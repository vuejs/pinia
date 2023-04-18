import { beforeEach, describe, it, expect } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'
import { createApp, h, inject, provide } from 'vue'
import { mount } from '@vue/test-utils'
import { mockWarn } from './vitest-mock-warn'

describe('app context injections', () => {
  mockWarn()

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', () => {
    const injected = inject<string>('injected')
    return { injected }
  })

  it('injects app provides', () => {
    // use it before mounting to ensure out of app context
    const wrapper = mount(
      {
        setup() {
          const store = useStore()
          return { store }
        },
        template: `<p>{{ store.injected }}</p>`,
      },
      {
        global: {
          provide: {
            injected: 'app injected',
          },
        },
      }
    )

    expect(wrapper.text()).toBe('app injected')

    const store = useStore()
    expect(store.injected).toBe('app injected')
  })

  it('can be used in older versions', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useStore(pinia)
    expect('inject() can only be used').toHaveBeenWarned()
  })

  it('can use getCurrentInstance', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const app = createApp({
      setup() {
        provide('injected', 'should not appear')
        const store = useStore()
        return () => h('p', `${store.injected}`)
      },
    })
    app.use(pinia)
    app.provide('injected', 'test 2')

    expect(app.mount(document.createElement('div')).$el.innerText).toBe(
      'test 2'
    )
  })
})
