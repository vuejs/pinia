---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / StoreProperties

# Interface: StoreProperties\<Id\>

Properties of a store.

## Extended by

- [`_StoreWithState`](StoreWithState.md)

## Type Parameters

• **Id** *extends* `string`

## Properties

### $id

> **$id**: `Id`

Unique identifier of the store

***

### \_customProperties

> **\_customProperties**: `Set`\<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.
