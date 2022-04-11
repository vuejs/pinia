---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / @pinia/testing

# 模块：@pinia/testing

## 接口{#interfaces}

- [TestingOptions](../interfaces/pinia_testing.TestingOptions.md)
- [TestingPinia](../interfaces/pinia_testing.TestingPinia.md)

## 函数

### createTestingPinia

▸ **createTestingPinia**(`options?`): [`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

创建一个为单元测试设计的 pinia 实例，**需要 mocking** store。
默认情况下，**所有的 action 都是模拟的**，因此不执行。
这允许你对你的 store 和组件进行单独的单元测试。
你可以通过 `stubActions` 选项来改变这一点。如果你使用 jest，
将它们替换为 `jest.fn()`，
否则，你必须提供你自己的 `createSpy` 选项。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `options` | [`TestingOptions`](../interfaces/pinia_testing.TestingOptions.md) | 配置用于测试 pinia 的选项 |

#### 返回值

[`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

一个增强的 Pinia 实例

#### 定义于

[testing/src/testing.ts:74](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L74)
