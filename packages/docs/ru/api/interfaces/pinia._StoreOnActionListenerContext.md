---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Интерфейс: \_StoreOnActionListenerContext<Store, ActionName, A\>

[pinia](../modules/pinia.md).\_StoreOnActionListenerContext

Actual type for [StoreOnActionListenerContext](../modules/pinia.md#storeonactionlistenercontext). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type parameters %{#Type-parameters}%

| Имя          | Тип              |
| :----------- | :--------------- |
| `Store`      | `Store`          |
| `ActionName` | extends `string` |
| `A`          | `A`              |

## Свойства %{#Properties}%

### after %{#Properties-after}%

• **after**: (`callback`: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

#### Объявление типа %{#Properties-after-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

##### Параметры %{#Properties-after-Type-declaration-Parameters}%

| Имя        | Тип                                                                                                                                                                                                        |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### Возвращает %{#Properties-after-Type-declaration-Returns}%

`void`

---

### args %{#Properties-args}%

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

Parameters passed to the action

---

### name %{#Properties-name}%

• **name**: `ActionName`

Name of the action

---

### onError %{#Properties-onError}%

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

#### Объявление типа %{#Properties-onError-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

##### Параметры %{#Properties-onError-Type-declaration-Parameters}%

| Имя        | Тип                            |
| :--------- | :----------------------------- |
| `callback` | (`error`: `unknown`) => `void` |

##### Возвращает %{#Properties-onError-Type-declaration-Returns}%

`void`

---

### store %{#Properties-store}%

• **store**: `Store`

Store that is invoking the action
