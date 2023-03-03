---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Интерфейс: StoreDefinition<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

## Типы параметров %{#Type-parameters}%

| Имя  | Тип                                                                                                 |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## Callable %{#Callable}%

### StoreDefinition %{#Callable-StoreDefinition}%

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Возвращает хранилище, при необходимости создает его.

#### Параметры %{#Callable-StoreDefinition-Parameters}%

| Имя      | Тип                                                | Описание                                 |
| :------- | :------------------------------------------------- | :--------------------------------------- |
| `pinia?` | `null` \| [`Pinia`](pinia.Pinia.md)                | экземпляр Pinia для извлечения хранилища |
| `hot?`   | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev только горячая замена модуля         |

#### Возвращает %{#Callable-StoreDefinition-Returns}%

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

## Свойства %{#Properties}%

### $id %{#Properties-$id}%

• **$id**: `Id`

Идентификатор хранилища. Используется хелперами.
