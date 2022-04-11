---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# 接口：\_SubscriptionCallbackMutationBase

[pinia](../modules/pinia.md)._SubscriptionCallbackMutationBase

传递给订阅回调的上下文的基本类型。内部类型。

## 层次结构{#hierarchy}

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## 属性{#properties}

### storeId

• **storeId**: `string`

执行 mutation 的 store 的`id`。

#### 定义于

[pinia/src/types.ts:81](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L81)

___

### 类型{#type}

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

mutation 的类型

#### 定义于

[pinia/src/types.ts:76](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L76)
