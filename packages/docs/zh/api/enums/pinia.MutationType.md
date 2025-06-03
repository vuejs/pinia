---
sidebar: 'auto'
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / MutationType

# Enumeration: MutationType %{#enumeration-mutationtype}%

[pinia](../modules/pinia.md).MutationType

SubscriptionCallback 的可能类型

## Enumeration Members %{#enumeration-members}%

### direct %{#direct}%

• **direct** = `"direct"`

Direct mutation of the state:

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

---

### patchFunction %{#patchfunction}%

• **patchFunction** = `"patch function"`

通过 `$patch` 和一个函数更改 state：

- `store.$patch(state => state.name = 'newName')`

---

### patchObject %{#patchobject}%

• **patchObject** = `"patch object"`

通过 `$patch` 和一个对象更改 state：

- `store.$patch({ name: 'newName' })`
