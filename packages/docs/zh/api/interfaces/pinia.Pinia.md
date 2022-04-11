---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / Pinia

# 接口：Pinia

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## 层次结构{#hierarchy}

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## 属性{#properties}

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### 定义于

[pinia/src/rootStore.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L51)

## 方法

### install

▸ **install**(`app`): `void`

#### 参数

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

#### 返回值

`void`

#### 定义于

[pinia/src/rootStore.ts:46](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L46)

___

### use

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

添加 store 插件来扩展每一个 store

#### 参数

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### 返回值

[`Pinia`](pinia.Pinia.md)

#### 定义于

[pinia/src/rootStore.ts:58](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L58)
