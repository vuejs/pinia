import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, defineStore } from '../src'
import { devtoolsPlugin, registerPiniaDevtools } from '../src/devtools'
import {
  connectDevtoolsClient,
  connectDevtoolsClientPerRegistration,
  createFakeDevtoolsApi,
  getDevtoolsRegistrations,
  resetDevtoolsRegistrations,
} from './devtools-api-stub'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  actions: {
    increment() {
      this.n++
    },
  },
})

const useUserStore = defineStore('user', {
  state: () => ({ name: 'Eduardo' }),
  actions: {
    rename(name: string) {
      this.name = name
    },
  },
})

function setupApp() {
  const pinia = createPinia()
  pinia.use(devtoolsPlugin)
  const wrapper = mount(
    { template: '<div />' },
    { global: { plugins: [pinia] } }
  )
  const app = (wrapper.vm as any).$.appContext.app
  return { pinia, app }
}

describe('devtools registration', () => {
  beforeEach(() => {
    resetDevtoolsRegistrations()
  })

  it('registers the plugin once per application, with settings', () => {
    const { app, pinia } = setupApp()

    // pinia registers its devtools plugin at install time, before any store
    registerPiniaDevtools(app, pinia)
    expect(getDevtoolsRegistrations()).toHaveLength(1)

    const { descriptor } = getDevtoolsRegistrations()[0]
    expect(descriptor.id).toBe('dev.esm.pinia')
    expect(descriptor.settings.logStoreChanges).toEqual({
      label: 'Notify about new/deleted stores',
      type: 'boolean',
      defaultValue: true,
    })

    // registering again (e.g. HMR re-install) reuses the same registration
    registerPiniaDevtools(app, pinia)
    expect(getDevtoolsRegistrations()).toHaveLength(1)
  })

  it('does not register the plugin again when stores are created before the client connects', async () => {
    const { app, pinia } = setupApp()

    useCounterStore(pinia)
    useUserStore(pinia)
    await flushPromises()

    // each store used to add its own setupDevtoolsPlugin registration
    expect(getDevtoolsRegistrations()).toHaveLength(1)
    expect(getDevtoolsRegistrations()[0].descriptor.app).toBe(app)
  })

  it('attaches store hooks through the shared API once the client connects', async () => {
    const { pinia } = setupApp()

    const store = useCounterStore(pinia)
    await flushPromises()

    const api = createFakeDevtoolsApi()
    connectDevtoolsClient(api)
    await flushPromises()

    expect(api.addTimelineLayer).toHaveBeenCalled()
    expect(api.addInspector).toHaveBeenCalled()

    store.increment()
    expect(api.addTimelineEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        layerId: 'pinia:mutations',
        event: expect.objectContaining({ title: '🛫 increment' }),
      })
    )
    expect(api.sendInspectorState).toHaveBeenCalledWith('pinia')
  })

  it('registers one plugin per Pinia instance, even on the same application', async () => {
    const { app, pinia } = setupApp()

    // install-time registrations (the compile-time devtools flag is off in
    // tests, so registerPiniaDevtools is called directly, as install would)
    registerPiniaDevtools(app, pinia)

    // a second Pinia instance installed on the same application
    const pinia2 = createPinia()
    pinia2.use(devtoolsPlugin)
    app.use(pinia2)
    registerPiniaDevtools(app, pinia2)
    await flushPromises()

    expect(getDevtoolsRegistrations()).toHaveLength(2)

    const store1 = useCounterStore(pinia)
    const store2 = useCounterStore(pinia2)
    await flushPromises()

    // each registration resolves with its own API and receives only its own
    // instance's store events
    const apis = connectDevtoolsClientPerRegistration(createFakeDevtoolsApi)
    await flushPromises()
    expect(apis).toHaveLength(2)

    store1.increment()
    expect(apis[0].addTimelineEvent).toHaveBeenCalled()
    expect(apis[1].addTimelineEvent).not.toHaveBeenCalled()

    store2.increment()
    expect(apis[1].addTimelineEvent).toHaveBeenCalled()
  })
})
