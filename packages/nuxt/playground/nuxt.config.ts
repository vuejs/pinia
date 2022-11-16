import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import piniaModule from '../src/module'

export default defineNuxtConfig({
  alias: {
    pinia: fileURLToPath(new URL('../../pinia/src/index.ts', import.meta.url)),
  },
  modules: [piniaModule],
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']],
  },
})
