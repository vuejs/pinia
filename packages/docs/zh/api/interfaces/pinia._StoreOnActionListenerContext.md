---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# 接口：\_StoreOnActionListenerContext<Store, ActionName, A\> %{#interface-storeonactionlistenercontext-store-actionname-a}%

[pinia](../modules/pinia.md)._StoreOnActionListenerContext

[StoreOnActionListenerContext](../modules/pinia.md#storeonactionlistenercontext)的实际类型。
存在的目的是重构。仅供内部使用。
**仅**供内部使用

## 类型参数 %{#type-parameters}%

| 名称 | 类型 |
| :------ | :------ |
| `Store` | `Store` |
| `ActionName` | extends `string` |
| `A` | `A` |

## 属性

### after %{#after}%

• **after**: (`callback`: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

#### 类型声明 %{#type-declaration}%

▸ (`callback`): `void`

action 执行完的钩子。
它接收 action 的返回值，如果是 Promise，它将被自动解包。

##### 参数 %{#parameters}%

| 名称 | 类型 |
| :------ | :------ |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### 返回值

`void`

___

### args %{#args}%

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

传递给 action 的参数

___

### name %{#name}%

• **name**: `ActionName`

action 的名称

___

### onError %{#onerror}%

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

#### 类型声明 %{#type-declaration_1}%

▸ (`callback`): `void`

action 的错误钩子。
返回 `false` 以捕获错误并阻止其继续传播。

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `callback` | (`error`: `unknown`) => `void` |

##### 返回值

`void`

___

### store %{#store}%

• **store**: `Store`

正在调用 action 的 Store
