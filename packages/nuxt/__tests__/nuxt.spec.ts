import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { nuxtCtx, useNuxt, createResolver } from '@nuxt/kit'
import Module from '../src/module'

describe('works with nuxt', async () => {
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

  it('works on ssr', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Count: 101')
  })
})

describe('Module', () => {
  const _imports = []
  const resolver = createResolver(import.meta.url)
  beforeEach(() => {
    nuxtCtx.unset()
    // @ts-ignore
    nuxtCtx.set({
      version: '3.0.8',
      options: {
        alias: {
          pinia: 'pinia/dist/pinia.mjs'
        },
        plugins: [],
        build: {
          transpile: []
        }
      },
      callHook() {},
      hook(evt, fn) {
        if (['autoImports:extend', 'autoImports:dirs'].includes(evt)) {
          fn(_imports)
        }
      },
      hooks: {}
    })
  })
  it('auto imports a directory if the autoImports entry is a directory and the directory exists', async () => {
    await Module({
      autoImports: [
        // Dir on filesystem...use it:
        '../stores', 

        // import { defineStore } from "composables"
        'defineStore',

        // import { defineStore as definePiniaStore } from "composables"
        ['defineStore', 'definePiniaStore']
      ]
    }, useNuxt())
    expect(_imports[0].name).toEqual('usePinia')
    expect(_imports[1]).toEqual(resolver.resolve('../stores'))
    expect(_imports[2].name).toEqual('defineStore')
    expect(_imports[3].name).toEqual('defineStore')
    expect(_imports[3].as).toEqual('definePiniaStore')
  })
})