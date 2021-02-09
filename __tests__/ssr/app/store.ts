import { defineStore } from '../../../src'

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
    name: 'anon',
  }),
})
