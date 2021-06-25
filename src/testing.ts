import { createPinia } from './createPinia'
import { Pinia, PiniaStorePlugin, setActivePinia } from './rootStore'

export interface TestingOptions {
  /**
   * Plugins to be installed before the testing plugin.
   */
  plugins?: PiniaStorePlugin[]

  /**
   * When set to false, actions are only spied, they still get executed. When
   * set to true, actions will be replaced with spies, resulting in their code
   * not being executed. Defaults to true.
   */
  bypassActions?: boolean

  createSpy?: (fn?: (...args: any[]) => any) => (...args: any[]) => any
}

export interface TestingPinia extends Pinia {
  /**
   * Clears the cache of spies used for actions.
   */
  resetSpyCache(): void
}

/**
 * Creates a pinia instance designed for unit tests that **requires mocking**
 * the stores. By default, **all actions are mocked** and therefore not
 * executed. This allows you to unit test your store and components separately.
 * You can change this with the `bypassActions` option. If you are using jest,
 * they are replaced with `jest.fn()`, otherwise, you must provide your own
 * `createSpy` option.
 *
 * @param options - options to configure the testing pinia
 * @returns a augmented pinia instance
 */
export function createTestingPinia({
  plugins = [],
  bypassActions = true,
  createSpy,
}: TestingOptions = {}): TestingPinia {
  const pinia = createPinia()

  plugins.forEach((plugin) => pinia.use(plugin))

  // @ts-ignore
  createSpy = createSpy || (typeof jest !== undefined && jest.fn)
  if (!createSpy) {
    throw new Error('You must configure the `createSpy` option.')
  }

  // Cache of all actions to share them across all stores
  const spiedActions = new Map<string, Record<string, any>>()

  pinia.use(({ store, options }) => {
    if (!spiedActions.has(options.id)) {
      spiedActions.set(options.id, {})
    }
    const actionsCache = spiedActions.get(options.id)!

    Object.keys(options.actions || {}).forEach((action) => {
      actionsCache[action] =
        actionsCache[action] ||
        (bypassActions
          ? createSpy!()
          : // @ts-expect-error:
            createSpy!(store[action]))
      // @ts-expect-error:
      store[action] = actionsCache[action]
    })
  })

  setActivePinia(pinia)

  return Object.assign(
    {
      resetSpyCache() {
        spiedActions.clear()
      },
    },
    pinia
  )
}
