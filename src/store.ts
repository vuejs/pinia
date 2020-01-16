import { ref, watch, computed } from '@vue/composition-api'
import { Ref, UnwrapRef } from '@vue/composition-api/dist/reactivity'
import {
  StateTree,
  StoreWithState,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreWithGetters,
  StoreGetter,
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

export interface StoreAction {
  (...args: any[]): any
}

// in this type we forget about this because otherwise the type is recursive
type StoreWithActions<A extends Record<string, StoreAction>> = {
  [k in keyof A]: A[k] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

// has the actions without the context (this) for typings
export type Store<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>,
  A extends Record<string, StoreAction>
> = StoreWithState<Id, S> & StoreWithGetters<S, G> & StoreWithActions<A>

export type WrapStoreWithId<
  S extends Store<any, any, any, any>
> = S extends Store<infer Id, infer S, infer G, infer A>
  ? {
      [k in Id]: Store<Id, S, G, A>
    }
  : never

export type ExtractGettersFromStore<S> = S extends Store<
  any,
  infer S,
  infer G,
  any
>
  ? {
      [k in keyof G]: ReturnType<G[k]>
    }
  : never

export type PiniaStore<
  P extends Record<string, Store<any, any, any, any>>
> = P extends Record<infer name, any>
  ? {
      [Id in P[name]['id']]: P[name] extends Store<
        Id,
        infer S,
        infer G,
        infer A
      >
        ? StoreWithGetters<S, G>
        : never
    }
  : never

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
  buildState: () => S,
  getters: G = {} as G,
  actions: A = {} as A,
  initialState?: S | undefined
): Store<Id, S, G, A> {
  const state: Ref<S> = ref(initialState || buildState())

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
    // it is replaced below by a getter
    state: state.value,

    patch,
    subscribe,
    reset,
  }

  // @ts-ignore we have to build it
  const computedGetters: StoreWithGetters<S, G> = {}
  for (const getterName in getters) {
    const method = getters[getterName]
    // @ts-ignore
    computedGetters[getterName] = computed<ReturnType<typeof method>>(() =>
      getters[getterName](state.value)
    )
  }

  const store = {
    ...storeWithState,
    ...computedGetters,
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

  // @ts-ignore TODO: actions
  return store
}

type NonNullObject = Record<any, any>

/**
 * setActiveReq must be called to handle SSR at the top of functions like `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeReq: NonNullObject = {}
export const setActiveReq = (req: NonNullObject | undefined) =>
  req && (activeReq = req)

export const getActiveReq = () => activeReq

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
 */

const storesMap = new WeakMap<
  NonNullObject,
  Record<string, Store<any, any, any, any>>
>()

/**
 * A state provider allows to set how states are stored for hydration. e.g. setting a property on a context, getting a property from window
 */
interface StateProvider {
  get(): Record<string, StateTree>
  set(store: Store<any, any, any, any>): any
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

function setInitialState(store: Store<any, any, any, any>): void {
  const provider = stateProviders.get(getActiveReq())
  if (provider) provider.set(store)
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
  state: () => S
  getters?: G
  // allow actions use other actions
  actions?: A & ThisType<A & StoreWithState<Id, S> & StoreWithGetters<S, G>>
}) {
  const { id, state: buildState, getters, actions } = options

  return function useStore(): Store<Id, S, G, A> {
    const req = getActiveReq()
    let stores = storesMap.get(req)
    if (!stores) storesMap.set(req, (stores = {}))

    let store = stores[id]
    if (!store) {
      stores[id] = store = buildStore(
        id,
        buildState,
        getters,
        actions,
        getInitialState(id)
      )
      // save a reference to the initial state
      // TODO: this implies that replacing the store cannot be done by the user because we are relying on the object reference
      setInitialState(store)
      if (isClient) useStoreDevtools(store)
    }

    return store
  }
}
