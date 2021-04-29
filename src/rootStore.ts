import { App, InjectionKey, Plugin, Ref, ref, warn } from 'vue'
import { IS_CLIENT } from './env'
import {
  StateTree,
  StoreWithState,
  StateDescriptor,
  GenericStore,
  PiniaCustomProperties,
  Method,
  DefineStoreOptions,
  Store,
  GettersTree,
} from './types'

/**
 * setActivePinia must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export let activePinia: Pinia | undefined

/**
 * Sets or unsets the active pinia. Used in SSR and internally when calling
 * actions and getters
 *
 * @param pinia - Pinia instance
 */
export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)

/**
 * Get the currently active pinia
 */
export const getActivePinia = () => {
  if (__DEV__ && !activePinia) {
    warn(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n\n` +
        `const pinia = createPinia()\n` +
        `app.use(pinia)\n\n` +
        `This will fail in production.`
    )
  }

  return activePinia!
}

/**
 * Map of stores based on a Pinia instance. Allows setting and retrieving stores
 * for the current running application (with its pinia).
 */

export const storesMap = new WeakMap<
  Pinia,
  Map<
    string,
    [
      StoreWithState<string, StateTree>,
      StateDescriptor<StateTree>,
      InjectionKey<GenericStore>
    ]
  >
>()

/**
 * Client-side application instance used for devtools
 */
export let clientApp: App | undefined /*#__PURE__*/
export const setClientApp = (app: App) => (clientApp = app)
export const getClientApp = () => clientApp

/**
 * Context argument passed to Pinia plugins.
 */
export interface PiniaPluginContext<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A = Record<string, Method>
> {
  /**
   * pinia instance.
   */
  pinia: Pinia

  /**
   * Current app created with `Vue.createApp()`.
   */
  app: App

  /**
   * Current store being extended.
   */
  store: Store<Id, S, G, A>

  /**
   * Current store being extended.
   */
  options: DefineStoreOptions<Id, S, G, A>
}

/**
 * Plugin to extend every store
 */
export interface PiniaStorePlugin {
  (context: PiniaPluginContext): Partial<PiniaCustomProperties> | void
}

/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  install: Exclude<Plugin['install'], undefined>

  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaStorePlugin): Pinia

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: Array<PiniaStorePlugin>

  /**
   * App linked to this Pinia instance
   *
   * @internal
   */
  _a: App
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Access to the application's Pinia
     */
    $pinia: Pinia

    /**
     * Cache of stores instantiated by the current instance. Used by map
     * helpers.
     *
     * @internal
     */
    _pStores?: Record<string, GenericStore>
  }
}

export const piniaSymbol = (__DEV__
  ? Symbol('pinia')
  : /* istanbul ignore next */
    Symbol()) as InjectionKey<Pinia>

/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = ref({})

  let localApp: App | undefined
  let _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia)
  const toBeInstalled: PiniaStorePlugin[] = []

  const pinia: Pinia = {
    install(app: App) {
      pinia._a = localApp = app
      // pinia._a = app
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
      // TODO: write test
      // only set the app on client for devtools
      if (__BROWSER__ && IS_CLIENT) {
        setClientApp(app)
        // this allows calling useStore() outside of a component setup after
        // installing pinia's plugin
        setActivePinia(pinia)
      }
      toBeInstalled.forEach((plugin) => _p.push(plugin))
    },

    use(plugin) {
      if (!localApp) {
        toBeInstalled.push(plugin)
      } else {
        _p.push(plugin)
      }
      return this
    },

    _p,
    // it's actually undefined here
    _a: localApp!,

    state,
  }

  return pinia
}
