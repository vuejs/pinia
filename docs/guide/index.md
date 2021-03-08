## Install the plugin

Create a pinia (the root store) and pass it to app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

This will also add devtools support. Some features like time traveling and editing are still not supported because vue-devtools doesn't expose the necessary APIs yet.

## Creating a Store

You can create as many stores as you want, and they should each exist in different files:

```ts
import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    doubleCount() {
      return this.counter * 2
    },
    // use getters in other getters
    doubleCountPlusOne() {
      return this.doubleCount * 2
    },
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
  },
})
```

`defineStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'

export default defineComponent({
  setup() {
    const main = useMainStore()

    return {
      // gives access to the whole store
      main,
      // gives access only to specific state
      state: computed(() => main.counter),
      // gives access to specific getter; like `computed` properties
      doubleCount: computed(() => main.doubleCount),
    }
  },
})
```

Note: the SSR implementation on Pinia might change, but if you intend having SSR on your application, you should avoid using `useStore` functions at the root level of a file to make sure the correct store is retrieved for your currently running application instance. Here is an example:

**Avoid doing this**:

```ts
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on where you do this it will fail
const main = useMainStore()

router.beforeEach((to, from, next) => {
  if (main.isLoggedIn) next()
  else next('/login')
})
```

Instead, call `useMainStore()` at the top of `setup`, like `inject` and `provide` in Vue:

```ts
export default defineComponent({
  setup() {
    // ✅ This will work
    const main = useMainStore()

    return {}
  },
})

// In a different file...
const pinia = createPinia()
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work (requires pinia param when outside of setup on both
  // Client and Server. See the SSR section below for more information)
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

⚠️: Note that if you are developing an SSR application, [you will need to do a bit more](#ssr).

You can access any property defined in `state` and `getters` directly on the store, similar to `data` and `computed` properties in a Vue component.

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    const text = main.name // "eduardo"
    const doubleCount = main.doubleCount // 2

    return {
      text, // will always be "eduardo"
      textDynamic: computed(() => main.name), // reactive value
    }
  },
})
```

The `main` store in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, we cannot destructure it:

```ts
export default defineComponent({
  setup() {
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = useMainStore()
    return { name, doubleCount }
  },
})
```

Actions are invoked like methods:

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    // call the action as a method of the store
    main.reset()

    return {}
  },
})
```

## Mutating the `state`

To mutate the state you can either directly change something:

```ts
main.counter++
```

or call the method `$patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
main.$patch({
  counter: -1,
  name: 'Abalam',
})
```

The main difference here is that `$patch` allows you to group multiple changes into one single entry in the devtools.

## Replacing the `state`

Simply set your store `$stet` property to a new object:

```ts
main.$state = { counter: 666, name: 'Paimon' }
```

## Composing Stores

Composing stores may look hard at first glance but there is only one rule to follow really:

If **multiple stores use each other** or you need to use **multiple stores** at the same time, you must create a **separate file** where you import all of them.

If one store uses an other store, there is no need to create a new file, you can directly import it. Think of it as nesting.

You can call `useOtherStore()` at the top of any getter an action:

```ts
import { useUserStore } from './user'

export const cartStore = defineStore({
  id: 'cart',
  getters: {
    // ... other getters
    summary() {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${this.list.length} items in your cart. It costs ${this.price}.`
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

### Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** because importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we follow the rule above** and we create a new file with a new store:

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore({
  id: 'shared',
  getters: {
    summary() {
      const user = useUserStore()
      const cart = useCartStore()

      return `Hi ${user.name}, you have ${cart.list.length} items in your cart. It costs ${cart.price}.`
    },
  },
})
```

### Shared Actions

When an actions needs to use multiple stores, we do the same, we create a new file with a new store:

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore({
  id: 'shared',
  state: () => ({}),
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
