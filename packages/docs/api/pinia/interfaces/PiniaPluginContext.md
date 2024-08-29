---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / PiniaPluginContext

# Interface: PiniaPluginContext\<Id, S, G, A\>

Context argument passed to Pinia plugins.

## Type Parameters

• **Id** *extends* `string` = `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md) = [`StateTree`](../type-aliases/StateTree.md)

• **G** = [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A** = [`_ActionsTree`](../type-aliases/ActionsTree.md)

## Properties

### app

> **app**: `App`\<`any`\>

Current app created with `Vue.createApp()`.

***

### options

> **options**: [`DefineStoreOptionsInPlugin`](DefineStoreOptionsInPlugin.md)\<`Id`, `S`, `G`, `A`\>

Initial options defining the store when calling `defineStore()`.

***

### pinia

> **pinia**: [`Pinia`](Pinia.md)

pinia instance.

***

### store

> **store**: [`Store`](../type-aliases/Store.md)\<`Id`, `S`, `G`, `A`\>

Current store being extended.
