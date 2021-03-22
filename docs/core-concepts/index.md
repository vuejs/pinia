# Defining a Store

Before diving into core concepts, we need to know that a store is defined using `defineStore()` and that it requires an `id` property, **unique** across all of your stores:

```js
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
export useStore = defineStore({
  // unique id of the store across your application
  id: 'storeName'
})
```

The `id` is necessary and is used by `pinia` to connect the store to the devtools. Naming the returned function _use..._ is a convention across composables to make its usage idiomatic.

## Using the store

We are _defining_ a store because the store won't be created until `useStore()` is called inside of `setup()`. You can define as many stores as you want and you should define each store in a different file to get the most out of pinia (like automatically allow your bundle to code split).

It's not possible to call `useStore()` outside of a `setup()` function. Here is an example using a store inside of a navigation guard with Vue Router:

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on where you do this it will fail
const store = useStore()

router.beforeEach((to, from, next) => {
  if (store.isLoggedIn) next()
  else next('/login')
})
```

Instead, make sure to call `useStore()` inside functions that are called after your application is mounted (`app.mount()` or `new Vue()`):

```js
router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after pinia is installed
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

:::tip
When dealing with Server Side Rendering, you will have to pass the `pinia` instance to `useStore()`. Read more about this in the [SSR guide](/server-side-rendering.md).
:::

Once the store is instantiated, you can access any property defined in `state`, `getters`, and `actions` directly on the store. We will see these in detail in the next pages but autocompletion will help you.

`store` in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, we cannot destructure it:

```ts
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // will always be "eduardo"
      name,
      // will always be 2
      doubleCount
      // this one will be reactive
      doubleValue: computed(() => store.doubleCount),
      }
  },
})
```
