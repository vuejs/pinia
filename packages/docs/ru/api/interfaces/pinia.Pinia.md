---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Интерфейс: Pinia

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy %{#Hierarchy}%

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Свойства %{#Properties}%

### install %{#Properties-install}%

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

### state %{#Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

## Methods %{#Methods}%

### use %{#Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Adds a store plugin to extend every store

#### Parameters %{#Methods-use-Parameters}%

| Имя      | Тип                                   | Description         |
| :------- | :------------------------------------ | :------------------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Returns %{#Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)
