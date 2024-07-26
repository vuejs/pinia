---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / mapWritableState

# Function: mapWritableState()

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

## Param

store to map from

## Param

array or object

## mapWritableState(useStore, keyMapper)

> **mapWritableState**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](../type-aliases/MapWritableStateObjectReturn.md)\<`S`, `KeyMapper`\>

Same as `mapState()` but creates computed setters as well so the state can be
modified. Differently from `mapState()`, only `state` properties can be
added.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A**

• **KeyMapper** *extends* `Record`\<`string`, keyof `S`\>

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keyMapper**: `KeyMapper`

object of state properties

### Returns

[`_MapWritableStateObjectReturn`](../type-aliases/MapWritableStateObjectReturn.md)\<`S`, `KeyMapper`\>

### Param

store to map from

### Param

array or object

## mapWritableState(useStore, keys)

> **mapWritableState**\<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): `{ [K in Keys]: Object }`

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A**

• **Keys** *extends* `string` \| `number` \| `symbol`

### Parameters

• **useStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

store to map from

• **keys**: readonly `Keys`[]

array of state properties

### Returns

`{ [K in Keys]: Object }`

### Param

store to map from

### Param

array or object
