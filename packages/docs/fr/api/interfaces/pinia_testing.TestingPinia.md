---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Interface: TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Instance Pinia spécialement conçue pour les tests. Étend une instance régulière
[Pinia](pinia.Pinia.md) ordinaire avec des propriétés spécifiques aux tests.

## Hiérarchie

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## Les Propriétés

### app

• **app**: `App`<`any`\>

Application utilisée par Pinia

#### Défini dans

[testing/src/testing.ts:60](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L60)

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

l'état de state

#### Hérité de

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

#### Défini dans

[pinia/src/rootStore.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L51)

## Les méthodes

### installer

▸ **install**(`app`): `void`

#### Paramètres

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

#### Renvoie à

`void`

#### Hérité de

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

#### Défini dans

[pinia/src/rootStore.ts:46](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L46)

___

### Utiliser

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Ajout d'un plugin de store pour étendre chaque store

#### Paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Renvoie à

[`Pinia`](pinia.Pinia.md)

#### Hérité de

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)

#### Défini dans

[pinia/src/rootStore.ts:58](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L58)
