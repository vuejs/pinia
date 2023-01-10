---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Interface: StoreDefinition<Id, S, G, A\> %{#Interface:-StoreDefinition<Id,-S,-G,-A\>}%

[pinia](../modules/pinia.md).StoreDefinition

## Type parameters %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Callable %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Callable}%

### StoreDefinition %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Callable-StoreDefinition}%

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

#### Parameters %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Callable-StoreDefinition-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](pinia.Pinia.md) | Pinia instance to retrieve the store |
| `hot?` | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev only hot module replacement |

#### Returns %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Callable-StoreDefinition-Returns}%

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

## Properties %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Properties}%

### $id %{#Interface:-StoreDefinition<Id,-S,-G,-A\>-Properties-$id}%

• **$id**: `Id`

Id of the store. Used by map helpers.
