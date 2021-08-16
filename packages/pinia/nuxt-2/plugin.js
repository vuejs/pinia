// @ts-check
/// <reference types="./types" />
import Vue from 'vue'
// @ts-expect-error: this must be pinia to load the local module
import { setActivePinia, PiniaPlugin, createPinia } from 'pinia'

Vue.use(PiniaPlugin)

/** @type {import('@nuxt/types').Plugin} */
const myPlugin = (context, inject) => {
  // console.log(context)

  /** @type {import('../src').Pinia} */
  const pinia = createPinia()
  inject('pinia', pinia)
  // simulate the injection ofr `new Vue({ pinia })`
  context.app.pinia = pinia
  // we also inject it without the $ to be able to use it without it
  context.pinia = pinia
  setActivePinia(pinia)

  // we bypass warnings
  // @ts-expect-error
  pinia._p.push(() => ({ $nuxt: context }))

  if (process.server) {
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = pinia.state.value
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }
}

export default myPlugin
