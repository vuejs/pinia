import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { createPinia, defineStore } from '../src'

describe.each(['options', 'setup'] as const)(
  'subscription dispatch with %s stores',
  (kind) => {
    function createStore() {
      const useStore =
        kind === 'options'
          ? defineStore('counter', {
              state: () => ({ count: 0 }),
              actions: {
                increment() {
                  this.count++
                },
              },
            })
          : defineStore('counter', () => {
              const count = ref(0)
              function increment() {
                count.value++
              }
              return { count, increment }
            })
      return useStore(createPinia())
    }

    describe.each(['patch', 'action'] as const)('%s', (kind) => {
      function setup() {
        const store = createStore()
        return {
          store,
          subscribe: (callback: () => void) =>
            kind === 'patch'
              ? store.$subscribe(callback, { flush: 'sync' })
              : store.$onAction(callback),
          dispatch: () =>
            kind === 'patch'
              ? store.$patch({ count: store.count + 1 })
              : store.increment(),
        }
      }

      it('does not revisit a callback that replaces its subscription', () => {
        const { store, subscribe, dispatch } = setup()
        let calls = 0
        let unsubscribe: () => void
        const callback = () => {
          // Bound the regression so a broken dispatcher fails instead of hanging.
          if (++calls > 5)
            throw new Error('subscription dispatch did not finish')
          unsubscribe()
          unsubscribe = subscribe(callback)
        }
        unsubscribe = subscribe(callback)

        dispatch()
        expect(calls).toBe(1)
        expect(store.count).toBe(1)
        dispatch()
        expect(calls).toBe(2)
        expect(store.count).toBe(2)
        unsubscribe()
      })

      it('defers subscriptions added during dispatch until the next dispatch', () => {
        const { subscribe, dispatch } = setup()
        let calls = 0
        let unsubscribe: (() => void) | undefined
        subscribe(() => {
          if (!unsubscribe) unsubscribe = subscribe(() => calls++)
        })

        dispatch()
        expect(calls).toBe(0)
        dispatch()
        expect(calls).toBe(1)
      })

      it('still skips callbacks removed before they are reached', () => {
        const { subscribe, dispatch } = setup()
        let calls = 0
        let unsubscribe: () => void
        subscribe(() => unsubscribe())
        unsubscribe = subscribe(() => calls++)

        dispatch()
        expect(calls).toBe(0)
      })

      it('does not call remaining subscriptions after disposal', () => {
        const { store, subscribe, dispatch } = setup()
        let calls = 0
        subscribe(() => store.$dispose())
        subscribe(() => calls++)

        dispatch()
        expect(calls).toBe(0)
      })
    })
  }
)
