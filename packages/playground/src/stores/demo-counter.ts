import { defineStore, acceptHMRUpdate } from 'pinia'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))
// just to ignore the not used error
delay(0)

export const useCounter = defineStore('demo-counter', {
  state: () => ({
    n: 0,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
