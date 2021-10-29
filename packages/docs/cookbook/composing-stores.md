# Composing Stores

Composing stores is about having stores that use each other and there is one rule to follow:

If **two or more stores use each other**, they cannot create an infinite loop through _getters_ or _actions_. They cannot **both** directly read each other state in their setup function:

```js
const useA = defineStore('a', () => {
  const b = useB()

  // ❌ this is not possible because b also tries to read a.name
  b.name

  function doSomething() {
    // ✅ Read b properties in computed or actions
    const bName = b.name
    // ...
  }

  return {
    name: ref('I am A'),
  }
})

const useB = defineStore('b', () => {
  const a = useA()

  // ❌ this is not possible because a also tries to read a.name
  a.name

  function doSomething() {
    // ✅ Read b properties in computed or actions
    const aName = a.name
    // ...
  }

  return {
    name: ref('I am B'),
  }
})
```

## Nested stores

Note that if one store uses an other store, **there is no need to create a new store in a separate file**, you can directly import it. Think of it as nesting.

You can call `useOtherStore()` at the top of any getter or action:

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

You can simply call `useOtherStore()` inside a _getter_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

## Shared Actions

The same applies to _actions_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // another action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
