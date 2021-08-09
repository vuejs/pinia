import { computed, ref } from 'vue'
import { defineStore, expectType } from './'

const useSetupStore = defineStore('name', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment(amount = 1) {
    count.value += amount

    return count.value
  }

  return { count, double, increment }
})

const setupStore = useSetupStore()
expectType<'name'>(setupStore.$id)
expectType<number>(setupStore.count)
expectType<number>(setupStore.$state.count)
expectType<number>(setupStore.double)
expectType<(amount?: number) => number>(setupStore.increment)
