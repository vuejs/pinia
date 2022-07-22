# Composing Stores

Composing stores is about having stores that use each other's state / methods, and this is supported in Pinia. There is one rule to follow:

If **two or more stores use each other**, they cannot create an infinite loop through _getters_ or _actions_. They cannot **both** directly read each other state in their setup function:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ This is not possible because y also tries to read x.name
  y.name

  function doSomething() {
    // ✅ Read y properties in computed or actions
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ This is not possible because x also tries to read y.name
  x.name

  function doSomething() {
    // ✅ Read x properties in computed or actions
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Using a store within another store

Note that if one store uses another store, you can directly import and call the `use${storeName}Store` method, then access methods on the returned store object, just like you would access them from within a Vue component.

You can call `useOtherStore()` inside any getter or action:


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
