import { vi } from 'vitest'

/**
 * Test stub for `@vue/devtools-api`, aliased in the root vitest.config.ts.
 *
 * The real module queues plugins until a devtools client connects, which never
 * happens in tests, making the registration lifecycle unobservable. No other
 * test executes devtools code (`__USE_DEVTOOLS__` is `false` in tests), so
 * replacing the module here is safe. `pinia` only imports
 * `setupDevtoolsPlugin` from it.
 */

export interface DevtoolsApiRegistration {
  descriptor: any
  setupFn: (api: any) => void
}

let registrations: DevtoolsApiRegistration[] = []

export function setupDevtoolsPlugin(
  descriptor: any,
  setupFn: (api: any) => void
): void {
  registrations.push({ descriptor, setupFn })
}

export function getDevtoolsRegistrations(): DevtoolsApiRegistration[] {
  return registrations
}

export function resetDevtoolsRegistrations(): void {
  registrations = []
}

/**
 * Simulates the devtools client connecting: runs every queued setup callback
 * with the given (fake) API.
 */
export function connectDevtoolsClient(api: any): void {
  registrations.forEach((r) => r.setupFn(api))
}

/**
 * Same as `connectDevtoolsClient`, but gives each registration its own API
 * (built by `makeApi`), so tests can assert which registration a store's
 * events flow through.
 */
export function connectDevtoolsClientPerRegistration(
  makeApi: () => any
): any[] {
  return registrations.map((r) => {
    const api = makeApi()
    r.setupFn(api)
    return api
  })
}

export function createFakeDevtoolsApi() {
  return {
    now: () => 123,
    addTimelineLayer: vi.fn(),
    addInspector: vi.fn(),
    addTimelineEvent: vi.fn(),
    sendInspectorTree: vi.fn(),
    sendInspectorState: vi.fn(),
    notifyComponentUpdate: vi.fn(),
    getSettings: vi.fn(() => ({ logStoreChanges: true })),
    on: {
      inspectComponent: vi.fn(),
      getInspectorTree: vi.fn(),
      getInspectorState: vi.fn(),
      editInspectorState: vi.fn(),
      editComponentState: vi.fn(),
    },
  }
}
