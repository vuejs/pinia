---
sidebar: 'auto'
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# 接口：PiniaPluginContext<Id, S, G, A\> %{#interface-piniaplugincontext-id-s-g-a}%

[pinia](../modules/pinia.md).PiniaPluginContext

传递给 Pinia 插件的上下文参数。

## 类型参数 %{#type-parameters}%

| Name | Type                                                                                                |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## 属性

### app %{#app}%

• **app**: `App`<`any`\>

用 `Vue.createApp()`创建的当前应用。

---

### options %{#options}%

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

调用 `defineStore()` 时定义 store 的初始选项。

---

### pinia %{#pinia}%

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia 实例

---

### store %{#store}%

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

目前正在扩展的 store
