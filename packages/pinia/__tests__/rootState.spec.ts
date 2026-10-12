import { describe, it, expect } from 'vitest'
import { createPinia, defineStore, getStores } from '../src'
import { ref } from 'vue'
import { mockWarn } from './vitest-mock-warn'

describe('Root State', () => {
  mockWarn()
  const useA = defineStore('a', {
    state: () => ({ a: 'a' }),
  })

  const useB = defineStore('b', {
    state: () => ({ b: 'b' }),
  })

  it('warns if creating a store without a pinia', () => {
    expect(() => useA()).toThrowError(/there was no active Pinia/)
  })

  it('works with no stores', () => {
    expect(createPinia().state.value).toEqual({})
  })

  it('retrieves the root state of one store', () => {
    const pinia = createPinia()
    useA(pinia)
    expect(pinia.state.value).toEqual({
      a: { a: 'a' },
    })
  })

  it('does not mix up different applications', () => {
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    useA(pinia1)
    useB(pinia2)
    expect(pinia1.state.value).toEqual({
      a: { a: 'a' },
    })
    expect(pinia2.state.value).toEqual({
      b: { b: 'b' },
    })
  })

  it('can hold multiple stores', () => {
    const pinia1 = createPinia()
    useA(pinia1)
    useB(pinia1)
    expect(pinia1.state.value).toEqual({
      a: { a: 'a' },
      b: { b: 'b' },
    })
  })

  describe('getStores', () => {
    it('returns the stores in use', () => {
      const pinia1 = createPinia()
      const pinia2 = createPinia()
      const useSetup = defineStore('setup', () => ({ n: ref(0) }))
      expect(getStores(pinia1)).toEqual([])

      const a = useA(pinia1)
      const setup = useSetup(pinia1)
      useB(pinia2)

      expect(getStores(pinia1)).toEqual([a, setup])
    })

    it('does not return disposed stores', () => {
      const pinia = createPinia()
      const a = useA(pinia)
      const b = useB(pinia)

      a.$dispose()

      expect(getStores(pinia)).toEqual([b])
    })

    it('returns a new array', () => {
      const pinia = createPinia()
      const a = useA(pinia)
      useB(pinia)

      getStores(pinia).splice(0)
      expect(getStores(pinia)).toHaveLength(2)

      for (const store of getStores(pinia)) {
        store.$dispose()
        // creating a store while iterating doesn't add it to the iteration
        useA(pinia)
      }
      expect(getStores(pinia)).toHaveLength(1)
      expect(getStores(pinia)[0]).not.toBe(a)
    })
  })
})
