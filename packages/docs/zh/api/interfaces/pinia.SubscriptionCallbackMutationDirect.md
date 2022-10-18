---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationDirect

# 接口：SubscriptionCallbackMutationDirect {#interface-subscriptioncallbackmutationdirect}

[pinia](../modules/pinia.md).SubscriptionCallbackMutationDirect

当用 `store.someState = newValue` 
或 `store.$state.someState = newValue` 直接改变 store 的状态时，
传递给订阅回调的上下文。

## 层次结构 {#hierarchy}

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationDirect`**

## 属性 {#properties}

### 事件 {#events}

• **events**: `DebuggerEvent`

只支持开发环境。不同的 mutation 调用。

___

### storeId {#storeid}

• **storeId**: `string`

执行 mutation 的 store 的 `id`

#### 继承于 {#inherited-from}

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

___

### 类型 {#type}

• **type**: [`direct`](../enums/pinia.MutationType.md#direct)

mutation 的类型

#### 重写 {#overrides}

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)
