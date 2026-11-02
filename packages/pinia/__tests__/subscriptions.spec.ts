import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, MutationType, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { effectScope, nextTick, ref } from 'vue'
import { mockWarn } from './vitest-mock-warn'

describe('Subscriptions', () => {
  mockWarn()

  const useOptionsStore = defineStore('main', {
    state: () => ({
      user: 'Eduardo',
    }),
  })

  const useSetupStore = defineStore('main', () => {
    return {
      user: ref('Eduardo'),
    }
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe.each([
    { useStore: useOptionsStore, name: 'Options Stores' },
    { useStore: useSetupStore, name: 'Setup Stores' },
  ])('with: $name', ({ useStore }) => {
    it('fires callback changed through $state', () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy, { flush: 'sync' })
      store.$state.user = 'Cleiton'
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 'main',
          type: MutationType.direct,
        }),
        store.$state
      )
    })

    it('fires callback when changed through store', async () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy)
      expect(spy).toHaveBeenCalledTimes(0)
      store.user = 'Cleiton'
      await nextTick()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('subscribe to changes done via patch', () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy, { flush: 'sync' })

      const patch = { user: 'Cleiton' }
      store.$patch(patch)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: patch,
          storeId: 'main',
          type: MutationType.patchObject,
        }),
        store.$state
      )
    })
    const flushOptions = ['post', 'pre', 'sync'] as const

    flushOptions.forEach((flush) => {
      it('calls once inside components with flush ' + flush, async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const spy1 = vi.fn()

        mount(
          {
            setup() {
              const s1 = useStore()
              s1.$subscribe(spy1, { flush })
            },
            template: `<p/>`,
          },
          { global: { plugins: [pinia] } }
        )

        const s1 = useStore()

        expect(spy1).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(1)

        s1.$patch({ user: 'a' })
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(2)

        s1.$patch((state) => {
          state.user = 'other'
        })
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(3)
      })
    })

    it('works with multiple different flush', async () => {
      const spyPre = vi.fn()
      const spyPost = vi.fn()
      const spySync = vi.fn()

      const s1 = useStore()
      s1.$subscribe(spyPre, { flush: 'pre' })
      s1.$subscribe(spyPost, { flush: 'post' })
      s1.$subscribe(spySync, { flush: 'sync' })

      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(0)

      s1.user = 'Edu'
      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(1)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(1)

      s1.$patch({ user: 'a' })
      // patch still triggers all subscriptions immediately
      expect(spyPre).toHaveBeenCalledTimes(2)
      expect(spyPost).toHaveBeenCalledTimes(2)
      expect(spySync).toHaveBeenCalledTimes(2)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(2)
      expect(spyPost).toHaveBeenCalledTimes(2)
      expect(spySync).toHaveBeenCalledTimes(2)

      s1.$patch((state) => {
        state.user = 'other'
      })
      expect(spyPre).toHaveBeenCalledTimes(3)
      expect(spyPost).toHaveBeenCalledTimes(3)
      expect(spySync).toHaveBeenCalledTimes(3)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(3)
      expect(spyPost).toHaveBeenCalledTimes(3)
      expect(spySync).toHaveBeenCalledTimes(3)
    })

    it('works with multiple different flush and multiple state changes', async () => {
      const spyPre = vi.fn()
      const spyPost = vi.fn()
      const spySync = vi.fn()

      const s1 = useStore()
      s1.$subscribe(spyPre, { flush: 'pre' })
      s1.$subscribe(spyPost, { flush: 'post' })
      s1.$subscribe(spySync, { flush: 'sync' })

      s1.user = 'Edu'
      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(1)
      s1.$patch({ user: 'a' })
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(2)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(2)
    })

    it('unsubscribes callback when unsubscribe is called', () => {
      const spy = vi.fn()
      const store = useStore()
      const unsubscribe = store.$subscribe(spy, { flush: 'sync' })
      unsubscribe()
      store.$state.user = 'Cleiton'
      expect(spy).not.toHaveBeenCalled()
    })

    it('listeners are not affected when unsubscribe is called multiple times', () => {
      const func1 = vi.fn()
      const func2 = vi.fn()
      const store = useStore()
      const unsubscribe1 = store.$subscribe(func1, { flush: 'sync' })
      store.$subscribe(func2, { flush: 'sync' })
      unsubscribe1()
      unsubscribe1()
      store.$state.user = 'Cleiton'
      expect(func1).not.toHaveBeenCalled()
      expect(func2).toHaveBeenCalledTimes(1)
    })

    describe('multiple', () => {
      it('triggers subscribe only once', async () => {
        const s1 = useStore()
        const s2 = useStore()

        const spy1 = vi.fn()
        const spy2 = vi.fn()

        s1.$subscribe(spy1, { flush: 'sync' })
        s2.$subscribe(spy2, { flush: 'sync' })

        expect(spy1).toHaveBeenCalledTimes(0)
        expect(spy2).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'

        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)
      })

      it('triggers pre subscriptions only once on $patch', async () => {
        const s1 = useStore()
        const spy1 = vi.fn()

        s1.$subscribe(spy1, { flush: 'pre' })

        // First mutation: works as expected
        s1.$patch({ user: 'Edu' })
        // anything else than awaiting a non promise or Promise.resolve() works
        await false
        // await Promise.resolve(false)
        // adding an extra await works
        // await false
        // adding any other delay also works
        // await delay(20)
        // await nextTick()
        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy1).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: MutationType.direct }),
          s1.$state
        )

        s1.$patch({ user: 'Myk' })
        await nextTick()

        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy1).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: MutationType.direct }),
          s1.$state
        )
      })

      it('removes on unmount', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const spy1 = vi.fn()
        const spy2 = vi.fn()

        const wrapper = mount(
          {
            setup() {
              const s1 = useStore()
              s1.$subscribe(spy1, { flush: 'sync' })
            },
            template: `<p/>`,
          },
          { global: { plugins: [pinia] } }
        )

        const s1 = useStore()
        const s2 = useStore()

        s2.$subscribe(spy2, { flush: 'sync' })

        expect(spy1).toHaveBeenCalledTimes(0)
        expect(spy2).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'
        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)

        s1.$patch({ user: 'a' })
        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy2).toHaveBeenCalledTimes(2)

        s1.$patch((state) => {
          state.user = 'other'
        })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(3)

        wrapper.unmount()
        await nextTick()

        s1.$patch({ user: 'b' })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(4)
        s1.$patch((state) => {
          state.user = 'c'
        })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(5)
        s1.user = 'd'
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(6)
      })
    })

    it('subscribe is post by default', async () => {
      const spy = vi.fn()
      const store = useStore()
      store.$subscribe(spy)
      store.$state.user = 'Cleiton'
      expect(spy).toHaveBeenCalledTimes(0)
      await nextTick()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 'main',
          type: MutationType.direct,
        }),
        store.$state
      )
    })

    describe('once', () => {
      const mutations = [
        {
          type: MutationType.direct,
          apply: (store: ReturnType<typeof useStore>) => {
            store.user += '!'
          },
        },
        {
          type: MutationType.patchObject,
          apply: (store: ReturnType<typeof useStore>) =>
            store.$patch({ user: store.user + '!' }),
        },
        {
          type: MutationType.patchFunction,
          apply: (store: ReturnType<typeof useStore>) =>
            store.$patch((state) => {
              state.user += '!'
            }),
        },
      ]

      describe.each(['sync', 'pre', 'post'] as const)('flush: %s', (flush) => {
        it.each(
          mutations.flatMap((first) =>
            mutations.map((second) => ({ first, second }))
          )
        )(
          'stops after $first.type before $second.type',
          async ({ first, second }) => {
            const store = useStore()
            const spy = vi.fn()
            const persistent = vi.fn()
            store.$subscribe(spy, { once: true, flush })
            store.$subscribe(persistent, { flush })

            first.apply(store)
            await nextTick()
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: first.type }),
              store.$state
            )

            second.apply(store)
            await nextTick()
            expect(spy).toHaveBeenCalledTimes(1)
            expect(persistent).toHaveBeenCalledTimes(2)
          }
        )

        it.each(mutations)(
          'defers self-resubscription until the next mutation after $type',
          async ({ apply }) => {
            const store = useStore()
            let calls = 0
            const callback = () => {
              // A finite guard makes the old live-Set regression safe to run.
              if (++calls < 10)
                store.$subscribe(callback, { once: true, flush })
            }
            const oldUnsubscribe = store.$subscribe(callback, {
              once: true,
              flush,
            })
            apply(store)
            await nextTick()
            expect(calls).toBe(1)
            oldUnsubscribe()
            apply(store)
            await nextTick()
            expect(calls).toBe(2)
          }
        )

        it('allows a rearmed callback to observe a genuinely nested patch', async () => {
          const store = useStore()
          const values: string[] = []
          const callback = () => {
            values.push(store.user)
            if (values.length === 1) {
              store.$subscribe(callback, { once: true, flush })
              store.$patch({ user: 'nested' })
            }
          }
          store.$subscribe(callback, { once: true, flush })
          store.$patch({ user: 'outer' })
          await nextTick()
          expect(values).toEqual(['outer', 'nested'])
          store.$patch({ user: 'later' })
          expect(values).toEqual(['outer', 'nested'])
        })

        it.each([false, true])(
          'skips subscriptions removed by an earlier callback (once: %s)',
          async (once) => {
            const store = useStore()
            const removed = vi.fn()
            const added = vi.fn()
            store.$subscribe(
              () => {
                unsubscribe()
                store.$subscribe(added, { once: true, flush })
              },
              { once: true, flush }
            )
            const unsubscribe = store.$subscribe(removed, { once, flush })
            store.$patch({ user: 'first' })
            await nextTick()
            expect(removed).not.toHaveBeenCalled()
            expect(added).not.toHaveBeenCalled()
            store.$patch({ user: 'second' })
            await nextTick()
            expect(removed).not.toHaveBeenCalled()
            expect(added).toHaveBeenCalledTimes(1)
          }
        )

        it('deduplicates once callbacks and returns a noop for the duplicate', async () => {
          const store = useStore()
          const spy = vi.fn()
          const unsubscribe = store.$subscribe(spy, { once: true, flush })
          const duplicate = store.$subscribe(spy, { once: true, flush })
          expect('passed to "$subscribe()"').toHaveBeenWarnedTimes(1)
          duplicate()
          store.$patch({ user: 'first' })
          await nextTick()
          expect(spy).toHaveBeenCalledTimes(1)

          // The consumed callback can be registered again. Its old cleanup must
          // not remove this new subscription.
          store.$subscribe(spy, { once: true, flush })
          unsubscribe()
          store.user = 'second'
          await nextTick()
          store.$patch({ user: 'third' })
          await nextTick()
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it('supports manual unsubscribe before the first notification', async () => {
          const store = useStore()
          const spy = vi.fn()
          const unsubscribe = store.$subscribe(spy, { once: true, flush })
          unsubscribe()
          unsubscribe()
          store.$patch({ user: 'patch' })
          store.user = 'direct'
          await nextTick()
          expect(spy).not.toHaveBeenCalled()
        })

        it.each([false, true])(
          'cleans up an effect scope (detached: %s)',
          async (detached) => {
            const store = useStore()
            const spy = vi.fn()
            const scope = effectScope()
            scope.run(() =>
              store.$subscribe(spy, { once: true, flush, detached })
            )
            scope.stop()
            store.$patch({ user: 'patch' })
            await nextTick()
            store.user = 'direct'
            await nextTick()
            expect(spy).toHaveBeenCalledTimes(detached ? 1 : 0)
          }
        )

        it('cleans up on component unmount', async () => {
          const pinia = createPinia()
          const spy = vi.fn()
          const wrapper = mount(
            {
              setup() {
                useStore().$subscribe(spy, { once: true, flush })
              },
              render: () => null,
            },
            { global: { plugins: [pinia] } }
          )
          const store = useStore(pinia)
          wrapper.unmount()
          store.$patch({ user: 'patch' })
          await nextTick()
          store.user = 'direct'
          await nextTick()
          expect(spy).not.toHaveBeenCalled()
        })

        it('cleans up on store disposal', async () => {
          const store = useStore()
          const spy = vi.fn()
          store.$subscribe(spy, { once: true, flush, detached: true })
          store.$dispose()
          store.$patch({ user: 'patch' })
          store.user = 'direct'
          await nextTick()
          expect(spy).not.toHaveBeenCalled()
        })

        it('consumes an immediate notification', async () => {
          const store = useStore()
          const spy = vi.fn()
          store.$subscribe(spy, { once: true, immediate: true, flush })
          expect(spy).toHaveBeenCalledTimes(1)
          store.$patch({ user: 'patch' })
          await nextTick()
          store.user = 'direct'
          await nextTick()
          expect(spy).toHaveBeenCalledTimes(1)
        })

        it('does not consume immediate notifications suppressed during a patch', async () => {
          const store = useStore()
          const spy = vi.fn()
          store.$patch((state) => {
            store.$subscribe(spy, { once: true, immediate: true, flush })
            state.user = 'patch'
            expect(spy).not.toHaveBeenCalled()
          })
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: MutationType.patchFunction }),
            store.$state
          )
          await nextTick()
          store.user = 'direct'
          await nextTick()
          store.$patch({ user: 'another patch' })
          expect(spy).toHaveBeenCalledTimes(1)
        })

        it.each([false, true])(
          'prevents reentrant mutations (immediate: %s)',
          async (immediate) => {
            const store = useStore()
            const spy = vi.fn(() => {
              if (spy.mock.calls.length === 1) {
                store.user = 'nested direct'
                store.$patch({ user: 'nested patch' })
              }
            })
            store.$subscribe(spy, { once: true, flush, immediate })
            store.$patch({ user: 'outer patch' })
            await nextTick()
            expect(spy).toHaveBeenCalledTimes(1)
          }
        )
      })

      it('consumes a patch notification even if the callback throws', async () => {
        const store = useStore()
        const error = new Error('subscription failure')
        const spy = vi.fn(() => {
          throw error
        })
        store.$subscribe(spy, { once: true, flush: 'sync' })
        expect(() => store.$patch({ user: 'first' })).toThrow(error)
        await nextTick()
        store.user = 'direct'
        await nextTick()
        expect(() => store.$patch({ user: 'second' })).not.toThrow()
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    it('subscribe once with patch', () => {
      const spy1 = vi.fn()
      const spy2 = vi.fn()
      const store = useStore()
      function once() {
        const unsubscribe = store.$subscribe(
          () => {
            spy1()
            unsubscribe()
          },
          { flush: 'sync' }
        )
      }
      once()
      store.$subscribe(spy2, { flush: 'sync' })
      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)
      store.$patch((state) => {
        state.user = 'a'
      })
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
      store.$patch((state) => {
        state.user = 'b'
      })
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(2)
    })

    // https://github.com/vuejs/pinia/issues/992
    it('triggers sync subscription when state is synchronously mutated after patch', async () => {
      const store = useStore()
      const syncSpy = vi.fn()
      const preSpy = vi.fn()
      const postSpy = vi.fn()
      store.$subscribe(syncSpy, { flush: 'sync' })
      store.$subscribe(preSpy, { flush: 'pre' })
      store.$subscribe(postSpy, { flush: 'post' })

      store.$patch({ user: 'Edu' })
      store.user = 'a'
      expect(syncSpy).toHaveBeenCalledTimes(2)

      // FIXME: ideally, these should be 2 but we cannot use
      // a sync flush within the store's $subscribe method
      // https://github.com/vuejs/pinia/issues/610
      await nextTick()
      expect(preSpy).toHaveBeenCalledTimes(1)
      expect(postSpy).toHaveBeenCalledTimes(1)
    })

    it('ignores a callback subscribed twice and warns', () => {
      const spy = vi.fn()
      const store = useStore()
      const unsub1 = store.$subscribe(spy, { flush: 'sync' })
      const unsub2 = store.$subscribe(spy, { flush: 'sync' })

      expect('passed to "$subscribe()"').toHaveBeenWarnedTimes(1)

      store.$state.user = 'once'
      expect(spy).toHaveBeenCalledTimes(1)

      store.$patch({ user: 'twice' })
      expect(spy).toHaveBeenCalledTimes(2)

      // the second call returned a noop, so it does not unsubscribe anything
      unsub2()
      store.$state.user = 'after-unsub2'
      expect(spy).toHaveBeenCalledTimes(3)

      // unsubscribing the original removes the single subscription
      unsub1()
      store.$state.user = 'after-unsub1'
      expect(spy).toHaveBeenCalledTimes(3)
    })
  })
})
