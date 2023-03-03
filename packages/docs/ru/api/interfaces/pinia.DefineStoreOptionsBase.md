---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsBase

# Интерфейс: DefineStoreOptionsBase<S, Store\>

[pinia](../modules/pinia.md).DefineStoreOptionsBase

Параметры, передаваемые в `defineStore()`, которые являются общими для хранилищ опций и хранилищ настроек. Расширьте этот интерфейс, если вы хотите добавить пользовательские опции в оба типа хранилищ.

## Типы параметров %{#Type-parameters}%

| Имя     | Тип                                                  |
| :------ | :--------------------------------------------------- |
| `S`     | extends [`StateTree`](../modules/pinia.md#statetree) |
| `Store` | `Store`                                              |

## Иерархия %{#Hierarchy}%

-   **`DefineStoreOptionsBase`**

    ↳ [`DefineStoreOptions`](pinia.DefineStoreOptions.md)

    ↳ [`DefineSetupStoreOptions`](pinia.DefineSetupStoreOptions.md)
