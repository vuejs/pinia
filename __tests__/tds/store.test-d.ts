import { createStore } from '../../src'
import { expectType, expectError } from 'tsd'

const useStore = createStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off' }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.state)

expectType<{ upper: string }>(store)

expectError(() => store.nonExistant)
