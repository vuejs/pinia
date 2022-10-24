/**
 * @module @pinia/nuxt
 */
import {
  defineNuxtModule,
  addPlugin,
  isNuxt2,
  addImports,
  createResolver,
  resolveModule,
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex (Nuxt 2 only)
   *
   * @default `true`
   */
  disableVuex?: boolean

  /**
   * Array of auto imports to be added to the nuxt.config.js file.
   *
   * @example
   * ```js
   * autoImports: [
   *  // automatically import `defineStore`
   *  'defineStore',
   *  // automatically import `defineStore` as `definePiniaStore`
   *  ['defineStore', 'definePiniaStore',
   * ]
   * ```
   *
   */
  autoImports?: Array<string | [string, string]>
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia',
    configKey: 'pinia',
    compatibility: {
      nuxt: '^2.0.0 || ^3.0.0-rc.5',
      bridge: true,
    },
  },
  defaults: {
    disableVuex: true,
    autoImports: [],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Disable default Vuex store (Nuxt v2.10+ only)
    if (nuxt.options.features && options.disableVuex && isNuxt2()) {
      nuxt.options.features.store = false
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    // Make sure we use the mjs build for pinia
    nuxt.options.alias.pinia =
      nuxt.options.alias.pinia ||
      resolveModule('pinia/dist/pinia.mjs', {
        paths: [nuxt.options.rootDir, import.meta.url],
      })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: '@pinia/nuxt' })
    })

    // Add runtime plugin
    if (isNuxt2()) {
      addPlugin(resolver.resolve('./runtime/plugin.vue2'))
    } else {
      addPlugin(resolver.resolve('./runtime/plugin.vue3'))
    }

    // Add auto imports
    const composables = resolver.resolve('./runtime/composables')
    addImports([
      { from: composables, name: 'usePinia' },
      ...options.autoImports!.map((imports) =>
        typeof imports === 'string'
          ? { from: composables, name: imports }
          : { from: composables, name: imports[0], as: imports[1] }
      ),
    ])
  },
})

export default module
