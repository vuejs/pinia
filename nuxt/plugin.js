// @ts-check
import Vue from 'vue'
// @ts-ignore: this must be pinia to load the local module
import { setActiveReq, setStateProvider, getRootState } from 'pinia'

Vue.mixin({
  beforeCreate() {
    // @ts-ignore
    const { setup, serverPrefetch } = this.$options
    if (setup) {
      // @ts-ignore
      this.$options.setup = (props, context) => {
        if (context.ssrContext && context.ssrContext.req) {
          setActiveReq(context.ssrContext.req)
        }

        return setup(props, context)
      }
    }

    if (process.server && serverPrefetch) {
      const patchedServerPrefetch = Array.isArray(serverPrefetch)
        ? serverPrefetch.slice()
        : [serverPrefetch]

      for (let i = 0; i < patchedServerPrefetch.length; i++) {
        const original = patchedServerPrefetch[i]
        /**
         * @type {(this: import('vue').default) => any}
         */
        patchedServerPrefetch[i] = function() {
          setActiveReq(this.$ssrContext.req)

          return original.call(this)
        }
      }

      // @ts-ignore
      this.$options.serverPrefetch = patchedServerPrefetch
    }
  },
})

/** @type {import('@nuxt/types').Plugin} */
const myPlugin = context => {
  // console.log('🍍 Pinia Nuxt plugin installed')

  if (process.server) {
    setActiveReq(context.req)
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = getRootState(context.req)
    })
  } else {
    setStateProvider(() => context.nuxtState.pinia)
  }
}

export default myPlugin
