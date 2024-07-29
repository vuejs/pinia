import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['..'],
  pinia: {
    storesDirs: ['xyz'],
  },
  vite: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __USE_DEVTOOLS__: true,
      __TEST__: false,
    },
  },
})
