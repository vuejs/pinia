---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# Интерфейс: SubscriptionCallbackMutationPatchObject<S\>

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

Контекст, передаваемый в callback подписки при вызове `store.$patch()` с объектом.

## Типы параметров %{#Type-parameters}%

| Имя |
| :-- |
| `S` |

## Иерархия %{#Hierarchy}%

-   [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

    ↳ **`SubscriptionCallbackMutationPatchObject`**

## Свойства %{#Properties}%

### события %{#Properties-events}%

• **events**: `DebuggerEvent`[]

🔴 Только для DEV, НЕ используйте для производственного кода. Различные вызовы мутаций. Берется из <https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging> и позволяет отслеживать мутации в devtools и плагинах **только во время разработки**.

#### Переопределения %{#Properties-events-Overrides}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[events](pinia._SubscriptionCallbackMutationBase.md#events)

---

### payload %{#Properties-payload}%

• **payload**: [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`S`\>

Объект, переданный в `store.$patch()`.

---

### storeId %{#Properties-storeId}%

• **storeId**: `string`

`id` хранилища, выполняющего мутацию.

#### Унаследовано от %{#Properties-storeId-Inherited-from}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

---

### тип %{#Properties-type}%

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchobject)

Тип мутации.

#### Переопределения %{#Properties-type-Overrides}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
