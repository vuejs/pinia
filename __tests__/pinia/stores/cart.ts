import { defineStore } from '../../../src'
import { useUserStore } from './user'

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    rawItems: [] as string[],
  }),
  getters: {
    items() {
      return this.rawItems.reduce((items, item) => {
        const existingItem = items.find((it) => it.name === item)

        if (!existingItem) {
          items.push({ name: item, amount: 1 })
        } else {
          existingItem.amount++
        }

        return items
      }, [] as { name: string; amount: number }[])
    },
  },
  actions: {
    addItem(name: string) {
      this.rawItems.push(name)
    },

    removeItem(name: string) {
      const i = this.rawItems.indexOf(name)
      if (i > -1) this.rawItems.splice(i, 1)
    },

    // TODO: use multiple stores
    // https://github.com/vuejs/vue-next-internal-discussions/issues/22
    async purchaseItems() {
      const user = useUserStore()
      if (!user.name) return

      // console.log('Purchasing', this.items)
      const n = this.items.length
      this.state.rawItems = []

      return { amount: n, user: user.name }
    },
  },
})

export type CartStore = ReturnType<typeof useCartStore>

export function addItem(name: string) {
  const store = useCartStore()
  store.state.rawItems.push(name)
}

export function removeItem(name: string) {
  const store = useCartStore()
  const i = store.state.rawItems.indexOf(name)
  if (i > -1) store.state.rawItems.splice(i, 1)
}

export async function purchaseItems() {
  const cart = useCartStore()
  const user = useUserStore()
  if (!user.state.name) return

  console.log('Purchasing', cart.items)
  const n = cart.items.length
  cart.state.rawItems = []

  return n
}
