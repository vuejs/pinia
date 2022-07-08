import { createPinia, setActivePinia } from 'pinia'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()

  nuxtApp.vueApp.use(pinia)

  // Make sure to inject pinia after installing the plugin because in Nuxt 3, inject defines a non configurable getter
  // on app.config.globalProperties
  // add $pinia to the context
  nuxtApp.provide('pinia', pinia)

  setActivePinia(pinia)

  // Add access to `$nuxt`
  pinia._p.push(({ store }) => {
    // Make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: nuxtApp })
  })

  if (process.server) {
    nuxtApp.payload.pinia = pinia.state.value
  } else if (nuxtApp.payload && nuxtApp.payload.pinia) {
    pinia.state.value = nuxtApp.payload.pinia
  }
})
