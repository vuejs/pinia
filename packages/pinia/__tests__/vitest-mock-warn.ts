// https://github.com/posva/jest-mock-warn/blob/master/src/index.js

import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, expect, vi } from 'vitest'

interface CustomMatchers<R = unknown> {
  toHaveBeenWarned: () => R
  toHaveBeenWarnedLast: () => R
  toHaveBeenWarnedTimes: (n: number) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export function mockWarn() {
  let warn: MockInstance<(typeof console)['log']>
  const asserted = new Map<string, string | RegExp>()

  expect.extend({
    toHaveBeenWarned(received: string | RegExp) {
      asserted.set(received.toString(), received)
      const passed = warn.mock.calls.some((args) =>
        typeof received === 'string'
          ? args[0].includes(received)
          : received.test(args[0])
      )
      if (passed) {
        return {
          pass: true,
          message: () => `expected "${received}" not to have been warned.`,
        }
      } else {
        const msgs = warn.mock.calls.map((args) => args[0]).join('\n - ')
        return {
          pass: false,
          message: () =>
            `expected "${received}" to have been warned.\n\nActual messages:\n\n - ${msgs}`,
        }
      }
    },

    toHaveBeenWarnedLast(received: string | RegExp) {
      asserted.set(received.toString(), received)
      const lastCall = warn.mock.calls[warn.mock.calls.length - 1][0]
      const passed =
        typeof received === 'string'
          ? lastCall.includes(received)
          : received.test(lastCall)
      if (passed) {
        return {
          pass: true,
          message: () => `expected "${received}" not to have been warned last.`,
        }
      } else {
        const msgs = warn.mock.calls.map((args) => args[0]).join('\n - ')
        return {
          pass: false,
          message: () =>
            `expected "${received}" to have been warned last.\n\nActual messages:\n\n - ${msgs}`,
        }
      }
    },

    toHaveBeenWarnedTimes(received: string | RegExp, n: number) {
      asserted.set(received.toString(), received)
      let found = 0
      warn.mock.calls.forEach((args) => {
        const isFound =
          typeof received === 'string'
            ? args[0].includes(received)
            : received.test(args[0])
        if (isFound) {
          found++
        }
      })

      if (found === n) {
        return {
          pass: true,
          message: () =>
            `expected "${received}" to have been warned ${n} times.`,
        }
      } else {
        return {
          pass: false,
          message: () =>
            `expected "${received}" to have been warned ${n} times but got ${found}.`,
        }
      }
    },
  })

  beforeEach(() => {
    asserted.clear()
    warn = vi.spyOn(console, 'warn')
    warn.mockImplementation(() => {})
  })

  afterEach(() => {
    const assertedArray = Array.from(asserted)
    const nonAssertedWarnings = warn.mock.calls
      .map((args) => args[0])
      .filter((received) => {
        return !assertedArray.some(([_key, assertedMsg]) => {
          return typeof assertedMsg === 'string'
            ? received.includes(assertedMsg)
            : assertedMsg.test(received)
        })
      })
    warn.mockRestore()
    if (nonAssertedWarnings.length) {
      nonAssertedWarnings.forEach((warning) => {
        console.warn(warning)
      })
      throw new Error(`test case threw unexpected warnings.`)
    }
  })
}

interface CustomMatchers<R = unknown> {
  toHaveBeenWarned: () => R
  toHaveBeenWarnedLast: () => R
  toHaveBeenWarnedTimes: (n: number) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
