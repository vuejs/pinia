# Interface: \_SubscriptionCallbackMutationBase

Base type for the context passed to a subscription callback. Internal type.

## Hierarchy

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](SubscriptionCallbackMutationPatchObject.md)

## Properties

### events

• `Optional` **events**: `DebuggerEvent` \| `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

___

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

___

### type

• **type**: [`MutationType`](../enums/MutationType.md)

Type of the mutation.
