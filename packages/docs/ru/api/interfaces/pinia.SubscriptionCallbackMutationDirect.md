---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationDirect

# Интерфейс: SubscriptionCallbackMutationDirect

[pinia](../modules/pinia.md).SubscriptionCallbackMutationDirect

Context passed to a subscription callback when directly mutating the state of
a store with `store.someState = newValue` or `store.$state.someState =
newValue`.

## Hierarchy %{#Hierarchy}%

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationDirect`**

## Свойства %{#Properties}%

### events %{#Properties-events}%

• **events**: `DebuggerEvent`

🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
devtools and plugins **during development only**.

#### Overrides %{#Properties-events-Overrides}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

---

### storeId %{#Properties-storeId}%

• **storeId**: `string`

`id` of the store doing the mutation.

#### Inherited from %{#Properties-storeId-Inherited-from}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

---

### type %{#Properties-type}%

• **type**: [`direct`](../enums/pinia.MutationType.md#direct)

Type of the mutation.

#### Overrides %{#Properties-type-Overrides}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
