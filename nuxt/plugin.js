// @ts-check
import Vue from 'vue'
// @ts-ignore: this must be pinia to load the local module
import { setActiveReq, setStateProvider, getRootState } from 'pinia'

/** @type {import('@nuxt/types').Plugin} */
const myPlugin = (context) => {
  // console.log('🍍 Pinia Nuxt plugin installed')

  // TODO: figure this out
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
