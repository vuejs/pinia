import { createStore } from 'src/store'

function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true })
  return Promise.reject(new Error('invalid credentials'))
}

export const useUserStore = createStore({
  id: 'user',
  state: () => ({
    name: 'Eduardo',
    isAdmin: true,
  }),
  actions: {
    async login(user: string, password: string) {
      const userData = await apiLogin(user, password)

      this.patch({
        name: user,
        ...userData,
      })
    },

    logout() {
      this.login('a', 'b').then(() => {})

      this.patch({
        name: '',
        isAdmin: false,
      })
    },
  },
  getters: {
    test() {
      return this.name.toUpperCase()
    },
  },
})

export type UserStore = ReturnType<typeof useUserStore>

// let a: WrapStoreWithId<UserStore>

export function logout() {
  const store = useUserStore()

  store.login('e', 'e').then(() => {})

  store.patch({
    name: '',
    isAdmin: false,
  })

  // we could do other stuff like redirecting the user
}
