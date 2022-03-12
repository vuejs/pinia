---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# Interface: StoreDefinition<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

## Les types de paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## Appelable

### StoreDefinition

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Renvoie un store, le crée si nécessaire.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](pinia.Pinia.md) | Instance Pinia pour récupérer le store |
| `hot?` | [`StoreGeneric`](../modules/pinia.md#storegeneric) | seulement en dev remplacement du module chaud  |

#### Returns

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

#### Défini dans

[pinia/src/types.ts:513](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L513)

## Les propriétés

### $id

• **$id**: `Id`

Id du store. Utilisé par les aides de la carte.

#### Défini dans

[pinia/src/types.ts:518](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L518)
