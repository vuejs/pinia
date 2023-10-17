---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Interface: PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

Context argument passed to Pinia plugins.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#StateTree) = [`StateTree`](../modules/pinia.md#StateTree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_GettersTree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_ActionsTree) |

## Properties

### app

• **app**: `App`<`any`\>

Current app created with `Vue.createApp()`.

___

### options

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Initial options defining the store when calling `defineStore()`.

___

### pinia

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia instance.

___

### store

• **store**: [`Store`](../modules/pinia.md#Store)<`Id`, `S`, `G`, `A`\>

Current store being extended.
