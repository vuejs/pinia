import { defineStore, expectType } from './'

const useStore = defineStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper: (state) => {
      expectType<'on' | 'off'>(state.a)
      return state.a.toUpperCase() as 'ON' | 'OFF'
    },
    upperThis(): 'ON' | 'OFF' {
      expectType<'on' | 'off'>(this.a)
      return this.a.toUpperCase() as 'ON' | 'OFF'
    },
    other(): false {
      expectType<string>(this.upper)
      return false
    },

    doubleCounter: (state) => {
      expectType<number>(state.nested.counter)
      return state.nested.counter * 2
    },
  },
  actions: {
    doStuff() {
      expectType<string>(this.upper)
      expectType<false>(this.other)
    },
    otherOne() {
      expectType<() => void>(this.doStuff)
    },
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.$state)
expectType<number>(store.nested.counter)
expectType<'on' | 'off'>(store.a)
expectType<'ON' | 'OFF'>(store.upper)

// @ts-expect-error
store.nonExistant

// @ts-expect-error
store.upper = 'thing'

// @ts-expect-error
store.nonExistant.stuff

// @ts-expect-error cannot return a value
store.$patch(async () => {})
store.$patch(() => {})
store.$patch(() => {
  // return earlier
  return
})

const useNoSAG = defineStore({
  id: 'noSAG',
})
const useNoAG = defineStore({
  id: 'noAG',
  state: () => ({}),
})
const useNoSG = defineStore({
  id: 'noAG',
  actions: {},
})
const useNoSA = defineStore({
  id: 'noAG',
  getters: {},
})
const useNoS = defineStore({
  id: 'noAG',
  actions: {},
  getters: {},
})
const useNoA = defineStore({
  id: 'noAG',
  state: () => ({}),
  getters: {},
})
const useNoG = defineStore({
  id: 'noAG',
  state: () => ({}),
  actions: {},
})

const noSAG = useNoSAG()
const noSA = useNoSA()
const noAG = useNoAG()
const noSG = useNoSG()
const noS = useNoS()
const noA = useNoA()
const noG = useNoG()

// @ts-expect-error
store.notExisting

// @ts-expect-error
noSAG.notExisting
// @ts-expect-error
noSAG.$state.hey

// @ts-expect-error
noSA.notExisting
// @ts-expect-error
noSA.notExisting
// @ts-expect-error
noAG.notExisting
// @ts-expect-error
noSG.notExisting
// @ts-expect-error
noS.notExisting
// @ts-expect-error
noA.notExisting
// @ts-expect-error
noG.notExisting
