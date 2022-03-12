---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchFunction

# Interface: SubscriptionCallbackMutationPatchFunction

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchFunction

Contexte transmis à un callback d'abonnement lorsque `store.$patch()` est appelé
avec une fonction.

## Hierarchy

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchFunction`**

## Properties

### événements

• **events**: `DebuggerEvent`[]

SEULEMENT EN DEV. Tableau de toutes les mutations effectuées à l'intérieur du callback.

#### Défini dans

[pinia/src/types.ts:129](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L129)

___

### storeId

• **storeId**: `string`

`id' du store effectuant la mutation.

#### Héritée de

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

#### Défini dans

[pinia/src/types.ts:81](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L81)

___

### type

• **type**: [`patchFunction`](../enums/pinia.MutationType.md#patchfunction)

Type de mutation.

#### Remplacement de

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)

#### Défini dans

[pinia/src/types.ts:124](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L124)
