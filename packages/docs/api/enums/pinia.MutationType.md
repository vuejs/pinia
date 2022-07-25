---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / MutationType

# Enumeration: MutationType

[pinia](../modules/pinia.md).MutationType

Possible types for SubscriptionCallback

## Enumeration Members

### direct

• **direct** = ``"direct"``

Direct mutation of the state:

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

#### Defined in

[packages/pinia/src/types.ts:50](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L50)

___

### patchFunction

• **patchFunction** = ``"patch function"``

Mutated the state with `$patch` and a function

- `store.$patch(state => state.name = 'newName')`

#### Defined in

[packages/pinia/src/types.ts:64](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L64)

___

### patchObject

• **patchObject** = ``"patch object"``

Mutated the state with `$patch` and an object

- `store.$patch({ name: 'newName' })`

#### Defined in

[packages/pinia/src/types.ts:57](https://github.com/vuejs/pinia/blob/aa0192a/packages/pinia/src/types.ts#L57)
