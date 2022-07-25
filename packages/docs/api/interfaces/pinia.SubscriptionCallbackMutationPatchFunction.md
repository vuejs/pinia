---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchFunction

# Interface: SubscriptionCallbackMutationPatchFunction

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchFunction

Context passed to a subscription callback when `store.$patch()` is called
with a function.

## Hierarchy

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchFunction`**

## Properties

### events

• **events**: `DebuggerEvent`[]

DEV ONLY. Array of all the mutations done inside of the callback.

#### Defined in

[packages/pinia/src/types.ts:129](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L129)

___

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

#### Defined in

[packages/pinia/src/types.ts:81](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L81)

___

### type

• **type**: [`patchFunction`](../enums/pinia.MutationType.md#patchfunction)

Type of the mutation.

#### Overrides

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)

#### Defined in

[packages/pinia/src/types.ts:124](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L124)
