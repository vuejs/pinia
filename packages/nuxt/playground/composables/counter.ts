import { defineStore, acceptHMRUpdate } from 'pinia'

export const useCounter = defineStore('counter', {
  state: () => ({
    count: 100
  }),
  actions: {
    increment () {
      this.count++
    }
  },
  getters: {
    getCount: state => state.count
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
