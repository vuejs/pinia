import { install, isVue2, Vue2 } from 'vue-demi'
import { createPinia, setActivePinia, PiniaVuePlugin } from 'pinia'
import type { Plugin } from '@nuxt/types'

if (isVue2) {
  install()
  // TODO: workaround that should probably be removed in the future
  const Vue = 'default' in Vue2 ? Vue2.default : Vue2
  Vue.use(PiniaVuePlugin)
}

const PiniaNuxtPlugin: Plugin = (context, inject) => {
  const pinia = createPinia()
  if (isVue2) {
    // simulate new Vue({ pinia })
    context.app.pinia = pinia
  } else {
    // @ts-expect-error: vue 3 only
    context.vueApp.use(pinia)
  }

  // make sure to inject pinia after installing the plugin because in Nuxt 3, inject defines a non configurable getter
  // on app.config.globalProperties
  // add $pinia to the context
  if (isVue2) {
    inject('pinia', pinia)
  } else {
    // @ts-expect-error: vue 3 only
    context.provide('pinia', pinia)
  }
  // to allow accessing pinia without the $
  // TODO: remove this in deprecation
  context.pinia = pinia

  setActivePinia(pinia)

  // add access to `$nuxt`
  // TODO: adapt to Nuxt 3 with a definePlugin
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: context })
  })

  if (process.server) {
    if (isVue2) {
      context.beforeNuxtRender(({ nuxtState }) => {
        nuxtState.pinia = pinia.state.value
      })
    } else {
      // there is no beforeNuxtRender in Nuxt 3
      context.payload.pinia = pinia.state.value
    }
  } else {
    const source = isVue2 ? context.nuxtState : context.payload
    if (source && source.pinia) {
      pinia.state.value = source.pinia
    }
  }
}

export default PiniaNuxtPlugin
