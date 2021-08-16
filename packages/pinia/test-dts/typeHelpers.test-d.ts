import { StoreDefinition } from 'dist/pinia'
import { computed, ref } from 'vue'
import {
  StoreState,
  StoreGetters,
  StoreActions,
  defineStore,
  expectType,
} from './'

const useSetupStore = defineStore('main', () => {
  const n = ref(0)

  const double = computed(() => n.value * 2)

  function increment(amount = 1) {
    n.value += amount
  }

  return { n, increment, double }
})

const useOptionsStore = defineStore('main', {
  state: () => ({ n: 0 }),
  getters: {
    double: (state) => state.n * 2,
  },
  actions: {
    increment(amount = 1) {
      this.n += amount
    },
  },
})

declare function storeActions<T extends StoreDefinition>(
  useStore: T
): StoreActions<ReturnType<T>>

declare function storeState<T extends StoreDefinition>(
  useStore: T
): StoreState<ReturnType<T>>

declare function storeGetters<T extends StoreDefinition>(
  useStore: T
): StoreGetters<ReturnType<T>>

expectType<{
  increment: (amount?: number) => void
}>(storeActions(useSetupStore))

expectType<{ n: number }>(storeState(useSetupStore))

expectType<{ double: number }>(storeGetters(useSetupStore))

expectType<{
  increment: (amount?: number) => void
}>(storeActions(useOptionsStore))

expectType<{ n: number }>(storeState(useOptionsStore))

expectType<{ double: number }>(storeGetters(useOptionsStore))

expectType<{ n: number }>(
  storeState(
    defineStore('', {
      state: () => ({ n: ref(0) }),
    })
  )
)
