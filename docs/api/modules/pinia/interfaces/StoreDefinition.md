# Interface: StoreDefinition<Id, S, G, A\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../type_aliases.md#statetree) = [`StateTree`](../type_aliases.md#statetree) |
| `G` | [`_GettersTree`](../type_aliases.md#getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../type_aliases.md#actionstree) |

## Callable

### StoreDefinition

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../type_aliases.md#store)<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](Pinia.md) | Pinia instance to retrieve the store |
| `hot?` | [`StoreGeneric`](../type_aliases.md#storegeneric) | dev only hot module replacement |

#### Returns

[`Store`](../type_aliases.md#store)<`Id`, `S`, `G`, `A`\>

## Properties

### $id

• **$id**: `Id`

Id of the store. Used by map helpers.
