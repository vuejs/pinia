---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / StoreDefinition

# 接口：StoreDefinition<Id, S, G, A\>

[pinia](../modules/pinia.md).StoreDefinition

## 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## Callable

### StoreDefinition

▸ **StoreDefinition**(`pinia?`, `hot?`): [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

返回一个 store，如果需要的话，创建它。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `pinia?` | ``null`` \| [`Pinia`](pinia.Pinia.md) | Pinia instance to retrieve the store |
| `hot?` | [`StoreGeneric`](../modules/pinia.md#storegeneric) | dev only hot module replacement |

#### 返回值

[`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

#### 定义于

[pinia/src/types.ts:513](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L513)

## 属性{#properties}

### $id

• **$id**: `Id`

 store 的 id。由 map helpers 使用。

#### 定义于

[pinia/src/types.ts:518](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L518)
