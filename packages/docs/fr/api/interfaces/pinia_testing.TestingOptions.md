---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation API](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# Interface: TestingOptions

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## Propriétés

### fakeApp

• `Optional` **fakeApp**: `boolean`

Crée une application vide et appelle `app.use(pinia)` avec le test créé
pinia. Ceci vous permet d'utiliser des plugins tout en stockant des tests unitaires, car
Les plugins **attendent que pinia soit installé pour être exécutés**.
La valeur par défaut est false.

#### Défini dans

[testing/src/testing.ts:45](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L45)

___

### initialState

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

Permet de définir un état initial partiel de tous vos stores. Cet état est appliqué après la création d'un store,
ce qui vous permet de ne définir que les quelques propriétés requises dans votre test.

#### Défini dans

[testing/src/testing.ts:15](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L15)

___

### Les plugins

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

Plugins à installer avant le plugin de test. Ajoutez tous les plugins utilisés dans
votre application qui sera utilisée lors des tests.

#### Défini dans

[testing/src/testing.ts:21](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L21)

___

### stubActions

• `Optional` **stubActions**: `boolean`

Lorsqu'il est défini à false, les actions sont seulement espionnées, elles sont toujours exécutées. Lorsque
défini à true, les actions seront remplacées par des espions, ce qui aura pour conséquence que leur code
code ne sera pas exécuté. La valeur par défaut est true. NOTE : lorsque vous fournissez `createSpy()`,
il rendra **seulement** l'argument `fn` `undefined`. Vous devez toujours
gérer cela dans `createSpy()`.

#### Défini dans

[testing/src/testing.ts:30](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L30)

___

### stubPatch

• `Optional` **stubPatch**: `boolean`

Lorsqu'il a la valeur true, les appels à `$patch()` ne changeront pas l'état. La valeur par défaut est
false. NOTE : lorsque vous fournissez `createSpy()`, il rendra **seulement** l'argument `fn`
l'argument `undefined`. Vous devez toujours le gérer dans `createSpy()`.

#### Défini dans

[testing/src/testing.ts:37](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L37)

## Les Methods

### createSpy

▸ `Optional` **createSpy**(`fn?`): (...`args`: `any`[]) => `any`

Fonction utilisée pour créer un espion pour les actions et `$patch()`. Pré-configuré
avec `jest.fn()` dans les projets jest.

#### Les paramètres

| Name | Type |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

#### Renvoie à

`fn`

▸ (...`args`): `any`

##### Les paramètres

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Renvoie à

`any`

#### Défini dans

[testing/src/testing.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L51)
