import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { toRaw } from 'vue'
import { createPinia, defineStore, disposePinia, Pinia } from '../src'
import {
  actionGlobalOpenStateFile,
  actionGlobalPasteState,
} from '../src/devtools/actions'

describe.each(['clipboard', 'file'] as const)(
  'DevTools %s state import',
  (source) => {
    let pinia: Pinia

    beforeEach(() => {
      pinia = createPinia()
      vi.spyOn(console, 'debug').mockImplementation(() => {})
    })

    afterEach(() => {
      disposePinia(pinia)
      vi.restoreAllMocks()
    })

    async function importState(text: string) {
      if (source === 'clipboard') {
        vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(text)
        await actionGlobalPasteState(pinia)
      } else {
        vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(
          function (this: HTMLInputElement) {
            Object.defineProperty(this, 'files', {
              configurable: true,
              value: {
                item: () => ({ name: 'state.json', text: async () => text }),
              },
            })
            this.dispatchEvent(new Event('change'))
          }
        )
        await actionGlobalOpenStateFile(pinia)
      }
    }

    it('does not modify Object.prototype through an inherited store ID', async () => {
      const prototype = Object.getPrototypeOf(toRaw(pinia.state.value))
      try {
        await importState(
          '{"__proto__":{"piniaImportPolluted":true},"counter":{"n":2}}'
        )

        expect(Object.hasOwn(Object.prototype, 'piniaImportPolluted')).toBe(
          false
        )
        expect(Object.getPrototypeOf(toRaw(pinia.state.value))).toBe(prototype)
        expect(pinia.state.value.counter).toEqual({ n: 2 })
      } finally {
        delete (Object.prototype as Record<string, unknown>).piniaImportPolluted
      }
    })

    it('does not replace an existing store state prototype', async () => {
      const store = defineStore('counter', { state: () => ({ n: 0 }) })(pinia)
      const prototype = Object.getPrototypeOf(toRaw(store.$state))

      await importState(
        '{"counter":{"__proto__":{"piniaImportPolluted":true},"n":2}}'
      )

      expect(Object.getPrototypeOf(toRaw(store.$state))).toBe(prototype)
      expect('piniaImportPolluted' in store.$state).toBe(false)
      expect(store.n).toBe(2)
    })

    it('creates own state for a store ID inherited from Object.prototype', async () => {
      try {
        await importState('{"constructor":{"piniaImportPolluted":true}}')

        expect(Object.hasOwn(Object, 'piniaImportPolluted')).toBe(false)
        expect(Object.hasOwn(pinia.state.value, 'constructor')).toBe(true)
        expect(pinia.state.value.constructor).toEqual({
          piniaImportPolluted: true,
        })
      } finally {
        delete (Object as unknown as Record<string, unknown>)
          .piniaImportPolluted
      }
    })

    it('patches existing state without replacing it', async () => {
      const store = defineStore('counter', {
        state: () => ({ n: 0, retained: true, constructor: 'initial' }),
      })(pinia)
      const state = store.$state

      await importState('{"counter":{"n":2,"constructor":"imported"}}')

      expect(store.$state).toBe(state)
      expect(store.n).toBe(2)
      expect(store.retained).toBe(true)
      expect(store.constructor).toBe('imported')
    })

    it('preserves explicitly declared __proto__ data properties', async () => {
      pinia.state.value = JSON.parse(
        '{"__proto__":{"n":0},"counter":{"__proto__":"initial"}}'
      )
      const rootPrototype = Object.getPrototypeOf(toRaw(pinia.state.value))
      const statePrototype = Object.getPrototypeOf(
        toRaw(pinia.state.value.counter)
      )

      await importState(
        '{"__proto__":{"n":2},"counter":{"__proto__":"imported"}}'
      )

      expect(pinia.state.value.__proto__).toEqual({ n: 2 })
      expect(pinia.state.value.counter.__proto__).toBe('imported')
      expect(Object.getPrototypeOf(toRaw(pinia.state.value))).toBe(
        rootPrototype
      )
      expect(Object.getPrototypeOf(toRaw(pinia.state.value.counter))).toBe(
        statePrototype
      )
    })
  }
)
