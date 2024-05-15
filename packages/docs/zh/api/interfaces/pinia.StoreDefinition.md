---
sidebar: 'auto'
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# 接口：StoreDefinition<Id, S, G, A\> %{#interface-storedefinition-id-s-g-a}%

[pinia](../modules/pinia.md).StoreDefinition

## 类型参数 %{#type-parameters}%

| 名称 | 类型                                                                                                |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## Callable %{#callable}%

### StoreDefinition %{#storedefinition}%

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

返回一个 store，有需要才创建它。

#### 参数

| 名称     | 类型                                               | 描述                                 |
| :------- | :------------------------------------------------- | :----------------------------------- |
| `pinia?` | `null` \| [`Pinia`](pinia.Pinia.md)                | Pinia instance to retrieve the store |
| `hot?`   | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev only hot module replacement      |

#### 返回值

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

## 属性

### $id %{#id}%

• **$id**: `Id`

store 的 id。供映射辅助函数使用。
