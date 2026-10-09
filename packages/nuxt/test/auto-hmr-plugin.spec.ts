import { describe, expect, it } from 'vitest'
import { parseAst } from 'vite'
import { autoRegisterHMRPlugin } from '../src/auto-hmr-plugin'

function transform(code: string, id = '/app/stores/counter.js') {
  const plugin = autoRegisterHMRPlugin('/app')
  return plugin.transform.call(
    { parse: parseAst } as ThisParameterType<typeof plugin.transform>,
    code,
    id
  )
}

describe('automatic store HMR', () => {
  it.each([
    'const useCounter = defineStore("counter", {})',
    'export const useCounter = defineStore("counter", {})',
  ])('registers a store declared with %s', (code) => {
    const result = transform(code)

    expect(result?.code).toContain(code)
    expect(result?.code).toContain("import { acceptHMRUpdate } from 'pinia'")
    expect(result?.code).toContain(
      'import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))'
    )
    expect(() => parseAst(result!.code)).not.toThrow()
  })

  it('preserves explicit HMR registration', () => {
    expect(
      transform(
        'const useCounter = defineStore("counter", {}); import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))'
      )
    ).toBeUndefined()
  })

  it('does not register a destructured declaration', () => {
    expect(
      transform('const { useCounter } = defineStore("counter", {})')
    ).toBeUndefined()
  })

  it('does not change files outside the app', () => {
    expect(
      transform(
        'const useCounter = defineStore("counter", {})',
        '/other/store.js'
      )
    ).toBeUndefined()
  })
})
