// @ts-check
import { isVue2, Vue2 } from 'vue-demi'
import { createPinia, setActivePinia, PiniaVuePlugin } from 'pinia'

if (isVue2) {
  Vue2.use(PiniaVuePlugin)
}

/**
 * @type {import('@nuxt/types').Plugin}
 */
const PiniaNuxtPlugin = (context, inject) => {
  const pinia = createPinia()
  if (isVue2) {
    // simulate new Vue({ pinia })
    context.app.pinia = pinia
  } else {
    context.app.use(pinia)
  }

  // make sure to inject pinia after installing the plugin because in Nuxt 3, inject defines a non configurable getter
  // on app.config.globalProperties
  // add $pinia to the context
  inject('pinia', pinia)
  // to allow accessing pinia without the $
  // TODO: remove this in deprecation
  context.pinia = pinia

  setActivePinia(pinia)

  // add access to `$nuxt`
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: context })
  })

  if (process.server) {
    if (isVue2) {
      context.beforeNuxtRender(({ nuxtState }) => {
        nuxtState.pinia = pinia.state.value
      })
    } else {
      // there is no beforeNuxtRender in Nuxt 3
      context.nuxtState.pinia = pinia.state.value
    }
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }
}

export default PiniaNuxtPlugin
