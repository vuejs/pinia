import { App, createApp } from 'vue'
import { createPinia } from './createPinia'
import { Pinia, PiniaStorePlugin, setActivePinia } from './rootStore'

export interface TestingOptions {
  /**
   * Plugins to be installed before the testing plugin. Add any plugins used in
   * your application that will be used while testing.
   */
  plugins?: PiniaStorePlugin[]

  /**
   * When set to false, actions are only spied, they still get executed. When
   * set to true, actions will be replaced with spies, resulting in their code
   * not being executed. Defaults to true.
   */
  stubActions?: boolean

  /**
   * When set to true, calls to `$patch()` won't change the state. Defaults to
   * false.
   */
  stubPatch?: boolean

  /**
   * Creates an empty App and calls `app.use(pinia)` with the created testing
   * pinia. This is allows you to use plugins while unit testing stores as
   * plugins **will wait for pinia to be installed in order to be executed**.
   * Defaults to false.
   */
  fakeApp?: boolean

  /**
   * Function used to create a spy for actions and `$patch()`. Pre-configured
   * with `jest.fn()` in jest projects.
   */
  createSpy?: (fn?: (...args: any[]) => any) => (...args: any[]) => any
}

export interface TestingPinia extends Pinia {
  /**
   * Clears the cache of spies used for actions.
   */
  resetSpyCache(): void

  /** App used by Pinia */
  app: App
}

/**
 * Creates a pinia instance designed for unit tests that **requires mocking**
 * the stores. By default, **all actions are mocked** and therefore not
 * executed. This allows you to unit test your store and components separately.
 * You can change this with the `stubActions` option. If you are using jest,
 * they are replaced with `jest.fn()`, otherwise, you must provide your own
 * `createSpy` option.
 *
 * @param options - options to configure the testing pinia
 * @returns a augmented pinia instance
 */
export function createTestingPinia({
  plugins = [],
  stubActions = true,
  stubPatch = false,
  fakeApp = false,
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
        (stubActions
          ? createSpy!()
          : // @ts-expect-error:
            createSpy!(store[action]))
      // @ts-expect-error:
      store[action] = actionsCache[action]
    })

    store.$patch = stubPatch ? createSpy!() : createSpy!(store.$patch)
  })

  if (fakeApp) {
    const app = createApp({})
    app.use(pinia)
  }

  pinia._testing = true

  setActivePinia(pinia)

  return Object.assign(
    {
      resetSpyCache() {
        spiedActions.clear()
      },
      get app() {
        return (this as TestingPinia)._a
      },
    },
    pinia
  )
}
