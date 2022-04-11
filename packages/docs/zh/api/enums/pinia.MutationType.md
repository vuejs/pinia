---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / MutationType

# Enumeration: MutationType

[pinia](../modules/pinia.md).MutationType

SubscriptionCallback 的可能类型

## Enumeration members

### direct

• **direct** = `"direct"`

Direct mutation of the state:

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

#### 定义于

[pinia/src/types.ts:50](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L50)

___

### patchFunction

• **patchFunction** = `"patch function"`

用 `$patch` 和一个函数更改了 state：

- `store.$patch(state => state.name = 'newName')`

#### 定义于

[pinia/src/types.ts:64](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L64)

___

### patchObject

• **patchObject** = `"patch object"`

用 `$patch` 和一个函数更改了 state：

- `store.$patch({ name: 'newName' })`

#### 定义于

[pinia/src/types.ts:57](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L57)
