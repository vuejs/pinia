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
  onUnmounted,
  ComputedRef,
  toRef,
  toRefs,
  Ref,
  ref,
} from 'vue'
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
  _UnionToTuple,
  DefineSetupStoreOptions,
  DefineStoreOptionsInPlugin,
} from './types'
import {
  getActivePinia,
  setActivePinia,
  piniaSymbol,
  Pinia,
  activePinia,
} from './rootStore'
import { IS_CLIENT } from './env'
import { patchObject } from './hmr'

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
      // @ts-ignore
      target[key] = subPatch
    }
  }

  return target
}

const { assign } = Object

function isComputed(o: any): o is ComputedRef {
  return o && o.effect && o.effect.computed
}

function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A extends ActionsTree
>(
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  const { id, state, actions, getters } = options
  function $reset() {
    pinia.state.value[id] = state ? state() : {}
  }

  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: Store<Id, S, G, A>

  function setup() {
    if (!initialState && (!__DEV__ || !hot)) {
      $reset()
    }
    // pinia.state.value[id] = state ? state() : {}

    // avoid creating a state in pinia.state.value
    const localState =
      __DEV__ && hot
        ? toRefs(ref(state ? state() : {}).value)
        : initialState || toRefs(pinia.state.value[id])

    return assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            setActivePinia(pinia)
            // const context = store || ref(localState).value
            // @ts-expect-error
            // return getters![name].call(context, context)
            return store && getters![name].call(store, store)
          })
        )
        return computedGetters
      }, {} as Record<string, ComputedRef>)
    )
  }

  store = createSetupStore(id, setup, options, pinia, hot)

  // TODO: HMR should also replace getters here

  store.$reset = $reset

  return store as any
}

const noop = () => {}

function createSetupStore<
  Id extends string,
  SS,
  S extends StateTree,
  G extends ActionsTree, // TODO: naming
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

  // watcher options for $subscribe
  const $subscribeOptions: WatchOptions = { deep: true, flush: 'sync' }
  /* istanbul ignore else */
  if (__DEV__) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event
        // avoid triggering this while the store is being built and the state is being set in pinia
      } else if (isListening == false) {
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

  if (!initialState && __DEV__ && !hot) {
    // should be set in Vue 2
    pinia.state.value[$id] = {}
  }

  const hotState = ref({} as S)

  const triggerSubscriptions: SubscriptionCallback<S> = (mutation, state) => {
    subscriptions.forEach((callback) => {
      callback(mutation, state)
    })
  }

  if (__DEV__ && !pinia._e.active) {
    throw new Error('Pinia destroyed')
  }

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    return scope.run(() => {
      // skip setting up the watcher on HMR
      if (!__DEV__ || !hot) {
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
      }

      return setup()
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

  // TODO: refactor duplicated code for subscriptions
  function $subscribe(callback: SubscriptionCallback<S>, detached?: boolean) {
    subscriptions.push(callback)

    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback)
      if (idx > -1) {
        subscriptions.splice(idx, 1)
      }
    }

    if (!detached && getCurrentInstance()) {
      onUnmounted(removeSubscription)
    }

    return removeSubscription
  }

  function $onAction(
    callback: StoreOnActionListener<Id, S, G, A>,
    detached?: boolean
  ) {
    actionSubscriptions.push(callback)

    const removeSubscription = () => {
      const idx = actionSubscriptions.indexOf(callback)
      if (idx > -1) {
        actionSubscriptions.splice(idx, 1)
      }
    }

    if (!detached && getCurrentInstance()) {
      onUnmounted(removeSubscription)
    }

    return removeSubscription
  }

  const $reset = __DEV__
    ? () => {
        throw new Error(
          `🍍: Store "${$id}" is build using the setup syntax and does not implement $reset().`
        )
      }
    : noop

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
          name,
          store,
          after,
          onError,
        })
      })

      let ret: any
      try {
        ret = action.apply(this || store, args)
        Promise.resolve(ret).then(afterCallback).catch(onErrorCallback)
      } catch (error) {
        onErrorCallback(error)
        throw error
      }

      return ret
    }
  }

  const _hmrPayload = /*#__PURE__*/ markRaw({
    actions: {} as Record<string, any>,
    getters: {} as Record<string, Ref>,
    state: [] as string[],
    hotState,
  })

  // overwrite existing actions to support $onAction
  for (const key in setupStore) {
    const prop = setupStore[key]

    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      // mark it as a piece of state to be serialized
      if (__DEV__ && hot) {
        hotState.value[key] = toRef(setupStore as any, key)
        // createOptionStore already did this
      } else if (!buildState) {
        pinia.state.value[$id][key] = prop
        // TODO: avoid if state exists for SSR
      }

      if (__DEV__) {
        _hmrPayload.state.push(key)
      }
      // action
    } else if (typeof prop === 'function') {
      // @ts-expect-error: we are overriding the function we avoid wrapping if
      // this a hot module replacement store because the hotUpdate method needs
      // to do it with the right context
      setupStore[key] = __DEV__ && hot ? prop : wrapAction(key, prop)

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

  const partialStore = {
    _p: pinia,
    // _s: scope,
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
            _hmrPayload,
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
    get: () => (__DEV__ && hot ? hotState.value : pinia.state.value[$id]),
    set: (state) => {
      if (__DEV__ && hot) {
        throw new Error('cannot set hotState')
      }
      pinia.state.value[$id] = state
    },
  })

  // add the hotUpdate before plugins to allow them to override it
  if (__DEV__) {
    store.hotUpdate = markRaw((newStore) => {
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          // @ts-expect-error
          const newStateTarget = newStore.$state[stateKey]
          // @ts-expect-error
          const oldStateSource = store.$state[stateKey]
          if (
            typeof newStateTarget === 'object' &&
            isPlainObject(newStateTarget) &&
            isPlainObject(oldStateSource)
          ) {
            patchObject(newStateTarget, oldStateSource)
          } else {
            // @ts-expect-error
            // transfer the ref
            newStore.$state[stateKey] = oldStateSource
          }
        }
        // patch direct access properties to allow store.stateProperty to work as
        // store.$state.stateProperty
        // @ts-expect-error
        store[stateKey] = toRef(newStore.$state, stateKey)
      })

      // remove deleted state properties
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          // @ts-expect-error
          delete store[stateKey]
        }
      })

      pinia.state.value[$id] = toRef(newStore._hmrPayload, 'hotState')

      for (const actionName in newStore._hmrPayload.actions) {
        const action: _Method =
          // @ts-expect-error
          newStore[actionName]

        // @ts-expect-error: new key
        store[actionName] =
          // new line forced for TS
          wrapAction(actionName, action)
      }

      // TODO: does this work in both setup and option store?
      for (const getterName in newStore._hmrPayload.getters) {
        const getter: _Method = newStore._hmrPayload.getters[getterName]
        // @ts-expect-error
        store[getterName] =
          // ---
          buildState
            ? // special handling of options api
              computed(() => {
                setActivePinia(pinia)
                return getter.call(store, store)
              })
            : getter
      }

      // remove deleted getters
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          // @ts-expect-error
          delete store[key]
        }
      })

      // remove old actions
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          // @ts-expect-error
          delete store[key]
        }
      })

      // update the values used in devtools and to allow deleting new properties later on
      store._hmrPayload = newStore._hmrPayload
      store._getters = newStore._getters
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

  // apply all plugins
  pinia._p.forEach((extender) => {
    if (__DEV__ && IS_CLIENT) {
      const extensions = extender({
        // @ts-expect-error: conflict between A and ActionsTree
        store,
        app: pinia._a,
        pinia,
        // @ts-expect-error
        options: optionsForPlugin,
      })
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      )
      assign(store, extensions)
    } else {
      assign(
        store,
        extender({
          // @ts-expect-error: conflict between A and ActionsTree
          store,
          app: pinia._a,
          pinia,
          // @ts-expect-error
          options: optionsForPlugin,
        })
      )
    }
  })

  if (initialState) {
    ;(options.hydrate || innerPatch)(store, initialState)
  }

  isListening = true
  return store
}

// export function disposeStore(store: Store) {
//   store._e

// }

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
 * @param id - id of the store (must be unique)
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */
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
  S extends StateTree,
  G extends GettersTree<S>,
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */
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
export function defineStore(idOrOptions: any, setup?: any, setupOptions?: any) {
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
    options = setupOptions
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore(pinia?: Pinia | null, hot?: Store): Store {
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
      pinia._s.set(
        id,
        isSetupStore
          ? createSetupStore(id, setup, options, pinia)
          : createOptionsStore(options as any, pinia)
      )

      if (__DEV__) {
        // @ts-expect-error: not the right inferred type
        useStore._pinia = pinia
      }
    }

    const store: Store = pinia._s.get(id)!

    if (__DEV__ && hot) {
      const hotId = '__hot:' + id
      const newStore = isSetupStore
        ? createSetupStore(hotId, setup, options, pinia, true)
        : createOptionsStore(
            assign({}, options, { id: hotId }) as any,
            pinia,
            true
          )

      hot.hotUpdate(newStore as any)

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

    return store
  }

  useStore.$id = id

  return useStore
}
