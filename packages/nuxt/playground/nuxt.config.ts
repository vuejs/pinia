import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import piniaModule from '../src/module'

export default defineNuxtConfig({
  alias: {
    pinia: fileURLToPath(new URL('../../pinia/src/index.ts', import.meta.url)),
  },
  modules: [piniaModule],

  pinia: {
    storesDirs: ['./stores', './domain/*/stores'],
  },

  vite: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __TEST__: 'false',
    },
  },
})
