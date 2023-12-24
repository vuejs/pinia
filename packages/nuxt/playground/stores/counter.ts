const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useCounter = defineStore('counter', {
  state: () => ({
    count: 100,
  }),
  actions: {
    increment() {
      this.count += 1
    },

    async asyncIncrement() {
      console.log('asyncIncrement called')
      await sleep(300)
      this.count++
      return true
    },
  },
  getters: {
    getCount: (state) => state.count,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
