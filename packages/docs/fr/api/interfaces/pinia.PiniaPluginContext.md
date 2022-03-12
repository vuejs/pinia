---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Interface: PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

Argument contextuel passé aux plugins Pinia.

## Les types paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## Les propriétés

### app

• **app**: `App`<`any`\>

Application actuelle créée avec `Vue.createApp()`.

#### Defined in

[pinia/src/rootStore.ts:117](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L117)

___

### options

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Current store being extended.

#### Défini dans

[pinia/src/rootStore.ts:127](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L127)

___

### pinia

• **pinia**: [`Pinia`](pinia.Pinia.md)

L'instance de pinia.


#### Défini dans

[pinia/src/rootStore.ts:112](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L112)

___

### store

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Le store actuel est en cours d'extension.

#### Défini dans

[pinia/src/rootStore.ts:122](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L122)
