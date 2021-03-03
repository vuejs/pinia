import { InjectionKey, ref, Ref } from '@vue/composition-api'
import {
  NonNullObject,
  StateTree,
  GenericStore,
  StoreWithState,
  StateDescriptor,
} from './types'
import Vue, { PluginFunction, VueConstructor } from 'vue'

/**
 * setActiveReq must be called to handle SSR at the top of functions like `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeReq: NonNullObject = {}
export const setActiveReq = (req: NonNullObject | undefined) =>
  req && (activeReq = req)

export const getActiveReq = () => activeReq

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
 */

export const storesMap = new WeakMap<
  Pinia,
  Map<string, [StoreWithState<string, StateTree>, StateDescriptor<StateTree>]>
>()

/**
 * A state provider allows to set how states are stored for hydration. e.g. setting a property on a context, getting a property from window
 */
interface StateProvider {
  (): Record<string, StateTree>
}

/**
 * Map of initial states used for hydration
 */
export const stateProviders = new WeakMap<NonNullObject, StateProvider>()

export function setStateProvider(stateProvider: StateProvider) {
  stateProviders.set(getActiveReq(), stateProvider)
}

export function getInitialState(id: string): StateTree | undefined {
  const provider = stateProviders.get(getActiveReq())
  return provider && provider()[id]
}

/**
 * Gets the root state of all active stores. This is useful when reporting an application crash by
 * retrieving the problematic state and send it to your error tracking service.
 * @param req request key
 */
export function getRootState(req: NonNullObject): Record<string, StateTree> {
  const stores = storesMap.get(req)
  if (!stores) return {}
  const rootState = {} as Record<string, StateTree>

  // forEach is the only one that also works on IE11
  stores.forEach((store) => {
    rootState[store.$id] = store.$state
  })

  return rootState
}

// ----------------------------------

/**
 * Properties that are added to every store by `pinia.use()`
 */
// eslint-disable-next-line
export interface PiniaCustomProperties {}

export const piniaSymbol = (__DEV__
  ? Symbol('pinia')
  : Symbol()) as InjectionKey<Pinia>

/**
 * Plugin to extend every store
 */
export interface PiniaStorePlugin {
  (pinia: Pinia): Partial<PiniaCustomProperties>
}

/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  install: PluginFunction<void>

  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaStorePlugin): void

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: Array<() => Partial<PiniaCustomProperties>>

  /**
   * Vue constructor retrieved when installing the pinia.
   */
  Vue: VueConstructor<Vue>
}


/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = ref({})

  const _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia)
  const toBeInstalled: PiniaStorePlugin[] = []

  const pinia: Pinia = {
    // this one is set in install
    Vue: {} as any,
    install(Vue) {
      // localApp = app
      this.Vue = Vue
      Vue.prototype.$pinia = pinia

      // Equivalent of
      // app.config.globalProperties.$pinia = pinia
      Vue.mixin({
        beforeCreate() {
          const options = this.$options as any
          // Make pinia accessible everywhere through this.$pinia
          // FIXME: typings
          if (options.pinia) {
            // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/master/src/apis/inject.ts#L25
            if (!(this as any)._provided) {
              const provideCache = {}
              Object.defineProperty(this, '_provided', {
                get: () => provideCache,
                set: (v) => Object.assign(provideCache, v),
              })
            }
            ;(this as any)._provided[piniaSymbol as any] = options.pinia
          }
        },
      })

      // only set the app on client for devtools
      if (__BROWSER__ && IS_CLIENT) {
        // setClientApp(app)
        // this allows calling useStore() outside of a component setup after
        // installing pinia's plugin
        setActivePinia(pinia)
      }

      toBeInstalled.forEach((plugin) => _p.push(plugin.bind(null, pinia)))
    },

    use(plugin) {
      if (!pinia.Vue) {
        toBeInstalled.push(plugin)
      } else {
        _p.push(plugin.bind(null, pinia))
      }
    },

    _p,

    state,
  }

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
export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)

/**
 * Get the currently active pinia
 */
export const getActivePinia = () => {
  if (__DEV__ && !activePinia) {
    console.warn(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia and inject it?\n\n` +
        `const pinia = createPinia()\n` +
        `Vue.use(pinia)\n` +
        `new Vue({ el: '#app', pinia })\n\n` +
        `This will fail in production.`
    )
  }

  return activePinia!
}
