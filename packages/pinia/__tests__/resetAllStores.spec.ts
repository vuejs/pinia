import { beforeEach, describe, it, expect, vi } from 'vitest'

import { createPinia, defineStore, setActivePinia, Pinia } from '../src'
import { resetAllStores } from '../src/resetAllStores'

describe('resetAllStores', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const useA = defineStore({
    id: 'A',
    state: () => ({}),
  })

  const useB = defineStore({
    id: 'B',
    state: () => ({}),
  })

  it('resets all stores', () => {
    const stores = [useA(), useB()]

    stores.forEach((store) => {
      store.$reset = vi.fn()
    })
    resetAllStores()

    stores.forEach((store) => {
      expect(store.$reset).toHaveBeenCalled()
    })
  })
})
