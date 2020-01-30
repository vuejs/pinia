import { createStore } from '../../src'

export const useStore = createStore({
  id: 'main',
  state: () => ({
    counter: 0,
    name: 'anon',
  }),
})
