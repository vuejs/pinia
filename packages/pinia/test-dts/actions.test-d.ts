import { defineStore, expectType } from './'
import { ref } from 'vue'

const useOptionsStore = defineStore('name', {
  state: () => ({ count: 0 }),
  actions: {
    useOtherAction() {
      return this.returnStuff()
    },
    useExternalFunction() {
      return outer(this as any)
    },
    returnStuff() {
      this.useOtherAction()
      return this.count * 2
    },
    // return type is necessary
    factorial(n?: number): number {
      n ??= this.count
      return n > 1 ? this.factorial(n - 1) * n : 1
    },
    crossA(): 'A' | 'B' {
      if (this.count < 3) {
        return 'A'
      } else {
        return this.crossB()
      }
    },
    crossB() {
      if (this.count > 2) {
        return this.crossA()
      } else {
        return 'B'
      }
    },
    generic<T>(value: T): T {
      return value
    },
    overload,
  },
})

const useSetupStore = defineStore('setup', () => {
  const count = ref(0)

  function useOtherAction() {
    return returnStuff()
  }
  function useExternalFunction(): number {
    return outerSetup(useSetupStore())
  }
  function returnStuff() {
    useOtherAction()
    return count.value * 2
  }
  function factorial(n?: number): number {
    n ??= count.value
    return n > 1 ? factorial(n - 1) * n : 1
  }
  function crossA(): 'A' | 'B' {
    if (count.value < 3) {
      return 'A'
    } else {
      return crossB()
    }
  }
  function crossB() {
    if (count.value > 2) {
      return crossA()
    } else {
      return 'B'
    }
  }
  function generic<T>(value: T): T {
    return value
  }

  return {
    count,
    useOtherAction,
    useExternalFunction,
    returnStuff,
    factorial,
    crossA,
    crossB,
    generic,
    overload,
  }
})

function outer(store: ReturnType<typeof useOptionsStore>): number {
  return store.count * 2
}

function outerSetup(store: ReturnType<typeof useSetupStore>): number {
  return store.count * 2
}

function overload(value: string): number
function overload(value: number): string
function overload(value: string | number): number | string {
  return typeof value === 'string' ? value.length : String(value)
}

const store = useOptionsStore()

expectType<'A' | 'B'>(store.crossA())
expectType<'A' | 'B'>(store.crossB())
expectType<number>(store.factorial())
expectType<number>(store.returnStuff())
expectType<number>(store.useExternalFunction())
expectType<number>(store.useOtherAction())
expectType<string>(store.generic('hello'))
expectType<string>(store.overload(1))
expectType<number>(store.overload('1'))
expectType<number>(outer(store))

const setupStore = useSetupStore()

expectType<'A' | 'B'>(setupStore.crossA())
expectType<'A' | 'B'>(setupStore.crossB())
expectType<number>(setupStore.factorial())
expectType<number>(setupStore.returnStuff())
expectType<number>(setupStore.useExternalFunction())
expectType<number>(setupStore.useOtherAction())
expectType<string>(setupStore.generic('hello'))
expectType<string>(setupStore.overload(1))
expectType<number>(setupStore.overload('1'))
expectType<number>(outerSetup(setupStore))
