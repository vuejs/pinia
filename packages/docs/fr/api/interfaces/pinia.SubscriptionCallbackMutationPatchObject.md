---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Do de l'APIcumentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# Interface: SubscriptionCallbackMutationPatchObject<S\>

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

Contexte transmis à un callback d'abonnement lorsque `store.$patch()` est appelé
avec un objet.

## Les types de paramètres

| Name |
| :------ |
| `S` |

## Hiérarchie

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## Propriétés

### events

• **events**: `DebuggerEvent`[]

SEULEMENT EN DEV. Tableau pour les appels de patch.

#### Défini dans

[pinia/src/types.ts:110](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L110)

___

### payload

• **payload**: `_DeepPartial`<`S`\>

Objet passé à `store.$patch()`.

#### Défini dans

[pinia/src/types.ts:115](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L115)

___

### storeId

• **storeId**: `string`

`id' du store qui effectue la mutation.

#### Hérité de

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

#### Défini dans

[pinia/src/types.ts:81](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L81)

___

### type

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchobject)

Type de mutation.

#### Remplacement de

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)

#### Défini dans

[pinia/src/types.ts:105](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L105)
