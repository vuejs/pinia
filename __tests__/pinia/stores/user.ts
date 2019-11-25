import { makeStore } from '../../../src'

export const userStore = makeStore(
  'user',
  () => ({
    name: 'Eduardo',
    isAdmin: true as boolean,
  }),
  {},
  {}
)

export function logout() {
  const store = userStore.useStore()

  store.patch({
    name: '',
    isAdmin: false,
  })

  // we could do other stuff like redirecting the user
}

function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true })
  return Promise.reject(new Error('invalid credentials'))
}

export async function login(user: string, password: string) {
  const store = userStore.useStore()
  const userData = await apiLogin(user, password)

  store.patch({
    name: user,
    ...userData,
  })
}
