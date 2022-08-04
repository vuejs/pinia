# Interface: PiniaPluginContext<Id, S, G, A\>

Context argument passed to Pinia plugins.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../type_aliases.md#statetree) = [`StateTree`](../type_aliases.md#statetree) |
| `G` | [`_GettersTree`](../type_aliases.md#getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../type_aliases.md#actionstree) |

## Properties

### app

• **app**: `App`<`any`\>

Current app created with `Vue.createApp()`.

___

### options

• **options**: [`DefineStoreOptionsInPlugin`](DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Initial options defining the store when calling `defineStore()`.

___

### pinia

• **pinia**: [`Pinia`](Pinia.md)

pinia instance.

___

### store

• **store**: [`Store`](../type_aliases.md#store)<`Id`, `S`, `G`, `A`\>

Current store being extended.
