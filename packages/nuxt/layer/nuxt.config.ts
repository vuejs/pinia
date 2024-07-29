import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import piniaModule from '../src/module'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: [piniaModule],

  pinia: {
    storesDirs: [join(currentDir, 'stores')],
  },

  vite: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __USE_DEVTOOLS__: true,
      __TEST__: false,
    },
  },
})
