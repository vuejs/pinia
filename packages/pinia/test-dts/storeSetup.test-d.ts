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

  const multiply = computed(() => (n: number) => {
    return count.value * n;
  });

  function increment(amount = 1) {
    count.value += amount

    return count.value
  }

  return { count, double, increment, triple, multiply }
})

const setupStore = useSetupStore()
expectType<'name'>(setupStore.$id)
expectType<number>(setupStore.count)
expectType<number>(setupStore.$state.count)
expectType<number>(setupStore.double)
expectType<number>(setupStore.triple)
expectType<(n: number) => number>(setupStore.multiply);
expectType<(amount?: number) => number>(setupStore.increment)
