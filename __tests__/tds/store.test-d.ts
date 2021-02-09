import { defineStore } from '../../src'
import { expectType, expectError } from 'tsd'

const useStore = defineStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off' }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.$state)

expectType<{ upper: string }>(store)

expectError(() => store.nonExistant)
