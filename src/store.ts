import { ref, watch, computed, Ref, reactive } from 'vue'
import {
  StateTree,
  StoreWithState,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreWithGetters,
  Store,
  StoreWithActions,
  Method,
} from './types'
import {
  getActiveReq,
  setActiveReq,
  storesMap,
  getInitialState,
} from './rootStore'

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

function toComputed<T>(refObject: Ref<T>) {
  // let asComputed = computed<T>()
  const reactiveObject = {} as {
    [k in keyof T]: Ref<T[k]>
  }
  for (const key in refObject.value) {
    // @ts-ignore: the key matches
    reactiveObject[key] = computed({
      get: () => refObject.value[key as keyof T],
      set: value => (refObject.value[key as keyof T] = value),
    })
  }

  return reactiveObject
}

/**
 * Creates a store instance
 * @param id - unique identifier of the store, like a name. eg: main, cart, user
 * @param initialState - initial state applied to the store, Must be correctly typed to infer typings
 */
export function buildStore<
  Id extends string,
  S extends StateTree,
  G extends Record<string, Method>,
  A extends Record<string, Method>
>(
  id: Id,
  buildState: () => S = () => ({} as S),
  getters: G = {} as G,
  actions: A = {} as A,
  initialState?: S | undefined
): Store<Id, S, G, A> {
  const state: Ref<S> = ref(initialState || buildState())
  // TODO: remove req part?
  const _r = getActiveReq()

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
    // because we paused the watcher, we need to manually call the subscriptions
    subscriptions.forEach(callback => {
      callback(
        { storeName: id, type: '⤵️ patch', payload: partialState },
        // @ts-ignore FIXME: why is this even failing on TS
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
    // @ts-ignore FIXME: why is this even failing on TS
    state.value = buildState()
  }

  const storeWithState: StoreWithState<Id, S> = {
    id,
    _r,
    // @ts-ignore, `reactive` unwraps this making it of type S
    state: computed<S>({
      get: () => state.value,
      set: newState => {
        isListening = false
        state.value = newState
        isListening = true
      },
    }),

    patch,
    subscribe,
    reset,
  }

  const computedGetters: StoreWithGetters<G> = {} as StoreWithGetters<G>
  for (const getterName in getters) {
    computedGetters[getterName] = computed(() => {
      setActiveReq(_r)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getters[getterName].call(store, store)
    }) as StoreWithGetters<G>[typeof getterName]
  }

  // const reactiveGetters = reactive(computedGetters)

  const wrappedActions: StoreWithActions<A> = {} as StoreWithActions<A>
  for (const actionName in actions) {
    wrappedActions[actionName] = function() {
      setActiveReq(_r)
      // eslint-disable-next-line
      return actions[actionName].apply(store, (arguments as unknown) as any[])
    } as StoreWithActions<A>[typeof actionName]
  }

  const store: Store<Id, S, G, A> = reactive({
    ...storeWithState,
    // using this means no new properties can be added as state
    ...toComputed(state),
    ...computedGetters,
    ...wrappedActions,
  }) as Store<Id, S, G, A>

  return store
}

/**
 * Creates a `useStore` function that retrieves the store instance
 * @param options
 */
export function createStore<
  Id extends string,
  S extends StateTree,
  G /* extends Record<string, StoreGetterThis> */,
  A /* extends Record<string, StoreAction> */
>(options: {
  id: Id
  state?: () => S
  getters?: G & ThisType<S & StoreWithGetters<G>>
  // allow actions use other actions
  actions?: A & ThisType<A & S & StoreWithState<Id, S> & StoreWithGetters<G>>
}) {
  const { id, state, getters, actions } = options

  return function useStore(reqKey?: object): Store<Id, S, G, A> {
    if (reqKey) setActiveReq(reqKey)
    const req = getActiveReq()
    let stores = storesMap.get(req)
    if (!stores) storesMap.set(req, (stores = new Map()))

    let store = stores.get(id) as Store<Id, S, G, A>
    if (!store) {
      stores.set(
        id,
        // @ts-ignore
        (store = buildStore(id, state, getters, actions, getInitialState(id)))
      )

      // TODO: client devtools when availables
      // if (isClient) useStoreDevtools(store)
    }

    return store
  }
}
