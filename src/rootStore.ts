import { App, InjectionKey, Plugin, Ref, ref, warn } from 'vue'
import { IS_CLIENT } from './env'
import {
  StateTree,
  GenericStore,
  StoreWithState,
  StateDescriptor,
} from './types'

/**
 * setActivePinia must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export let activePinia: Pinia | undefined
export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)

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
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between piniauests on the server
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
export const stateProviders = new WeakMap<Pinia, StateProvider>()

export function setStateProvider(stateProvider: StateProvider) {
  stateProviders.set(getActivePinia(), stateProvider)
}

export function getInitialState(id: string): StateTree | undefined {
  const provider = stateProviders.get(getActivePinia())
  return provider && provider()[id]
}

/**
 * Gets the root state of all active stores. This is useful when reporting an application crash by
 * retrieving the problematic state and send it to your error tracking service.
 * @param pinia - piniauest key
 */
export function getRootState(pinia: Pinia): Record<string, StateTree> {
  return pinia.state.value
}

/**
 * Client-side application instance used for devtools
 */
export let clientApp: App | undefined
export const setClientApp = (app: App) => (clientApp = app)
export const getClientApp = () => clientApp

export interface Pinia {
  install: Exclude<Plugin['install'], undefined>

  /**
   * root state
   */
  state: Ref<any>
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Access to the application's Pinia
     */
    $pinia: Pinia
  }
}

export const piniaSymbol = (__DEV__
  ? Symbol('pinia')
  : Symbol()) as InjectionKey<Pinia>

export function createPinia(): Pinia {
  const state = ref({})

  const pinia: Pinia = {
    install(app: App) {
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
      // TODO: write test
      // only set the app on client
      if (__BROWSER__ && IS_CLIENT) {
        setClientApp(app)
      }
    },

    state,
  }

  return pinia
}

/**
 * Registered stores
 */
export const stores = new Set<GenericStore>()

export function registerStore(store: GenericStore) {
  stores.add(store)
}

export const getRegisteredStores = () => stores
