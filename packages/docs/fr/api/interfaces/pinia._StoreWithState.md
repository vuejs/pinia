---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / \_StoreWithState

# Interface: \_StoreWithState<Id, S, G, A\>

[pinia](../modules/pinia.md)._StoreWithState

Le Store de base avec état et fonctions. Ne doit pas être utilisé directement.

## Type Paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- [`StorePropriétés`](pinia.StorePropriétés.md)<`Id`\>

  ↳ **`_StoreWithState`**

## Propriétés

### $id

• **$id**: `Id`

Identifiant unique du store

#### Inherited from

[StorePropriétés](pinia.StorePropriétés.md).[$id](pinia.StorePropriétés.md#$id)

#### Défini dans

[pinia/src/types.ts:265](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L265)

___

### $state

• **$state**: `UnwrapRef`<`S`\> & `PiniaCustomStatePropriétés`<`S`\>

État du store. Si vous le définissez, l'état entier sera remplacé.

#### Défini dans

[pinia/src/types.ts:337](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L337)

## Les méthodes

### $dispose

▸ **$dispose**(): `void`

Arrête la portée de l'effet associé du store et la supprime du registre du store.
registre. Les plugins peuvent surcharger cette méthode pour nettoyer tout effet ajouté.
Par exemple, le plugin devtools arrête d'afficher les stores disposés de devtools.

#### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:425](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L425)

___

### $onAction

▸ **$onAction**(`callback`, `detached?`): () => `void`

Configure un callback qui sera appelé chaque fois qu'une action est sur le point d'être
invoquée. Le callback reçoit un objet avec toutes les informations pertinentes
de l'action invoquée :
- `store` : la zone de stockage sur lequel elle est invoquée
- `name` : Le nom de l'action
- `args` : Les paramètres passés à l'action

En plus de cela, il reçoit deux fonctions qui permettent de configurer un callback
lorsque l'action se termine ou lorsqu'elle échoue.

Il renvoie également à une fonction permettant de supprimer le callback. Notez que lorsque vous appelez
`store.$onAction()` à l'intérieur d'un composant, elle sera automatiquement nettoyée
nettoyé lorsque le composant sera démonté, sauf si `detached` est mis à true.

**`exemple`**

```js
store.$onAction(({ after, onError }) => {
 // Ici vous pouvez partager des variables entre tous les hooks ainsi que
 // mettre en place des watchers et les nettoyer
 after((resolvedValue) => {
   // peut être utilisé pour nettoyer les effets secondaires
.  // `resolvedValue` est la valeur retournée par l'action, si c'est un
.  // Promise, ce sera la valeur résolue au lieu de la Promise.
 })
 onError((error) => {
   // peut être utilisé pour transmettre les erreurs
 })
})
```

#### Les Paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`StoreOnActionListener`](../modules/pinia.md#storeonactionlistener)<`Id`, `S`, `G`, `A`\> | callback called before every action |
| `detached?` | `boolean` | détache l'abonnement du contexte à partir duquel il est appelé|
 
#### Renvoie à

`fn`

fonction qui supprime l'observateur

▸ (): `void`

Configure un callback qui sera appelé chaque fois qu'une action est sur le point d'être
invoquée. Le callback reçoit un objet avec toutes les informations pertinentes
de l'action invoquée :
- `store` : la zone de sttockage sur lequel elle est invoquée
- `name` : Le nom de l'action
- `args` : Les paramètres passés à l'action

En plus de cela, il reçoit deux fonctions qui permettent de configurer un callback
lorsque l'action se termine ou lorsqu'elle échoue.

Il renvoie également à une fonction permettant de supprimer le callback. Notez que lorsque vous appelez
`store.$onAction()` à l'intérieur d'un composant, elle sera automatiquement nettoyée
nettoyé lorsque le composant sera démonté, sauf si `detached` est mis à true.

**`exemple`**

```js
store.$onAction(({ after, onError }) => {
 // Ici vous pouvez partager des variables entre tous les hooks ainsi que
 // mettre en place des watchers et les nettoyer
 after((resolvedValue) => {
   // peut être utilisé pour nettoyer les effets secondaires
.  // `resolvedValue` est la valeur retournée par l'action, si c'est un
.  // Promise, ce sera la valeur résolue au lieu de la Promise.
 })
 onError((error) => {
   // peut être utilisé pour transmettre les erreurs
 })
})
```

##### Renvoie à

`void`

fonction qui supprime l'observateur

#### Défini dans

[pinia/src/types.ts:415](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L415)

___

### $patch

▸ **$patch**(`partialState`): `void`

Applique un patch d'état à l'état actuel. Permet de passer des valeurs imbriquées

#### Paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `partialState` | `_DeepPartial`<`UnwrapRef`<`S`\>\> | patch to apply to the state |

#### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:344](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L344)

▸ **$patch**<`F`\>(`stateMutator`): `void`

Regroupe plusieurs modifications dans une seule fonction. Utile lorsque la mutation d'objets tels que
des ensembles ou des tableaux et que l'application d'un patch d'objet n'est pas pratique, par exemple l'ajout de
à un tableau. La fonction passée à `$patch()` **doit être synchrone**.

#### Les types de Paramètres

| Name | Type |
| :------ | :------ |
| `F` | extends (`state`: `UnwrapRef`<`S`\>) => `any` |

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateMutator` | `ReturnType`<`F`\> étend `Promise`<`any`\> ? `never` : `F` | fonction qui modifie le `state`, ne peut pas être asynchrone. |

#### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:353](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L353)

___

### $reset

▸ **$reset**(): `void`

Réinitialise le store à son état initial en construisant un nouvel objet d'état.
TODO : faire cette option seulement

#### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:362](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L362)

___

### $subscribe

▸ **$subscribe**(`callback`, `options?`): () => `void`

Configure un callback qui sera appelé à chaque fois que l'état change. Il renvoie également à une fonction pour supprimer la callback. Note
que lorsque vous appelez `store.$subscribe()` à l'intérieur d'un composant, il sera automatiquement nettoyé lorsque le
composant est démonté, à moins que `detached` soit mis à true.

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`SubscriptionCallback`](../modules/pinia.md#subscriptioncallback)<`S`\> | callback passé au watcher |
| `options?` | { `detached?`: `boolean`  } & `WatchOptions`<`boolean`\> | `watch` options + `detached` pour détacher l'abonnement du contexte (généralement un composant) à partir duquel il est appelé. Notez que l'option `flush` n'affecte pas les appels à `store.$patch()`. |

#### Renvoie à

`fn`

Fonction qui supprime l'observateur

▸ () : `void`

Configure un callback qui sera appelé à chaque fois que l'état change. Il renvoie également à une fonction pour supprimer le callback. Note
que lorsque vous appelez `store.$subscribe()` à l'intérieur d'un composant, il sera automatiquement nettoyé lorsque le
composant est démonté, à moins que `detached` soit mis à true.

##### Renvoie à

`void`

fonction qui supprime l'observateur

#### Défini dans

[pinia/src/types.ts:374](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L374)
