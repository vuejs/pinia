---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / MutationType

# Enumeration: MutationType

Possible types for SubscriptionCallback

## Enumeration Members

### direct

> **direct**: `"direct"`

Direct mutation of the state:

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

***

### patchFunction

> **patchFunction**: `"patch function"`

Mutated the state with `$patch` and a function

- `store.$patch(state => state.name = 'newName')`

***

### patchObject

> **patchObject**: `"patch object"`

Mutated the state with `$patch` and an object

- `store.$patch({ name: 'newName' })`
