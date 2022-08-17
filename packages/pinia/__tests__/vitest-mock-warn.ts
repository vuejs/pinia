// https://github.com/posva/jest-mock-warn/blob/master/src/index.js

import { afterEach, beforeEach, expect, SpyInstance, vi } from 'vitest'

export function mockWarn() {
  expect.extend({
    toHaveBeenWarned(received: string | RegExp) {
      asserted.set(received.toString(), received)
      const passed = warn.mock.calls.some((args) =>
        typeof received === 'string'
          ? args[0].indexOf(received) > -1
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
          ? lastCall.indexOf(received) > -1
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
            ? args[0].indexOf(received) > -1
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

  let warn: SpyInstance
  const asserted = new Map<string, string | RegExp>()

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
        return !assertedArray.some(([key, assertedMsg]) => {
          return typeof assertedMsg === 'string'
            ? received.indexOf(assertedMsg) > -1
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

declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveBeenWarned(): void
      toHaveBeenWarnedLast(): void
      toHaveBeenWarnedTimes(n: number): void
    }
  }
}
