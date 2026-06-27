/**
 * Regression test for https://github.com/vuejs/pinia/issues/2861
 * $patch with an object partial does not trigger reactivity when the
 * patched state property is backed by a shallowRef.
 */
import { describe, it, expect } from 'vitest'
import { shallowRef, watchEffect, nextTick } from 'vue'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('$patch + shallowRef reactivity (#2861)', () => {
  it('triggers reactive effects when patching a shallowRef state property', async () => {
    setActivePinia(createPinia())

    const useStore = defineStore('shallowRefPatch', () => {
      const counter = shallowRef({ count: 0 })
      return { counter }
    })

    const store = useStore()

    const captured: number[] = []
    watchEffect(() => {
      captured.push(store.counter.count)
    })
    // initial effect run
    expect(captured).toEqual([0])

    store.$patch({ counter: { count: 1 } })
    await nextTick()

    // effect must re-run because the shallowRef was changed via $patch
    expect(store.counter.count).toBe(1)
    expect(captured).toEqual([0, 1])
  })

  it('state value is correctly updated after patching a shallowRef', () => {
    setActivePinia(createPinia())

    const useStore = defineStore('shallowRefPatch2', () => {
      const item = shallowRef({ name: 'foo', value: 0 })
      return { item }
    })

    const store = useStore()

    store.$patch({ item: { name: 'bar', value: 42 } })

    expect(store.item.name).toBe('bar')
    expect(store.item.value).toBe(42)
  })
})
