---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_SubscriptionCallbackMutationBase

# Interface: \_SubscriptionCallbackMutationBase

Base type for the context passed to a subscription callback. Internal type.

## Extended by

- [`SubscriptionCallbackMutationDirect`](SubscriptionCallbackMutationDirect.md)
- [`SubscriptionCallbackMutationPatchFunction`](SubscriptionCallbackMutationPatchFunction.md)
- [`SubscriptionCallbackMutationPatchObject`](SubscriptionCallbackMutationPatchObject.md)

## Properties

### events?

> `optional` **events**: `DebuggerEvent` \| `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

***

### storeId

> **storeId**: `string`

`id` of the store doing the mutation.

***

### type

> **type**: [`MutationType`](../enumerations/MutationType.md)

Type of the mutation.
