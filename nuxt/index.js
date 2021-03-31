import path from 'path'

/** @type {import('@nuxt/types').Module<{ disableVuex?: boolean}>} */
export default function NuxtPiniaModule(options) {
  const disableStore = 'disableVuex' in options ? options.disableVuex : true

  // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
  if (this.options.features && disableStore) {
    this.options.features.store = false
  }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'pinia.js',
  })

  this.options.build.transpile = this.options.build.transpile || []

  // transpile pinia if @vue/composition-api is transpiled because we must use the same instance
  if (
    !this.options.dev &&
    !this.options.build.transpile.includes('pinia') &&
    this.options.build.transpile.includes('@vue/composition-api')
  ) {
    this.options.build.transpile.push('pinia')
  }
}
