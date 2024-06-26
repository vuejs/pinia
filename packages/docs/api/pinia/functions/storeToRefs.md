---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / storeToRefs

# Function: storeToRefs()

> **storeToRefs**\<`SS`\>(`store`): `StoreToRefs`\<`SS`\>

Creates an object of references with all the state, getters, and plugin-added
state properties of the store. Similar to `toRefs()` but specifically
designed for Pinia stores so methods and non reactive properties are
completely ignored.

## Type Parameters

• **SS** *extends* [`StoreGeneric`](../type-aliases/StoreGeneric.md)

## Parameters

• **store**: `SS`

store to extract the refs from

## Returns

`StoreToRefs`\<`SS`\>
