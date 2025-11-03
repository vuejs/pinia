import { createPinia, setActivePinia } from 'pinia'
import type { Pinia } from 'pinia'
import { defineNuxtPlugin, useNuxtApp, type Plugin } from '#app'

const plugin: Plugin<{ pinia: Pinia }> = defineNuxtPlugin({
  name: 'pinia',
  setup(nuxtApp) {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
    setActivePinia(pinia)

    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia as any
    }

    // Inject $pinia
    return {
      provide: {
        pinia,
      },
    }
  },
  hooks: {
    'app:rendered'() {
      const nuxtApp = useNuxtApp()
      nuxtApp.payload.pinia = (nuxtApp.$pinia as Pinia).state.value
      setActivePinia(undefined)
    },
  },
})

export default plugin
