import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createTestingPinia } from './testing'
import { restoreGetter } from './restoreGetters'

describe('restoreGetters', () => {
  it('allows overriding getters', () => {
    const useStore = defineStore('lol', {
      state: () => ({ n: 0 }),
      getters: {
        double: (state) => state.n * 2,
      },
    })
    const pinia = createTestingPinia()
    const store = useStore(pinia)

    store.double = 3
    expect(store.double).toBe(3)
    restoreGetter(store, 'double')
    expect(store.double).toBe(0)
  })

  tds(() => {
    const s1 = defineStore('s1', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      return { n, double }
    })()

    const s2 = defineStore('s2', {
      state: () => ({ n: 0 }),
      getters: {
        double: (state) => state.n * 2,
      },
    })()

    restoreGetter(s1, 'double')
    restoreGetter(s2, 'double')

    // @ts-expect-error: not a getter
    restoreGetter(s1, 'n')
    // @ts-expect-error: not a getter
    restoreGetter(s2, 'n')
  })
})

function tds(_fn: Function) {}
