import { ref, toRaw, watch } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getRandomJoke, Joke } from '../api/jokes'
import useSWRV from 'swrv'

export const useJokesSetup = defineStore('jokes-swrv-setup', () => {
  // const current = ref<null | Joke>(null)
  const history = ref<Joke[]>([])

  const { data, error, mutate } = useSWRV('jokes', getRandomJoke)

  watch(data, (joke) => {
    console.log('changed from within the store', joke)
    if (joke) {
      history.value.push(toRaw(joke))
    }
  })

  return { current: data, error, history, fetchJoke: mutate }
})

if (import.meta.hot) {
  // import.meta.hot.accept(acceptHMRUpdate(useJokes, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useJokesSetup, import.meta.hot))
}
