import { computed, ref } from 'vue'
import { defineStore, expectType } from './'

const useSetupStore = defineStore('name', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  const triple = computed({
    get: () => count.value * 3,
    set: (tripled) => {
      count.value = Math.round(tripled / 3)
    },
  })

  function increment(amount = 1) {
    count.value += amount

    return count.value
  }

  return { count, double, increment, triple }
})

const setupStore = useSetupStore()
expectType<'name'>(setupStore.$id)
expectType<number>(setupStore.count)
expectType<number>(setupStore.$state.count)
expectType<number>(setupStore.double)
expectType<number>(setupStore.triple)
expectType<(amount?: number) => number>(setupStore.increment)
