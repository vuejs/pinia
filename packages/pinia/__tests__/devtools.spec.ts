import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, defineStore } from '../src'
import { devtoolsPlugin } from '../src/devtools'

describe('devtoolsPlugin', () => {
  const useStore = defineStore('test', {
    actions: {
      myAction() {
        return 42
      },
    },
  })

  it('preserves mocked actions during testing', () => {
    const pinia = createPinia()
    // Simulate using createTestingPinia
    pinia._testing = true

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    // Simulate mocking with @pinia/testing createSpy
    pinia.use(({ store, options }) => {
      Object.keys(options.actions).forEach((action) => {
        store[action]._mockImplementation = () => {}
      })
    })
    // Previously the mocked actions would be wrapped again
    pinia.use(devtoolsPlugin)

    const store = useStore(pinia)

    // @ts-expect-error we have not actually loaded @pinia/testing and mocked actions
    expect(store.myAction._mockImplementation).toBeDefined()
  })

  it('passes the options of $dispose along', async () => {
    // make the devtools api call the plugin setup right away
    vi.doMock('@vue/devtools-api', () => {
      const noop = () => {}
      const api = new Proxy(
        {
          getSettings: () => ({}),
          on: new Proxy({}, { get: () => noop }),
        } as Record<PropertyKey, unknown>,
        { get: (target, key) => (key in target ? target[key] : noop) }
      )
      return {
        setupDevtoolsPlugin: (_descriptor: unknown, setup: Function) =>
          setup(api),
      }
    })
    // the devtools plugin has already been imported with the real api
    vi.resetModules()
    const { createPinia, defineStore } = await import('../src')
    const { devtoolsPlugin } = await import('../src/devtools')

    const pinia = createPinia()
    mount({ template: 'none' }, { global: { plugins: [pinia] } })
    pinia.use(devtoolsPlugin)

    const store = defineStore('test', { state: () => ({ n: 0 }) })(pinia)
    store.$dispose({ deleteState: true })

    expect(pinia.state.value).not.toHaveProperty('test')

    vi.doUnmock('@vue/devtools-api')
  })
})
