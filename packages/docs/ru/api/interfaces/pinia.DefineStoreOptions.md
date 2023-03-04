---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptions

# Интерфейс: DefineStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptions

Свойства параметров `defineStore()` для хранилищ опций. Может быть расширен для дополнения хранилищ с помощью API плагина.

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

    ↳ **`DefineStoreOptions`**

## Свойства %{#Properties}%

### экшены %{#Properties-actions}%

• `Optional` **actions**: `A` & `ThisType`<`A` & `UnwrapRef`<`S`\> & [`_StoreWithState`](pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\>

Необязательный объект экшенов.

---

### getters %{#Properties-getters}%

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\> & [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>

Необязательный объект геттеров.

---

### id %{#Properties-id}%

• **id**: `Id`

Уникальный строковый ключ для идентификации хранилища в приложении.

---

### состояние %{#Properties-state}%

• `Optional` **state**: () => `S`

#### Объявление типа %{#Properties-state-Type-declaration}%

▸ (): `S`

Функция для создания нового состояния. **Должна быть стрелочной функцией** для обеспечения правильного набора!

##### Возвращает %{#Properties-state-Type-declaration-Returns}%

`S`

## Методы %{#Methods}%

### hydrate %{#Methods-hydrate}%

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Позволяет гидратировать хранилище во время SSR, когда в определении хранилища используется сложное состояние (например, только рефссылки на стороне клиента) и копирования значения из `pinia.state` недостаточно.

**`Пример`**

Если в вашем `state` вы используете какие-либо `customRef`, какие-либо `computed`, или какие-либо `ref`, которые имеют разное значение на Сервере и Клиенте, вам необходимо вручную гидрировать их. Например, пользовательской ссылкой, которая хранится в локальном хранилище:

```ts
const useStore = defineStore('main', {
    state: () => ({
        n: useLocalStorage('key', 0),
    }),
    hydrate(storeState, initialState) {
        // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
        storeState.n = useLocalStorage('key', 0)
    },
})
```

#### Параметры %{#Methods-hydrate-Parameters}%

| Имя            | Тип               | Описание                      |
| :------------- | :---------------- | :---------------------------- |
| `storeState`   | `UnwrapRef`<`S`\> | текущее состояние в хранилище |
| `initialState` | `UnwrapRef`<`S`\> | initialState                  |

#### Возвращает %{#Methods-hydrate-Returns}%

`void`
