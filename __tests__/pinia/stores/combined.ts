import { useUserStore } from './user'
import { useCartStore } from './cart'
import { pinia } from '../../../src'
// in this file we could import other stores that use one each other while
// avoiding any recursive import

// TODO: not implemented

const useCartUserStore = pinia(
  { user: useUserStore, cart: useCartStore },
  {
    getters: {
      combinedGetter: ({ user, cart }) =>
        `Hi ${user.state.name}, you have ${cart.state.list.length} items in your cart. It costs ${cart.price}.`,
    },
    actions: {
      async orderCart() {
        try {
          await apiOrderCart(this.user.state.token, this.cart.state.items)
          this.cart.emptyCart()
        } catch (err) {
          displayError(err)
        }
      },
    },
  }
)

const a = useCartUserStore()

a.user.isAdmin = false
a.cart.rawItems.push()
