import { InjectionKey, ref, Ref } from '@vue/composition-api'
import {
  StateTree,
  StoreWithState,
  StateDescriptor,
  PiniaCustomProperties,
  GettersTree,
  Store,
  DefineStoreOptions,
  ActionsTree,
} from './types'
import type Vue from 'vue'

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
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
  A = ActionsTree
> {
  /**
   * pinia instance.
   */
  pinia: Pinia

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
  /**
   * Plugin to extend every store. Returns an object to extend the store or
   * nothing.
   *
   * @param context - Context
   */
  (context: PiniaPluginContext): Partial<PiniaCustomProperties> | void
}

/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @alpha the plugin API could change in the future
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaStorePlugin): Pinia

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: PiniaStorePlugin[]
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Currently installed pinia instance.
     */
    $pinia: Pinia

    /**
     * Cache of stores instantiated by the current instance. Used by map
     * helpers.
     *
     * @internal
     */
    _pStores?: Record<string, Store>
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    /**
     * Pinia instance to install in your application. Should be passed to the
     * root Vue.
     */
    pinia?: Pinia
  }
}

/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = ref({})

  const _p: Pinia['_p'] = []

  const pinia: Pinia = {
    use(plugin) {
      _p.push(plugin)
      return pinia
    },

    _p,

    state,
  }

  // this allows calling useStore() outside of a component setup after
  // installing pinia's plugin
  setActivePinia(pinia)

  return pinia
}

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
export const setActivePinia = (pinia: Pinia | undefined): Pinia | undefined =>
  (activePinia = pinia)

/**
 * Get the currently active pinia
 */
export const getActivePinia = (): Pinia => {
  /* istanbul ignore if */
  if (__DEV__ && !activePinia) {
    console.warn(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia and inject it?\n\n` +
        `import { PiniaPlugin, createPinia } from 'pinia'\n\n` +
        `Vue.use(PiniaPlugin)\n` +
        `const pinia = createPinia()\n` +
        `new Vue({ el: '#app', pinia })\n\n` +
        `This will fail in production.`
    )
  }

  return activePinia!
}
