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
  // add $pinia to the context
  inject('pinia', pinia)
  // to allow accessing pinia without the $
  context.pinia = pinia

  if (isVue2) {
    // simulate new Vue({ pinia })
    context.app.pinia = pinia
  } else {
    // TODO: does this work?
    context.app.use(pinia)
  }

  setActivePinia(pinia)

  // add access to `$nuxt`
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: context })
  })

  if (process.server) {
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = pinia.state.value
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }
}

export default PiniaNuxtPlugin
