---
editLink: false
---

[Документация API](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Интерфейс: TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Экземпляр Pinia, специально разработанный для тестирования. Расширяет обычный экземпляр `Pinia` свойствами, специфичными для тестирования.

## Иерархия %{#Hierarchy}%

-   [`Pinia`](pinia.Pinia.md)

    ↳ **`TestingPinia`**

## Свойства %{#Properties}%

### app %{#Properties-app}%

• **app**: `App`<`any`\>

Приложение, используемое Pinia

---

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

#### Унаследовано от %{#Properties-install-Inherited-from}%

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

---

### состояние %{#Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Унаследовано от %{#Properties-state-Inherited-from}%

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

## Методы %{#Methods}%

### use %{#Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Добавляет плагин store для расширения каждого store

#### Параметры %{#Methods-use-Parameters}%

| Имя      | Тип                                   | Описание                        |
| :------- | :------------------------------------ | :------------------------------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | плагин хранилища для добавления |

#### Возвращает %{#Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)

#### Унаследовано от %{#Methods-use-Inherited-from}%

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)
