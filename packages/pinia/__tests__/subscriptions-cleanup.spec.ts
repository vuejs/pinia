import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createApp,
  effectScope,
  nextTick,
  onWatcherCleanup,
  ref,
  watch,
} from 'vue'
import { createPinia, defineStore, disposePinia, setActivePinia } from '../src'
import { mockWarn } from './vitest-mock-warn'

mockWarn()

describe.each(['options', 'setup'] as const)(
  '%s subscription cleanup',
  (kind) => {
    let pinia: ReturnType<typeof createPinia>
    beforeEach(() => {
      pinia = createPinia()
      setActivePinia(pinia)
    })
    afterEach(() => disposePinia(pinia))

    function useStore() {
      return kind === 'options'
        ? defineStore('cleanup', { state: () => ({ n: 0 }) })()
        : defineStore('cleanup', () => ({ n: ref(0) }))()
    }

    describe.each(['sync', 'pre', 'post'] as const)('flush: %s', (flush) => {
      it.each([false, true])(
        'cleans up a consumed watcher exactly once (immediate: %s)',
        async (immediate) => {
          const store = useStore()
          const controller = new AbortController()
          const cleanup = vi.fn(() => controller.abort())
          const stop = store.$subscribe(() => onWatcherCleanup(cleanup), {
            once: true,
            immediate,
            flush,
          })
          if (!immediate) {
            store.n++
            await nextTick()
          }
          expect(controller.signal.aborted).toBe(true)
          expect(cleanup).toHaveBeenCalledTimes(1)
          stop()
          stop()
          store.$dispose()
          disposePinia(pinia)
          expect(cleanup).toHaveBeenCalledTimes(1)
        }
      )

      it('cleans up an immediate callback that throws the original error', () => {
        const store = useStore()
        const failure = new Error('subscription failure')
        const cleanup = vi.fn()
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
        store.$dispose()
        expect(cleanup).toHaveBeenCalledTimes(1)
      })

      it.each([false, true])(
        'cleans up when the app handles the callback error (immediate: %s)',
        async (immediate) => {
          const store = useStore()
          const failure = new Error('handled subscription failure')
          const cleanup = vi.fn()
          const app = createApp({
            setup() {
              store.$subscribe(
                () => {
                  onWatcherCleanup(cleanup)
                  throw failure
                },
                { once: true, immediate, flush }
              )
            },
            render: () => null,
          })
          const errorHandler = (app.config.errorHandler = vi.fn())
          app.use(pinia)
          app.mount(document.createElement('div'))
          if (!immediate) {
            store.n++
            await nextTick()
          }
          expect(errorHandler).toHaveBeenCalledExactlyOnceWith(
            failure,
            expect.anything(),
            'watcher callback'
          )
          expect(cleanup).toHaveBeenCalledTimes(1)
          app.unmount()
          expect(cleanup).toHaveBeenCalledTimes(1)
        }
      )

      it('restores the outer watcher cleanup context', () => {
        const store = useStore()
        const signal = ref(0)
        const innerCleanup = vi.fn()
        const outerCleanup = vi.fn()
        const stop = watch(
          signal,
          () => {
            store.$subscribe(() => onWatcherCleanup(innerCleanup), {
              once: true,
              immediate: true,
              flush,
            })
            onWatcherCleanup(outerCleanup)
          },
          { immediate: true }
        )
        expect(innerCleanup).toHaveBeenCalledTimes(1)
        expect(outerCleanup).not.toHaveBeenCalled()
        store.$dispose()
        expect(outerCleanup).not.toHaveBeenCalled()
        stop()
        expect(innerCleanup).toHaveBeenCalledTimes(1)
        expect(outerCleanup).toHaveBeenCalledTimes(1)
      })

      it('preserves a nested watcher created by the immediate callback', async () => {
        const store = useStore()
        const signal = ref(0)
        const onceCleanup = vi.fn()
        const nestedCleanup = vi.fn()
        store.$subscribe(
          () => {
            onWatcherCleanup(onceCleanup)
            watch(signal, () => onWatcherCleanup(nestedCleanup), {
              immediate: true,
              flush: 'sync',
            })
          },
          { once: true, immediate: true, flush }
        )
        expect(onceCleanup).toHaveBeenCalledTimes(1)
        expect(nestedCleanup).not.toHaveBeenCalled()
        signal.value++
        expect(nestedCleanup).toHaveBeenCalledTimes(1)
        store.$dispose()
        expect(onceCleanup).toHaveBeenCalledTimes(1)
        expect(nestedCleanup).toHaveBeenCalledTimes(2)
        signal.value++
        await nextTick()
        expect(nestedCleanup).toHaveBeenCalledTimes(2)
      })

      it.each(['store', 'pinia', 'caller'] as const)(
        'cleans up once when the callback disposes its %s',
        async (owner) => {
          const store = useStore()
          const caller = effectScope()
          const cleanup = vi.fn()
          caller.run(() =>
            store.$subscribe(
              () => {
                onWatcherCleanup(cleanup)
                if (owner === 'store') store.$dispose()
                else if (owner === 'pinia') disposePinia(pinia)
                else caller.stop()
              },
              { once: true, immediate: true, flush }
            )
          )
          expect(cleanup).toHaveBeenCalledTimes(1)
          caller.stop()
          await nextTick()
          expect(cleanup).toHaveBeenCalledTimes(1)
        }
      )
    })

    it('cleans up a synchronous direct callback that throws', () => {
      const store = useStore()
      const failure = new Error('direct callback failure')
      const cleanup = vi.fn()
      store.$subscribe(
        () => {
          onWatcherCleanup(cleanup)
          throw failure
        },
        { once: true, flush: 'sync' }
      )
      expect(() => store.n++).toThrow(failure)
      expect(
        'Unhandled error during execution of watcher callback'
      ).toHaveBeenWarned()
      expect(cleanup).toHaveBeenCalledTimes(1)
      expect(() => store.n++).not.toThrow()
      store.$dispose()
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  }
)
