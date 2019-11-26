import { createStore } from '../../src'
import { expectType, expectError } from 'tsd'

const useStore = createStore('name', () => ({ a: 'on' as 'on' | 'off' }), {
  upper: state => state.a.toUpperCase(),
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.state)

expectError(() => store.nonExistant)
