import { ref, watch, computed, reactive, Ref } from '@vue/composition-api'
import {
  StateTree,
  StoreWithState,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreWithGetters,
  StoreGetter,
  NonNullObject,
  StoreAction,
  StoreWithActions,
} from './types'
import { useStoreDevtools } from './devtools'

const isClient = typeof window != 'undefined'

function innerPatch<T extends StateTree>(
  target: T,
  patchToApply: DeepPartial<T>
): T {
  // TODO: get all keys like symbols as well
  for (const key in patchToApply) {
    const subPatch = patchToApply[key]
    const targetValue = target[key]
    if (isPlainObject(targetValue) && isPlainObject(subPatch)) {
      target[key] = innerPatch(targetValue, subPatch)
    } else {
      // @ts-ignore
      target[key] = subPatch
    }
  }

  return target
}

/**
 * setActiveReq must be called to handle SSR at the top of functions like `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeReq: NonNullObject = {}
export const setActiveReq = (req: NonNullObject | undefined) =>
  req && (activeReq = req)

export const getActiveReq = () => activeReq

// has the actions without the context (this) for typings
export type Store<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>,
  A extends Record<string, StoreAction>
> = StoreWithState<Id, S> & StoreWithGetters<S, G> & StoreWithActions<A>

/**
 * Creates a store instance
 * @param id unique identifier of the store, like a name. eg: main, cart, user
 * @param initialState initial state applied to the store, Must be correctly typed to infer typings
 */
export function buildStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>,
  A extends Record<string, StoreAction>
>(
  id: Id,
  buildState = () => ({} as S),
  getters: G = {} as G,
  actions: A = {} as A,
  initialState?: S | undefined
): Store<Id, S, G, A> {
  const state: Ref<S> = ref(initialState || buildState())
  const _r = getActiveReq()

  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = []

  watch(
    () => state.value,
    state => {
      if (isListening) {
        subscriptions.forEach(callback => {
          callback({ storeName: id, type: '🧩 in place', payload: {} }, state)
        })
      }
    },
    {
      deep: true,
      flush: 'sync',
    }
  )

  function patch(partialState: DeepPartial<S>): void {
    isListening = false
    innerPatch(state.value, partialState)
    isListening = true
    subscriptions.forEach(callback => {
      callback(
        { storeName: id, type: '⤵️ patch', payload: partialState },
        state.value
      )
    })
  }

  function subscribe(callback: SubscriptionCallback<S>) {
    subscriptions.push(callback)
    return () => {
      const idx = subscriptions.indexOf(callback)
      if (idx > -1) {
        subscriptions.splice(idx, 1)
      }
    }
  }

  function reset() {
    subscriptions = []
    state.value = buildState()
  }

  const storeWithState: StoreWithState<Id, S> = {
    id,
    _r,
    // it is replaced below by a getter
    state: state.value,

    patch,
    subscribe,
    reset,
  }

  const computedGetters: StoreWithGetters<S, G> = {} as StoreWithGetters<S, G>
  for (const getterName in getters) {
    computedGetters[getterName] = computed(() => {
      setActiveReq(_r)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getters[getterName](state.value)
    }) as StoreWithGetters<S, G>[typeof getterName]
  }

  // const reactiveGetters = reactive(computedGetters)

  const wrappedActions: StoreWithActions<A> = {} as StoreWithActions<A>
  for (const actionName in actions) {
    wrappedActions[actionName] = function() {
      setActiveReq(_r)
      // eslint-disable-next-line
      return actions[actionName].apply(store, arguments as unknown as any[])
    } as StoreWithActions<A>[typeof actionName]
  }

  const store: Store<Id, S, G, A> = {
    ...storeWithState,
    ...computedGetters,
    ...wrappedActions,
  }

  // make state access invisible
  Object.defineProperty(store, 'state', {
    get: () => state.value,
    set: (newState: S) => {
      isListening = false
      state.value = newState
      isListening = true
    },
  })

  return store
}

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
 */

export const storesMap = new WeakMap<
  NonNullObject,
  Record<string, Store<any, any, any, any>>
>()

/**
 * A state provider allows to set how states are stored for hydration. e.g. setting a property on a context, getting a property from window
 */
interface StateProvider {
  get(): Record<string, StateTree>
  set(store: Store<string, StateTree, any, any>): any
}

/**
 * Map of initial states used for hydration
 */
export const stateProviders = new WeakMap<NonNullObject, StateProvider>()

export function setStateProvider(stateProvider: StateProvider) {
  stateProviders.set(getActiveReq(), stateProvider)
}

function getInitialState(id: string): StateTree | undefined {
  const provider = stateProviders.get(getActiveReq())
  return provider && provider.get()[id]
}

function setInitialState(store: Store<string, StateTree, any, any>): void {
  const provider = stateProviders.get(getActiveReq())
  if (provider) provider.set(store)
}

/**
 * Gets the root state of all active stores. This is useful when reporting an application crash by
 * retrieving the problematic state and send it to your error tracking service.
 * @param req request key
 */
export function getRootState(req: NonNullObject): Record<string, StateTree> {
  const stores = storesMap.get(req)
  if (!stores) return {}
  const rootState = {} as Record<string, StateTree>

  for (const store of Object.values(stores)) {
    rootState[store.id] = store.state
  }

  return rootState
}

/**
 * Creates a `useStore` function that retrieves the store instance
 * @param options
 */
export function createStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>,
  A extends Record<string, StoreAction>
>(options: {
  id: Id
  state?: () => S
  getters?: G
  // allow actions use other actions
  actions?: A & ThisType<A & StoreWithState<Id, S> & StoreWithGetters<S, G>>
}) {
  const { id, state, getters, actions } = options

  return function useStore(reqKey?: object): Store<Id, S, G, A> {
    if (reqKey) setActiveReq(reqKey)
    const req = getActiveReq()
    let stores = storesMap.get(req)
    if (!stores) storesMap.set(req, (stores = {}))

    let store = stores[id]
    if (!store) {
      stores[id] = store = buildStore(
        id,
        state,
        getters,
        actions,
        getInitialState(id)
      )
      // save a reference to the initial state
      // TODO: this implies that replacing the store cannot be done by the user on the server
      setInitialState(store)
      if (isClient) useStoreDevtools(store)
    }

    return store
  }
}
