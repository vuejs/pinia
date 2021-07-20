# Defining a Store

Before diving into core concepts, we need to know that a store is defined using `defineStore()` and that it requires an `id` property, **unique** across all of your stores:

```js
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
export const useStore = defineStore({
  // unique id of the store across your application
  id: 'storeId',
})
```

The `id` is necessary and is used by `pinia` to connect the store to the devtools. Naming the returned function _use..._ is a convention across composables to make its usage idiomatic.

## Using the store

We are _defining_ a store because the store won't be created until `useStore()` is called inside of `setup()`:

```js
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

You can define as many stores as you want and **you should define each store in a different file** to get the most out of pinia (like automatically allow your bundle to code split and TypeScript inference).

If you are not using `setup` components yet, [you can still use Pinia with _map helpers_](../cookbook/options-api.md).

Once the store is instantiated, you can access any property defined in `state`, `getters`, and `actions` directly on the store. We will see these in detail in the next pages but autocompletion will help you.

Note that `store` in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, **we cannot destructure it**:

```js
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
