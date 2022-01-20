import { App, createApp } from 'vue-demi'
import {
  Pinia,
  PiniaPlugin,
  setActivePinia,
  createPinia,
  StateTree,
} from 'pinia'

export interface TestingOptions {
  /**
   * Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
   * allowing you to only set a few properties that are required in your test.
   */
  initialState?: StateTree

  /**
   * Plugins to be installed before the testing plugin. Add any plugins used in
   * your application that will be used while testing.
   */
  plugins?: PiniaPlugin[]

  /**
   * When set to false, actions are only spied, they still get executed. When
   * set to true, actions will be replaced with spies, resulting in their code
   * not being executed. Defaults to true. NOTE: when providing `createSpy()`,
   * it will **only** make the `fn` argument `undefined`. You still have to
   * handle this in `createSpy()`.
   */
  stubActions?: boolean

  /**
   * When set to true, calls to `$patch()` won't change the state. Defaults to
   * false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
   * argument `undefined`. You still have to handle this in `createSpy()`.
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
   * with `jest.fn()` in jest projects or `vitest.fn()` in vitest projects
   */
  createSpy?: (fn?: (...args: any[]) => any) => (...args: any[]) => any
}

/**
 * Pinia instance specifically designed for testing. Extends a regular
 * {@link Pinia} instance with test specific properties.
 */
export interface TestingPinia extends Pinia {
  /** App used by Pinia */
  app: App
}

/**
 * Creates a pinia instance designed for unit tests that **requires mocking**
 * the stores. By default, **all actions are mocked** and therefore not
 * executed. This allows you to unit test your store and components separately.
 * You can change this with the `stubActions` option. If you are using jest or vitest,
 * they are replaced with basic `fn()`, otherwise, you must provide your own
 * `createSpy` option.
 *
 * @param options - options to configure the testing pinia
 * @returns a augmented pinia instance
 */
export function createTestingPinia({
  initialState = {},
  plugins = [],
  stubActions = true,
  stubPatch = false,
  fakeApp = false,
  createSpy: _createSpy,
}: TestingOptions = {}): TestingPinia {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    if (initialState[store.$id]) {
      store.$patch(initialState[store.$id])
    }
  })

  plugins.forEach((plugin) => pinia.use(plugin))

  const createSpy = _createSpy || (typeof jest !== 'undefined' && jest.fn) || (typeof vitest !== 'undefined' && vitest.fn)
  /* istanbul ignore if */
  if (!createSpy) {
    throw new Error('You must configure the `createSpy` option.')
  }

  pinia.use(({ store, options }) => {
    Object.keys(options.actions).forEach((action) => {
      store[action] = stubActions ? createSpy() : createSpy(store[action])
    })

    store.$patch = stubPatch ? createSpy() : createSpy(store.$patch)
  })

  if (fakeApp) {
    const app = createApp({})
    app.use(pinia)
  }

  pinia._testing = true

  setActivePinia(pinia)

  Object.defineProperty(pinia, 'app', {
    configurable: true,
    enumerable: true,
    get(): App {
      return this._a
    },
  })

  return pinia as TestingPinia
}
