# Interface: SubscriptionCallbackMutationDirect

Context passed to a subscription callback when directly mutating the state of
a store with `store.someState = newValue` or `store.$state.someState =
newValue`.

## Hierarchy

- [`_SubscriptionCallbackMutationBase`](_SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationDirect`**

## Properties

### events

• **events**: `DebuggerEvent`

DEV ONLY. Different mutation calls.

___

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[_SubscriptionCallbackMutationBase](_SubscriptionCallbackMutationBase.md).[storeId](_SubscriptionCallbackMutationBase.md#storeid)

___

### type

• **type**: [`direct`](../enums/MutationType.md#direct)

Type of the mutation.

#### Overrides

[_SubscriptionCallbackMutationBase](_SubscriptionCallbackMutationBase.md).[type](_SubscriptionCallbackMutationBase.md#type)
