import { createPinia, registerPiniaDevtools, setActivePinia } from 'pinia'
import type { Pinia } from 'pinia'
import { defineNuxtPlugin, type Plugin } from '#app'
import { toRaw } from 'vue'

const plugin: Plugin<{ pinia: Pinia }> = defineNuxtPlugin({
  name: 'pinia',
  setup(nuxtApp) {
    const pinia = createPinia({ skipDevtoolsRegistration: true })
    nuxtApp.vueApp.use(pinia)
    setActivePinia(pinia)

    if (import.meta.server) {
      nuxtApp.payload.pinia = toRaw(pinia.state.value)
    } else if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia as any
    }

    // Register the devtools after vue devtools is initialized, see: https://github.com/nuxt/devtools/issues/823
    if (import.meta.client && typeof Proxy !== 'undefined') {
      nuxtApp.hook('app:mounted', () =>
        registerPiniaDevtools(nuxtApp.vueApp, pinia)
      )
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
