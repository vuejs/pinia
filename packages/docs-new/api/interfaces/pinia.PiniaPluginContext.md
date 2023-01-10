---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Interface: PiniaPluginContext<Id, S, G, A\> %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>}%

[pinia](../modules/pinia.md).PiniaPluginContext

Context argument passed to Pinia plugins.

## Type parameters %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Properties %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Properties}%

### app %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Properties-app}%

• **app**: `App`<`any`\>

Current app created with `Vue.createApp()`.

___

### options %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Properties-options}%

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Initial options defining the store when calling `defineStore()`.

___

### pinia %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Properties-pinia}%

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia instance.

___

### store %{#Interface:-PiniaPluginContext<Id,-S,-G,-A\>-Properties-store}%

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Current store being extended.
