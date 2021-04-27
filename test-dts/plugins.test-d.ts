import {
  defineStore,
  expectType,
  mapStores,
  createPinia,
  GenericStore,
} from '.'

const useCounter = defineStore({
  id: 'counter',
  state: () => ({ n: 0 }),
})

type CounterStore = ReturnType<typeof useCounter>

const computedStores = mapStores(useCounter)

expectType<{
  counterStore: () => CounterStore
}>(computedStores)

const pinia = createPinia()

pinia.use(({ store }) => {
  expectType<GenericStore>(store)
})
