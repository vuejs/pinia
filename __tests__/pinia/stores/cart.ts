import { makeStore } from '../../../src'
import { userStore } from './user'

export const cartStore = makeStore(
  'cart',
  () => ({
    rawItems: [] as string[],
  }),
  {
    items: state =>
      state.rawItems.reduce((items, item) => {
        const existingItem = items.find(it => it.name === item)

        if (!existingItem) {
          items.push({ name: item, amount: 1 })
        } else {
          existingItem.amount++
        }

        return items
      }, [] as { name: string; amount: number }[]),
  },
  {}
)

export function addItem(name: string) {
  const store = cartStore.useStore()
  store.state.rawItems.push(name)
}

export function removeItem(name: string) {
  const store = cartStore.useStore()
  const i = store.state.rawItems.indexOf(name)
  if (i > -1) store.state.rawItems.splice(i, 1)
}

export async function purchaseItems() {
  const cart = cartStore.useStore()
  const user = userStore.useStore()
  if (!user.state.name) return

  console.log('Purchasing', cart.items.value)
  const n = cart.items.value.length
  cart.state.rawItems = []

  return n
}
