import { defineStore, acceptHMRUpdate } from 'pinia'

export const useCounter = defineStore('counter', {
  state: () => ({
    n: 0,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
