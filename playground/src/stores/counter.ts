import { defineStore, Pinia, Store, StoreDefinition } from '../../../src'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useCounter = defineStore({
  id: 'counter',

  state: () => ({
    n: 5,
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

    newOne() {
      console.log('neeeew')
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

if (import.meta.hot) {
  const isUseStore = (fn: any): fn is StoreDefinition => {
    return typeof fn === 'function' && typeof fn.$id === 'string'
  }

  const oldUseStore = useCounter
  import.meta.hot.accept((newStore) => {
    if (!import.meta.hot) throw new Error('import.meta.hot disappeared')

    const pinia: Pinia | undefined =
      import.meta.hot.data.pinia || oldUseStore._pinia

    if (!pinia) {
      console.warn(`Missing the pinia instance for "${oldUseStore.$id}".`)
      return import.meta.hot.invalidate()
    }

    // preserve the pinia instance across loads
    import.meta.hot.data.pinia = pinia

    console.log('got data', newStore)
    for (const exportName in newStore) {
      const useStore = newStore[exportName]
      console.log('checking for', exportName)
      if (isUseStore(useStore) && pinia._s.has(useStore.$id)) {
        console.log('Accepting update for', useStore.$id)
        const id = useStore.$id

        if (id !== oldUseStore.$id) {
          console.warn(
            `The id of the store changed from "${oldUseStore.$id}" to "${id}". Reloading.`
          )
          return import.meta.hot!.invalidate()
        }

        const existingStore: Store = pinia._s.get(id)!
        if (!existingStore) {
          console.log(`skipping hmr because store doesn't exist yet`)
          // TODO: replace the useCounter var???
          return
        }
        console.log('patching')
        useStore(pinia, existingStore)
        // remove the existing store from the cache to force a new one
        // pinia._s.delete(id)
        // this adds any new state to pinia and then runs the `hydrate` function
        // which, by default, will reuse the existing state in pinia
        // const newStore = useStore(pinia)
        // console.log('going there', newStore._hmrPayload)
        // pinia._s.set(id, existingStore)
      }
    }
  })
}
