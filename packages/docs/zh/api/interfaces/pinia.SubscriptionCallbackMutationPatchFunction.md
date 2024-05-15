---
sidebar: 'auto'
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchFunction

# 接口：SubscriptionCallbackMutationPatchFunction %{#interface-subscriptioncallbackmutationpatchfunction}%

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchFunction

当 `store.$patch()` 被一个函数调用时，
传递给订阅回调的上下文。

## 层次结构 %{#hierarchy}%

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchFunction`**

## 属性

### 事件 %{#events}%

• **events**: `DebuggerEvent`[]

仅限开发环境。在回调中所有已完成的 mutation 的数组。

---

### storeId %{#storeid}%

• **storeId**: `string`

执行 mutation 的 store 的 `id`

#### 继承于

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

---

### 类型 %{#type}%

• **type**: [`patchFunction`](../enums/pinia.MutationType.md#patchfunction)

mutation 的类型

#### 重写 %{#overrides}%

[\_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
