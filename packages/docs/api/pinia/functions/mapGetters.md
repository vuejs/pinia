---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / mapGetters

# Function: ~~mapGetters()~~

Alias for `mapState()`. You should use `mapState()` instead.

## Deprecated

use `mapState()` instead.

## mapGetters(useStore, keyMapper)

> **mapGetters**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](../type-aliases/MapStateObjectReturn.md)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component. The values of the object are the state properties/getters
while the keys are the names of the resulting computed properties.
Optionally, you can also pass a custom function that will receive the store
as its first argument. Note that while it has access to the component
instance via `this`, it won't be typed.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\> \| `object`

• **A**

• **KeyMapper** *extends* `Record`\<`string`, keyof `S` \| keyof `G` \| (`store`) => `any`\>

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keyMapper**: `KeyMapper`

object of state properties or getters

### Returns

[`_MapStateObjectReturn`](../type-aliases/MapStateObjectReturn.md)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

### Deprecated

use `mapState()` instead.

### Example

```js
export default {
  computed: {
    // other computed properties
    // useCounterStore has a state property named `count` and a getter `double`
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // note we can't use an arrow function if we want to use `this`
      custom(store) {
        return this.someComponentValue + store.n
      },
      doubleN: 'double'
    })
  },

  created() {
    this.n // 2
    this.doubleN // 4
  }
}
```

## mapGetters(useStore, keys)

> **mapGetters**\<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](../type-aliases/MapStateReturn.md)\<`S`, `G`, `Keys`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\> \| `object`

• **A**

• **Keys** *extends* `string` \| `number` \| `symbol`

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keys**: readonly `Keys`[]

array of state properties or getters

### Returns

[`_MapStateReturn`](../type-aliases/MapStateReturn.md)\<`S`, `G`, `Keys`\>

### Deprecated

use `mapState()` instead.

### Example

```js
export default {
  computed: {
    // other computed properties
    ...mapState(useCounterStore, ['count', 'double'])
  },

  created() {
    this.count // 2
    this.double // 4
  }
}
```
