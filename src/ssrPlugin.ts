import { VueConstructor } from 'vue/types'
import { setActiveReq } from './rootStore'
import { SetupContext } from '@vue/composition-api'

export const PiniaSsr = (vue: VueConstructor) => {
  const isServer = typeof window === 'undefined'

  if (!isServer) {
    console.warn(
      '`PiniaSsrPlugin` seems to be used in the client bundle. You should only call it on the server entry: https://github.com/posva/pinia#raw-vue-ssr'
    )
    return
  }

  vue.mixin({
    beforeCreate() {
      // @ts-ignore
      const { setup, serverPrefetch } = this.$options
      if (setup) {
        // @ts-ignore
        this.$options.setup = (props: any, context: SetupContext) => {
          // @ts-ignore to fix usage with nuxt-composition-api https://github.com/posva/pinia/issues/179
          if (context.ssrContext) setActiveReq(context.ssrContext.req)
          return setup(props, context)
        }
      }

      if (serverPrefetch) {
        const patchedServerPrefetch = Array.isArray(serverPrefetch)
          ? serverPrefetch.slice()
          : // serverPrefetch not being an array cannot be triggered due to options merge
            // https://github.com/vuejs/vue/blob/7912f75c5eb09e0aef3e4bfd8a3bb78cad7540d7/src/core/util/options.js#L149
            /* istanbul ignore next */
            [serverPrefetch]

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
