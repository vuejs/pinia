import { ref, unref, watch } from 'vue'
import { acceptHMRUpdate, defineStore } from '../../../src'
import { getRandomJoke, Joke } from '../views/api/jokes'
import useSWRV from 'swrv'

export const useJokesSetup = defineStore('jokes-swrv-setup', () => {
  // const current = ref<null | Joke>(null)
  const history = ref<Joke[]>([])

  const { data, error, isValidating, mutate, revalidate } = useSWRV(
    'jokes',
    getRandomJoke
  )

  watch(data, (joke) => {
    if (joke) {
      history.value.push(joke)
    }
  })

  return { current: data, history, fetchJoke: revalidate }
})

if (import.meta.hot) {
  // import.meta.hot.accept(acceptHMRUpdate(useJokes, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useJokesSetup, import.meta.hot))
}
