import { beforeEach, describe, it, expect } from 'vitest'
import { computed, ref } from 'vue'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('Composing stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function useCounter() {
    const n = ref(0)
    const double = computed(() => n.value)

    function increment(amount = 1) {
      n.value += amount
    }

    return { n, double, increment }
  }

  const useStoreA = defineStore('a', () => {
    const { n, double, increment } = useCounter()
    const b = useStoreB()

    function changeB() {
      b.n++
    }

    function getInnerB() {
      return b
    }

    return { n, increment, double, changeB, getInnerB }
  })

  const useStoreB = defineStore('b', () => {
    const { n, double, increment } = useCounter()
    const a = useStoreA()

    function changeA() {
      a.n++
    }

    function getInnerA() {
      return a
    }

    return { n, increment, double, changeA, getInnerA }
  })

  it('works', () => {
    expect(() => {
      useStoreA()
      useStoreB()
    }).not.toThrow()
  })

  it('they can use each other', () => {
    const b = useStoreB()
    const a = useStoreA()

    expect(a).toBe(b.getInnerA())
    expect(b).toBe(a.getInnerB())

    expect(a.n).toBe(0)
    b.changeA()
    expect(a.n).toBe(1)

    expect(b.n).toBe(0)
    a.changeB()
    expect(b.n).toBe(1)
  })
})
