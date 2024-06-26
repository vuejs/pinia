---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / skipHydrate

# Function: skipHydrate()

> **skipHydrate**\<`T`\>(`obj`): `T`

Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.

## Type Parameters

• **T** = `any`

## Parameters

• **obj**: `T`

target object

## Returns

`T`

obj
