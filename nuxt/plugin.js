// @ts-check
import Vue from 'vue'
// @ts-ignore: this must be pinia to load the local module
import { setActiveReq, PiniaSsr, setStateProvider, getRootState } from 'pinia'

if (process.server) {
  Vue.use(PiniaSsr)
}

/** @type {import('@nuxt/types').Plugin} */
const myPlugin = (context) => {
  // console.log('🍍 Pinia Nuxt plugin installed')

  if (process.server) {
    setActiveReq(context.req)
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = getRootState(context.req)
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    setStateProvider(() => context.nuxtState.pinia)
  }
}

export default myPlugin
