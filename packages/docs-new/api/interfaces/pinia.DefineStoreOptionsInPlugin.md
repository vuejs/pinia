---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsInPlugin

# Interface: DefineStoreOptionsInPlugin<Id, S, G, A\> %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>}%

[pinia](../modules/pinia.md).DefineStoreOptionsInPlugin

Available `options` when creating a pinia plugin.

## Type parameters %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Hierarchy}%

- `Omit`<[`DefineStoreOptions`](pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"`` \| ``"actions"``\>

  ↳ **`DefineStoreOptionsInPlugin`**

## Properties %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties}%

### actions %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-actions}%

• **actions**: `A`

Extracted object of actions. Added by useStore() when the store is built
using the setup API, otherwise uses the one passed to `defineStore()`.
Defaults to an empty object if no actions are defined.

___

### getters %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-getters}%

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\> & [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>

Optional object of getters.

#### Inherited from %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-getters-Inherited-from}%

Omit.getters

___

### state %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-state}%

• `Optional` **state**: () => `S`

#### Type declaration %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-state-Type-declaration}%

▸ (): `S`

Function to create a fresh state. **Must be an arrow function** to ensure
correct typings!

##### Returns %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-state-Type-declaration-Returns}%

`S`

#### Inherited from %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Properties-state-Inherited-from}%

Omit.state

## Methods %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Methods}%

### hydrate %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Methods-hydrate}%

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Allows hydrating the store during SSR when complex state (like client side only refs) are used in the store
definition and copying the value from `pinia.state` isn't enough.

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

#### Parameters %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Methods-hydrate-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### Returns %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Methods-hydrate-Returns}%

`void`

#### Inherited from %{#Interface:-DefineStoreOptionsInPlugin<Id,-S,-G,-A\>-Methods-hydrate-Inherited-from}%

Omit.hydrate
