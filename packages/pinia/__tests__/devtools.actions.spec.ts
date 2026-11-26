import { afterEach, expect, it, vi } from 'vitest'
import { createPinia, defineStore } from '../src'
import { actionGlobalPasteState } from '../src/devtools/actions'

afterEach(() => {
  vi.restoreAllMocks()
  delete (Object.prototype as any).polluted
  delete (Object as any).polluted
})

it('imports state without prototype pollution', async () => {
  vi.spyOn(console, 'debug').mockImplementation(() => {})
  const pinia = createPinia()
  const store = defineStore('main', { state: () => ({ n: 0 }) })(pinia)
  vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(
    '{"__proto__":{"polluted":1},"constructor":{"polluted":1},"main":{"__proto__":{"polluted":1},"n":1}}'
  )

  await actionGlobalPasteState(pinia)

  expect(({} as any).polluted).toBeUndefined()
  expect((Object as any).polluted).toBeUndefined()
  expect((store.$state as any).polluted).toBeUndefined()
  expect(store.n).toBe(1)
  expect(pinia.state.value.constructor).toEqual({ polluted: 1 })
})

it.each(['null', '42', '"ab"', '[{}]'])(
  'rejects a non-object root: %s',
  async (json) => {
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const pinia = createPinia()
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue(json)

    await actionGlobalPasteState(pinia)

    expect(pinia.state.value).toEqual({})
    expect(error).toHaveBeenCalled()
  }
)
