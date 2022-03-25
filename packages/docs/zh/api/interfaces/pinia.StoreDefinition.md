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
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

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

[pinia/src/types.ts:513](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L513)

## Properties

### $id

• **$id**: `Id`

Id of the store. Used by map helpers.

#### Defined in

[pinia/src/types.ts:518](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L518)
