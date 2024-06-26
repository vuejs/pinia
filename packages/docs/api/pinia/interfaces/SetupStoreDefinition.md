---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / SetupStoreDefinition

# Interface: SetupStoreDefinition()\<Id, SS\>

Return type of `defineStore()` with a setup function.
- `Id` is a string literal of the store's name
- `SS` is the return type of the setup function

## See

[StoreDefinition](StoreDefinition.md)

## Extends

- [`StoreDefinition`](StoreDefinition.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>

## Type Parameters

• **Id** *extends* `string`

• **SS**

> **SetupStoreDefinition**(`pinia`?, `hot`?): [`Store`](../type-aliases/Store.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>

Returns a store, creates it if necessary.

## Parameters

• **pinia?**: `null` \| [`Pinia`](Pinia.md)

Pinia instance to retrieve the store

• **hot?**: [`StoreGeneric`](../type-aliases/StoreGeneric.md)

dev only hot module replacement

## Returns

[`Store`](../type-aliases/Store.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>

## Properties

### $id

> **$id**: `Id`

Id of the store. Used by map helpers.

#### Inherited from

[`StoreDefinition`](StoreDefinition.md).[`$id`](StoreDefinition.md#$id)
