import { App, EffectScope, InjectionKey, Plugin, Ref, warn } from 'vue'
import {
  StateTree,
  StoreWithState,
  StateDescriptor,
  PiniaCustomProperties,
  _Method,
  DefineStoreOptions,
  Store,
  GettersTree,
  ActionsTree,
  PiniaCustomStateProperties,
  GenericStore,
  DefineStoreOptionsInPlugin,
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
      InjectionKey<Store>
    ]
  >
>()

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

  /**
   * Effect scope the pinia is attached to
   *
   * @internal
   */
  _e: EffectScope

  /**
   *
   * @internal
   */
  _s: Map<string, GenericStore>

  /**
   * Added by `createTestingPinia()` to bypass `useStore(pinia)`.
   *
   * @internal
   */
  _testing?: boolean
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Access to the application's Pinia
     */
    $pinia: Pinia

    /**
     * Cache of stores instantiated by the current instance. Used by devtools to
     * list currently used stores.
     *
     * @internal
     */
    _pStores?: Record<string, Store>
  }
}

export const piniaSymbol = (
  __DEV__ ? Symbol('pinia') : /* istanbul ignore next */ Symbol()
) as InjectionKey<Pinia>

/**
 * Context argument passed to Pinia plugins.
 */
export interface PiniaPluginContext<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
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
  options: DefineStoreOptionsInPlugin<Id, S, G, A>
}

/**
 * Plugin to extend every store
 */
export interface PiniaStorePlugin {
  /**
   * Plugin to extend every store. Returns an object to extend the store or
   * nothing.
   *
   * @param context - Context
   */
  (context: PiniaPluginContext): Partial<
    PiniaCustomProperties & PiniaCustomStateProperties
  > | void
}
