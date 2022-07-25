---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# Interface: \_SubscriptionCallbackMutationBase

[pinia](../modules/pinia.md)._SubscriptionCallbackMutationBase

Base type for the context passed to a subscription callback. Internal type.

## Hierarchy

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## Properties

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

#### Defined in

[packages/pinia/src/types.ts:81](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L81)

___

### type

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

Type of the mutation.

#### Defined in

[packages/pinia/src/types.ts:76](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L76)
