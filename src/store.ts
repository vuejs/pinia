import {
  watch,
  computed,
  reactive,
  Ref,
  getCurrentInstance,
  markRaw,
  inject,
  onUnmounted,
  InjectionKey,
  provide,
  UnwrapRef,
  set,
} from '@vue/composition-api'
import {
  StateTree,
  StoreWithState,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreWithGetters,
  Store,
  StoreWithActions,
  StateDescriptor,
  StoreDefinition,
  GettersTree,
  DefineStoreOptions,
  StoreOnActionListener,
  MutationType,
  ActionsTree,
  SubscriptionCallbackMutation,
} from './types'
import { useStoreDevtools } from './devtools'
import {
  storesMap,
  Pinia,
  setActivePinia,
  getActivePinia,
  piniaSymbol,
} from './rootStore'
import { assign } from './utils'

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
      // @ts-expect-error
      target[key] = subPatch
    }
  }

  return target
}

/**
 * Create an object of computed properties referring to
 *
 * @param rootStateRef - pinia.state
 * @param id - unique name
 */
function computedFromState<T, Id extends string>(
  rootStateRef: Ref<Record<Id, T>>,
  id: Id
) {
  // let asComputed = computed<T>()
  const reactiveObject = {} as {
    [k in keyof T]: Ref<T[k]>
  }
  const state = rootStateRef.value[id]
  for (const key in state) {
    // @ts-expect-error: the key matches
    reactiveObject[key] = computed({
      get: () => rootStateRef.value[id][key as keyof T],
      set: (value) => (rootStateRef.value[id][key as keyof T] = value),
    })
  }

  return reactiveObject
}

/**
 * Creates a store with its state object. This is meant to be augmented with getters and actions
 *
 * @param $id - unique identifier of the store, like a name. eg: main, cart, user
 * @param buildState - function to build the initial state
 * @param initialState - initial state applied to the store, Must be correctly typed to infer typings
 */
function initStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends ActionsTree */
>(
  $id: Id,
  buildState: () => S = () => ({} as S),
  initialState?: S | undefined
): [
  StoreWithState<Id, S, G, A>,
  { get: () => S; set: (newValue: S) => void },
  InjectionKey<Store>
] {
  const pinia = getActivePinia()
  set(pinia.state.value, $id, initialState || buildState())
  // const state: Ref<S> = toRef(_p.state.value, $id)

  let isListening = true
  const subscriptions: SubscriptionCallback<S>[] = []
  const actionSubscriptions: StoreOnActionListener<Id, S, G, A>[] = []

  function $patch(stateMutation: (state: S) => void): void
  function $patch(partialState: DeepPartial<S>): void
  function $patch(
    partialStateOrMutator: DeepPartial<S> | ((state: S) => void)
  ): void {
    let subscriptionMutation: SubscriptionCallbackMutation<S>
    isListening = false
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id])
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeName: $id,
        storeId: $id,
      }
    } else {
      innerPatch(pinia.state.value[$id], partialStateOrMutator)
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeName: $id,
        storeId: $id,
      }
    }
    isListening = true
    // because we paused the watcher, we need to manually call the subscriptions
    subscriptions.forEach((callback) => {
      callback(subscriptionMutation, pinia.state.value[$id] as UnwrapRef<S>)
    })
  }

  function $subscribe(callback: SubscriptionCallback<S>) {
    subscriptions.push(callback)

    // watch here to link the subscription to the current active instance
    // e.g. inside the setup of a component
    const stopWatcher = watch(
      () => pinia.state.value[$id] as UnwrapRef<S>,
      (state) => {
        if (isListening) {
          callback(
            {
              storeName: $id,
              storeId: $id,
              type: MutationType.direct,
            },
            state
          )
        }
      },
      {
        deep: true,
        flush: 'sync',
      }
    )

    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback)
      if (idx > -1) {
        subscriptions.splice(idx, 1)
        stopWatcher()
      }
    }

    if (getCurrentInstance()) {
      onUnmounted(removeSubscription)
    }

    return removeSubscription
  }

  function $onAction(callback: StoreOnActionListener<Id, S, G, A>) {
    actionSubscriptions.push(callback)

    const removeSubscription = () => {
      const idx = actionSubscriptions.indexOf(callback)
      if (idx > -1) {
        actionSubscriptions.splice(idx, 1)
      }
    }

    if (getCurrentInstance()) {
      onUnmounted(removeSubscription)
    }

    return removeSubscription
  }

  function $reset() {
    pinia.state.value[$id] = buildState()
  }

  const storeWithState: StoreWithState<Id, S, G, A> = {
    $id,
    _p: pinia,
    _as: markRaw(actionSubscriptions as unknown as StoreOnActionListener[]),

    // $state is added underneath

    $patch,
    $subscribe,
    $onAction,
    $reset,
  } as StoreWithState<Id, S, G, A>

  const injectionSymbol = __DEV__
    ? Symbol(`PiniaStore(${$id})`)
    : /* istanbul ignore next */
      Symbol()

  return [
    storeWithState,
    {
      get: () => pinia.state.value[$id] as S,
      set: (newState: S) => {
        isListening = false
        pinia.state.value[$id] = newState
        isListening = true
      },
    },
    injectionSymbol,
  ]
}

const noop = () => {}
/**
 * Creates a store bound to the lifespan of where the function is called. This
 * means creating the store inside of a component's setup will bound it to the
 * lifespan of that component while creating it outside of a component will
 * create an ever living store
 *
 * @param partialStore - store with state returned by initStore
 * @param descriptor - descriptor to setup $state property
 * @param $id - unique name of the store
 * @param getters - getters of the store
 * @param actions - actions of the store
 */
function buildStoreToUse<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A extends ActionsTree
>(
  partialStore: StoreWithState<Id, S, G, A>,
  descriptor: StateDescriptor<S>,
  $id: Id,
  getters: G = {} as G,
  actions: A = {} as A,
  options: DefineStoreOptions<Id, S, G, A>
) {
  const pinia = getActivePinia()

  const computedGetters: StoreWithGetters<G> = {} as StoreWithGetters<G>
  for (const getterName in getters) {
    // @ts-expect-error: it's only readonly for the users
    computedGetters[getterName] = computed(() => {
      setActivePinia(pinia)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // @ts-expect-error: the argument count is correct
      return getters[getterName].call(store, store)
    }) as StoreWithGetters<G>[typeof getterName]
  }

  const wrappedActions: StoreWithActions<A> = {} as StoreWithActions<A>
  for (const actionName in actions) {
    wrappedActions[actionName] = function (this: Store<Id, S, G, A>) {
      setActivePinia(pinia)
      /* eslint-disable-next-line */
      const args = Array.from(arguments)
      const localStore = this || store

      let afterCallback: (
        resolvedReturn: ReturnType<typeof actions[typeof actionName]>
      ) => void = noop
      let onErrorCallback: (error: unknown) => void = noop
      function after(callback: typeof afterCallback) {
        afterCallback = callback
      }
      function onError(callback: typeof onErrorCallback) {
        onErrorCallback = callback
      }

      partialStore._as.forEach((callback) => {
        callback({
          args,
          name: actionName,
          // @ts-expect-error
          store: localStore,
          after,
          onError,
        })
      })

      let ret: ReturnType<typeof actions[typeof actionName]>
      try {
        ret = actions[actionName].apply(localStore, args as unknown as any[])
        Promise.resolve(ret).then(afterCallback).catch(onErrorCallback)
      } catch (error) {
        onErrorCallback(error)
        throw error
      }

      return ret
    } as StoreWithActions<A>[typeof actionName]
  }

  const store: Store<Id, S, G, A> = reactive(
    assign(
      {},
      partialStore,
      // using this means no new properties can be added as state
      computedFromState(pinia.state, $id),
      computedGetters,
      wrappedActions
    )
  ) as Store<Id, S, G, A>

  // use this instead of a computed with setter to be able to create it anywhere
  // without linking the computed lifespan to wherever the store is first
  // created.
  Object.defineProperty(store, '$state', descriptor)

  // apply all plugins
  pinia._p.forEach((extender) => {
    // @ts-expect-error: conflict between A and ActionsTree
    assign(store, extender({ store, pinia, options }))
  })

  return store
}

/**
 * Defines a `useStore()` function that creates or retrieves the store instance
 * when called.
 *
 * @param options
 */
export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends ActionsTree */
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A> {
  const { id, state, getters, actions } = options

  function useStore(pinia?: Pinia | null): Store<Id, S, G, A> {
    const hasInstance = getCurrentInstance()
    // only run provide when pinia hasn't been manually passed
    const shouldProvide = hasInstance && !pinia
    // pinia = pinia || (vm && ((vm as any).$pinia as Pinia))
    pinia = pinia || (hasInstance && inject(piniaSymbol))

    if (pinia) setActivePinia(pinia)

    pinia = getActivePinia()

    let stores = storesMap.get(pinia)
    if (!stores) storesMap.set(pinia, (stores = new Map()))

    // let store = stores.get(id) as Store<Id, S, G, A>
    let storeAndDescriptor = stores.get(id) as
      | [
          StoreWithState<Id, S, G, A>,
          StateDescriptor<S>,
          InjectionKey<Store<Id, S, G, A>>
        ]
      | undefined

    if (!storeAndDescriptor) {
      storeAndDescriptor = initStore(id, state, pinia.state.value[id])

      // @ts-expect-error: annoying to type
      stores.set(id, storeAndDescriptor)

      if (__DEV__ && isClient) {
        // @ts-expect-error: annoying to type
        useStoreDevtools(storeAndDescriptor[0], storeAndDescriptor[1])
      }

      const store = buildStoreToUse<
        Id,
        S,
        G,
        // @ts-expect-error: cannot extends ActionsTree
        A
      >(
        storeAndDescriptor[0],
        storeAndDescriptor[1],
        id,
        getters,
        actions,
        options
      )

      // allow children to reuse this store instance to avoid creating a new
      // store for each child
      if (shouldProvide) {
        provide(storeAndDescriptor[2], store)
      }

      return store as Store<Id, S, G, A>
    }

    return (
      (hasInstance && inject(storeAndDescriptor[2], null)) ||
      (buildStoreToUse<
        Id,
        S,
        G,
        // @ts-expect-error: cannot extends ActionsTree
        A
      >(
        storeAndDescriptor[0],
        storeAndDescriptor[1],
        id,
        getters,
        actions,
        options
      ) as Store<Id, S, G, A>)
    )
  }

  // needed by map helpers
  useStore.$id = id

  return useStore
}
