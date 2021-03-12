import { defineStore, mapStores, Store } from '../../src'
import { expectType, expectError } from 'tsd'
import { StoreDefinition } from 'src/types'

const useStore = defineStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off' }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
})

const useCounter = defineStore({
  id: 'counter',
  state: () => ({ n: 0 }),
})

const useStoreDos = defineStore({
  id: 'dos',
  state: () => ({}),
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.$state)
expectType<string>(store.upper)

expectType<{ upper: string }>(store)

expectError(() => store.nonExistant)

type MainStore = ReturnType<typeof useStore>
type DosStore = ReturnType<typeof useStoreDos>
type CounterStore = ReturnType<typeof useCounter>

expectType<{
  name: () => MainStore
  dos: () => DosStore
  counter: () => CounterStore
}>(mapStores(useStore, useStoreDos, useCounter))
