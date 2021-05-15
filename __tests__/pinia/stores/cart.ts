import { defineStore } from '../../../src'
import { useUserStore } from './user'

export interface CartItem {
  name: string
  price: number
}

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    rawItems: [] as CartItem[],
  }),
  getters: {
    items: (state) =>
      state.rawItems.reduce((items, item) => {
        const existingItem = items.find((it) => it.item.name === item.name)

        if (!existingItem) {
          items.push({ item, amount: 1 })
        } else {
          existingItem.amount++
        }

        return items
      }, [] as { item: CartItem; amount: number }[]),
    price: (state) =>
      state.rawItems.reduce((total, item) => total + item.price, 0),
  },
})

export type CartStore = ReturnType<typeof useCartStore>

// const a: PiniaStore<{
//   u: UserStore
//   c: CartStore
// }>

// a.cart

// const getters: ExtractGettersFromStore<CartStore>

// getters.items

export function addItem(name: string, price: number): void {
  const store = useCartStore()
  store.$state.rawItems.push({ name, price })
}

export function removeItem(name: string): void {
  const store = useCartStore()
  const i = store.$state.rawItems.findIndex((item) => item.name === name)
  if (i > -1) store.$state.rawItems.splice(i, 1)
}

export async function purchaseItems(): Promise<number> {
  const cart = useCartStore()
  const user = useUserStore()
  if (!user.$state.name) return 0

  console.log('Purchasing', cart.items)
  const n = cart.items.length
  cart.$state.rawItems = []

  return n
}
