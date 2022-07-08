import {
  defineNuxtModule,
  addPlugin,
  isNuxt2,
  addAutoImport,
  createResolver,
} from '@nuxt/kit'

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
    const resolver = createResolver(import.meta.url)

    // Disable default Vuex store (Nuxt v2.10+ only)
    if (nuxt.options.features && options.disableVuex && isNuxt2()) {
      nuxt.options.features.store = false
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    // Make sure we use the mjs build for pinia
    nuxt.options.alias.pinia = 'pinia/dist/pinia.mjs'

    // Add runtime plugin
    if (isNuxt2()) {
      addPlugin(resolver.resolve('./runtime/plugin.vue2'))
    } else {
      addPlugin(resolver.resolve('./runtime/plugin.vue3'))
    }

    // Add auto imports
    const composables = resolver.resolve('./runtime/composables')
    addAutoImport([
      { from: composables, name: 'usePinia' },
      { from: composables, name: 'definePiniaStore' },
    ])
  },
})
