---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# 接口：PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

传递给 Pinia 插件的上下文参数。

## 类型参数

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## 属性{#properties}

### app

• **app**: `App`<`any`\>

用 `Vue.createApp() `创建的当前应用程序。

#### 定义于

[pinia/src/rootStore.ts:117](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L117)

___

### options

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

目前正在扩展的 store 

#### 定义于

[pinia/src/rootStore.ts:127](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L127)

___

### pinia

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia 实例

#### 定义于

[pinia/src/rootStore.ts:112](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L112)

___

### store

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

目前正在扩展的 store 

#### 定义于

[pinia/src/rootStore.ts:122](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L122)
