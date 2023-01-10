---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# Interface: SubscriptionCallbackMutationPatchObject<S\> %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>}%

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

Context passed to a subscription callback when `store.$patch()` is called
with an object.

## Type parameters %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Type-parameters}%

| Name |
| :------ |
| `S` |

## Hierarchy %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Hierarchy}%

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## Properties %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties}%

### events %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-events}%

• **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-events-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

___

### payload %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-payload}%

• **payload**: [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`S`\>

Object passed to `store.$patch()`.

___

### storeId %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-storeId}%

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-storeId-Inherited-from}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

___

### type %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-type}%

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchobject)

Type of the mutation.

#### Overrides %{#Interface:-SubscriptionCallbackMutationPatchObject<S\>-Properties-type-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
