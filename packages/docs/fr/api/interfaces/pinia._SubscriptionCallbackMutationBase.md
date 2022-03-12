---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'v](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# Interface: \_SubscriptionCallbackMutationBase

[pinia](../modules/pinia.md)._SubscriptionCallbackMutationBase

Type de base pour le contexte transmis à un callback d'abonnement. Type interne.

## Hiérarchie

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## Propriétés

### storeId

• **storeId**: `string`

`id' du store qui effectue la mutation.

#### Défini dans

[pinia/src/types.ts:81](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L81)

___

### type

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

Type de mutation.

#### Defined in

[pinia/src/types.ts:76](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L76)
