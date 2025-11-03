import { describe, expect, it, vi, type Mock } from 'vitest'
import { computed, defineComponent, ref, type UnwrapRef } from 'vue'
import { defineStore, type Store, type StoreDefinition } from 'pinia'
import { TestingOptions, createTestingPinia } from './testing'
import { mount } from '@vue/test-utils'

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef
): TStoreDef extends StoreDefinition<
  infer Id,
  infer State,
  infer Getters,
  infer Actions
>
  ? Store<
      Id,
      State,
      Record<string, never>,
      {
        [K in keyof Actions]: Actions[K] extends (...args: any[]) => any
          ? // 👇 depends on your testing framework
            Mock<Actions[K]>
          : Actions[K]
      }
    > & {
      [K in keyof Getters]: UnwrapRef<Getters[K]>
    }
  : ReturnType<TStoreDef> {
  return useStore() as any
}

describe('mockedStore', () => {
  const useCounter = defineStore('counter-setup', () => {
    const n = ref(0)
    const doubleComputedCallCount = ref(0)
    const double = computed(() => {
      doubleComputedCallCount.value++
      return n.value * 2
    })
    const doublePlusOne = computed(() => double.value + 1)
    function increment(amount = 1) {
      n.value += amount
    }
    function decrement() {
      n.value--
    }
    function setValue(newValue: number) {
      n.value = newValue
    }
    function $reset() {
      n.value = 0
    }

    return {
      n,
      doubleComputedCallCount,
      double,
      doublePlusOne,
      increment,
      decrement,
      setValue,
      $reset,
    }
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

    const counter = mockedStore(useCounter)

    return { wrapper, counter }
  }

  it('can unstub actions', () => {
    const { counter } = factory({
      stubActions: false,
      createSpy: (fn) => vi.fn(fn).mockImplementation(() => {}),
    })
    counter.increment()
    expect(counter.increment).toHaveBeenCalledTimes(1)
    expect(counter.n).toBe(0)

    counter.increment.mockRestore()
    counter.increment()
    expect(counter.increment).toHaveBeenCalledTimes(1)
    expect(counter.n).toBe(1)
  })
})
