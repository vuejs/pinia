import { defineStore } from '../../../src'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useCounter = defineStore({
  id: 'counter',

  state: () => ({
    n: 0,
    incrementedTimes: 0,
    decrementedTimes: 0,
    numbers: [] as number[],
  }),

  getters: {
    double: (state) => state.n * 2,
  },

  actions: {
    increment(amount = 1) {
      if (typeof amount !== 'number') {
        amount = 1
      }
      this.incrementedTimes++
      this.n += amount
    },

    async fail() {
      const n = this.n
      await delay(1000)
      this.numbers.push(n)
      await delay(1000)
      if (this.n !== n) {
        throw new Error('Someone changed n!')
      }

      return n
    },

    async decrementToZero(interval: number = 300, usePatch = true) {
      if (this.n <= 0) return

      while (this.n > 0) {
        if (usePatch) {
          this.$patch({
            n: this.n - 1,
            decrementedTimes: this.decrementedTimes + 1,
          })
          // this.$patch(state => {
          //   state.n--
          //   state.decrementedTimes++
          // })
        } else {
          this.n--
        }
        await delay(interval)
      }
    },
  },
})
