---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# 接口：TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

专门为测试设计的 Pinia 实例。
用测试中特定属性扩展普通的 [Pinia](pinia.Pinia.md) 实例。

## 层次结构{#hierarchy}

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## 属性{#properties}

### app

• **app**: `App`<`any`\>

Pinia 使用的应用程序

#### 定义于

[testing/src/testing.ts:60](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L60)

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### 继承于

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

#### 定义于

[pinia/src/rootStore.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L51)

## 方法

### 安装

▸ **install**(`app`): `void`

#### 参数

| 名称 | 类型 |
| :------ | :------ |
| `app` | `App`<`any`\> |

#### 返回值

`void`

#### 继承于

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

#### 定义于

[pinia/src/rootStore.ts:46](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L46)

___

### use

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

增加了一个 store 插件来扩展每个  store

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### 返回值

[`Pinia`](pinia.Pinia.md)

#### 继承于

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)

#### 定义于

[pinia/src/rootStore.ts:58](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L58)
