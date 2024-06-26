---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / SubscriptionCallbackMutationPatchFunction

# Interface: SubscriptionCallbackMutationPatchFunction

Context passed to a subscription callback when `store.$patch()` is called
with a function.

## Extends

- [`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md)

## Properties

### events

> **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`events`](SubscriptionCallbackMutationBase.md#events)

***

### storeId

> **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`storeId`](SubscriptionCallbackMutationBase.md#storeId)

***

### type

> **type**: [`patchFunction`](../enumerations/MutationType.md#patchFunction)

Type of the mutation.

#### Overrides

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`type`](SubscriptionCallbackMutationBase.md#type)
