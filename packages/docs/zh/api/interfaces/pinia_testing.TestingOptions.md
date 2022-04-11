---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# 接口：TestingOptions

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## 属性{#properties}

### fakeApp

• `Optional` **fakeApp**: `boolean`

创建一个空的 App，并通过创建的测试 pinia 调用 `app.use(pinia)`。
这允许你在单元测试时使用插件，
因为插件**会等待 pinia 安装好后才执行**。
默认为false。

#### 定义于

[testing/src/testing.ts:45](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L45)

___

### initialState

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

允许定义你所有 store 的部分初始状态。
这个状态应用于 store 被创建后，这允许你只设置测试中需要的几个属性。

#### 定义于

[testing/src/testing.ts:15](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L15)

___

### 插件

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

在测试插件之前必装的插件。
可以向你的应用程序添加测试时使用的任意插件。

#### 定义于

[testing/src/testing.ts:21](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L21)

___

### stubActions

• `Optional` **stubActions**: `boolean`

当设置为 false 时， action 只会被监听，它们仍然会执行。当设置为 true 时，action 将被替换为 spies，导致其代码不被执行。默认为 true。注意：当提供 `createSpy()` 时，它将**只**使 `fn` 参数 `undefined`。你仍然需要在 `createSpy()` 中处理这个问题。

#### 定义于

[testing/src/testing.ts:30](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L30)

___

### stubPatch

• `Optional` **stubPatch**: `boolean`

当设置为 true 时，对 `$patch()` 的调用将不会改变状态。默认为 false。注意：当提供 `createSpy()` 时，它将**只**使 `fn` 参数 `undefined`。你仍然需要在 `createSpy()` 中处理这个问题。

#### 定义于

[testing/src/testing.ts:37](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L37)

## 方法

### createSpy

▸ `Optional` **createSpy**(`fn?`): (...`args`: `any`[]) => `any`

用于创建 action 和 `$patch()` 的 spy 的函数。
在 jest 项目中使用 `jest.fn()` 预先配置。

#### 参数

| Name | Type |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

#### 返回值

`fn`

▸ (...`args`): `any`

##### 参数

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### 返回值

`any`

#### 定义于

[testing/src/testing.ts:51](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L51)
