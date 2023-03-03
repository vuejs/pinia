---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Интерфейс: \_StoreOnActionListenerContext<Store, ActionName, A\>

[pinia](../modules/pinia.md).\_StoreOnActionListenerContext

Фактический тип для [StoreOnActionListenerContext](../modules/pinia.md#store в контексте actionlistener). Существует для
целей рефакторинга. Только для внутреннего использования.
Только для **внутреннего использования**

## Типы параметров %{#Type-parameters}%

| Имя          | Тип              |
| :----------- | :--------------- |
| `Store`      | `Store`          |
| `ActionName` | extends `string` |
| `A`          | `A`              |

## Свойства %{#Properties}%

### после %{#Properties-after}%

• **после**: (`callback`: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

#### Объявление типа %{#Properties-after-Type-declaration}%

▸ (`callback`): `void`

Устанавливает хук после завершения действия. Он получает возвращаемое значение действия, если это Promise, то оно будет развернуто.

##### Параметры %{#Properties-after-Type-declaration-Parameters}%

| Имя        | Тип                                                                                                                                                                                                        |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### Возвращает %{#Properties-after-Type-declaration-Returns}%

`void`

---

### args %{#Properties-args}%

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

Параметры, передаваемые действию

---

### name %{#Properties-name}%

• **name**: `ActionName`

## Название экшена

---

### onError %{#Properties-onError}%

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

#### Объявление типа %{#Properties-onError-Type-declaration}%

▸ (`callback`): `void`

Устанавливает хук в случае неудачи действия. Верните `false`, чтобы поймать ошибку и остановить ее распространение.

##### Параметры %{#Properties-onError-Type-declaration-Parameters}%

| Имя        | Тип                            |
| :--------- | :----------------------------- |
| `callback` | (`error`: `unknown`) => `void` |

##### Возвращает %{#Properties-onError-Type-declaration-Returns}%

`void`

---

### store %{#Properties-store}%

• **store**: `Store`

Хранилище, вызывающее экшен
