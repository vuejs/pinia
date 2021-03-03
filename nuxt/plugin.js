// @ts-check
import Vue from 'vue'
// @ts-ignore: this must be pinia to load the local module
import { setActivePinia, PiniaPlugin, createPinia } from 'pinia'

Vue.use(PiniaPlugin)

/** @type {import('@nuxt/types').Plugin} */
const myPlugin = (context, inject) => {
  // console.log(context)

  const pinia = createPinia()
  context.app.pinia = pinia
  setActivePinia(pinia)

  inject('pinia', pinia)

  if (process.server) {
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = pinia.state.value
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }
}

export default myPlugin
