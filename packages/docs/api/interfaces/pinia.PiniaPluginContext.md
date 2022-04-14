---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Interface: PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

Context argument passed to Pinia plugins.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Properties

### app

• **app**: `App`<`any`\>

Current app created with `Vue.createApp()`.

#### Defined in

[packages/pinia/src/rootStore.ts:117](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L117)

___

### options

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Current store being extended.

#### Defined in

[packages/pinia/src/rootStore.ts:127](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L127)

___

### pinia

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia instance.

#### Defined in

[packages/pinia/src/rootStore.ts:112](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L112)

___

### store

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Current store being extended.

#### Defined in

[packages/pinia/src/rootStore.ts:122](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L122)
