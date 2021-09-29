import {
  watch,
  computed,
  inject,
  getCurrentInstance,
  reactive,
  DebuggerEvent,
  WatchOptions,
  UnwrapRef,
  markRaw,
  isRef,
  isReactive,
  effectScope,
  EffectScope,
  ComputedRef,
  toRef,
  toRefs,
  Ref,
  ref,
  set,
  del,
  isVue2,
} from 'vue-demi'
import {
  StateTree,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
  Store,
  _Method,
  DefineStoreOptions,
  StoreDefinition,
  GettersTree,
  MutationType,
  StoreOnActionListener,
  ActionsTree,
  SubscriptionCallbackMutation,
  DefineSetupStoreOptions,
  DefineStoreOptionsInPlugin,
  StoreGeneric,
  StoreWithGetters,
  _ExtractActionsFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractStateFromSetupStore,
  StoreWithState,
} from './types'
import { setActivePinia, piniaSymbol, Pinia, activePinia } from './rootStore'
import { IS_CLIENT } from './env'
import { patchObject } from './hmr'
import { addSubscription, triggerSubscriptions } from './subscriptions'

function innerPatch<T extends StateTree>(
  target: T,
  patchToApply: DeepPartial<T>
): T {
  // no need to go through symbols because they cannot be serialized anyway
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
      // @ts-expect-error: subPatch is a valid value
      target[key] = subPatch
    }
  }

  return target
}

const { assign } = Object

function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
function isComputed(o: any): o is ComputedRef {
  if (isVue2) {
    const descriptor = o ? Object.getOwnPropertyDescriptor(o, 'value') : null
    return (descriptor &&
      descriptor.get &&
      // TODO: make something in @vue/composition-api to be able to check this
      descriptor.get.toString().length > 42) as boolean
  }
  return o && o.effect
}

function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A extends ActionsTree
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  const { state, actions, getters } = options

  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: Store<Id, S, G, A>

  function setup() {
    if (!initialState && (!__DEV__ || !hot)) {
      if (isVue2) {
        set(pinia.state.value, id, state ? state() : {})
      } else {
        pinia.state.value[id] = state ? state() : {}
      }
    }

    // avoid creating a state in pinia.state.value
    const localState =
      __DEV__ && hot
        ? // use ref() to unwrap refs inside state TODO: check if this is still necessary
          toRefs(ref(state ? state() : {}).value)
        : toRefs(pinia.state.value[id])

    return assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            setActivePinia(pinia)
            // it was created just before
            const store = pinia._s.get(id)!

            // allow cross using stores
            if (isVue2 && !store._r) return

            // @ts-expect-error
            // return getters![name].call(context, context)
            // TODO: avoid reading the getter while assigning with a global variable
            return getters![name].call(store, store)
          })
        )
        return computedGetters
      }, {} as Record<string, ComputedRef>)
    )
  }

  store = createSetupStore(id, setup, options, pinia, hot)

  store.$reset = function $reset() {
    const newState = state ? state() : {}
    // we use a patch to group all changes into one single subscription
    this.$patch(($state) => {
      assign($state, newState)
    })
  }

  return store as any
}

const noop = () => {}

function createSetupStore<
  Id extends string,
  SS,
  S extends StateTree,
  G extends Record<string, _Method>,
  A extends ActionsTree
>(
  $id: Id,
  setup: () => SS,
  options:
    | DefineSetupStoreOptions<Id, S, G, A>
    | DefineStoreOptions<Id, S, G, A> = {},
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  let scope!: EffectScope
  const buildState = (options as DefineStoreOptions<Id, S, G, A>).state

  const optionsForPlugin: DefineStoreOptionsInPlugin<Id, S, G, A> = {
    actions: {} as A,
    ...options,
  }

  /* istanbul ignore if */
  if (__DEV__ && !pinia._e.active) {
    throw new Error('Pinia destroyed')
  }

  // watcher options for $subscribe
  const $subscribeOptions: WatchOptions = {
    deep: true,
    // flush: 'post',
  }
  /* istanbul ignore else */
  if (__DEV__ && !isVue2) {
    $subscribeOptions.onTrigger = (event) => {
      /* istanbul ignore else */
      if (isListening) {
        debuggerEvents = event
        // avoid triggering this while the store is being built and the state is being set in pinia
      } else if (isListening == false && !store._hotUpdating) {
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
  let isListening: boolean // set to true at the end
  let subscriptions: SubscriptionCallback<S>[] = markRaw([])
  let actionSubscriptions: StoreOnActionListener<Id, S, G, A>[] = markRaw([])
  let debuggerEvents: DebuggerEvent[] | DebuggerEvent
  const initialState = pinia.state.value[$id] as UnwrapRef<S> | undefined

  if (!initialState && (!__DEV__ || !hot)) {
    if (isVue2) {
      set(pinia.state.value, $id, {})
    } else {
      pinia.state.value[$id] = {}
    }
  }

  const hotState = ref({} as S)

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
      subscriptions,
      subscriptionMutation,
      pinia.state.value[$id] as UnwrapRef<S>
    )
  }

  /* istanbul ignore next */
  const $reset = __DEV__
    ? () => {
        throw new Error(
          `🍍: Store "${$id}" is build using the setup syntax and does not implement $reset().`
        )
      }
    : noop

  function $dispose() {
    scope.stop()
    subscriptions = []
    actionSubscriptions = []
    pinia._s.delete($id)
  }

  /**
   * Wraps an action to handle subscriptions.
   *
   * @param name - name of the action
   * @param action - action to wrap
   * @returns a wrapped action to handle subscriptions
   */
  function wrapAction(name: string, action: _Method) {
    return function (this: any) {
      setActivePinia(pinia)
      const args = Array.from(arguments)

      let afterCallback: (resolvedReturn: any) => any = noop
      let onErrorCallback: (error: unknown) => unknown = noop
      function after(callback: typeof afterCallback) {
        afterCallback = callback
      }
      function onError(callback: typeof onErrorCallback) {
        onErrorCallback = callback
      }

      // @ts-expect-error
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError,
      })

      let ret: any
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args)
        // handle sync errors
      } catch (error) {
        if (onErrorCallback(error) !== false) {
          throw error
        }
      }

      if (ret instanceof Promise) {
        return ret
          .then((value) => {
            const newRet = afterCallback(value)
            // allow the afterCallback to override the return value
            return newRet === undefined ? value : newRet
          })
          .catch((error) => {
            if (onErrorCallback(error) !== false) {
              return Promise.reject(error)
            }
          })
      }

      // allow the afterCallback to override the return value
      const newRet = afterCallback(ret)
      return newRet === undefined ? ret : newRet
    }
  }

  const _hmrPayload = /*#__PURE__*/ markRaw({
    actions: {} as Record<string, any>,
    getters: {} as Record<string, Ref>,
    state: [] as string[],
    hotState,
  })

  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options = {}) {
      /* istanbul ignore if */
      if (__DEV__ && typeof options === 'boolean') {
        console.warn(
          `[🍍]: store.$subscribe() no longer accepts a boolean as the 2nd parameter:\n` +
            `Replace "store.$subscribe(fn, ${String(
              options
            )})" with "store.$subscribe(fn, { detached: ${String(
              options
            )} })".\nThis will fail in production.`
        )
        options = { detached: options }
      }

      const _removeSubscription = addSubscription(
        subscriptions,
        callback,
        // @ts-expect-error: until the deprecation is removed
        options.detached
      )
      const stopWatcher = scope.run(() =>
        watch(
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
          assign({}, $subscribeOptions, options)
        )
      )!

      const removeSubscription = () => {
        stopWatcher()
        _removeSubscription()
      }

      return removeSubscription
    },
    $dispose,
  } as StoreWithState<Id, S, G, A>

  if (isVue2) {
    // start as non ready
    partialStore._r = false
  }

  const store: Store<Id, S, G, A> = reactive(
    assign(
      __DEV__ && IS_CLIENT
        ? // devtools custom properties
          {
            _customProperties: markRaw(new Set<string>()),
            _hmrPayload,
          }
        : {},
      partialStore
      // must be added later
      // setupStore
    )
  ) as unknown as Store<Id, S, G, A>

  // store the partial store now so the setup of stores can instantiate each other before they are finished without
  // creating infinite loops.
  pinia._s.set($id, store)

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })!

  // overwrite existing actions to support $onAction
  for (const key in setupStore) {
    const prop = setupStore[key]

    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      // mark it as a piece of state to be serialized
      if (__DEV__ && hot) {
        set(hotState.value, key, toRef(setupStore as any, key))
        // createOptionStore directly sets the state in pinia.state.value so we
        // can just skip that
      } else if (!buildState) {
        // in setup stores we must hydrate the state and sync pinia state tree with the refs the user just created
        if (initialState) {
          if (isRef(prop)) {
            prop.value = initialState[key]
          } else {
            // probably a reactive object, lets recursively assign
            innerPatch(prop, initialState[key])
          }
        }
        // transfer the ref to the pinia state to keep everything in sync
        if (isVue2) {
          set(pinia.state.value[$id], key, prop)
        } else {
          pinia.state.value[$id][key] = prop
        }
      }

      /* istanbul ignore else */
      if (__DEV__) {
        _hmrPayload.state.push(key)
      }
      // action
    } else if (typeof prop === 'function') {
      // @ts-expect-error: we are overriding the function we avoid wrapping if
      const actionValue = __DEV__ && hot ? prop : wrapAction(key, prop)
      // this a hot module replacement store because the hotUpdate method needs
      // to do it with the right context
      if (isVue2) {
        set(setupStore, key, actionValue)
      } else {
        // @ts-expect-error
        setupStore[key] = actionValue
      }

      /* istanbul ignore else */
      if (__DEV__) {
        _hmrPayload.actions[key] = prop
      }

      // list actions so they can be used in plugins
      // @ts-expect-error
      optionsForPlugin.actions[key] = prop
    } else if (__DEV__) {
      // add getters for devtools
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = buildState
          ? // @ts-expect-error
            options.getters[key]
          : prop
        if (IS_CLIENT) {
          const getters: string[] =
            // @ts-expect-error: it should be on the store
            setupStore._getters || (setupStore._getters = markRaw([]))
          getters.push(key)
        }
      }
    }
  }

  // add the state, getters, and action properties
  if (isVue2) {
    Object.keys(setupStore).forEach((key) => {
      set(
        store,
        key,
        // @ts-expect-error: valid key indexing
        setupStore[key]
      )
    })
  } else {
    assign(store, setupStore)
  }

  // use this instead of a computed with setter to be able to create it anywhere
  // without linking the computed lifespan to wherever the store is first
  // created.
  Object.defineProperty(store, '$state', {
    get: () => (__DEV__ && hot ? hotState.value : pinia.state.value[$id]),
    set: (state) => {
      /* istanbul ignore if */
      if (__DEV__ && hot) {
        throw new Error('cannot set hotState')
      }
      $patch(($state) => {
        assign($state, state)
      })
    },
  })

  // add the hotUpdate before plugins to allow them to override it
  /* istanbul ignore else */
  if (__DEV__) {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey]
          const oldStateSource = store.$state[stateKey]
          if (
            typeof newStateTarget === 'object' &&
            isPlainObject(newStateTarget) &&
            isPlainObject(oldStateSource)
          ) {
            patchObject(newStateTarget, oldStateSource)
          } else {
            // transfer the ref
            newStore.$state[stateKey] = oldStateSource
          }
        }
        // patch direct access properties to allow store.stateProperty to work as
        // store.$state.stateProperty
        set(store, stateKey, toRef(newStore.$state, stateKey))
      })

      // remove deleted state properties
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey)
        }
      })

      // avoid devtools logging this as a mutation
      isListening = false
      pinia.state.value[$id] = toRef(newStore._hmrPayload, 'hotState')
      isListening = true

      for (const actionName in newStore._hmrPayload.actions) {
        const action: _Method = newStore[actionName]

        set(store, actionName, wrapAction(actionName, action))
      }

      // TODO: does this work in both setup and option store?
      for (const getterName in newStore._hmrPayload.getters) {
        const getter: _Method = newStore._hmrPayload.getters[getterName]
        const getterValue = buildState
          ? // special handling of options api
            computed(() => {
              setActivePinia(pinia)
              return getter.call(store, store)
            })
          : getter

        set(store, getterName, getterValue)
      }

      // remove deleted getters
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key)
        }
      })

      // remove old actions
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key)
        }
      })

      // update the values used in devtools and to allow deleting new properties later on
      store._hmrPayload = newStore._hmrPayload
      store._getters = newStore._getters
      store._hotUpdating = false
    })

    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false,
    }

    if (IS_CLIENT) {
      // avoid listing internal properties in devtools
      ;(
        ['_p', '_hmrPayload', '_getters', '_customProperties'] as const
      ).forEach((p) => {
        Object.defineProperty(store, p, {
          value: store[p],
          ...nonEnumerable,
        })
      })
    }
  }

  if (isVue2) {
    // mark the store as ready before pluginsn
    store._r = true
  }

  // apply all plugins
  pinia._p.forEach((extender) => {
    /* istanbul ignore else */
    if (__DEV__ && IS_CLIENT) {
      const extensions = scope.run(() =>
        extender({
          store,
          app: pinia._a,
          pinia,
          // @ts-expect-error
          options: optionsForPlugin,
        })
      )!
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      )
      assign(store, extensions)
    } else {
      assign(
        store,
        scope.run(() =>
          extender({
            store,
            app: pinia._a,
            pinia,
            // @ts-expect-error
            options: optionsForPlugin,
          })
        )!
      )
    }
  })

  // only apply hydrate to option stores with an initial state in pinia
  if (initialState && buildState) {
    ;(options.hydrate || innerPatch)(store, initialState)
  }

  isListening = true
  return store
}

// export function disposeStore(store: StoreGeneric) {
//   store._e

// }

/**
 * Extract the actions of a store type. Works with both a Setup Store or an
 * Options Store.
 */
export type StoreActions<SS> = SS extends Store<
  string,
  StateTree,
  GettersTree<StateTree>,
  infer A
>
  ? A
  : _ExtractActionsFromSetupStore<SS>

/**
 * Extract the getters of a store type. Works with both a Setup Store or an
 * Options Store.
 */
export type StoreGetters<SS> = SS extends Store<
  string,
  StateTree,
  infer G,
  ActionsTree
>
  ? StoreWithGetters<G>
  : _ExtractGettersFromSetupStore<SS>

/**
 * Extract the state of a store type. Works with both a Setup Store or an
 * Options Store. Note this unwraps refs.
 */
export type StoreState<SS> = SS extends Store<
  string,
  infer S,
  GettersTree<StateTree>,
  ActionsTree
>
  ? UnwrapRef<S>
  : _ExtractStateFromSetupStore<SS>

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
 * @param id - id of the store (must be unique)
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {}
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {}
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param storeSetup - function that defines the store
 * @param options - extra options
 */
export function defineStore<Id extends string, SS>(
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
>
export function defineStore(
  // TODO: add proper types from above
  idOrOptions: any,
  setup?: any,
  setupOptions?: any
): StoreDefinition {
  let id: string
  let options:
    | DefineStoreOptions<string, StateTree, GettersTree<StateTree>, ActionsTree>
    | DefineSetupStoreOptions<
        string,
        StateTree,
        GettersTree<StateTree>,
        ActionsTree
      >

  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    // the option store setup will contain the actual options in this case
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
    const currentInstance = getCurrentInstance()
    pinia =
      // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
      (currentInstance && inject(piniaSymbol))
    if (pinia) setActivePinia(pinia)

    if (__DEV__ && !activePinia) {
      throw new Error(
        `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n\n` +
          `const pinia = createPinia()\n` +
          `app.use(pinia)\n\n` +
          `This will fail in production.`
      )
    }

    pinia = activePinia!

    if (!pinia._s.has(id)) {
      // creating the store registers it in `pinia._s`
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia)
      } else {
        createOptionsStore(id, options as any, pinia)
      }

      /* istanbul ignore else */
      if (__DEV__) {
        // @ts-expect-error: not the right inferred type
        useStore._pinia = pinia
      }
    }

    const store: StoreGeneric = pinia._s.get(id)!

    if (__DEV__ && hot) {
      const hotId = '__hot:' + id
      const newStore = isSetupStore
        ? createSetupStore(hotId, setup, options, pinia, true)
        : createOptionsStore(hotId, assign({}, options) as any, pinia, true)

      hot._hotUpdate(newStore)

      // cleanup the state properties and the store from the cache
      delete pinia.state.value[hotId]
      pinia._s.delete(hotId)
    }

    // save stores in instances to access them devtools
    if (
      __DEV__ &&
      IS_CLIENT &&
      currentInstance &&
      currentInstance.proxy &&
      // avoid adding stores that are just built for hot module replacement
      !hot
    ) {
      const vm = currentInstance.proxy
      const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
      cache[id] = store
    }

    // StoreGeneric cannot be casted towards Store
    return store as any
  }

  useStore.$id = id

  return useStore
}
