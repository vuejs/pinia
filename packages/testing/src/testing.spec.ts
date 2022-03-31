import { createTestingPinia, TestingOptions } from './testing'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'

describe('Testing', () => {
  const useCounter = defineStore('counter', {
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

  function factory(options?: TestingOptions) {
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

  it('bypass useStore(pinia)', () => {
    const realPinia = createPinia()
    const { counter } = factory()

    const counterWithRealPinia = useCounter(realPinia)

    expect(counter.n).toBe(0)
    expect(counterWithRealPinia.n).toBe(0)
    counter.n++
    expect(counter.n).toBe(1)
    expect(counterWithRealPinia.n).toBe(1)
  })

  it('works with no actions', () => {
    const useEmpty = defineStore('empty', {})

    const Empty = defineComponent({
      setup() {
        const empty = useEmpty()
        return { empty }
      },
      template: `{{ empty.$id }}`,
    })

    const wrapper = mount(Empty, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(wrapper.text()).toBe('empty')
  })

  it('works with nested stores', () => {
    const useA = defineStore('a', () => {
      const n = ref(0)
      return { n }
    })

    const useB = defineStore('b', () => {
      const a = useA()
      const n = ref(0)
      const doubleA = computed(() => a.n * 2)
      return { n, doubleA }
    })

    const pinia = createTestingPinia()
    setActivePinia(pinia)

    const b = useB()
    const a = useA()

    expect(a.n).toBe(0)
    a.n++
    expect(b.doubleA).toBe(2)
    expect(pinia.state.value).toEqual({
      a: { n: 1 },
      b: { n: 0 },
    })
  })
})
