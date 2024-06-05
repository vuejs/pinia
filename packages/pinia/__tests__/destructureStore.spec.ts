import { describe, beforeEach, it, expect } from 'vitest'
import {
  createPinia,
  defineStore,
  destructureStore,
  setActivePinia,
} from '../src'

describe('destructureStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useCounterStore = defineStore('counter', {
    state: () => ({
      n: 1,
    }),

    getters: {
      double: (state) => state.n * 2,
    },

    actions: {
      increment(amount = 1) {
        this.n += amount
      },
    },
  })

  it('test destructureStore', () => {
    const { n, double, increment } = destructureStore(useCounterStore())

    expect(n.value).toBe(1)
    increment()
    expect(n.value).toBe(2)
    expect(double.value).toBe(4)
  })
})
