# Usage without `setup()`

Pinia can be used even if you are not using the composition API (if you are using Vue 2, you still need to install the `@vue/composition-api` plugin though). While we recommend you to give the Composition API a try and learn it, it might not be the time for you and your team yet, you might be in the process of migrating an application, or any other reason. There are a few functions:

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#options-api) (just for migration convenience, use `mapState()` instead)
- [mapActions](../core-concepts/actions.md#options-api)

## Giving access to the whole store

If you need to access pretty much everything from the store, it might be too much to map every single property of the store... Instead you can get access to the whole store with `mapStores()`:

```js
import { mapStores } from 'pinia'

// given two stores with the following ids
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // note we are not passing an array, just one store after the other
    // each store will be accessible as its id + 'Store'
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // use them anywhere!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

By default, Pinia will add the `"Store"` suffix to the `id` of each store. You can customize this behavior by calling the `setMapStoreSuffix()`:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// completely remove the suffix: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (it's okay, I won't judge you)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

By default, all map helpers support autocompletion and you don't need to do anything. If you call `setMapStoreSuffix()` to change the `"Store"` suffix, you will need to also add it somewhere in a TS file or your `global.d.ts` file. The most convenient place would be the same place where you call `setMapStoreSuffix()`:

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // completely remove the suffix
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // set it to the same value as above
    suffix: ''
  }
}
```

:::warning
If you are using a TypeScript declaration file (like `global.d.ts`), make sure to `import 'pinia'` at the top of it to expose all existing types.
:::
