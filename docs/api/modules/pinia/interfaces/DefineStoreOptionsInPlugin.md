# Interface: DefineStoreOptionsInPlugin<Id, S, G, A\>

Available `options` when creating a pinia plugin.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../type_aliases.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- `Omit`<[`DefineStoreOptions`](DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"`` \| ``"actions"``\>

  ↳ **`DefineStoreOptionsInPlugin`**

## Properties

### actions

• **actions**: `A`

Extracted object of actions. Added by useStore() when the store is built
using the setup API, otherwise uses the one passed to `defineStore()`.
Defaults to an empty object if no actions are defined.

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../type_aliases.md#storewithgetters)<`G`\> & [`PiniaCustomProperties`](PiniaCustomProperties.md)<`string`, [`StateTree`](../type_aliases.md#statetree), [`_GettersTree`](../type_aliases.md#getterstree)<[`StateTree`](../type_aliases.md#statetree)\>, [`_ActionsTree`](../type_aliases.md#actionstree)\>\> & [`_GettersTree`](../type_aliases.md#getterstree)<`S`\>

Optional object of getters.

#### Inherited from

Omit.getters

___

### state

• `Optional` **state**: () => `S`

#### Type declaration

▸ (): `S`

Function to create a fresh state. **Must be an arrow function** to ensure
correct typings!

##### Returns

`S`

#### Inherited from

Omit.state

## Methods

### hydrate

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### Returns

`void`

#### Inherited from

Omit.hydrate
