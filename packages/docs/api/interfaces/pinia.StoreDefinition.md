---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Interface: StoreDefinition\<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

Return type of `defineStore()`. Function that allows instantiating a store.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#StateTree) = [`StateTree`](../modules/pinia.md#StateTree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_GettersTree)\<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_ActionsTree) |

## Hierarchy

- **`StoreDefinition`**

  ↳ [`SetupStoreDefinition`](pinia.SetupStoreDefinition.md)

## Callable

### StoreDefinition

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#Store)\<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](pinia.Pinia.md) | Pinia instance to retrieve the store |
| `hot?` | [`StoreGeneric`](../modules/pinia.md#StoreGeneric) | dev only hot module replacement |

#### Returns

[`Store`](../modules/pinia.md#Store)\<`Id`, `S`, `G`, `A`\>

## Properties

### $id

• **$id**: `Id`

Id of the store. Used by map helpers.
