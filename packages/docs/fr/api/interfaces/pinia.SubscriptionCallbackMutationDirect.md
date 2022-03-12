---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationDirect

# Interface: SubscriptionCallbackMutationDirect

[pinia](../modules/pinia.md).SubscriptionCallbackMutationDirect

Contexte transmis à un callback d'abonnement lors d'une mutation directe de l'état d'un store avec `store.someState = newValue` ou `store.$state.someState = newValue`.
un store avec `store.someState = newValue` ou `store.$state.someState =
nouvelleValeur`.

## Hiérarchie

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationDirect`**

## Propriétés

### événements

• **events**: `DebuggerEvent`

DEV ONLY. Different mutation calls.

#### Défini dans

[pinia/src/types.ts:96](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L96)

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

• **type**: [`direct`](../enums/pinia.MutationType.md#direct)

Type de mutation.

#### Remplacement de

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)

#### Défini dans

[pinia/src/types.ts:91](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L91)
