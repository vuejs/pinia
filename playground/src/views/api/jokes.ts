import { mande } from 'mande'

export const jokes = mande('https://official-joke-api.appspot.com', {
  headers: {
    'Content-Type': null,
  },
})

export interface Joke {
  id: number
  type: string
  setup: string
  punchline: string
}

export function getRandomJoke() {
  return jokes.get<Joke>('/jokes/random')
}
