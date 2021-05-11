import {
  Pinia,
  PiniaStorePlugin,
  setActivePinia,
  piniaSymbol,
} from './rootStore'
import { ref, App } from 'vue'
import { devtoolsPlugin } from './devtools'
import { IS_CLIENT } from './env'

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

  if (IS_CLIENT && __BROWSER__ && __DEV__) {
    pinia.use(devtoolsPlugin)
  }

  return pinia
}
