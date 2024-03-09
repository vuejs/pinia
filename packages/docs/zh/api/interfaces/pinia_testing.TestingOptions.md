---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# 接口：TestingOptions %{#interface-testingoptions}%

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## 属性

### createSpy %{#createspy}%

• `Optional` **createSpy**: (`fn?`: (...`args`: `any`[]) => `any`) => (...`args`: `any`[]) => `any`

#### 类型声明 %{#type-declaration}%

▸ (`fn?`): (...`args`: `any`[]) => `any`

用于创建 action 和 `$patch()` 的 spy 的函数。
在 jest 项目中默认为 `jest.fn()`，在 vitest 项目中默认为 `vi.fn()`。

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

##### 返回值

`fn`

▸ (...`args`): `any`

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `...args` | `any`[] |

##### 返回值

`any`

___

### fakeApp %{#fakeapp}%

• `Optional` **fakeApp**: `boolean`

创建一个空的 App，并通过创建的测试 pinia 调用 `app.use(pinia)`。
这样可以让你在单元测试时使用插件，
因为插件**必须等待 pinia 安装好后才会执行**。
默认为 false。

___

### initialState %{#initialstate}%

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

允许你定义每个 store 的部分初始 state。
这个 state 会在 store 创建后被应用，这样可以让你只设置测试中需要的几个属性。

___

### 插件 %{#plugins}%

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

在测试插件之前必装的插件。
可以向你的应用添加测试时使用的任意插件。

___

### stubActions %{#stubactions}%

• `Optional` **stubActions**: `boolean`

当设置为 false 时， actions 只会被监听，它们仍然会执行。
当设置为 true 时，actions 将被替换为 spies，导致其代码不被执行。
默认为 true。
注意：当提供 `createSpy()` 时，它将**只**给 `fn` 参数 传递 `undefined`。
你仍然需要在 `createSpy()` 中处理这个问题。

___

### stubPatch %{#stubpatch}%

• `Optional` **stubPatch**: `boolean`

当设置为 true 时，对 `$patch()` 的调用将不会改变状态。
默认为 false。注意：当提供 `createSpy()` 时，它将**只**给 `fn` 参数 传递 `undefined`。
你仍然需要在 `createSpy()` 中处理这个问题。
