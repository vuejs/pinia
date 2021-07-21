import useSWRV from 'swrv'
import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from '../../../src'
import { getNASAPOD } from '../api/nasa'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

export const useNasaStore = defineStore('nasa-pod-swrv', () => {
  // can't go past today
  const today = new Date().toISOString().slice(0, 10)

  // const currentDate = computed<string>({
  //   get: () => image.value?.date || today,
  //   set: (date) => {
  //     // TODO: router push
  //   }
  // })

  const currentDate = ref(today)

  const {
    data: image,
    error,
    isValidating,
  } = useSWRV(
    () => `nasa-pod-${currentDate.value}`,
    () => getNASAPOD(currentDate.value),
    {
      refreshInterval: 0,
      ttl: 0,
      revalidateOnFocus: false,
      cache: new LocalStorageCache(),
    }
  )

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

  return { image, currentDate, incrementDay, decrementDay, error, isValidating }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNasaStore, import.meta.hot))
}
