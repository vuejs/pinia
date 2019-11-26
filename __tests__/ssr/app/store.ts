import { createStore } from '../../../src'

export const useStore = createStore('main', () => ({
  counter: 0,
  name: 'anon',
}))
