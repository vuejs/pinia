import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  pinia: {
    storesDirs: [join(currentDir, './stores/**')],
  },
})
