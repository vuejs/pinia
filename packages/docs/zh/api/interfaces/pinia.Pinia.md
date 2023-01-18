---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / Pinia

# 接口：Pinia %{#interface-pinia}%

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## 层次结构 %{#hierarchy}%

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## 属性

### 安装 %{#install}%

• **install**: (`app`: `App`<`any`\>) => `void`

#### 类型声明 %{#type-declaration}%

▸ (`app`): `void`

##### 参数

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

##### 返回值

`void`

___

### state %{#state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

根 state

## 方法 %{#methods}%

### use %{#use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

添加 store 插件来扩展每一个 store

#### 参数 %{#paramters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### 返回值

[`Pinia`](pinia.Pinia.md)
