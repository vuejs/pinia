import { defineStore } from 'pinia'
import { Ref, ref, ComputedRef, computed } from 'vue'

export interface ObjectyState {
  didChangeIllegally: boolean
  didChangeLegally: boolean
}

export const useObjectStore = defineStore('testStore', () => {
  const testStatePrivate: Ref<ObjectyState> = ref({
    didChangeIllegally: false,
    didChangeLegally: false,
  })

  const testStateGetter: ComputedRef<ObjectyState> = computed(() => {
    return { ...testStatePrivate.value }
  })

  function modifyLegalValue(newValue: boolean) {
    testStatePrivate.value.didChangeLegally = newValue
  }

  return { testStateGetter, modifyLegalValue }
})
