import { VueConstructor } from 'vue/types'
import { setActiveReq } from './rootStore'

export const PiniaSsr = (vue: VueConstructor) => {
  const isServer = typeof window === 'undefined'

  if (!isServer) {
    console.warn(
      'PiniaSsrPlugin seems to be included in the browser bundle. Try to Vue.use(PiniaSsr) only from entry-server.js'
    )
    return
  }

  vue.mixin({
    beforeCreate() {
      const { setup, serverPrefetch } = this.$options
      if (setup) {
        this.$options.setup = (props, context) => {
          // @ts-ignore
          if (context.ssrContext && context.ssrContext.req) {
            // @ts-ignore
            setActiveReq(context.ssrContext.req)
          }

          return setup(props, context)
        }
      }

      if (serverPrefetch) {
        const patchedServerPrefetch = Array.isArray(serverPrefetch)
          ? serverPrefetch.slice()
          : [serverPrefetch]

        for (let i = 0; i < patchedServerPrefetch.length; i++) {
          const original = patchedServerPrefetch[i]
          patchedServerPrefetch[i] = function() {
            // @ts-ignore
            setActiveReq(this.$ssrContext.req)

            return original.call(this)
          }
        }

        // @ts-ignore
        this.$options.serverPrefetch = patchedServerPrefetch
      }
    },
  })
}
