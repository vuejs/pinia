# Composing Stores

Composing stores is about having stores that use each other and there is one rule to follow:

If **two or more stores use each other**, you must create a new store in a **separate file** where you import and use all of them.

Note that if one store uses an other store, **there is no need to create a new store in a separate file**, you can directly import it. Think of it as nesting.

You can call `useOtherStore()` at the top of any getter an action:

```js
import { useUserStore } from './user'

export const cartStore = defineStore('cart', {
  getters: {
    // ... other getters
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },

  actions: {
    purchase() {
      const user = useUserStore()

      return apiPurchase(user.id, this.list)
    },
  },
})
```

## Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** because importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we follow the rule above** and we create a new file with a new store:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore('shared', {
  getters: {
    summary() {
      const user = useUserStore()
      const cart = useCartStore()

      return `Hi ${user.name}, you have ${cart.list.length} items in your cart. It costs ${cart.price}.`
    },
  },
})
```

## Shared Actions

When an actions needs to use multiple stores, we do the same, we create a new file with a new store:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore('shared', {
  actions: {
    async orderCart() {
      const user = useUserStore()
      const cart = useCartStore()

      try {
        await apiOrderCart(user.token, cart.items)
        cart.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
