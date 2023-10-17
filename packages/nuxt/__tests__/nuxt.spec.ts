/**
 * @vitest-env node
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await setup({
  server: true,
  rootDir: path.join(__dirname, '../playground'),
  nuxtConfig: {
    hooks: {
      'vite:extendConfig'(config, { isClient }) {
        config.define!.__BROWSER__ = isClient
      },
    },
    vite: {
      define: {
        __DEV__: false,
        __TEST__: true,
        __FEATURE_PROD_DEVTOOLS__: false,
      },
    },
  },
})

describe('works with nuxt', async () => {
  it('works on ssr', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Count: 101')
  })
})
