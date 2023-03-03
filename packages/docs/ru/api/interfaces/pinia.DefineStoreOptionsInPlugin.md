---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsInPlugin

# Интерфейс: DefineStoreOptionsInPlugin<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptionsInPlugin

Доступные `options` при создании плагина pinia.

## Типы параметров %{#Type-parameters}%

| Имя  | Тип                                                  |
| :--- | :--------------------------------------------------- |
| `Id` | extends `string`                                     |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | `G`                                                  |
| `A`  | `A`                                                  |

## Иерархия %{#Hierarchy}%

-   `Omit`<[`DefineStoreOptions`](pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, `"id"` \| `"actions"`\>

    ↳ **`DefineStoreOptionsInPlugin`**

## Свойства %{#Properties}%

### экшены %{#Properties-actions}%

• **actions**: `A`

Извлеченный объект экшена. Добавляется useStore(), если хранилище создается с помощью API setup, в противном случае используется тот, который был передан в `defineStore()`.
По умолчанию пустой объект, если действия не определены.

---

### getters %{#Properties-getters}%

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\> & [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>

Необязательный объект геттеров.

#### Унаследовано от %{#Properties-getters-Inherited-from}%

Omit.getters

---

### состояние %{#Properties-state}%

• `Optional` **state**: () => `S`

#### Объявление типа %{#Properties-state-Type-declaration}%

▸ (): `S`

Функция для создания нового состояния. **Должна быть стрелочной функцией** для обеспечения правильного набора!

##### Возвращает %{#Properties-state-Type-declaration-Returns}%

`S`

#### Унаследовано от %{#Properties-state-Inherited-from}%

Omit.state

## Методы %{#Methods}%

### hydrate %{#Methods-hydrate}%

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Позволяет гидратировать хранилище во время SSR, когда в определении хранилища используется сложное состояние (например, только рефссылки на стороне клиента) и копирования значения из `pinia.state` недостаточно.

**`Пример`**

Если в вашем `state` вы используете какие-либо `customRef`, какие-либо `computed` или какие-либо `ref`, которые имеют разное значение на сервере и клиенте, вам необходимо вручную гидрировать их. Например, пользовательский ref, который хранится в локальном хранилище:

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

#### Унаследовано от %{#Methods-hydrate-Inherited-from}%

Omit.hydrate
