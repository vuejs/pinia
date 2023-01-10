---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchFunction

# Interface: SubscriptionCallbackMutationPatchFunction %{#Interface:-SubscriptionCallbackMutationPatchFunction}%

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchFunction

Context passed to a subscription callback when `store.$patch()` is called
with a function.

## Hierarchy %{#Interface:-SubscriptionCallbackMutationPatchFunction-Hierarchy}%

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchFunction`**

## Properties %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties}%

### events %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-events}%

• **events**: `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-events-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

___

### storeId %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-storeId}%

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-storeId-Inherited-from}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

___

### type %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-type}%

• **type**: [`patchFunction`](../enums/pinia.MutationType.md#patchfunction)

Type of the mutation.

#### Overrides %{#Interface:-SubscriptionCallbackMutationPatchFunction-Properties-type-Overrides}%

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
