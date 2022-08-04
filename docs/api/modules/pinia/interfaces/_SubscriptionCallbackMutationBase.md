# Interface: \_SubscriptionCallbackMutationBase

Base type for the context passed to a subscription callback. Internal type.

## Hierarchy

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](SubscriptionCallbackMutationPatchObject.md)

## Properties

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

___

### type

• **type**: [`MutationType`](../enums/MutationType.md)

Type of the mutation.
