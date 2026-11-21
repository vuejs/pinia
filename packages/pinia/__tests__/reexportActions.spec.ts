import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { createPinia, defineStore } from '../src'

describe('Re-exported actions', () => {
  function setup() {
    const pinia = createPinia()
    const original = defineStore('original', () => {
      const n = ref(0)
      function increment(amount = 1) {
        return (n.value += amount)
      }
      return { n, increment }
    })(pinia)
    const facade = defineStore('facade', () => ({
      advance: original.increment,
    }))(pinia)
    return { original, facade }
  }

  it('keeps the original action name after creating a facade', () => {
    const { original } = setup()
    const listener = vi.fn()
    original.$onAction(listener)
    expect(original.increment(2)).toBe(2)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: 'increment',
        store: original,
        args: [2],
      })
    )
  })

  it('notifies the facade subscribers with its own name and store', () => {
    const { original, facade } = setup()
    const listener = vi.fn()
    facade.$onAction(listener)
    expect(facade.advance(3)).toBe(3)
    expect(original.n).toBe(3)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: 'advance',
        store: facade,
        args: [3],
      })
    )
  })

  it('tracks ordinary actions', () => {
    const store = defineStore('ordinary', {
      state: () => ({ n: 0 }),
      actions: {
        increment(amount: number) {
          return (this.n += amount)
        },
      },
    })(createPinia())
    const listener = vi.fn()
    store.$onAction(listener)
    expect(store.increment(2)).toBe(2)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'increment', store, args: [2] })
    )
  })

  it('tracks explicit new-function delegation', () => {
    const { original } = setup()
    const delegated = defineStore('delegated', () => ({
      advance: (amount: number) => original.increment(amount),
    }))(createPinia())
    const listener = vi.fn()
    delegated.$onAction(listener)
    expect(delegated.advance(4)).toBe(4)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: 'advance',
        store: delegated,
        args: [4],
      })
    )
  })

  it.each(['increment', 'advance', ''] as const)(
    'keeps both stores and stable function identities for the alias %s',
    (name) => {
      const { original } = setup()
      const increment = original.increment
      const sourceListener = vi.fn()
      original.$onAction(sourceListener)
      const facade = defineStore('another', () => ({
        increment,
        advance: increment,
        '': increment,
      }))(createPinia())
      const advance = facade[name]
      const facadeListener = vi.fn()
      facade.$onAction(facadeListener)

      expect(increment(2)).toBe(2)
      expect(advance(3)).toBe(5)
      expect(original.increment).toBe(increment)
      expect(facade[name]).toBe(advance)
      expect(advance).not.toBe(increment)
      expect(sourceListener).toHaveBeenCalledTimes(2)
      for (const [context] of sourceListener.mock.calls) {
        expect(context).toMatchObject({ name: 'increment', store: original })
      }
      expect(facadeListener).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ name, store: facade, args: [3] })
      )
    }
  )

  it('does not rename earlier facades when exporting an action again', () => {
    const { original, facade } = setup()
    const next = defineStore('next', () => ({ step: facade.advance }))(
      createPinia()
    )
    const sourceListener = vi.fn()
    const facadeListener = vi.fn()
    const nextListener = vi.fn()
    original.$onAction(sourceListener)
    facade.$onAction(facadeListener)
    next.$onAction(nextListener)

    expect(next.step(2)).toBe(2)
    for (const [listener, name, store] of [
      [sourceListener, 'increment', original],
      [facadeListener, 'advance', facade],
      [nextListener, 'step', next],
    ] as const) {
      expect(listener).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ name, store, args: [2] })
      )
    }
  })

  it('retains the source this across Pinia instances with identical store ids', () => {
    const source = defineStore('shared', {
      state: () => ({ n: 0 }),
      actions: {
        increment(amount: number) {
          return (this.n += amount)
        },
      },
    })(createPinia())
    const facade = defineStore('shared', () => ({
      n: ref(100),
      advance: source.increment,
    }))(createPinia())
    const sourceListener = vi.fn()
    const facadeListener = vi.fn()
    source.$onAction(sourceListener)
    facade.$onAction(facadeListener)
    const { advance } = facade

    expect(advance.call(null, 2)).toBe(2)
    expect(facade.advance(3)).toBe(5)
    expect(source.n).toBe(5)
    expect(facade.n).toBe(100)
    expect(sourceListener).toHaveBeenCalledTimes(2)
    expect(facadeListener).toHaveBeenCalledTimes(2)
    expect(sourceListener.mock.calls[0][0].store).toBe(source)
    expect(facadeListener.mock.calls[0][0].store).toBe(facade)
  })

  it('names explicit helper aliases without double notifications', () => {
    const store = defineStore('helpers', ({ action }) => {
      const first = action((amount: number) => amount * 2)
      const same = action(first)
      const second = action(first, 'second')
      return { first, alias: same, second, '': first }
    })(createPinia())
    const listener = vi.fn()
    store.$onAction(listener)

    expect(store.first(1)).toBe(2)
    expect(store.alias(2)).toBe(4)
    expect(store.second(3)).toBe(6)
    expect(store[''](4)).toBe(8)
    expect(listener.mock.calls.map(([context]) => context.name)).toEqual([
      'first',
      'alias',
      'second',
      '',
    ])
  })

  it('does not wrap same-owner helpers again when they are returned', () => {
    const store = defineStore('nested', ({ action }) => {
      const inner = action(() => 2)
      const outer = action(() => inner() * 3)
      return { inner, outer }
    })(createPinia())
    const listener = vi.fn()
    store.$onAction(listener)
    expect(store.outer()).toBe(6)
    expect(listener.mock.calls.map(([context]) => context.name)).toEqual([
      'outer',
      'inner',
    ])
  })

  it('accepts a source action through an explicit facade helper', () => {
    const { original } = setup()
    const facade = defineStore('explicit', ({ action }) => ({
      advance: action(original.increment),
    }))(createPinia())
    const listener = vi.fn()
    facade.$onAction(listener)
    expect(facade.advance(2)).toBe(2)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'advance', store: facade })
    )
  })

  it('keeps ordinary internal calls unwrapped', () => {
    const source = defineStore('internal', () => {
      function inner(value: number) {
        return value * 2
      }
      function outer(value: number) {
        return inner(unexported(value)) + 1
      }
      const unexported = (value: number) => value + 1
      return { inner, outer }
    })(createPinia())
    const facade = defineStore('internal-facade', () => ({
      advance: source.outer,
    }))(createPinia())
    const listener = vi.fn()
    source.$onAction(listener)
    expect(facade.advance(2)).toBe(7)
    expect(listener).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ name: 'outer', store: source })
    )
  })

  it.each(['sync', 'promise'] as const)(
    'preserves %s returns and before/after callbacks on both stores',
    async (mode) => {
      const result = { value: 42 }
      const source = defineStore('returns', () => ({
        run: (value: number) => {
          expect(value).toBe(42)
          return mode === 'promise' ? Promise.resolve(result) : result
        },
      }))(createPinia())
      const facade = defineStore('return-facade', () => ({
        execute: source.run,
      }))(createPinia())
      const events: string[] = []
      for (const store of [source, facade]) {
        store.$onAction(({ name, store: owner, args, after, onError }) => {
          expect(owner).toBe(store)
          expect(args).toEqual([42])
          events.push(name)
          after((value) => {
            expect(value).toBe(result)
            events.push('after ' + name)
          })
          onError(() => events.push('unexpected error'))
        })
      }
      const value = facade.execute(42)
      if (mode === 'promise') expect(value).toBeInstanceOf(Promise)
      else expect(value).toBe(result)
      expect(await value).toBe(result)
      expect(events).toEqual(['execute', 'run', 'after run', 'after execute'])
    }
  )

  it.each(['throw', 'reject'] as const)(
    'preserves the original error and both onError callbacks on %s',
    async (mode) => {
      const error = new Error('expected failure')
      const source = defineStore('errors', () => ({
        run: () => {
          if (mode === 'reject') return Promise.reject(error)
          throw error
        },
      }))(createPinia())
      const facade = defineStore('error-facade', () => ({
        execute: source.run,
      }))(createPinia())
      const events: string[] = []
      for (const store of [source, facade]) {
        store.$onAction(({ name, after, onError }) => {
          events.push(name)
          after(() => events.push('unexpected after'))
          onError((value) => {
            expect(value).toBe(error)
            events.push('error ' + name)
          })
        })
      }
      if (mode === 'reject') await expect(facade.execute()).rejects.toBe(error)
      else {
        let caught: unknown
        try {
          facade.execute()
        } catch (value) {
          caught = value
        }
        expect(caught).toBe(error)
      }
      expect(events).toEqual(['execute', 'run', 'error run', 'error execute'])
    }
  )
})
