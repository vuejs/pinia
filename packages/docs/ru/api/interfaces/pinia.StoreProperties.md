---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / StoreProperties

# Интерфейс: StoreProperties<Id\>

[pinia](../modules/pinia.md).StoreProperties

Свойства хранилища.

## Типы параметров %{#Type-parameters}%

| Имя  | Тип              |
| :--- | :--------------- |
| `Id` | extends `string` |

## Иерархия %{#Hierarchy}%

-   **`StoreProperties`**

    ↳ [`_StoreWithState`](pinia._StoreWithState.md)

## Свойства %{#Properties}%

### $id %{#Properties-$id}%

• **$id**: `Id`

Уникальный идентификатор хранилища

---

### \_customProperties %{#Properties-\_customProperties}%

• **\_customProperties**: `Set`<`string`\>

Используется плагином devtools для получения свойств, добавленных с помощью плагинов. Удалено в продакшене. Может использоваться пользователем для добавления ключей свойств хранилища, которые должны отображаться в devtools.
