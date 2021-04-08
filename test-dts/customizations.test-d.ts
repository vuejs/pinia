import { defineStore, expectType, mapStores } from '.'

declare module '../dist/pinia' {
  export interface MapStoresCustomization {
    // this is the only one that can be applied to work with other tests
    suffix: 'Store'
  }
}

const useCounter = defineStore({
  id: 'counter',
  state: () => ({ n: 0 }),
})

type CounterStore = ReturnType<typeof useCounter>

const computedStores = mapStores(useCounter)

expectType<{
  counterStore: () => CounterStore
}>(computedStores)
