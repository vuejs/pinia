---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation del'API](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Interface: Pinia

[pinia](../modules/pinia.md).Pinia

Chaque application doit posséder son propre pinia pour pouvoir créer des stores.

## Hierarchy

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Properties

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Défini dans

[pinia/src/rootStore.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L51)

## Les méthodes

### installation

▸ **install**(`app`): `void`

#### Les Paramètres

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

#### Renvoie à

`void`

#### Défini dans

[pinia/src/rootStore.ts:46](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L46)

___

### utiliser

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Ajout d'un plugin de store pour étendre chaque store

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Renvoie à

[`Pinia`](pinia.Pinia.md)

#### Défini dans

[pinia/src/rootStore.ts:58](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L58)
