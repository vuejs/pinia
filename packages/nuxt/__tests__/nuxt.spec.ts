/**
 * @vitest-env node
 */
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeAll } from 'vitest'
import {
  setup,
  $fetch,
  useTestContext,
  startServer,
  loadFixture,
} from '@nuxt/test-utils'

describe('works with nuxt', async () => {
  beforeAll(async () => {
    await setup({
      server: true,
      rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
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
    // await loadFixture()
    // const ctx = useTestContext()
    // await startServer()
  })

  // FIXME: this is consistently failing, seems to not be configured well with nuxt
  it.skip('works on ssr', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Count: 101')
  })
})
