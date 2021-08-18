import { defineNuxtPlugin } from '@nuxt/app'
import { markRaw, isVue2, Vue2 } from 'vue-demi'
import { createPinia, setActivePinia, PiniaPlugin } from 'pinia'

if (isVue2) {
  Vue2(PiniaPlugin)
}

a._legacyContext

const PiniaNuxtPlugin = defineNuxtPlugin((nuxt) => {
  const pinia = createPinia()

  if (isVue2) {
    // simulate new Vue({ pinia })
    nuxt._legacyContext.app.pinia = pinia
    // nuxt.app.pinia = pinia
  }

  // TODO: handle this once we know how to do it
  // add $pinia to the context
  // inject('pinia', pinia)
  // to allow accessing pinia without the $
  // context.pinia = pinia

  setActivePinia(pinia)

  pinia._p.push(() => ({ $nuxt: markRaw(nuxt) }))

  if (process.server) {
    // beforeNuxt render set nuxtState.pinia = pinia.state.value
    nuxt.payload.data.pinia = pinia.state.value
  } else {
    // set pinia.state.value = nuxtState.pinia
    pinia.state.value = nuxt.payload.data.pinia
  }
})

export default PiniaNuxtPlugin
