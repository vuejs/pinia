import { resolve } from 'upath'
import { addPlugin, defineNuxtModule, resolveModule } from '@nuxt/kit'
import { Pinia } from 'pinia'
import { Context } from '@nuxt/types'

export interface PiniaNuxtOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex.
   *
   * @default `true`
   */
  disableVuex?: boolean
}

const module = defineNuxtModule<PiniaNuxtOptions>({
  name: 'pinia',
  configKey: 'pinia',
  defaults: {
    disableVuex: true,
  },
  setup(options, nuxt) {
    // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
    if (nuxt.options.features && options.disableVuex) {
      nuxt.options.features.store = false
    }

    addPlugin({ src: resolve(__dirname, '../templates/plugin.js') })

    // Define pinia resolution to ensure plugins register global context successfully
    nuxt.options.alias['pinia'] =
      nuxt.options.alias['pinia'] || resolveModule('pinia')

    // transpile pinia if @vue/composition-api is transpiled because we must use the same instance
    if (
      !nuxt.options.dev &&
      !nuxt.options.build.transpile.includes('pinia') &&
      nuxt.options.build.transpile.includes('@vue/composition-api')
    ) {
      nuxt.options.build.transpile.push('pinia')
    }
  },
})

export default module

declare module '@nuxt/types' {
  export interface Context {
    /**
     * Pinia instance attached to the app.
     */
    pinia: Pinia

    /**
     * Pinia instance attached to the app.
     */
    $pinia: Pinia
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    /**
     * Nuxt context.
     */
    $nuxt: Context
  }
}
