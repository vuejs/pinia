export const useCounter = defineStore('counter', {
  state: () => ({
    count: 100,
  }),
  actions: {
    increment() {
      this.count += 1
    },
  },
  getters: {
    getCount: (state) => state.count,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
