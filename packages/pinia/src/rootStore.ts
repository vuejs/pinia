import {
  App,
  EffectScope,
  inject,
  hasInjectionContext,
  InjectionKey,
  Ref,
} from 'vue'
import {
  StateTree,
  PiniaCustomProperties,
  _Method,
  Store,
  _GettersTree,
  _ActionsTree,
  PiniaCustomStateProperties,
  DefineStoreOptionsInPlugin,
  StoreGeneric,
} from './types'
import { IS_CLIENT } from './env'

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
// @ts-expect-error: cannot constrain the type of the return
export const setActivePinia: _SetActivePinia = (pinia) => (activePinia = pinia)

interface _SetActivePinia {
  (pinia: Pinia): Pinia
  (pinia: undefined): undefined
  (pinia: Pinia | undefined): Pinia | undefined
}

/**
 * Get the currently active pinia if there is any.
 */
export const getActivePinia = __DEV__
  ? (): Pinia | undefined => {
      const pinia = hasInjectionContext() && inject(piniaSymbol)

      if (!pinia && !IS_CLIENT) {
        console.error(
          `[🍍]: Pinia instance not found in context. This falls back to the global activePinia which exposes you to cross-request pollution on the server. Most of the time, it means you are calling "useStore()" in the wrong place.\n` +
            `Read https://vuejs.org/guide/reusability/composables.html to learn more`
        )
      }

      return pinia || activePinia
    }
  : (): Pinia | undefined =>
      (hasInjectionContext() && inject(piniaSymbol)) || activePinia

export interface PiniaSetupContext {
  // context provided to stores by plugins will be available here
  [unknownInjection: string | symbol]: unknown
}
/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  install: (app: App) => void

  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaPlugin): Pinia

  provide(key: string | symbol, value: unknown): Pinia
  provide<K extends keyof PiniaSetupContext>(
    key: K,
    value: PiniaSetupContext[K]
  ): Pinia

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: PiniaPlugin[]

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
   * Registry of stores used by this pinia.
   *
   * @internal
   */
  _s: Map<string, StoreGeneric>

  /**
   * Added by `createTestingPinia()` to bypass `useStore(pinia)`.
   *
   * @internal
   */
  _testing?: boolean

  /**
   * Setup context passed to the setup function of setup store or the state function of option stores.
   *
   * @internal
   */
  _i: PiniaSetupContext
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
  G /* extends _GettersTree<S> */ = _GettersTree<S>,
  A /* extends _ActionsTree */ = _ActionsTree,
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
   * Initial options defining the store when calling `defineStore()`.
   */
  options: DefineStoreOptionsInPlugin<Id, S, G, A>

  /**
   * Make something available in the store setup function.
   *
   * @param key the name of the property used to access the provided value
   * @param value the value to provide
   */
  provide: Provide
}

export interface Provide {
  /**
   * Make something available in the setup of stores.
   *
   * Augment PiniaSetupContext like so to enable strong typing.
   * ```ts
   * declare module 'pinia' {
   * 	export interface PiniaSetupContext {
   * 		myContextInjection: MyAwesomeType;
   * 	}
   * }
   * ```
   *
   * @param key the key used to access the injected value. Can be a `string` or a `symbol`
   * @param value the value to make available, can be anything but isn't reactive by default
   */
  <K extends keyof PiniaSetupContext>(key: K, value: PiniaSetupContext[K]): void

  /**
   * Make something available in the setup of stores.
   *
   * Augment PiniaSetupContext like so to enable strong typing.
   * ```ts
   * declare module 'pinia' {
   * 	export interface PiniaSetupContext {
   * 		myContextInjection: MyAwesomeType;
   * 	}
   * }
   * ```
   *
   * @param key the key used to access the injected value. Can be a `string` or a `symbol`
   * @param value the value to make available, can be anything but isn't reactive by default
   */
  (key: string | symbol, value: unknown): void
}
/**
 * Plugin to extend every store.
 */
export interface PiniaPlugin {
  /**
   * Plugin to extend every store. Returns an object to extend the store or
   * nothing.
   *
   * @param context - Context
   */
  (
    context: PiniaPluginContext
  ): Partial<PiniaCustomProperties & PiniaCustomStateProperties> | void
}
