import _Vue2 from 'vue'
import { createPinia, setActivePinia, PiniaVuePlugin } from 'pinia'

// TODO: workaround that should probably be removed in the future
const Vue = 'default' in _Vue2 ? (_Vue2 as any).default : _Vue2

Vue.use(PiniaVuePlugin)

export default (context: any, inject: any) => {
  const pinia = createPinia()
  // simulate new Vue({ pinia })
  context.app.pinia = pinia

  // make sure to inject pinia after installing the plugin because in Nuxt 3, inject defines a non configurable getter
  // on app.config.globalProperties
  // add $pinia to the context
  inject('pinia', pinia)

  // to allow accessing pinia without the $
  // TODO: remove this in deprecation
  context.pinia = pinia
  setActivePinia(pinia)

  // add access to `$nuxt`
  // TODO: adapt to Nuxt 3 with a definePlugin
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
}
