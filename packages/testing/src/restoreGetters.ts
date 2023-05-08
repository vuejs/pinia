import {
  Store,
  StateTree,
  _ExtractGettersFromSetupStore_Keys,
  defineStore,
} from 'pinia'
import { ref, computed } from 'vue-demi'

export function restoreGetter<G>(
  store: Store<string, StateTree, G, any>,
  getter: keyof G
): void
export function restoreGetter<SS>(
  store: SS,
  getter: _ExtractGettersFromSetupStore_Keys<SS>
): void
export function restoreGetter<G>(store: Store, getter: any): void {
  // @ts-expect-error: private api
  store[getter] = undefined
}

function tds() {
  const s1 = defineStore('s1', () => {
    const n = ref(0)
    const double = computed(() => n.value * 2)
    return { n, double }
  })()

  const s2 = defineStore('s2', {
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
    },
  })()

  restoreGetter(s1, 'double')
  restoreGetter(s2, 'double')
}
