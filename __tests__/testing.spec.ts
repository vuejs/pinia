import { createTestingPinia, defineStore, TestingOptions } from '../src'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('Testing', () => {
  const useCounter = defineStore({
    id: 'counter',
    state: () => ({ n: 0 }),
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

  function factory(options: TestingOptions = {}) {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia(options)],
      },
    })

    const counter = useCounter()

    return { wrapper, counter }
  }

  it('spies with no config', () => {
    const { counter, wrapper } = factory()

    counter.increment()
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(1)
    expect(counter.increment).toHaveBeenLastCalledWith()

    counter.increment(5)
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(2)
    expect(counter.increment).toHaveBeenLastCalledWith(5)

    wrapper.findAll('button')[0].trigger('click')
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(3)
    expect(counter.increment).toHaveBeenLastCalledWith()

    wrapper.findAll('button')[1].trigger('click')
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(4)
    expect(counter.increment).toHaveBeenLastCalledWith(10)
  })

  it('can execute actions', () => {
    const { counter, wrapper } = factory({ stubActions: false })

    counter.increment()
    expect(counter.n).toBe(1)
    expect(counter.increment).toHaveBeenCalledTimes(1)
    expect(counter.increment).toHaveBeenLastCalledWith()

    counter.increment(5)
    expect(counter.n).toBe(6)
    expect(counter.increment).toHaveBeenCalledTimes(2)
    expect(counter.increment).toHaveBeenLastCalledWith(5)

    wrapper.findAll('button')[0].trigger('click')
    expect(counter.n).toBe(7)
    expect(counter.increment).toHaveBeenCalledTimes(3)
    expect(counter.increment).toHaveBeenLastCalledWith()

    wrapper.findAll('button')[1].trigger('click')
    expect(counter.n).toBe(17)
    expect(counter.increment).toHaveBeenCalledTimes(4)
    expect(counter.increment).toHaveBeenLastCalledWith(10)
  })

  it('spies $patch calls', () => {
    const { counter } = factory()

    expect(counter.n).toBe(0)
    expect(counter.$patch).toHaveBeenCalledTimes(0)
    counter.$patch({ n: 1 })
    expect(counter.$patch).toHaveBeenCalledTimes(1)
    expect(counter.$patch).toHaveBeenLastCalledWith({ n: 1 })
    expect(counter.n).toBe(1)
  })

  it('can stub $patch calls', () => {
    const { counter } = factory({ stubPatch: true })

    expect(counter.n).toBe(0)
    expect(counter.$patch).toHaveBeenCalledTimes(0)
    counter.$patch({ n: 1 })
    expect(counter.$patch).toHaveBeenCalledTimes(1)
    expect(counter.$patch).toHaveBeenLastCalledWith({ n: 1 })
    expect(counter.n).toBe(0)
  })

  it('can stub $patch calls', () => {
    const { counter } = factory({ stubPatch: true })

    expect(counter.n).toBe(0)
    expect(counter.$patch).toHaveBeenCalledTimes(0)
    counter.$patch({ n: 1 })
    expect(counter.$patch).toHaveBeenCalledTimes(1)
    expect(counter.$patch).toHaveBeenLastCalledWith({ n: 1 })
    expect(counter.n).toBe(0)
  })

  it('executes plugins', () => {
    const { counter, wrapper } = factory({
      plugins: [() => ({ pluginN: 0 })],
    })

    expect(counter.pluginN).toBe(0)
    expect(wrapper.vm.counter.pluginN).toBe(0)
  })

  it('executes plugins with fakeApp', () => {
    const pinia = createTestingPinia({
      plugins: [() => ({ pluginN: 0 })],
      fakeApp: true,
    })

    const counter = useCounter(pinia)

    expect(counter.pluginN).toBe(0)
    expect(pinia.app).toHaveProperty('mount', expect.any(Function))
  })
})
