---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Interface: StoreDefinition<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Callable

### StoreDefinition

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](pinia.Pinia.md) | Pinia instance to retrieve the store |
| `hot?` | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev only hot module replacement |

#### Returns

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

#### Defined in

[packages/pinia/src/types.ts:504](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L504)

## Properties

### $id

• **$id**: `Id`

Id of the store. Used by map helpers.

#### Defined in

[packages/pinia/src/types.ts:509](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L509)
