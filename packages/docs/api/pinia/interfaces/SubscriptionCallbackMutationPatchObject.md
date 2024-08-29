---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / SubscriptionCallbackMutationPatchObject

# Interface: SubscriptionCallbackMutationPatchObject\<S\>

Context passed to a subscription callback when `store.$patch()` is called
with an object.

## Extends

- [`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md)

## Type Parameters

• **S**

## Properties

### events

> **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`events`](SubscriptionCallbackMutationBase.md#events)

***

### payload

> **payload**: [`_DeepPartial`](../type-aliases/DeepPartial.md)\<`UnwrapRef`\<`S`\>\>

Object passed to `store.$patch()`.

***

### storeId

> **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`storeId`](SubscriptionCallbackMutationBase.md#storeId)

***

### type

> **type**: [`patchObject`](../enumerations/MutationType.md#patchObject)

Type of the mutation.

#### Overrides

[`_SubscriptionCallbackMutationBase`](SubscriptionCallbackMutationBase.md).[`type`](SubscriptionCallbackMutationBase.md#type)
