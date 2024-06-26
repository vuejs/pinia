---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / mapStores

# Function: mapStores()

> **mapStores**\<`Stores`\>(...`stores`): [`_Spread`](../type-aliases/Spread.md)\<`Stores`\>

Allows using stores without the composition API (`setup()`) by generating an
object to be spread in the `computed` field of a component. It accepts a list
of store definitions.

## Type Parameters

• **Stores** *extends* `any`[]

## Parameters

• ...**stores**: [`...Stores[]`]

list of stores to map to an object

## Returns

[`_Spread`](../type-aliases/Spread.md)\<`Stores`\>

## Example

```js
export default {
  computed: {
    // other computed properties
    ...mapStores(useUserStore, useCartStore)
  },

  created() {
    this.userStore // store with id "user"
    this.cartStore // store with id "cart"
  }
}
```
