import { defineNuxtPlugin } from '#app'
import { createPinia, setActivePinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  nuxtApp.provide('pinia', pinia)
  setActivePinia(pinia)

  // Hydrate state
  if (process.server) {
    nuxtApp.payload.state.pinia = pinia.state.value
  }
  if (process.client && nuxtApp.payload.state.pinia) {
    pinia.state.value = nuxtApp.payload.state.pinia
  }
})
