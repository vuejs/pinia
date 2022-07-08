import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, isNuxt2, addAutoImport } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex (Nuxt 2 only)
   *
   * @default `true`
   */
  disableVuex?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia',
    configKey: 'pinia',
    compatibility: {
      nuxt: '^2.0.0 || ^3.0.0',
      bridge: true,
    },
  },
  defaults: {
    disableVuex: true,
  },
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Disable default Vuex store (Nuxt v2.10+ only)
    if (nuxt.options.features && options.disableVuex && isNuxt2()) {
      nuxt.options.features.store = false
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)

    // Make sure we use the mjs build for pinia
    nuxt.options.alias.pinia = 'pinia/dist/pinia.mjs'

    // Add runtime plugin
    if (isNuxt2()) {
      addPlugin(resolve(runtimeDir, './plugin.vue2'))
    } else {
      addPlugin(resolve(runtimeDir, './plugin'))
    }

    // Add auto imports
    addAutoImport([
      { from: 'pinia', name: 'defineStore', as: 'definePiniaStore' },
    ])
  },
})
