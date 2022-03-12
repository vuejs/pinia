---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsBase

# Interface: DefineStoreOptionsBase<S, Store\>

[pinia](../modules/pinia.md).DefineStoreOptionsBase

Les options passées à `defineStore()` qui sont communes aux stores d'options et d'installation.
et setup. Étendez cette interface si vous voulez ajouter des options personnalisées aux deux types
de stores.

## Les types de paramètres

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `Store` | `Store` |

## Hiérarchie

- **`DefineStoreOptionsBase`**

  ↳ [`DefineStoreOptions`](pinia.DefineStoreOptions.md)

  ↳ [`DefineSetupStoreOptions`](pinia.DefineSetupStoreOptions.md)
