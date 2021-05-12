import { computed, ref } from 'vue'
import { defineStore, expectType } from './'

const name = ref('Eduardo')
const counter = ref(0)
const double = computed({
  get: () => counter.value * 2,
  set(val) {
    counter.value = val / 2
  },
})

const useStore = defineStore({
  id: 'name',
  state: () => ({
    n: 0,
    name,
    double,
    counter,
  }),

  getters: {
    myDouble: (state) => {
      expectType<number>(state.double)
      expectType<number>(state.counter)
      return state.n * 2
    },
    other(): undefined {
      expectType<number>(this.double)
      expectType<number>(this.counter)
      return undefined
    },
  },

  actions: {
    some() {
      expectType<number>(this.$state.double)
      expectType<number>(this.$state.counter)
      expectType<number>(this.double)
      expectType<number>(this.counter)

      this.$patch({ counter: 2 })
      this.$patch((state) => {
        expectType<number>(state.counter)
      })
    },
  },
})

const store = useStore()

expectType<number>(store.$state.counter)
expectType<number>(store.$state.double)
