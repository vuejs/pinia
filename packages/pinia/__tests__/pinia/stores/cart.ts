import { defineStore } from '../../../src'
import { useUserStore } from './user'

export const useCartStore = defineStore({
  id: 'cart',
  state: () => ({
    id: 2,
    rawItems: [] as string[],
  }),
  getters: {
    items: (state) =>
      state.rawItems.reduce((items, item) => {
        const existingItem = items.find((it) => it.name === item)

        if (!existingItem) {
          items.push({ name: item, amount: 1 })
        } else {
          existingItem.amount++
        }

        return items
      }, [] as { name: string; amount: number }[]),
  },

  actions: {
    addItem(name: string) {
      this.rawItems.push(name)
    },

    removeItem(name: string) {
      const i = this.rawItems.indexOf(name)
      if (i > -1) this.$state.rawItems.splice(i, 1)
    },

    // TODO: use multiple stores
    // https://github.com/vuejs/vue-next-internal-discussions/issues/22
    async purchaseItems() {
      const user = useUserStore()
      if (!user.name) return

      // console.log('Purchasing', this.items)
      const n = this.items.length
      this.rawItems = []

      return { amount: n, user: user.name }
    },
  },
})

export type CartStore = ReturnType<typeof useCartStore>

export function addItem(name: string) {
  const store = useCartStore()
  store.rawItems.push(name)
}

export function removeItem(name: string) {
  const store = useCartStore()
  const i = store.rawItems.indexOf(name)
  if (i > -1) store.rawItems.splice(i, 1)
}

export async function purchaseItems() {
  const cart = useCartStore()
  const user = useUserStore()
  if (!user.name) return

  console.log('Purchasing', cart.items)
  const n = cart.items.length
  cart.rawItems = []

  return n
}
