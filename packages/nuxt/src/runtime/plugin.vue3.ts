import { createPinia, setActivePinia } from 'pinia'
import type { Pinia } from 'pinia'
import { defineNuxtPlugin, Plugin } from '#app'

const plugin: Plugin<{ pinia: Pinia }> = defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  setActivePinia(pinia)

  if (process.server) {
    nuxtApp.payload.pinia = pinia.state.value
  } else if (nuxtApp.payload && nuxtApp.payload.pinia) {
    pinia.state.value = nuxtApp.payload.pinia
  }

  // Inject $pinia
  return {
    provide: {
      pinia,
    },
  }
})

export default plugin
