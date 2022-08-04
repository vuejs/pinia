# Interface: SubscriptionCallbackMutationPatchObject<S\>

Context passed to a subscription callback when `store.$patch()` is called
with an object.

## Type parameters

| Name |
| :------ |
| `S` |

## Hierarchy

- [`_SubscriptionCallbackMutationBase`](_SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## Properties

### events

• **events**: `DebuggerEvent`[]

DEV ONLY. Array for patch calls.

___

### payload

• **payload**: [`_DeepPartial`](../type_aliases.md#deeppartial)<`S`\>

Object passed to `store.$patch()`.

___

### storeId

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from

[_SubscriptionCallbackMutationBase](_SubscriptionCallbackMutationBase.md).[storeId](_SubscriptionCallbackMutationBase.md#storeid)

___

### type

• **type**: [`patchObject`](../enums/MutationType.md#patchobject)

Type of the mutation.

#### Overrides

[_SubscriptionCallbackMutationBase](_SubscriptionCallbackMutationBase.md).[type](_SubscriptionCallbackMutationBase.md#type)
