---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / DefineSetupStoreOptions

# Interface: DefineSetupStoreOptions\<Id, S, G, A\>

Options parameter of `defineStore()` for setup stores. Can be extended to
augment stores with the plugin API.

## See

[DefineStoreOptionsBase](DefineStoreOptionsBase.md).

## Extends

- [`DefineStoreOptionsBase`](DefineStoreOptionsBase.md)\<`S`, [`Store`](../type-aliases/Store.md)\<`Id`, `S`, `G`, `A`\>\>

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G**

• **A**

## Properties

### actions?

> `optional` **actions**: `A`

Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
creating the store. Can be used in plugins to get the list of actions in a
store defined with a setup function. Note this is always defined
