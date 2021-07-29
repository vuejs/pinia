import { defineNuxtPlugin } from '@nuxt/app'
import { markRaw } from '@nuxt/app/node_modules/@vue/runtime-core'
import { createPinia, setActivePinia } from 'pinia'

const PiniaPlugin = defineNuxtPlugin((nuxt) => {
  const pinia = createPinia()

  // if Vue 2, simulate new Vue({ pinia })
  nuxt.app.pinia = pinia

  // TODO: handle this once we know how to do it
  // add $pinia to the context
  // inject('pinia', pinia)
  // to allow accessing pinia without the $
  // context.pinia = pinia

  setActivePinia(pinia)

  pinia._p.push(() => ({ $nuxt: markRaw(nuxt) }))

  if (process.server) {
    // beforeNuxt render set nuxtState.pinia = pinia.state.value
  } else {
    // set pinia.state.value = nuxtState.pinia
  }
})

export default PiniaPlugin
