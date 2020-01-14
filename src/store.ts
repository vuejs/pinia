import { ref, watch, computed } from '@vue/composition-api'
import { Ref } from '@vue/composition-api/dist/reactivity'
import {
  StateTree,
  Store,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreGetters,
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

/**
 * NOTE: by allowing users to name stores correctly, they can nest them the way
 * they want, no? like user/cart
 */

export type CombinedStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>
> = Store<Id, S> & StoreGetters<S, G>

// TODO: allow buildStore to start with an initial state for hydration

/**
 * Creates a store instance
 * @param id unique identifier of the store, like a name. eg: main, cart, user
 * @param initialState initial state applied to the store, Must be correctly typed to infer typings
 */
export function buildStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>
>(
  id: Id,
  buildState: () => S,
  getters: G = {} as G,
  initialState?: S | undefined
  // methods: Record<string | symbol, StoreMethod>
): CombinedStore<Id, S, G> {
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

  const storeWithState: Store<Id, S> = {
    id,
    // it is replaced below by a getter
    state: state.value,

    patch,
    subscribe,
    reset,
  }

  // @ts-ignore we have to build it
  const computedGetters: StoreGetters<S, G> = {}
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
  Record<string, CombinedStore<any, any, any>>
>()

/**
 * A state provider allows to set how states are stored for hydration. e.g. setting a property on a context, getting a property from window
 */
interface StateProvider {
  get(): Record<string, StateTree>
  set(store: CombinedStore<any, any, any>): any
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

function setInitialState(store: CombinedStore<any, any, any>): void {
  const provider = stateProviders.get(getActiveReq())
  if (provider) provider.set(store)
}

/**
 * Creates a `useStore` function that retrieves the store instance
 * @param id id of the store we are creating
 * @param buildState function that returns a state
 * @param getters optional object of getters
 */
export function createStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>
>(id: Id, buildState: () => S, getters: G = {} as G) {
  return function useStore(): CombinedStore<Id, S, G> {
    const req = getActiveReq()
    let stores = storesMap.get(req)
    if (!stores) storesMap.set(req, (stores = {}))

    let store = stores[id]
    if (!store) {
      stores[id] = store = buildStore(
        id,
        buildState,
        getters,
        getInitialState(id)
      )
      setInitialState(store)
      if (isClient) useStoreDevtools(store)
    }

    return store
  }
}
