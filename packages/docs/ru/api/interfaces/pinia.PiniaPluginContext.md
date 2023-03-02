---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Интерфейс: PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

Context argument passed to Pinia plugins.

## Type parameters %{#Type-parameters}%

| Имя  | Тип                                                                                                 |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## Свойства %{#Properties}%

### app %{#Properties-app}%

• **app**: `App`<`any`\>

Current app created with `Vue.createApp()`.

---

### options %{#Properties-options}%

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Initial options defining the store when calling `defineStore()`.

---

### pinia %{#Properties-pinia}%

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia instance.

---

### store %{#Properties-store}%

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Current store being extended.
