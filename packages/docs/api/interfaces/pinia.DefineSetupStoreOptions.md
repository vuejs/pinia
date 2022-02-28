---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / DefineSetupStoreOptions

# Interface: DefineSetupStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineSetupStoreOptions

Options parameter of `defineStore()` for setup stores. Can be extended to
augment stores with the plugin API. @see [DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineSetupStoreOptions`**

## Properties

### actions

• `Optional` **actions**: `A`

Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
creating the store. Can be used in plugins to get the list of actions in a
store defined with a setup function. Note this is always defined

#### Defined in

[pinia/src/types.ts:706](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L706)
