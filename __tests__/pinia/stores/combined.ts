import { useUserStore } from './user'
import { useCartStore } from './cart'
import { pinia, CombinedState } from '../../../src/pinia'
// in this file we could import other stores that use one each other while
// avoiding any recursive import

type S = CombinedState<{
  user: typeof useUserStore
  cart: typeof useCartStore
}>

let a: S

a.user.isAdmin = false
a.cart.rawItems.push()
