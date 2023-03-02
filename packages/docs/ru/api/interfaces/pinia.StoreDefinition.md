---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Интерфейс: StoreDefinition<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

## Type parameters %{#Type-parameters}%

| Имя  | Тип                                                                                                 |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## Callable %{#Callable}%

### StoreDefinition %{#Callable-StoreDefinition}%

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

#### Parameters %{#Callable-StoreDefinition-Parameters}%

| Имя      | Тип                                                | Description                          |
| :------- | :------------------------------------------------- | :----------------------------------- |
| `pinia?` | `null` \| [`Pinia`](pinia.Pinia.md)                | Pinia instance to retrieve the store |
| `hot?`   | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev only hot module replacement      |

#### Returns %{#Callable-StoreDefinition-Returns}%

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

## Свойства %{#Properties}%

### $id %{#Properties-$id}%

• **$id**: `Id`

Id of the store. Used by map helpers.
