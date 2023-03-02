---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# Интерфейс: \_SubscriptionCallbackMutationBase

[pinia](../modules/pinia.md).\_SubscriptionCallbackMutationBase

Base type for the context passed to a subscription callback. Internal type.

## Hierarchy %{#Hierarchy}%

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## Свойства %{#Properties}%

### events %{#Properties-events}%

• `Optional` **events**: `DebuggerEvent` \| `DebuggerEvent`[]

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

---

### storeId %{#Properties-storeId}%

• **storeId**: `string`

`id` of the store doing the mutation.

---

### type %{#Properties-type}%

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

Type of the mutation.
