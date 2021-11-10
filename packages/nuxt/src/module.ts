import { name, version } from '../package.json'
import { defineNuxtModule, addPlugin, isNuxt2 } from '@nuxt/kit'
import type { Pinia } from 'pinia'

export interface PiniaModuleOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex.
   *
   * @default `true`
   */
  disableVuex?: boolean
}

export default defineNuxtModule({
  name,
  version,
  configKey: 'pinia',
  defaults: {
    disableVuex: true,
  } as PiniaModuleOptions,
  setup(options, nuxt) {
    // Disable default Vuex store for Nuxt 2 (options.features only exists in Nuxt v2.10+)
    if (isNuxt2() && nuxt.options.features && options.disableVuex) {
      nuxt.options.features.store = false
    }

    // Resolve pinia
    // TODO: Use kit to use proper search path
    nuxt.options.alias.pinia = require.resolve('pinia/dist/pinia.mjs')

    // Register auto imports
    nuxt.hook('autoImports:extend', (autoImports) => {
      autoImports.push({
        name: 'defineStore',
        as: 'defineStore',
        from: 'pinia',
      })
    })

    // Add vue2 or vue3 plugin
    addPlugin({
      src: isNuxt2()
        ? require.resolve('./runtime/plugin.vue2.mjs')
        : require.resolve('./runtime/plugin.vue3.mjs'),
    })
  },
})

declare module '@nuxt/kit' {
  export interface NuxtApp {
    /** Pinia instance attached to the app.*/
    $pinia: Pinia
  }
  export interface NuxtConfig {
    pinia: PiniaModuleOptions
  }
}
