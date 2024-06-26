---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / mapActions

# Function: mapActions()

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component.

## Param

store to map from

## Param

array or object

## mapActions(useStore, keyMapper)

> **mapActions**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](../type-aliases/MapActionsObjectReturn.md)\<`A`, `KeyMapper`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component. The values of the object are the actions while the keys are
the names of the resulting methods.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A**

• **KeyMapper** *extends* `Record`\<`string`, keyof `A`\>

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keyMapper**: `KeyMapper`

object to define new names for the actions

### Returns

[`_MapActionsObjectReturn`](../type-aliases/MapActionsObjectReturn.md)\<`A`, `KeyMapper`\>

### Example

```js
export default {
  methods: {
    // other methods properties
    // useCounterStore has two actions named `increment` and `setCount`
    ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
  },

  created() {
    this.moar()
    this.setIt(2)
  }
}
```

## mapActions(useStore, keys)

> **mapActions**\<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](../type-aliases/MapActionsReturn.md)\<`A`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A**

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keys**: keyof `A`[]

array of action names to map

### Returns

[`_MapActionsReturn`](../type-aliases/MapActionsReturn.md)\<`A`\>

### Example

```js
export default {
  methods: {
    // other methods properties
    ...mapActions(useCounterStore, ['increment', 'setCount'])
  },

  created() {
    this.increment()
    this.setCount(2) // pass arguments as usual
  }
}
```
