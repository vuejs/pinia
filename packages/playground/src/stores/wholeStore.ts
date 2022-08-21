interface User {
  id: string
}
type State<T extends string> = { type: T }
type AuthStateLoggingIn = State<'loggingIn'>
type AuthStateLoggedIn = State<'loggedIn'> & { user: User }
type AuthStateError = State<'error'> & { errorMsg: string }
type AuhtStateLoggedOut = State<'loggedOut'>

export type AuthState =
  | AuthStateLoggingIn
  | AuthStateLoggedIn
  | AuthStateError
  | AuhtStateLoggedOut

import { acceptHMRUpdate, defineStore } from 'pinia'

const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useWholeStore = defineStore('whole', {
  state: (): AuthState => ({ type: 'loggedIn', user: { id: '1' } }),

  getters: {
    errorMsg: (state) => (state.type === 'error' ? state.errorMsg : ''),
  },

  actions: {
    async login() {
      try {
        await delay(1000)
        this.$patch({ type: 'loggedIn', user: { id: '1' } })
      } catch (e) {
        const error = e as Error
        this.$patch({ type: 'error', errorMsg: error.message })
      }
    },

    logout() {
      this.$patch({ type: 'loggedOut' })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWholeStore, import.meta.hot))
}
