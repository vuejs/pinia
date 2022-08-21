export const useCounter = definePiniaStore('counter', {
  state: () => ({
    count: 100,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
  getters: {
    getCount: (state) => state.count,
  },
})
