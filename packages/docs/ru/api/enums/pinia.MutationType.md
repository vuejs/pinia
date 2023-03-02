---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / MutationType

# Перечисление: MutationType

[pinia](../modules/pinia.md).MutationType

Возможные типы для SubscriptionCallback

## Элементы перечисления %{#Enumeration-Members}%

### direct %{#Enumeration-Members-direct}%

• **direct** = `"direct"`

Прямая мутация состояния:

- `store.name = 'new name'`
- `store.$state.name = 'new name'`
- `store.list.push('new item')`

---

### patchFunction %{#Enumeration-Members-patchFunction}%

• **patchFunction** = `"patch function"`

Изменение состояния с помощью `$patch` и функции

- `store.$patch(state => state.name = 'newName')`

---

### patchObject %{#Enumeration-Members-patchObject}%

• **patchObject** = `"patch object"`

Изменение состояния с помощью `$patch` и объекта

- `store.$patch({ name: 'newName' })`
