---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / DefineSetupStoreOptions

# Интерфейс: DefineSetupStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineSetupStoreOptions

Параметр опций `define Store()` для настройки хранилищ. Может быть расширен для дополнения хранилищ с помощью API плагина.

**`See`**

[DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## Типы параметров %{#Type-parameters}%

| Имя  | Тип                                                  |
| :--- | :--------------------------------------------------- |
| `Id` | extends `string`                                     |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | `G`                                                  |
| `A`  | `A`                                                  |

## Иерархия %{#Hierarchy}%

-   [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

    ↳ **`DefineSetupStoreOptions`**

## Свойства %{#Properties}%

### экшены %{#Properties-actions}%

• `Optional` **actions**: `A`

Извлеченные экшены. Добавляются функцией `useStore()`. НЕ ДОЛЖНЫ добавляться пользователем при создании хранилища. Может использоваться в плагинах для получения списка действий в хранилище, определенном с помощью функции настройки. Обратите внимание, что это всегда определено.
