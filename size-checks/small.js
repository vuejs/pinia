import {
  createPinia,
  defineStore,
  PiniaPlugin,
} from '../dist/pinia.esm-bundler'

// simulate using the plugin
PiniaPlugin()

createPinia()
// @ts-expect-error
export default defineStore()
