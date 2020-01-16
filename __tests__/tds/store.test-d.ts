import { createStore } from '../../src'
import { expectType, expectError } from 'tsd'

const useStore = createStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off' }),
  getters: {
    upper: state => state.a.toUpperCase(),
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.state)

expectError(() => store.nonExistant)
