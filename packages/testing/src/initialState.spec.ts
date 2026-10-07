import { describe, it, expect } from 'vitest'
import { createTestingPinia, TestingOptions } from './testing'
import { defineStore } from 'pinia'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, effect, ref, shallowRef } from 'vue'

describe('Testing: initial state', () => {
  const useCounter = defineStore('counter', {
    state: () => ({ n: 0, nested: { n: 0, other: false } }),
    actions: {
      increment(amount = 1) {
        this.n += amount
      },
    },
  })

  const Counter = defineComponent({
    setup() {
      const counter = useCounter()
      return { counter }
    },
    template: `
    <button @click="counter.increment()">+1</button>
    <span>{{ counter.n }}</span>
    <button @click="counter.increment(10)">+10</button>
    `,
  })

  function factory(options?: TestingOptions) {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia(options)],
      },
    })

    const counter = useCounter()

    return { wrapper, counter }
  }

  it('can set an initial state', () => {
    const { counter } = factory({
      initialState: { counter: { n: 10 } },
    })
    expect(counter.nested).toEqual({ n: 0, other: false })
    expect(counter.n).toBe(10)
    counter.n++
    expect(counter.n).toBe(11)
  })

  it('can provide objects', () => {
    const { counter } = factory({
      initialState: { counter: { nested: { n: 10 } } },
    })
    expect(counter.n).toBe(0)
    expect(counter.nested.other).toBe(false)
    expect(counter.nested.n).toBe(10)
    counter.nested.n++
    expect(counter.nested.n).toBe(11)
  })

  for (const makeRef of [shallowRef, ref]) {
    it(`updates cached setup computations when initializing ${makeRef.name} state`, () => {
      const observed: number[] = []
      const useStore = defineStore('cached', () => {
        const nested = makeRef({ n: 0, other: false })
        const double = computed(() => nested.value.n * 2)
        // Setup logic can read a computed or start effects before plugins run.
        expect(double.value).toBe(0)
        effect(() => observed.push(nested.value.n))
        return { nested, double }
      })
      const initialState = { cached: { nested: { n: 10 } } }
      const store = useStore(createTestingPinia({ initialState }))

      expect(store.nested).toEqual({ n: 10, other: false })
      expect(store.double).toBe(20)
      expect(observed).toEqual([0, 10])
      expect(initialState).toEqual({ cached: { nested: { n: 10 } } })
    })
  }

  it('initializes nested shallow refs and preserves replacement and unpatched state', () => {
    const observed: number[] = []
    const useStore = defineStore('nested-refs', () => {
      const nested = ref({ counter: shallowRef({ n: 0, other: true }) })
      const replaced = shallowRef(0)
      const untouched = shallowRef({ n: 3 })
      effect(() =>
        observed.push(
          nested.value.counter.n + replaced.value + untouched.value.n
        )
      )
      return { nested, replaced, untouched }
    })
    const replacement = 5
    const store = useStore(
      createTestingPinia({
        initialState: {
          'nested-refs': {
            nested: { counter: { n: 2 } },
            replaced: replacement,
          },
        },
      })
    )

    expect(store.nested.counter).toEqual({ n: 2, other: true })
    expect(store.replaced).toBe(replacement)
    expect(store.untouched.n).toBe(3)
    expect(observed).toEqual([3, 5, 10])
  })

  it('can set an initial state with no app', () => {
    const pinia = createTestingPinia({
      initialState: {
        counter: { n: 20 },
      },
    })
    const counter = useCounter(pinia)
    expect(counter.nested).toEqual({ n: 0, other: false })
    expect(counter.n).toBe(20)
    counter.n++
    expect(counter.n).toBe(21)
  })
})
