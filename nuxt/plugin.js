import Vue from 'vue'
import { setActiveReq, setStateProvider, getRootState } from 'pinia'
// import { Plugin } from '@nuxt/types'

// declare module '@nuxt/types' {
//   interface Context {
//     ssrContext: {
//       req: Parameters<Plugin>[0]['req']
//       nuxt: {
//         __piniaStates?: Record<string, any>
//       }
//     }
//   }
// }

// declare global {
//   interface Window {
//     __NUXT__: {
//       __piniaStates: Record<string, any>
//     }
//   }
// }

const piniStatesGetter = () => window.__NUXT__.__piniaStates

const noop = () => {}
const emptyObjectReturn = () => ({})

/**
 * Create a state provider for nuxt
 * @param {Parameters<import('@nuxt/types').Plugin>[0]['ssrContext'] | undefined} context
 */
function createStateProvider(context) {
  /**
   *
   * @param {any} store
   */
  const piniStatesSetter = store => {
    // context is always non undefined on server
    const { nuxt } = context
    const states = nuxt.__piniaStates || (nuxt.__piniaStates = {})
    states[store.id] = store.state
  }

  return {
    get: process.client ? piniStatesGetter : emptyObjectReturn,
    set: context ? piniStatesSetter : noop,
  }
}

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
        // setStateProvider(createStateProvider(context.ssrContext))
        return setup(props, context)
      }
    }

    if (process.server && serverPrefetch) {
      const patchedServerPrefetch = Array.isArray(serverPrefetch)
        ? serverPrefetch.slice()
        : [serverPrefetch]

      for (let i = 0; i < patchedServerPrefetch.length; i++) {
        const original = patchedServerPrefetch[i]
        patchedServerPrefetch[i] = function() {
          setActiveReq(this.$ssrContext.req)
          // setStateProvider(createStateProvider(this.$ssrContext.req))
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
  // setActiveReq(context.req)
  // setStateProvider(createStateProvider(context.ssrContext))

  if (process.server) {
    setActiveReq(context.req)
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = getRootState(context.req)
    })
  } else {
    setStateProvider({
      get: () => context.nuxtState.pinia,
      // TODO: remove the setter
      set: () => {},
    })
  }
}

export default myPlugin
