import { describe, it, expect } from 'vitest'
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
})
