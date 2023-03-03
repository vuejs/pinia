---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# Интерфейс: \_SubscriptionCallbackMutationBase

[pinia](../modules/pinia.md).\_SubscriptionCallbackMutationBase

Базовый тип для контекста, передаваемого в callback подписки. Внутренний тип.

## Иерархия %{#Hierarchy}%

-   **`_SubscriptionCallbackMutationBase`**

    ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

    ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

    ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## Свойства %{#Properties}%

### события %{#Properties-events}%

• `Optional` **events**: `DebuggerEvent` \| `DebuggerEvent`[]

🔴 ТОЛЬКО для разработчиков, НЕ используйте для производственного кода. Разные вызовы мутации. Исходит от
<https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging> и позволяет отслеживать мутации в
devtools и плагинах **только во время разработки**.

---

### storeId %{#Properties-storeId}%

• **storeId**: `string`

`id` хранилища, выполняющего мутацию.

---

### тип %{#Properties-type}%

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

Тип мутации
