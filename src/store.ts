import { ref, watch, computed } from 'vue'
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
  getters: G = {} as G
  // methods: Record<string | symbol, StoreMethod>
): CombinedStore<Id, S, G> {
  const state = ref<S>(buildState())

  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = []

  watch(
    () => state.value,
    state => {
      if (isListening) {
        subscriptions.forEach(callback => {
          // @ts-ignore FIXME: why is this even failing on TS
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
    // @ts-ignore FIXME: why is this even failing on TS
    innerPatch(state.value, partialState)
    isListening = true
    subscriptions.forEach(callback => {
      callback(
        { storeName: id, type: '⤵️ patch', payload: partialState },
        // @ts-ignore FIXME: why is this even failing on TS
        state.value
      )
    })
  }

  function subscribe(callback: SubscriptionCallback<S>): void {
    subscriptions.push(callback)
    // TODO: return function to remove subscription
  }

  function reset() {
    subscriptions = []
    // @ts-ignore FIXME: why is this even failing on TS
    state.value = buildState()
  }

  const storeWithState: Store<Id, S> = {
    id,
    // it is replaced below by a getter
    // @ts-ignore FIXME: why is this even failing on TS
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
      // @ts-ignore FIXME: why is this even failing on TS
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
      // @ts-ignore FIXME: why is this even failing on TS
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
  let store: CombinedStore<Id, S, G> | undefined

  return function useStore(forceNewStore = false): CombinedStore<Id, S, G> {
    if (!store || forceNewStore) store = buildStore(id, buildState, getters)

    useStoreDevtools(store)

    return store
  }
}
