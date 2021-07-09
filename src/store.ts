import {
  watch,
  computed,
  Ref,
  inject,
  getCurrentInstance,
  reactive,
  InjectionKey,
  provide,
  DebuggerEvent,
  WatchOptions,
  UnwrapRef,
  markRaw,
  isRef,
  isReactive,
  effectScope,
  onScopeDispose,
  EffectScope,
  onUnmounted,
  ComputedRef,
  toRef,
} from 'vue'
import {
  StateTree,
  StoreWithState,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  StoreWithGetters,
  Store,
  StoreWithActions,
  _Method,
  StateDescriptor,
  DefineStoreOptions,
  StoreDefinition,
  GettersTree,
  MutationType,
  StoreOnActionListener,
  UnwrapPromise,
  ActionsTree,
  SubscriptionCallbackMutation,
  _UnionToTuple,
} from './types'
import {
  getActivePinia,
  setActivePinia,
  storesMap,
  piniaSymbol,
  Pinia,
  activePinia,
} from './rootStore'
import { IS_CLIENT } from './env'

function innerPatch<T extends StateTree>(
  target: T,
  patchToApply: DeepPartial<T>
): T {
  // TODO: get all keys like symbols as well
  for (const key in patchToApply) {
    const subPatch = patchToApply[key]
    const targetValue = target[key]
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      target[key] = innerPatch(targetValue, subPatch)
    } else {
      // @ts-ignore
      target[key] = subPatch
    }
  }

  return target
}

const { assign } = Object

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
 * @param id - unique identifier of the store, like a name. eg: main, cart, user
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
  pinia.state.value[$id] = initialState || buildState()
  // const state: Ref<S> = toRef(_p.state.value, $id)

  // internal state
  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = markRaw([])
  let actionSubscriptions: StoreOnActionListener<Id, S, G, A>[] = markRaw([])
  let debuggerEvents: DebuggerEvent[] | DebuggerEvent

  function $patch(stateMutation: (state: UnwrapRef<S>) => void): void
  function $patch(partialState: DeepPartial<UnwrapRef<S>>): void
  function $patch(
    partialStateOrMutator:
      | DeepPartial<UnwrapRef<S>>
      | ((state: UnwrapRef<S>) => void)
  ): void {
    let subscriptionMutation: SubscriptionCallbackMutation<S>
    isListening = false
    // reset the debugger events since patches are sync
    /* istanbul ignore else */
    if (__DEV__) {
      debuggerEvents = []
    }
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
      }
    } else {
      innerPatch(pinia.state.value[$id], partialStateOrMutator)
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
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
    const options: WatchOptions = { deep: true, flush: 'sync' }
    /* istanbul ignore else */
    if (__DEV__) {
      options.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event
        } else {
          // let patch send all the events together later
          /* istanbul ignore else */
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event)
          } else {
            console.error(
              '🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.'
            )
          }
        }
      }
    }
    const stopWatcher = watch(
      () => pinia.state.value[$id] as UnwrapRef<S>,
      (state, oldState) => {
        if (isListening) {
          callback(
            {
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents as DebuggerEvent,
            },
            state
          )
        }
      },
      options
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
    _as: actionSubscriptions as unknown as StoreOnActionListener[],

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
    // @ts-ignore: it's only readonly for the users
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
      const args = Array.from(arguments) as Parameters<A[typeof actionName]>
      const localStore = this || store

      let afterCallback: (
        resolvedReturn: UnwrapPromise<ReturnType<A[typeof actionName]>>
      ) => void = noop
      let onErrorCallback: (error: unknown) => void = noop
      function after(callback: typeof afterCallback) {
        afterCallback = callback
      }
      function onError(callback: typeof onErrorCallback) {
        onErrorCallback = callback
      }

      partialStore._as.forEach((callback) => {
        // @ts-expect-error
        callback({ args, name: actionName, store: localStore, after, onError })
      })

      let ret: ReturnType<A[typeof actionName]>
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
      __DEV__ && IS_CLIENT
        ? // devtools custom properties
          {
            _customProperties: markRaw(new Set<string>()),
          }
        : {},
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

  // add getters for devtools
  if (__DEV__ && IS_CLIENT) {
    store._getters = markRaw(Object.keys(getters))
  }

  // apply all plugins
  pinia._p.forEach((extender) => {
    if (__DEV__ && IS_CLIENT) {
      // @ts-expect-error: conflict between A and ActionsTree
      const extensions = extender({ store, app: pinia._a, pinia, options })
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      )
      assign(store, extensions)
    } else {
      // @ts-expect-error: conflict between A and ActionsTree
      assign(store, extender({ store, app: pinia._a, pinia, options }))
    }
  })

  return store
}

export interface DefineSetupStoreOptions<
  Id extends string,
  S extends StateTree,
  G extends ActionsTree, // TODO: naming
  A extends ActionsTree
> {
  hydrate?(store: Store<Id, S, G, A>, initialState: S | undefined): void
}

function isComputed(o: any) {
  return o && o.effect && o.effect.computed
}

function createSetupStore<
  Id extends string,
  SS,
  S extends StateTree,
  G extends ActionsTree, // TODO: naming
  A extends ActionsTree
>(
  $id: Id,
  setup: () => SS,
  {
    // @ts-expect-error
    hydrate = innerPatch,
  }: DefineSetupStoreOptions<Id, S, G, A> = {}
): Store<Id, S, {}, A> {
  const pinia = getActivePinia()
  let scope!: EffectScope

  // watcher options for $subscribe
  const $subscribeOptions: WatchOptions = { deep: true, flush: 'sync' }
  /* istanbul ignore else */
  if (__DEV__) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event
      } else {
        // let patch send all the events together later
        /* istanbul ignore else */
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event)
        } else {
          console.error(
            '🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.'
          )
        }
      }
    }
  }

  // internal state
  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = markRaw([])
  let actionSubscriptions: StoreOnActionListener<Id, S, G, A>[] = markRaw([])
  let debuggerEvents: DebuggerEvent[] | DebuggerEvent
  const initialState = pinia.state.value[$id] as S | undefined

  if (!initialState) {
    // should be set in Vue 2
    pinia.state.value[$id] = {}
  }

  const triggerSubscriptions: SubscriptionCallback<S> = (mutation, state) => {
    subscriptions.forEach((callback) => {
      callback(mutation, state)
    })
  }

  if (__DEV__ && !pinia._e.active) {
    // TODO: warn in dev
    throw new Error('Pinia destroyed')
  }

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => {
      const store = setup()

      watch(
        () => pinia.state.value[$id] as UnwrapRef<S>,
        (state, oldState) => {
          if (isListening) {
            triggerSubscriptions(
              {
                storeId: $id,
                type: MutationType.direct,
                events: debuggerEvents as DebuggerEvent,
              },
              state
            )
          }
        },
        $subscribeOptions
      )!

      return store
    })
  })!

  function $patch(stateMutation: (state: UnwrapRef<S>) => void): void
  function $patch(partialState: DeepPartial<UnwrapRef<S>>): void
  function $patch(
    partialStateOrMutator:
      | DeepPartial<UnwrapRef<S>>
      | ((state: UnwrapRef<S>) => void)
  ): void {
    let subscriptionMutation: SubscriptionCallbackMutation<S>
    isListening = false
    // reset the debugger events since patches are sync
    /* istanbul ignore else */
    if (__DEV__) {
      debuggerEvents = []
    }
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
      }
    } else {
      innerPatch(pinia.state.value[$id], partialStateOrMutator)
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
      }
    }
    isListening = true
    // because we paused the watcher, we need to manually call the subscriptions
    triggerSubscriptions(
      subscriptionMutation,
      pinia.state.value[$id] as UnwrapRef<S>
    )
  }

  function $subscribe(callback: SubscriptionCallback<S>, detached?: boolean) {
    subscriptions.push(callback)

    if (!detached) {
      if (getCurrentInstance()) {
        onUnmounted(() => {
          const idx = subscriptions.indexOf(callback)
          if (idx > -1) {
            subscriptions.splice(idx, 1)
          }
        })
      }
    }
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
      onScopeDispose(removeSubscription)
    }

    return removeSubscription
  }

  function $reset() {
    // TODO: is it worth? probably should be removed
    // maybe it can stop the effect and create it again
    // pinia.state.value[$id] = buildState()
  }

  // overwrite existing actions to support $onAction
  for (const key in setupStore) {
    const prop = setupStore[key]

    // action
    if (typeof prop === 'function') {
      // @ts-expect-error: we are overriding the function
      setupStore[key] = function () {
        setActivePinia(pinia)
        const args = Array.from(arguments)

        let afterCallback: (resolvedReturn: any) => void = noop
        let onErrorCallback: (error: unknown) => void = noop
        function after(callback: typeof afterCallback) {
          afterCallback = callback
        }
        function onError(callback: typeof onErrorCallback) {
          onErrorCallback = callback
        }

        actionSubscriptions.forEach((callback) => {
          // @ts-expect-error
          callback({
            args,
            name: key,
            store,
            after,
            onError,
          })
        })

        let ret: any
        try {
          ret = prop.apply(this, args)
          Promise.resolve(ret).then(afterCallback).catch(onErrorCallback)
        } catch (error) {
          onErrorCallback(error)
          throw error
        }

        return ret
      }
    } else if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      // mark it as a piece of state to be serialized
      pinia.state.value[$id][key] = toRef(setupStore as any, key)
    } else if (__DEV__ && IS_CLIENT) {
      // add getters for devtools
      if (isComputed(prop)) {
        const getters: string[] =
          // @ts-expect-error: it should be on the store
          setupStore._getters || (setupStore._getters = markRaw([]))
        getters.push(key)
      }
    }
  }

  const partialStore = {
    $id,
    $onAction,
    $patch,
    $reset,
    $subscribe,
  }

  const store: Store<Id, S, G, A> = reactive(
    assign(
      __DEV__ && IS_CLIENT
        ? // devtools custom properties
          {
            _customProperties: markRaw(new Set<string>()),
          }
        : {},
      partialStore,
      setupStore
    )
  ) as Store<Id, S, G, A>

  // use this instead of a computed with setter to be able to create it anywhere
  // without linking the computed lifespan to wherever the store is first
  // created.
  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[$id],
    set: (state) => (pinia.state.value[$id] = state),
  })

  // apply all plugins
  pinia._p.forEach((extender) => {
    if (__DEV__ && IS_CLIENT) {
      // @ts-expect-error: conflict between A and ActionsTree
      // TODO: completely different options...
      const extensions = extender({ store, app: pinia._a, pinia, options })
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      )
      assign(store, extensions)
    } else {
      // @ts-expect-error: conflict between A and ActionsTree
      assign(store, extender({ store, app: pinia._a, pinia, options }))
    }
  })

  if (initialState) {
    hydrate(store, initialState)
  }

  return store
}

// const useStore = createSetupStore('cosa', () => {
//   return {
//     o: 'one',
//   }
// })

type _SpreadStateFromStore<SS, K extends readonly any[]> = K extends readonly [
  infer A,
  ...infer Rest
]
  ? A extends string | number | symbol
    ? SS extends Record<A, _Method | ComputedRef<any>>
      ? _SpreadStateFromStore<SS, Rest>
      : SS extends Record<A, any>
      ? Record<A, UnwrapRef<SS[A]>> & _SpreadStateFromStore<SS, Rest>
      : never
    : {}
  : {}

type _SpreadPropertiesFromObject<
  SS,
  K extends readonly any[],
  T
> = K extends readonly [infer A, ...infer Rest]
  ? A extends string | number | symbol
    ? SS extends Record<A, T>
      ? Record<A, UnwrapRef<SS[A]>> & _SpreadPropertiesFromObject<SS, Rest, T>
      : _SpreadPropertiesFromObject<SS, Rest, T>
    : {}
  : {}

type _ExtractStateFromSetupStore<SS> = _SpreadStateFromStore<
  SS,
  _UnionToTuple<keyof SS>
>

type _ExtractActionsFromSetupStore<SS> = _SpreadPropertiesFromObject<
  SS,
  _UnionToTuple<keyof SS>,
  _Method
>

type _ExtractGettersFromSetupStore<SS> = _SpreadPropertiesFromObject<
  SS,
  _UnionToTuple<keyof SS>,
  ComputedRef<any>
>

// type a1 = _ExtractStateFromSetupStore<{ a: Ref<number>; action: () => void }>
// type a2 = _ExtractActionsFromSetupStore<{ a: Ref<number>; action: () => void }>
// type a3 = _ExtractGettersFromSetupStore<{
//   a: Ref<number>
//   b: ComputedRef<string>
//   action: () => void
// }>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param options - options to define the store
 */
export function defineSetupStore<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
> {
  function useStore(
    pinia?: Pinia | null
  ): Store<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  > {
    const currentInstance = getCurrentInstance()
    pinia =
      // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
      (currentInstance && inject(piniaSymbol))
    if (pinia) setActivePinia(pinia)
    // TODO: worth warning on server if no piniaKey as it can leak data
    pinia = getActivePinia()

    if (!pinia._s.has(id)) {
      pinia._s.set(id, createSetupStore(id, storeSetup, options))
    }

    const store: Store<
      Id,
      _ExtractStateFromSetupStore<SS>,
      _ExtractGettersFromSetupStore<SS>,
      _ExtractActionsFromSetupStore<SS>
    > = pinia._s.get(id)! as Store<
      Id,
      _ExtractStateFromSetupStore<SS>,
      _ExtractGettersFromSetupStore<SS>,
      _ExtractActionsFromSetupStore<SS>
    >

    // save stores in instances to access them devtools
    if (__DEV__ && IS_CLIENT && currentInstance && currentInstance.proxy) {
      const vm = currentInstance.proxy
      const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
      // @ts-expect-error: still can't cast Store with generics to Store
      cache[id] = store
    }

    return store
  }

  useStore.$id = id

  return useStore
}

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A> {
  const { id, state, getters, actions } = options

  function useStore(pinia?: Pinia | null): Store<Id, S, G, A> {
    const currentInstance = getCurrentInstance()
    // only run provide when pinia hasn't been manually passed
    const shouldProvide = currentInstance && !pinia
    // avoid injecting if `useStore` when not possible
    pinia =
      // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
      (currentInstance && inject(piniaSymbol))
    if (pinia) setActivePinia(pinia)
    // TODO: worth warning on server if no piniaKey as it can leak data
    pinia = getActivePinia()
    let storeCache = storesMap.get(pinia)
    if (!storeCache) storesMap.set(pinia, (storeCache = new Map()))

    let storeAndDescriptor = storeCache.get(id) as
      | [
          StoreWithState<Id, S, G, A>,
          StateDescriptor<S>,
          InjectionKey<Store<Id, S, G, A>>
        ]
      | undefined

    let store: Store<Id, S, G, A>

    if (!storeAndDescriptor) {
      storeAndDescriptor = initStore(id, state, pinia.state.value[id])

      // @ts-expect-error: annoying to type
      storeCache.set(id, storeAndDescriptor)

      store = buildStoreToUse<
        Id,
        S,
        G,
        // @ts-expect-error: A without extends
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
    } else {
      store =
        (currentInstance && inject(storeAndDescriptor[2], null)) ||
        buildStoreToUse<
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
    }

    // save stores in instances to access them devtools
    if (__DEV__ && IS_CLIENT && currentInstance && currentInstance.proxy) {
      const vm = currentInstance.proxy
      const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
      // @ts-expect-error: still can't cast Store with generics to Store
      cache[store.$id] = store
    }

    return store
  }

  // needed by map helpers
  useStore.$id = id

  return useStore
}
