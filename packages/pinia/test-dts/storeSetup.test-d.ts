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
    return count.value * n
  })

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
expectType<(n: number) => number>(setupStore.multiply)
expectType<(amount?: number) => number>(setupStore.increment)

const emptyStore = defineStore('setup-empty', () => ({}))()

expectType<'setup-empty'>(emptyStore.$id)

// @ts-expect-error
emptyStore.notExisting()
// @ts-expect-error
emptyStore.notExisting = 1
// @ts-expect-error
emptyStore.$state.notExisting

const stateOnlyStore = defineStore('setup-state-only', () => ({
  count: ref(0),
  status: ref<'on' | 'off'>('on'),
  nested: ref({ counter: 0 }),
}))()

expectType<number>(stateOnlyStore.count)
expectType<'on' | 'off'>(stateOnlyStore.status)
expectType<number>(stateOnlyStore.nested.counter)
stateOnlyStore.count = 1
stateOnlyStore.status = 'off'
stateOnlyStore.$state.count = 2
stateOnlyStore.$patch({ nested: { counter: 3 } })
stateOnlyStore.$patch((state) => {
  expectType<number>(state.count)
  state.count++
  // @ts-expect-error
  state.count = 'wrong'
})

// @ts-expect-error
stateOnlyStore.notExisting()
// @ts-expect-error
stateOnlyStore.count()
// @ts-expect-error
stateOnlyStore.count = 'wrong'
// @ts-expect-error
stateOnlyStore.status = 'other'
// @ts-expect-error
stateOnlyStore.nested.counter = 'wrong'
// @ts-expect-error
stateOnlyStore.$state.count = 'wrong'
// @ts-expect-error
stateOnlyStore.$patch({ count: 'wrong' })
// @ts-expect-error
stateOnlyStore.$patch({ notExisting: 1 })

const gettersOnlyStore = defineStore('setup-state-getters-only', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  return { count, double }
})()

expectType<number>(gettersOnlyStore.count)
expectType<number>(gettersOnlyStore.double)
expectType<number>(gettersOnlyStore.$state.count)
gettersOnlyStore.count = 1
gettersOnlyStore.$state.count = 2
gettersOnlyStore.$patch({ count: 3 })
gettersOnlyStore.$patch((state) => {
  expectType<number>(state.count)
  state.count++
  // @ts-expect-error
  state.count = 'wrong'
})

// @ts-expect-error
gettersOnlyStore.notExisting()
// @ts-expect-error
gettersOnlyStore.count()
// @ts-expect-error
gettersOnlyStore.double()
// @ts-expect-error
gettersOnlyStore.count = 'wrong'
// @ts-expect-error: computed getters are readonly
gettersOnlyStore.double = 1
// @ts-expect-error
gettersOnlyStore.$state.count = 'wrong'
// @ts-expect-error: computed getters are not state
gettersOnlyStore.$state.double
// @ts-expect-error
gettersOnlyStore.$patch({ count: 'wrong' })
// @ts-expect-error
gettersOnlyStore.$patch({ double: 1 })
