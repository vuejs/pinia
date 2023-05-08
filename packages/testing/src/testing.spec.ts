import { describe, expect, it, vi } from 'vitest'
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

  const useSetupStore = defineStore('setup', () => {
    const n = ref(0)
    const double = computed(() => n.value * 2)
    function increment() {
      n.value++
    }
    function $reset() {
      n.value = 0
    }

    return { n, double, increment, $reset }
  })

  const CounterSetup = defineComponent({
    setup() {
      const counter = useSetupStore()
      return { counter }
    },
    template: `
    <button @click="counter.increment()">+1</button>
    <span>{{ counter.n }}</span>
    <button @click="counter.increment(10)">+10</button>
    `,
  })

  function factorySetupStore(options?: TestingOptions) {
    const wrapper = mount(CounterSetup, {
      global: {
        plugins: [createTestingPinia(options)],
      },
    })

    const counter = useSetupStore()

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

  it('ignores $reset in option stores', () => {
    const { counter } = factory()

    counter.n = 5
    counter.$reset()
    expect(counter.n).toBe(0)
  })

  it('ignores $reset in setup stores', () => {
    const { counter } = factorySetupStore()

    counter.n = 5
    expect(() => counter.$reset()).not.toThrow()
    expect(counter.n).toBe(0)
  })

  it('can stub $reset calls in option stores', () => {
    const { counter } = factory({ stubReset: true })

    counter.n = 5
    counter.$reset()
    expect(counter.n).toBe(5)
  })

  it('can stub $reset calls in setup stores', () => {
    const { counter } = factorySetupStore({ stubReset: true })

    counter.n = 5
    counter.$reset()
    expect(counter.n).toBe(5)
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

  it('allows overriding getters', () => {
    const useStore = defineStore('lol', {
      state: () => ({ n: 0 }),
      getters: {
        double: (state) => state.n * 2,
      },
    })
    const pinia = createTestingPinia()
    const store = useStore(pinia)

    store.n++
    expect(store.double).toBe(2)
    // once the getter is overridden, it stays
    store.double = 3
    expect(store.double).toBe(3)
    store.n++
    expect(store.double).toBe(3)
    // it can be set to undefined again to reset
    // @ts-expect-error
    store.double = undefined
    expect(store.double).toBe(4)
    store.n++
    expect(store.double).toBe(6)
  })

  it('allows overriding getters in setup stores', () => {
    const useStore = defineStore('computed', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      const doublePlusOne = computed(() => double.value + 1)
      return { n, double, doublePlusOne }
    })
    const pinia = createTestingPinia()
    const store = useStore(pinia)

    // console.log('is same', d === toRaw(store).double._computed)

    store.n++
    expect(store.double).toBe(2)
    // once the getter is overridden, it stays
    store.double = 3
    expect(store.double).toBe(3)
    expect(store.doublePlusOne).toBe(4)
    store.n++
    expect(store.double).toBe(3)
    expect(store.doublePlusOne).toBe(4)
    // it can be set to undefined again to reset
    // @ts-expect-error
    store.double = undefined
    expect(store.n).toBe(2)
    expect(store.double).toBe(4)
    expect(store.doublePlusOne).toBe(5)
    // it works again
    store.n++
    expect(store.n).toBe(3)
    expect(store.double).toBe(6)
    expect(store.doublePlusOne).toBe(7)
  })

  it('actions are stubbed even when replaced by other plugins', () => {
    const spy = vi.fn()
    mount(Counter, {
      global: {
        plugins: [
          createTestingPinia({
            plugins: [
              ({ store }) => {
                const { increment } = store.increment
                store.increment = spy
                spy.mockImplementation(increment)
              },
            ],
          }),
        ],
      },
    })
    const counter = useCounter()

    counter.increment()
    counter.increment(5)
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(2)
    expect(counter.increment).toHaveBeenLastCalledWith(5)
    // the actual spy is never called because we stub the action
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('pass through replaced actions in plugins', () => {
    const spy = vi.fn()
    mount(Counter, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            plugins: [
              ({ store }) => {
                const { increment } = store.increment
                store.increment = spy
                spy.mockImplementation(increment)
              },
            ],
          }),
        ],
      },
    })
    const counter = useCounter()

    counter.increment()
    counter.increment(5)
    expect(counter.n).toBe(0)
    expect(counter.increment).toHaveBeenCalledTimes(2)
    expect(counter.increment).toHaveBeenLastCalledWith(5)
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith(5)
  })

  it('can override getters added in plugins', () => {
    const pinia = createTestingPinia({
      plugins: [
        ({ store }) => {
          store.triple = computed(() => store.n * 3)
        },
      ],
    })

    const store = useCounter(pinia)
    store.n++
    // @ts-expect-error: non declared
    expect(store.triple).toBe(3)
    // once the getter is overridden, it stays
    // @ts-expect-error: non declared
    store.triple = 10
    // @ts-expect-error: non declared
    expect(store.triple).toBe(10)
    store.n++
    // @ts-expect-error: non declared
    expect(store.triple).toBe(10)
    // it can be set to undefined again to reset
    // @ts-expect-error
    store.triple = undefined
    // @ts-expect-error: non declared
    expect(store.triple).toBe(6)
    store.n++
    // @ts-expect-error: non declared
    expect(store.triple).toBe(9)
  })
})
