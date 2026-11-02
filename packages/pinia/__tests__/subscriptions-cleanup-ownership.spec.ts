import { describe, expect, it, vi } from 'vitest'
import {
  createApp,
  effectScope,
  getCurrentScope,
  nextTick,
  onUnmounted,
  onWatcherCleanup,
  ref,
  watch,
} from 'vue'
import { createPinia, defineStore, disposePinia } from '../src'
import { mockWarn } from './vitest-mock-warn'

mockWarn()

describe.each(['options', 'setup'] as const)(
  '%s immediate once cleanup ownership',
  (kind) => {
    function setup() {
      const pinia = createPinia()
      const store =
        kind === 'options'
          ? defineStore('cleanup-owner', { state: () => ({ n: 0 }) })(pinia)
          : defineStore('cleanup-owner', () => ({ n: ref(0) }))(pinia)
      return { pinia, store }
    }

    describe.each(['sync', 'pre', 'post'] as const)('flush: %s', (flush) => {
      it.each(['store', 'pinia'] as const)(
        'keeps cleanup-created resources live until %s disposal',
        async (owner) => {
          const { pinia, store } = setup()
          const caller = effectScope()
          const signal = ref(0)
          const second = vi.fn()
          const nested = vi.fn()
          const resources: AbortController[] = []
          const release = vi.fn()
          const cleanup = vi.fn(() => {
            expect(caller.active).toBe(true)
            expect(getCurrentScope()?.active).toBe(true)
            store.$subscribe(second, { flush: 'sync' })
            watch(
              signal,
              () => {
                nested()
                const resource = new AbortController()
                resources.push(resource)
                onWatcherCleanup(() => {
                  resource.abort()
                  release()
                })
              },
              { immediate: true, flush: 'sync' }
            )
          })
          try {
            const stop = caller.run(() =>
              store.$subscribe(() => onWatcherCleanup(cleanup), {
                once: true,
                immediate: true,
                flush,
              })
            )!
            expect(cleanup).toHaveBeenCalledTimes(1)
            expect(resources).toHaveLength(1)
            expect(resources[0].signal.aborted).toBe(false)
            // Stopping the consumed handle must not stop the new resources.
            stop()
            store.n++
            signal.value++
            await nextTick()
            expect(second).toHaveBeenCalledTimes(1)
            expect(nested).toHaveBeenCalledTimes(2)
            expect(resources.map((r) => r.signal.aborted)).toEqual([
              true,
              false,
            ])
            // Immediate callback effects belong to the store, which is still live.
            caller.stop()
            expect(resources[1].signal.aborted).toBe(false)
            if (owner === 'store') store.$dispose()
            else disposePinia(pinia)
            expect(resources.every((r) => r.signal.aborted)).toBe(true)
            expect(release).toHaveBeenCalledTimes(2)
            store.n++
            signal.value++
            await nextTick()
            expect(second).toHaveBeenCalledTimes(1)
            expect(nested).toHaveBeenCalledTimes(2)
            expect(cleanup).toHaveBeenCalledTimes(1)
          } finally {
            caller.stop()
            disposePinia(pinia)
          }
        }
      )

      it('preserves cleanup-created resources when the once callback throws', async () => {
        const { pinia, store } = setup()
        const failure = new Error('once callback failure')
        const signal = ref(0)
        const second = vi.fn()
        const nested = vi.fn()
        const cleanup = vi.fn(() => {
          store.$subscribe(second, { flush: 'sync' })
          watch(signal, nested, { flush: 'sync' })
        })
        try {
          expect(() =>
            store.$subscribe(
              () => {
                onWatcherCleanup(cleanup)
                throw failure
              },
              { once: true, immediate: true, flush }
            )
          ).toThrow(failure)
          expect(
            'Unhandled error during execution of watcher callback'
          ).toHaveBeenWarned()
          expect(cleanup).toHaveBeenCalledTimes(1)
          store.n++
          signal.value++
          await nextTick()
          expect(second).toHaveBeenCalledTimes(1)
          expect(nested).toHaveBeenCalledTimes(1)
          store.$dispose()
          signal.value++
          await nextTick()
          expect(nested).toHaveBeenCalledTimes(1)
        } finally {
          disposePinia(pinia)
        }
      })
    })

    it('releases cleanup-created resources when the owning app disposes Pinia', () => {
      const { pinia, store } = setup()
      const signal = ref(0)
      const nested = vi.fn()
      const resource = new AbortController()
      const app = createApp({
        setup() {
          onUnmounted(() => disposePinia(pinia))
          store.$subscribe(
            () =>
              onWatcherCleanup(() => {
                watch(signal, nested, { flush: 'sync' })
                watch(signal, () => onWatcherCleanup(() => resource.abort()), {
                  immediate: true,
                })
              }),
            { once: true, immediate: true }
          )
        },
        render: () => null,
      })
      app.use(pinia)
      app.mount(document.createElement('div'))
      try {
        signal.value++
        expect(nested).toHaveBeenCalledTimes(1)
        expect(resource.signal.aborted).toBe(false)
        app.unmount()
        expect(resource.signal.aborted).toBe(true)
        signal.value++
        expect(nested).toHaveBeenCalledTimes(1)
      } finally {
        disposePinia(pinia)
      }
    })
  }
)
