import { makeStore } from '../../../src'

export const { useStore, clear } = makeStore('main', () => ({
  counter: 0,
  name: 'anon',
}))
