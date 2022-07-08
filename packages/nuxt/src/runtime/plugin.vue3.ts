import { createPinia, setActivePinia } from 'pinia'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  setActivePinia(pinia)

  // @ts-expect-error: _p is internal
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: nuxtApp })
  })

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

declare module 'pinia' {
  export interface PiniaCustomProperties {
    /**
     * Nuxt context.
     */
    // FIXME: where is this type?
    // $nuxt: import('@nuxt/types').Context
  }
}
