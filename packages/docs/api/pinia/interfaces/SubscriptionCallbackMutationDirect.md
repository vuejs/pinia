---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / SubscriptionCallbackMutationDirect

# Interface: SubscriptionCallbackMutationDirect

Context passed to a subscription callback when directly mutating the state of
a store with `store.someState = newValue` or `store.$state.someState =
newValue`.

## Extends

- [`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md)

## Properties

### events

> **events**: `DebuggerEvent`

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

> **type**: [`direct`](../enumerations/MutationType.md#direct)

Type of the mutation.

#### Overrides

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`type`](SubscriptionCallbackMutationBase.md#type)
