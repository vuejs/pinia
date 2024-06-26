---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / StoreDefinition

# Interface: StoreDefinition()\<Id, S, G, A\>

Return type of `defineStore()`. Function that allows instantiating a store.

## Extended by

- [`SetupStoreDefinition`](SetupStoreDefinition.md)

## Type Parameters

• **Id** *extends* `string` = `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md) = [`StateTree`](../type-aliases/StateTree.md)

• **G** = [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A** = [`_ActionsTree`](../type-aliases/ActionsTree.md)

> **StoreDefinition**(`pinia`?, `hot`?): [`Store`](../type-aliases/Store.md)\<`Id`, `S`, `G`, `A`\>

Returns a store, creates it if necessary.

## Parameters

• **pinia?**: `null` \| [`Pinia`](Pinia.md)

Pinia instance to retrieve the store

• **hot?**: [`StoreGeneric`](../type-aliases/StoreGeneric.md)

dev only hot module replacement

## Returns

[`Store`](../type-aliases/Store.md)\<`Id`, `S`, `G`, `A`\>

## Properties

### $id

> **$id**: `Id`

Id of the store. Used by map helpers.
