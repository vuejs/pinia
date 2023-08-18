---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptions

# Interface: DefineStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptions

Options parameter of `defineStore()` for option stores. Can be extended to
augment stores with the plugin API.

**`See`**

[DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineStoreOptions`**

## Properties

### actions

• `Optional` **actions**: `A` & `ThisType`<`A` & `UnwrapRef`<`S`\> & [`_StoreWithState`](pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\>

Optional object of actions.

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\> & [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>

Optional object of getters.

___

### id

• **id**: `Id`

Unique string key to identify the store across the application.

___

### state

• `Optional` **state**: () => `S`

#### Type declaration

▸ (): `S`

Function to create a fresh state. **Must be an arrow function** to ensure
correct typings!

##### Returns

`S`

## Methods

### hydrate

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Allows hydrating the store during SSR when complex state (like client side only refs) are used in the store
definition and copying the value from `pinia.state` isn't enough.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### Returns

`void`

**`Example`**

If in your `state`, you use any `customRef`s, any `computed`s, or any `ref`s that have a different value on
Server and Client, you need to manually hydrate them. e.g., a custom ref that is stored in the local
storage:

```ts
const useStore = defineStore('main', {
  state: () => ({
    n: useLocalStorage('key', 0)
  }),
  hydrate(storeState, initialState) {
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.n = useLocalStorage('key', 0)
  }
})
```
