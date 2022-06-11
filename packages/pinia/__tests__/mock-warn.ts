export function mockWarn() {
  expect.extend({
    /**
     *
     * @param {string | RegExp} received
     */
    toHaveBeenWarned(received) {
      asserted.set(received.toString(), received)
      const passed = warn.mock.calls.some((args: any) =>
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
        const msgs = warn.mock.calls.map((args: any) => args[0]).join('\n - ')
        return {
          pass: false,
          message: () =>
            `expected "${received}" to have been warned.\n\nActual messages:\n\n - ${msgs}`,
        }
      }
    },

    /**
     *
     * @param {string | RegExp} received
     */
    toHaveBeenWarnedLast(received) {
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
        const msgs = warn.mock.calls.map((args: any) => args[0]).join('\n - ')
        return {
          pass: false,
          message: () =>
            `expected "${received}" to have been warned last.\n\nActual messages:\n\n - ${msgs}`,
        }
      }
    },

    /**
     *
     * @param {string | RegExp} received
     * @param {number} n
     */
    toHaveBeenWarnedTimes(received, n) {
      asserted.set(received.toString(), received)
      let found = 0
      warn.mock.calls.forEach((args: any) => {
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

  let warn: any
  const asserted = new Map()

  beforeEach(() => {
    asserted.clear()
    warn = vitest.spyOn(console, 'warn')
    warn.mockImplementation(() => {})
  })

  afterEach(() => {
    const assertedArray = Array.from(asserted)
    const nonAssertedWarnings = warn.mock.calls
      .map((args: any) => args[0])
      .filter((received: any) => {
        return !assertedArray.some(([key, assertedMsg]) => {
          return typeof assertedMsg === 'string'
            ? received.indexOf(assertedMsg) > -1
            : assertedMsg.test(received)
        })
      })
    warn.mockRestore()
    if (nonAssertedWarnings.length) {
      nonAssertedWarnings.forEach((warning: any) => {
        console.warn(warning)
      })
      throw new Error(`test case threw unexpected warnings.`)
    }
  })
}

declare global {
  namespace Vi {
    export interface JestAssertion<T> {
      toHaveBeenWarned(): T
      toHaveBeenWarnedLast(): T
      toHaveBeenWarnedTimes(n: number): T
    }
  }
}
