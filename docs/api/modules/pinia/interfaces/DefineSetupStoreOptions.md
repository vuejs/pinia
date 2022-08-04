# Interface: DefineSetupStoreOptions<Id, S, G, A\>

Options parameter of `defineStore()` for setup stores. Can be extended to
augment stores with the plugin API.

**`See`**

[DefineStoreOptionsBase](DefineStoreOptionsBase.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../index.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- [`DefineStoreOptionsBase`](DefineStoreOptionsBase.md)<`S`, [`Store`](../index.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineSetupStoreOptions`**

## Properties

### actions

• `Optional` **actions**: `A`

Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
creating the store. Can be used in plugins to get the list of actions in a
store defined with a setup function. Note this is always defined
