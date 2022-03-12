---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation API](../index.md) / [pinia](../modules/pinia.md) / MutationType

# Énumération : MutationType

[pinia](../modules/pinia.md).MutationType

Types possibles pour SubscriptionCallback

## Membres de l'énumération

### direct

• **direct** = `"direct"`

Mutation directe de l'état :

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

#### Défini dans

[pinia/src/types.ts:50](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L50)

___

### patchFunction

• **patchFunction** = `"patch function"`

Muté l'état avec `$patch` et une fonction

- `store.$patch(state => state.name = 'newName')`

#### Défini dans

[pinia/src/types.ts:64](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L64)

___

### patchObject

• **patchObject** = `"patch object"`

Muté l'état avec `$patch` et un objet

- `store.$patch({ name: 'newName' })`

#### Défini dans

[pinia/src/types.ts:57](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L57)
