---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# Interface: SubscriptionCallbackMutationPatchObject<S\>

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

Context passed to a subscription callback when `store.$patch()` is called
with an object.

## Type parameters %{#Type-parameters}%

| Name |
| :------ |
| `S` |

## Hierarchy %{#Hierarchy}%

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## Properties %{#Properties}%

### events %{#Properties-events}%

• **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides %{#Properties-events-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

___

### payload %{#Properties-payload}%

• **payload**: [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`S`\>

Object passed to `store.$patch()`.

___

### storeId %{#Properties-storeId}%

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from %{#Properties-storeId-Inherited-from}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

___

### type %{#Properties-type}%

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchobject)

Type of the mutation.

#### Overrides %{#Properties-type-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
