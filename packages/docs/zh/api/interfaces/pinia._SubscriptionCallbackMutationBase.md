---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / \_SubscriptionCallbackMutationBase

# 接口：\_SubscriptionCallbackMutationBase %{#interface-subscriptioncallbackmutationbase}%

[pinia](../modules/pinia.md)._SubscriptionCallbackMutationBase

传递给订阅回调的上下文的基本类型。内部类型。

## 层次结构 %{#hierarchy}%

- **`_SubscriptionCallbackMutationBase`**

  ↳ [`SubscriptionCallbackMutationDirect`](pinia.SubscriptionCallbackMutationDirect.md)

  ↳ [`SubscriptionCallbackMutationPatchFunction`](pinia.SubscriptionCallbackMutationPatchFunction.md)

  ↳ [`SubscriptionCallbackMutationPatchObject`](pinia.SubscriptionCallbackMutationPatchObject.md)

## 属性

### storeId %{#storeid}%

• **storeId**: `string`

执行 mutation 的 store 的`id`。

___

### 类型 %{#type}%

• **type**: [`MutationType`](../enums/pinia.MutationType.md)

mutation 的类型
