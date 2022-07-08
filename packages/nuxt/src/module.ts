import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule, addPlugin, isNuxt2 } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex.
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
      bridge: true
    }
  },
  defaults: {
    disableVuex: true
  },
  setup (options: ModuleOptions, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
    if (nuxt.options.features && options.disableVuex && isNuxt2()) {
      nuxt.options.features.store = false
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)

    // make sure we use the mjs for pinia so node doesn't complain about using a module js with an extension that is js
    // but doesn't have the type: module in its packages.json file
    nuxt.options.alias.pinia = 'pinia/dist/pinia.mjs'

    nuxt.options.build.transpile.push('pinia')
    // Add runtime plugin
    if (isNuxt2()) {
      addPlugin(resolve(runtimeDir, './plugin.vue2'))

    } else {
      addPlugin(resolve(runtimeDir, './plugin'))
    }
  }
})
