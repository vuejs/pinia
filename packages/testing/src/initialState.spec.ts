import { createTestingPinia, TestingOptions } from './testing'
import { defineStore } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

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
})
