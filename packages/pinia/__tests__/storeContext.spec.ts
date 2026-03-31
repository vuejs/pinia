import { mount } from '@vue/test-utils'
import { createPinia, defineStore } from 'pinia'
import { it, describe, expect } from 'vitest'

const key = Symbol('key')
declare module '../src' {
  export interface PiniaSetupContext {
    value: string
    [key]: string
  }
}
describe('store context injection', () => {
  it('provides context to setup stores', async ({ task: { id } }) => {
    const pinia = createPinia().provide('value', id).provide(key, id)

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    const useStore = defineStore('main', ({ context }) => {
      return {
        value: context.value,
        key: context[key],
      }
    })

    const store = useStore(pinia)

    expect(store).toHaveProperty('value', id)
    expect(store).toHaveProperty('key', id)
  })

  it('provides context to option state', ({ task: { id } }) => {
    const pinia = createPinia().provide('value', id).provide(key, id)

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    const useStore = defineStore('main', {
      state: (context) => ({
        value: context.value,
        key: context[key],
      }),
    })

    const store = useStore(pinia)

    expect(store).toHaveProperty('value', id)
  })

  it('is not writable', ({ task: { id } }) => {
    const pinia = createPinia().provide('value', id).provide(key, id)

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    const useStore = defineStore('main', ({ context }) => {
      let hasThrown = false

      try {
        // @ts-ignore we are making sure context is readonly
        context.value = 'not writable'
      } catch (e) {
        hasThrown = true
      }

      return {
        hasThrown,
      }
    })

    const store = useStore(pinia)

    expect(store).toHaveProperty('hasThrown', true)
  })

  it('has the same value for all store', ({ task: { id } }) => {
    const pinia = createPinia().provide('value', id)

    const useStoreA = defineStore('A', ({ context }) => {
      return {
        value: context.value,
      }
    })
    const useStoreB = defineStore('A', ({ context }) => {
      return {
        value: context.value,
      }
    })

    const storeA = useStoreA(pinia)
    const storeB = useStoreB(pinia)

    expect(storeA).toHaveProperty('value', id)
    expect(storeB).toHaveProperty('value', id)
  })

  it('cannot provide the same key multiple times', () => {
    const pinia = createPinia()
      .provide('value', 'first')
      .provide('value', 'second')

    expect(pinia._i).toHaveProperty('value', 'first')
  })
})
