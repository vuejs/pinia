import path from 'path'

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
}
