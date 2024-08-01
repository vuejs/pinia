import { createPinia, setActivePinia } from 'pinia'
import type { Pinia } from 'pinia'
import { defineNuxtPlugin, type Plugin } from '#app'

const plugin: Plugin<{ pinia: Pinia }> = defineNuxtPlugin({
  name: 'pinia',
  setup(nuxtApp) {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
    setActivePinia(pinia)

    if (import.meta.server) {
      nuxtApp.payload.pinia = pinia.state.value
    } else if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia as any
    }

    // Inject $pinia
    return {
      provide: {
        pinia,
      },
    }
  },
})

export default plugin
