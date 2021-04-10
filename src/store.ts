import {
  watch,
  computed,
  Ref,
  inject,
  getCurrentInstance,
  reactive,
  onUnmounted,
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
  StateDescriptor,
  Method,
  PiniaCustomProperties,
  DefineStoreOptions,
  StoreDefinition,
} from './types'
import {
  getActivePinia,
  setActivePinia,
  storesMap,
  getClientApp,
  piniaSymbol,
  Pinia,
} from './rootStore'
import { addDevtools } from './devtools'
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
    // @ts-ignore: the key matches
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
): [StoreWithState<Id, S>, { get: () => S; set: (newValue: S) => void }] {
  const pinia = getActivePinia()
  pinia.state.value[$id] = initialState || buildState()
  // const state: Ref<S> = toRef(_p.state.value, $id)

  let isListening = true
  let subscriptions: SubscriptionCallback<S>[] = []

  function $patch(stateMutation: (state: S) => void): void
  function $patch(partialState: DeepPartial<S>): void
  function $patch(
    partialStateOrMutator: DeepPartial<S> | ((state: S) => void)
  ): void {
    let partialState: DeepPartial<S> = {}
    let type: string
    isListening = false
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id])
      type = '🧩 patch'
    } else {
      innerPatch(pinia.state.value[$id], partialStateOrMutator)
      partialState = partialStateOrMutator
      type = '⤵️ patch'
    }
    isListening = true
    // because we paused the watcher, we need to manually call the subscriptions
    subscriptions.forEach((callback) => {
      callback(
        { storeName: $id, type, payload: partialState },
        pinia.state.value[$id]
      )
    })
  }

  function $subscribe(callback: SubscriptionCallback<S>) {
    subscriptions.push(callback)

    // watch here to link the subscription to the current active instance
    // e.g. inside the setup of a component
    const stopWatcher = watch(
      () => pinia.state.value[$id],
      (state) => {
        if (isListening) {
          callback({ storeName: $id, type: '🧩 in place', payload: {} }, state)
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
  G extends Record<string, Method>,
  A extends Record<string, Method>
>(
  partialStore: StoreWithState<Id, S>,
  descriptor: StateDescriptor<S>,
  $id: Id,
  getters: G = {} as G,
  actions: A = {} as A
) {
  const pinia = getActivePinia()

  const computedGetters: StoreWithGetters<G> = {} as StoreWithGetters<G>
  for (const getterName in getters) {
    computedGetters[getterName] = computed(() => {
      setActivePinia(pinia)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
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

  const extensions = pinia._p.reduce(
    (extended, extender) => assign({}, extended, extender()),
    {} as PiniaCustomProperties
  )

  const store: Store<Id, S, G, A> = reactive(
    assign(
      {},
      extensions,
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

  return store
}

// only warn the dev once
let isDevWarned: boolean | undefined

/**
 * Creates a `useStore` function that retrieves the store instance
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree,
  G /* extends Record<string, StoreGetterThis> */,
  A /* extends Record<string, StoreAction> */
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A> {
  const { id, state, getters, actions } = options

  function useStore(pinia?: Pinia | null): Store<Id, S, G, A> {
    // avoid injecting if `useStore` when not possible
    pinia = pinia || (getCurrentInstance() && inject(piniaSymbol))
    if (pinia) setActivePinia(pinia)
    // TODO: worth warning on server if no piniaKey as it can leak data
    pinia = getActivePinia()
    let stores = storesMap.get(pinia)
    if (!stores) storesMap.set(pinia, (stores = new Map()))

    let storeAndDescriptor = stores.get(id) as
      | [StoreWithState<Id, S>, StateDescriptor<S>]
      | undefined
    if (!storeAndDescriptor) {
      storeAndDescriptor = initStore(id, state, pinia.state.value[id])

      stores.set(id, storeAndDescriptor)

      const store = buildStoreToUse(
        storeAndDescriptor[0],
        storeAndDescriptor[1],
        id,
        getters as Record<string, Method> | undefined,
        actions as Record<string, Method> | undefined
      )

      if (
        IS_CLIENT &&
        __BROWSER__ &&
        __DEV__ /*|| __FEATURE_PROD_DEVTOOLS__*/
      ) {
        const app = getClientApp()
        /* istanbul ignore else */
        if (app) {
          addDevtools(app, store)
        } else if (!isDevWarned && !__TEST__) {
          isDevWarned = true
          console.warn(
            `[🍍]: store was instantiated before calling\n` +
              `app.use(pinia)\n` +
              `Make sure to install pinia's plugin by using createPinia:\n` +
              `https://github.com/posva/pinia/tree/v2#install-the-plugin\n` +
              `It will enable devtools and overall a better developer experience.`
          )
        }
      }

      return store
    }

    return buildStoreToUse(
      storeAndDescriptor[0],
      storeAndDescriptor[1],
      id,
      getters as Record<string, Method> | undefined,
      actions as Record<string, Method> | undefined
    )
  }

  // needed by map helpers
  useStore.$id = id

  return useStore
}
