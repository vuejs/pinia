import { useUserStore } from './user'
import { useCartStore } from './cart'
import { defineStore } from '../../../src'
// in this file we could import other stores that use one each other while
// avoiding any recursive import

// TODO: not implemented

const useCartUserStore = defineStore({
  id: 'user-cart',
  getters: {
    combinedGetter: () => {
      const user = useUserStore()
      const cart = useCartStore()
      return `Hi ${user.name}, you have ${cart.items.length} items in your cart. It costs ${cart.price}.`
    },
  },
  actions: {
    async orderCart() {
      try {
        await apiOrderCart(this.user.token, this.cart.items)
        this.cart.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})

const a = useCartUserStore()

a.user.isAdmin = false
a.cart.rawItems.push()
