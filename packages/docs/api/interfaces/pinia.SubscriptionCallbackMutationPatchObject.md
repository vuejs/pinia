---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# Interface: SubscriptionCallbackMutationPatchObject\<S\>

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

Context passed to a subscription callback when `store.$patch()` is called
with an object.

## Type parameters

| Name |
| :------ |
| `S` |

## Hierarchy

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## Properties

### events

• **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

___

### payload

• **payload**: [`_DeepPartial`](../modules/pinia.md#_DeepPartial)\<`S`\>

Object passed to `store.$patch()`.

___

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeId)

___

### type

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchObject)

Type of the mutation.

#### Overrides

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
