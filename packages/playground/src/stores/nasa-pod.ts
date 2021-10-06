import { ref, watch } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getNASAPOD } from '../api/nasa'
import { useCachedRequest } from '../composables/useCachedRequest'

export const useNasaPOD = defineStore('nasa-pod', () => {
  // can't go past today
  const today = new Date().toISOString().slice(0, 10)

  const currentDate = ref(today)

  // const image = ref<NASAPOD | undefined>()
  // const error = ref<Error | undefined>()
  // const isLoading = ref(false)

  watch(currentDate, fetchPOD)

  const {
    data: image,
    error,
    isLoading,
    isReady,
  } = useCachedRequest(currentDate, getNASAPOD)

  function fetchPOD(date: string) {
    error.value = undefined
    isLoading.value = true

    return getNASAPOD(date)
      .then((imageData) => {
        image.value = imageData
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  function incrementDay(date: string) {
    const from = new Date(date).getTime()

    currentDate.value = new Date(from + 1000 * 60 * 60 * 24)
      .toISOString()
      .slice(0, 10)
  }

  function decrementDay(date: string) {
    const from = new Date(date).getTime()

    currentDate.value = new Date(from - 1000 * 60 * 60 * 24)
      .toISOString()
      .slice(0, 10)
  }

  return {
    image,
    currentDate,
    incrementDay,
    decrementDay,
    error,
    isLoading,
    isReady,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNasaPOD, import.meta.hot))
}
