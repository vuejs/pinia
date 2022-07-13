import _Vue2 from 'vue'
import { createPinia, setActivePinia, PiniaVuePlugin } from 'pinia'

// TODO: workaround that should probably be removed in the future
const Vue = 'default' in _Vue2 ? (_Vue2 as any).default : _Vue2
Vue.use(PiniaVuePlugin)

export default (context: any, inject: any) => {
  const pinia = createPinia()
  context.app.pinia = pinia
  setActivePinia(pinia)

  // add access to `$nuxt`
  // @ts-expect-error: _p is internal
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: context })
  })

  if (process.server) {
    context.beforeNuxtRender((ctx: any) => {
      ctx.nuxtState.pinia = pinia.state.value
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }

  // Inject $pinia
  inject('pinia', pinia)
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    /**
     * Nuxt context.
     *
     * @deprecated use `useNuxtApp()` and global `$fetch()` instead. See https://v3.nuxtjs.org/bridge/bridge-composition-api/
     */
    $nuxt: import('@nuxt/schema').NuxtApp
  }
}
