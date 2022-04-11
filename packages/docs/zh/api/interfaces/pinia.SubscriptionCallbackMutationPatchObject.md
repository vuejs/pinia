---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / SubscriptionCallbackMutationPatchObject

# 接口：SubscriptionCallbackMutationPatchObject<S\>

[pinia](../modules/pinia.md).SubscriptionCallbackMutationPatchObject

当 `store.$patch()` 与一个对象一起被调用时，
传递给订阅回调的上下文。

## 类型参数

| Name |
| :------ |
| `S` |

## 层次结构{#hierarchy}

- [`_SubscriptionCallbackMutationBase`](pinia._SubscriptionCallbackMutationBase.md)

  ↳ **`SubscriptionCallbackMutationPatchObject`**

## 属性{#properties}

### 事件{#events}

• **events**: `DebuggerEvent`[]

仅限 DEV， patch 调用的数组

#### 定义于

[pinia/src/types.ts:110](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L110)

___

### payload

• **payload**: `_DeepPartial`<`S`\>

传递给 `store.$patch()` 的对象

#### 定义于

[pinia/src/types.ts:115](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L115)

___

### storeId

• **storeId**: `string`

执行 mutation 的 store 的 `id`

#### 继承于

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[storeId](pinia._SubscriptionCallbackMutationBase.md#storeid)

#### 定义于

[pinia/src/types.ts:81](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L81)

___

### 类型{#type}

• **type**: [`patchObject`](../enums/pinia.MutationType.md#patchobject)

mutation 的类型

### 重写{#overrides}

[_SubscriptionCallbackMutationBase](pinia._SubscriptionCallbackMutationBase.md).[type](pinia._SubscriptionCallbackMutationBase.md#type)

#### 定义于

[pinia/src/types.ts:105](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L105)
