import {
  watch,
  computed,
  Ref,
  inject,
  getCurrentInstance,
  reactive,
  onUnmounted,
  InjectionKey,
  provide,
  DebuggerEvent,
  WatchOptions,
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
  GenericStore,
  GettersTree,
  MutationType,
} from './types'
import {
  getActivePinia,
  setActivePinia,
  storesMap,
  piniaSymbol,
  Pinia,
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
    if (isPlainObject(targetValue) && isPlainObject(subPatch)) {
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
function initStore<Id extends string, S extends StateTree>(
  $id: Id,
  buildState: () => S = () => ({} as S),
  initialState?: S | undefined
): [
  StoreWithState<Id, S>,
  { get: () => S; set: (newValue: S) => void },
  InjectionKey<GenericStore>
] {
  const pinia = getActivePinia()
  pinia.state.value[$id] = initialState || buildState()
  // const state: Ref<S> = toRef(_p.state.value, $id)

  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = []
  let debuggerEvents: DebuggerEvent[] | DebuggerEvent

  function $patch(stateMutation: (state: S) => void): void
  function $patch(partialState: DeepPartial<S>): void
  function $patch(
    partialStateOrMutator: DeepPartial<S> | ((state: S) => void)
  ): void {
    let partialState: DeepPartial<S> = {}
    let type: MutationType
    isListening = false
    // reset the debugger events since patches are sync
    if (__DEV__) {
      debuggerEvents = []
    }
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id])
      type = MutationType.patchFunction
    } else {
      innerPatch(pinia.state.value[$id], partialStateOrMutator)
      partialState = partialStateOrMutator
      type = MutationType.patchObject
    }
    isListening = true
    // because we paused the watcher, we need to manually call the subscriptions
    subscriptions.forEach((callback) => {
      callback(
        { storeName: $id, type, payload: partialState, events: debuggerEvents },
        pinia.state.value[$id]
      )
    })
  }

  function $subscribe(
    callback: SubscriptionCallback<S>,
    onTrigger?: (event: DebuggerEvent) => void
  ) {
    subscriptions.push(callback)

    // watch here to link the subscription to the current active instance
    // e.g. inside the setup of a component
    const options: WatchOptions = { deep: true, flush: 'sync' }
    if (__DEV__) {
      options.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event
        } else {
          // let patch send all the events together later
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
      () => pinia.state.value[$id],
      (state, oldState) => {
        if (isListening) {
          // TODO: remove payload
          callback(
            {
              storeName: $id,
              type: MutationType.direct,
              payload: {},
              events: debuggerEvents,
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

  function $reset() {
    pinia.state.value[$id] = buildState()
  }

  const storeWithState: StoreWithState<Id, S> = {
    $id,
    _p: pinia,

    // $state is added underneath

    $patch,
    $subscribe,
    $reset,
  } as StoreWithState<Id, S>

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
  A extends Record<string, _Method>
>(
  partialStore: StoreWithState<Id, S>,
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
    wrappedActions[actionName] = function () {
      setActivePinia(pinia)
      // eslint-disable-next-line
      return actions[actionName].apply(store, (arguments as unknown) as any[])
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

  if (IS_CLIENT && __BROWSER__ && __DEV__) {
    store._getters = Object.keys(getters)
  }

  // apply all plugins
  pinia._p.forEach((extender) => {
    assign(store, extender({ store, app: pinia._a, pinia, options }))
  })

  return store
}

/**
 * Creates a `useStore` function that retrieves the store instance
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends Record<string, StoreAction> */
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A> {
  const { id, state, getters, actions } = options

  function useStore(pinia?: Pinia | null): Store<Id, S, G, A> {
    const hasInstance = getCurrentInstance()
    // only run provide when pinia hasn't been manually passed
    const shouldProvide = hasInstance && !pinia
    // avoid injecting if `useStore` when not possible
    pinia = pinia || (hasInstance && inject(piniaSymbol))
    if (pinia) setActivePinia(pinia)
    // TODO: worth warning on server if no piniaKey as it can leak data
    pinia = getActivePinia()
    let stores = storesMap.get(pinia)
    if (!stores) storesMap.set(pinia, (stores = new Map()))

    let storeAndDescriptor = stores.get(id) as
      | [
          StoreWithState<Id, S>,
          StateDescriptor<S>,
          InjectionKey<Store<Id, S, G, A>>
        ]
      | undefined
    if (!storeAndDescriptor) {
      storeAndDescriptor = initStore(id, state, pinia.state.value[id])

      stores.set(id, storeAndDescriptor)

      const store = buildStoreToUse(
        storeAndDescriptor[0],
        storeAndDescriptor[1],
        id,
        getters as GettersTree<S> | undefined,
        actions as Record<string, _Method> | undefined,
        // @ts-expect-error: because of the extend on Actions
        options
      )

      // allow children to reuse this store instance to avoid creating a new
      // store for each child
      if (shouldProvide) {
        provide(storeAndDescriptor[2], store)
      }

      return store
    }

    return (
      // null avoids the warning for not found injection key
      (hasInstance && inject(storeAndDescriptor[2], null)) ||
      buildStoreToUse(
        storeAndDescriptor[0],
        storeAndDescriptor[1],
        id,
        getters as GettersTree<S> | undefined,
        actions as Record<string, _Method> | undefined,
        // @ts-expect-error: because of the extend on Actions
        options
      )
    )
  }

  // needed by map helpers
  useStore.$id = id

  return useStore
}
