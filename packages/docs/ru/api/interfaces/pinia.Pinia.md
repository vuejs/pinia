---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Интерфейс: Pinia

[pinia](../modules/pinia.md).Pinia

Каждое приложение должно иметь свою собственную pinia, чтобы иметь возможность создавать хранилища

## Иерархия %{#Hierarchy}%

-   **`Pinia`**

    ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Свойства %{#Properties}%

### установка %{#Properties-install}%

• **install**: (`app`: `App`<`any`\>) => `void`

#### Объявление типа %{#Properties-install-Type-declaration}%

▸ (`app`): `void`

##### Параметры %{#Properties-install-Type-declaration-Parameters}%

| Имя   | Тип           |
| :---- | :------------ |
| `app` | `App`<`any`\> |

##### Возвращает %{#Properties-install-Type-declaration-Returns}%

`void`

---

### состояние %{#Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

## Методы %{#Methods}%

### use %{#Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Добавляет плагин хранилища для расширения каждого хранилища

#### Параметры %{#Methods-use-Parameters}%

| Имя      | Тип                                   | Описание                        |
| :------- | :------------------------------------ | :------------------------------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | плагин хранилища для добавления |

#### Возвращает %{#Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)
