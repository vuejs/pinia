import { InjectionKey, ref, Ref } from '@vue/composition-api'
import { StateTree, StoreWithState, StateDescriptor } from './types'
import { PluginFunction, VueConstructor } from 'vue'
import type Vue from 'vue'

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
 * Properties that are added to every store by `pinia.use()`
 */
// eslint-disable-next-line
export interface PiniaCustomProperties {}

export const piniaSymbol = (__DEV__
  ? Symbol('pinia')
  : /* istanbul ignore next */
    Symbol()) as InjectionKey<Pinia>

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
  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @alpha DO NOT USE, The plugin architecture will change to provide more
   * customization options.
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

declare module 'vue/types/vue' {
  interface Vue {
    $pinia: Pinia
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    pinia?: Pinia
  }
}

export const PiniaPlugin: PluginFunction<void> = function (_Vue) {
  // Equivalent of
  // app.config.globalProperties.$pinia = pinia
  _Vue.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.pinia) {
        options.pinia.Vue = _Vue
        // this allows calling useStore() outside of a component setup after
        // installing pinia's plugin
        setActivePinia(options.pinia)
        // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/master/src/apis/inject.ts#L25
        /* istanbul ignore else */
        if (!(this as any)._provided) {
          const provideCache = {}
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          })
        }
        ;(this as any)._provided[piniaSymbol as any] = options.pinia

        // propagate the pinia instance in an SSR friendly way
        this.$pinia = options.pinia
      } else if (options.parent && options.parent.$pinia) {
        this.$pinia = options.parent.$pinia
      }
    },
  })
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
    // this one is set in install
    Vue: {} as any,

    use(plugin) {
      /* istanbul ignore next */
      if (__DEV__) {
        console.warn(
          `[🍍]: The plugin API has plans to change to bring better extensibility. "pinia.use()" signature will change in the next release. It is recommended to avoid using this API.`
        )
      }
      _p.push(plugin.bind(null, pinia))
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
