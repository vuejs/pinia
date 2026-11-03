import { ref, watch, type DebuggerEvent } from 'vue'
import {
  defineStore,
  expectType,
  MutationType,
  type TypeEqual,
  type SubscriptionCallbackMutation,
} from './'

const optionsStore = defineStore('subscribe-options', {
  state: () => ({ n: 0, name: 'Eduardo' }),
})()
const setupStore = defineStore('subscribe-setup', () => ({
  n: ref(0),
  name: ref('Eduardo'),
}))()

type Options = NonNullable<Parameters<typeof optionsStore.$subscribe>[1]>
type SetupOptions = NonNullable<Parameters<typeof setupStore.$subscribe>[1]>
expectType<TypeEqual<'once' extends keyof Options ? true : false, false>>(true)
expectType<TypeEqual<'once' extends keyof SetupOptions ? true : false, false>>(
  true
)

// @ts-expect-error: once is not a subscription option
optionsStore.$subscribe(() => {}, { once: true })
// @ts-expect-error: even once: false is not a subscription option
optionsStore.$subscribe(() => {}, { once: false })
// @ts-expect-error: setup stores have the same subscription options
setupStore.$subscribe(() => {}, { once: true })
// @ts-expect-error: even once: false is not a subscription option
setupStore.$subscribe(() => {}, { once: false })

for (const store of [optionsStore, setupStore]) {
  const unsubscribe = store.$subscribe(
    (mutation, state) => {
      expectType<TypeEqual<typeof state, { n: number; name: string }>>(true)
      expectType<
        TypeEqual<
          typeof mutation,
          SubscriptionCallbackMutation<{ n: number; name: string }>
        >
      >(true)
      expectType<string>(mutation.storeId)
      if (mutation.type === MutationType.patchObject) {
        expectType<number | undefined>(mutation.payload.n)
        // @ts-expect-error: the state payload is not any
        expectType<string>(mutation.payload.n)
      }
      // @ts-expect-error: state properties keep their inferred types
      expectType<string>(state.n)
    },
    {
      detached: true,
      flush: 'sync',
      immediate: true,
      deep: 2,
      onTrack(event) {
        expectType<TypeEqual<typeof event, DebuggerEvent>>(true)
      },
      onTrigger(event) {
        expectType<TypeEqual<typeof event, DebuggerEvent>>(true)
      },
    }
  )
  expectType<TypeEqual<typeof unsubscribe, () => void>>(true)
  store.$subscribe(() => {}, { flush: 'pre', deep: true })
  store.$subscribe(() => {}, { flush: 'post', detached: false })
  // @ts-expect-error: other invalid options still fail
  store.$subscribe(() => {}, { flush: 'invalid' })
}

// Excluding once from Pinia does not change Vue's own watch options.
watch(
  ref(0),
  (value) => {
    expectType<TypeEqual<typeof value, number>>(true)
  },
  { once: true }
)
