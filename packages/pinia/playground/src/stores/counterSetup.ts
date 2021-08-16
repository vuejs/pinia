import { computed, toRefs, reactive } from 'vue'
import { acceptHMRUpdate, defineStore } from '../../../src'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useCounter = defineStore('counter-setup', () => {
  const state = reactive({
    n: 0,
    incrementedTimes: 0,
    decrementedTimes: 0,
    numbers: [] as number[],
  })

  const double = computed(() => state.n * 2)

  function increment(amount = 1) {
    if (typeof amount !== 'number') {
      amount = 1
    }
    state.incrementedTimes++
    state.n += amount
  }

  function changeMe() {
    console.log('change me to test HMR')
  }

  async function fail() {
    const n = state.n
    await delay(1000)
    state.numbers.push(n)
    await delay(1000)
    if (state.n !== n) {
      throw new Error('Someone changed n!')
    }

    return n
  }

  async function decrementToZero(interval: number = 300) {
    if (state.n <= 0) return

    while (state.n > 0) {
      state.n -= 1
      state.decrementedTimes += 1
      await delay(interval)
    }
  }

  return {
    ...toRefs(state),
    double,
    increment,
    fail,
    changeMe,
    decrementToZero,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
