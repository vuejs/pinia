---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / pinia

# 模块：pinia %{#module-pinia}%

## 枚举 %{#enumerations}%

- [MutationType](../enums/pinia.MutationType.md)

## 接口 %{#interfaces}%

- [DefineSetupStoreOptions](../interfaces/pinia.DefineSetupStoreOptions.md)
- [DefineStoreOptions](../interfaces/pinia.DefineStoreOptions.md)
- [DefineStoreOptionsBase](../interfaces/pinia.DefineStoreOptionsBase.md)
- [DefineStoreOptionsInPlugin](../interfaces/pinia.DefineStoreOptionsInPlugin.md)
- [MapStoresCustomization](../interfaces/pinia.MapStoresCustomization.md)
- [Pinia](../interfaces/pinia.Pinia.md)
- [PiniaCustomProperties](../interfaces/pinia.PiniaCustomProperties.md)
- [PiniaCustomStateProperties](../interfaces/pinia.PiniaCustomStateProperties.md)
- [PiniaPlugin](../interfaces/pinia.PiniaPlugin.md)
- [PiniaPluginContext](../interfaces/pinia.PiniaPluginContext.md)
- [StoreDefinition](../interfaces/pinia.StoreDefinition.md)
- [StoreProperties](../interfaces/pinia.StoreProperties.md)
- [SubscriptionCallbackMutationDirect](../interfaces/pinia.SubscriptionCallbackMutationDirect.md)
- [SubscriptionCallbackMutationPatchFunction](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)
- [SubscriptionCallbackMutationPatchObject](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)
- [\_StoreOnActionListenerContext](../interfaces/pinia._StoreOnActionListenerContext.md)
- [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
- [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## 类型别名 %{#type-aliases}%

### PiniaStorePlugin %{#piniastoreplugin}%

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

扩展每个 store 的插件。

**`deprecated`**

使用 PiniaPlugin 代替

___

### StateTree %{#statetree}%

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Store 的通用 state

___

### Store %{#store}%

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> & [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>

创建 store 的 Store 类型。

#### 类型参数

| 名称 | 类型                                           |
| :--- | :--------------------------------------------- |
| `Id` | 扩展自 `string` = `string`                    |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) = {} |
| `G`  | {}                                             |
| `A`  | {}                                             |

___

### StoreActions %{#storeactions}%

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>

提取一个 store 类型的 action。
对 Setup Store 或 Option Store 都有效。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

___

### StoreGeneric %{#storegeneric}%

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\>

泛型与 Store 的类型不安全版本。
在访问字符串时不会失败，
这使得编写不在意传递的 store 类型的通用函数更加容易。

___

### StoreGetters %{#storegetters}%

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, [`_ActionsTree`](pinia.md#_actionstree)\> ? [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>

提取一个 store 类型的 getter。
对 Setup Store 或 Option Store都有效。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

___

### StoreOnActionListener %{#storeonactionlistener}%

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\>) => `void`

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### 类型声明 %{#type-declaration}%

▸ (`context`): `void`

`store.$onAction()` 的参数

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\> |

##### 返回值

`void`

___

### StoreOnActionListenerContext %{#storeonactionlistenercontext}%

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)<[`StoreGeneric`](pinia.md#storegeneric), `string`, [`_ActionsTree`](pinia.md#_actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

传递给 `store.$onAction(context => {})` 的回调的上下文对象。
TODO：应该只有Id，Store 和 Action 来生成适当的对象。

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

___

### StoreState %{#storestate}%

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>

提取一个 store 类型的 state。
对 Setup Store 或 Option Store 都有效。请注意，它自动解包 refs。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

___

### SubscriptionCallback %{#subscriptioncallback}%

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### 类型参数

| 名称 |
| :------ |
| `S` |

#### 类型声明 %{#type-declaration_1}%

▸ (`mutation`, `state`): `void`

订阅的回调

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state` | `UnwrapRef`<`S`\> |

##### 返回值

`void`

___

### SubscriptionCallbackMutation %{#subscriptioncallbackmutation}%

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

传递给订阅回调的上下文对象。

#### 类型参数

| 名称 |
| :--- |
| `S`  |

___

### \_ActionsTree %{#actionstree}%

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](pinia.md#_method)\>

行动的对象的类型。仅供内部使用。
**仅**供内部使用

___

### \_Awaited %{#awaited}%

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### 类型参数

| 名称 |
| :--- |
| `T`  |

___

### \_DeepPartial %{#deeppartial}%

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

递归的 `Partial<T>`。 [['$patch']](pinia.md#store)会用到。

**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `T` |

___

### \_ExtractActionsFromSetupStore %{#extractactionsfromsetupstore}%

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_ExtractActionsFromSetupStore\_Keys %{#extractactionsfromsetupstore-keys}%

Ƭ **\_ExtractActionsFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

能够通过 IDE 进行重构的类型。
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore %{#extractgettersfromsetupstore}%

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\>\> : `never`

**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore\_Keys %{#extractgettersfromsetupstore-keys}%

Ƭ **\_ExtractGettersFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

能够通过 IDE 进行重构的类型。
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore %{#extractstatefromsetupstore}%

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore\_Keys %{#extractstatefromsetupstore-keys}%

Ƭ **\_ExtractStateFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

能够通过 IDE 进行重构的类型。
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

___

### \_GettersTree %{#getterstree}%

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<[`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>\>) => `any` \| () => `any`\>

推断参数的 Getter 对象的类型。仅供内部使用。
**仅**供内部使用

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_MapActionsObjectReturn %{#mapactionsobjectreturn}%

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

**仅**供内部使用

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `A`\> |

___

### \_MapActionsReturn %{#mapactionsreturn}%

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `A` |

___

### \_MapStateObjectReturn %{#mapstateobjectreturn}%

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

**仅**供内部使用

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

___

### \_MapStateReturn %{#mapstatereturn}%

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

**仅**供内部使用

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

___

### \_MapWritableStateObjectReturn %{#mapwritablestateobjectreturn}%

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

**仅**供内部使用

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\> |

___

### \_MapWritableStateReturn %{#mapwritablestatereturn}%

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

**仅**供内部使用

#### 类型参数

| 名称 | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_Method %{#method}%

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### 类型声明 %{#type-declaration_2}%

▸ (...`args`): `any`

Generic type for a function that can infer arguments and return type

**仅**供内部使用

##### 参数

| 名称 | 类型 |
| :------ | :------ |
| `...args` | `any`[] |

##### 返回值

`any`

___

### \_Spread %{#spread}%

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](pinia.md#_storeobject)<`L`\> & [`_Spread`](pinia.md#_spread)<`R`\> : `unknown`

**仅**供内部使用.

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `A` | extends readonly `any`[] |

___

### \_StoreObject %{#storeobject}%

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", string\> ? MapStoresCustomization["suffix"] : "Store"}\`]: Function } : {}

**仅**供内部使用.

#### 类型参数

| 名称 |
| :------ |
| `S` |

___

### \_StoreWithActions %{#storewithactions}%

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

为 action 增强的 Store。仅供内部使用。
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `A` |

___

### \_StoreWithGetters %{#storewithgetters}%

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Store augmented with getters. For internal usage only.
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `G` |

___

### \_UnwrapAll %{#unwrapall}%

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

能够通过 IDE 进行重构的类型。
**仅**供内部使用

#### 类型参数

| 名称 |
| :------ |
| `SS` |

## 变量 %{#variables}%

### PiniaVuePlugin %{#piniavueplugin}%

• **PiniaVuePlugin**: `Plugin`

Vue 2 插件，必须安装该插件才能使 pinia 工作。
注意，**如果你使用的是 Nuxt.js，那你不需要这个插件**。请使用 `buildModule` 代替：
<https://pinia.vuejs.org/zh/ssr/nuxt.html>

**`Example`**

```js
import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // ...
  pinia,
})
```

**`param`**

 从 'vue' 导入的 `Vue`。

## 函数 %{#functions}%

### acceptHMRUpdate %{#accepthmrupdate}%

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

创建一个 _accept_ 函数，在 Vite 应用中传递给 `import.meta.hot`。

**`Example`**

```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> | return of the defineStore to hot update |
| `hot` | `any` | `import.meta.hot` |

#### 返回值

`fn`

▸ (`newModule`): `any`

##### 参数

| 名称        | 类型  |
| :---------- | :---- |
| `newModule` | `any` |

##### 返回值

`any`

___

### createPinia %{#createpinia}%

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

创建一个 Pinia 实例，供应用使用。

#### 返回值

[`Pinia`](../interfaces/pinia.Pinia.md)

___

### defineStore %{#definestore}%

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

创建一个 `useStore` 函数，检索 store 实例

#### 类型参数

| 名称 | 类型                                           |
| :--- | :--------------------------------------------- |
| `Id` | 扩展自 `string`                               |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) = {} |
| `G`  | 扩展自 `_GettersTree`<`S`\> = {}              |
| `A`  | {}                                             |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

创建一个 `useStore` 函数，检索 store 实例

#### 类型参数

| 名称 | 类型 |
| :--- | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options to define the store |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

创建一个 `useStore` 函数，检索 store 实例

#### 类型参数

| 名称 | 类型             |
| :--- | :--------------- |
| `Id` | 扩展自 `string` |
| `SS` | `SS`             |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `storeSetup` | () => `SS` | function that defines the store |
| `options?` | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\> | extra options |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

___

### getActivePinia %{#getactivepinia}%

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

如果有的话，获取当前激活的 pinia

#### 返回值

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### mapActions %{#mapactions}%

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

通过生成一个传递到组件的 `methods` 字段的对象，
允许直接使用 store 的 action，而不需要使用组合式 API(`setup()`)。
该对象的值是 action，
而键是产生的方法名称。

**`Example`**

```js
export default {
  methods: {
    // 其他方法属性
    // useCounterStore 有两个 action，分别是 `increment` 与 `setCount`。
    ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
  },

  created() {
    this.moar()
    this.setIt(2)
  }
}
```

#### 类型参数

| 名称        | 类型                                      |
| :---------- | :---------------------------------------- |
| `Id`        | 扩展自 `string`                          |
| `S`         | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`         | 扩展自 `_GettersTree`<`S`\>              |
| `A`         | `A`                                       |
| `KeyMapper` | 扩展自 `Record`<`string`, keyof `A`\>    |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object to define new names for the actions |

#### 返回值

[`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

允许直接使用 store 里的 action，
而不是必须使用组合式 API(`setup()`)，
通过生成一个对象，传递到组件的 `methods` 字段。

**`Example`**

```js
export default {
  methods: {
    // 其他方法属性
    ...mapActions(useCounterStore, ['increment', 'setCount'])
  },

  created() {
    this.increment()
    this.setCount(2) // 像往常一样传递参数
  }
}
```

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string` |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | 扩展自 [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`  | `A`                                       |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `A`[] | array of action names to map |

#### 返回值

[`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

___

### mapGetters %{#mapgetters}%

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

通过生成一个对象传递到组件的 `computed` 字段中。
允许使用来自一个 store 的 state 和 getter，而不必使用组合式 API(`setup()`)。
该对象的值是 state 属性/ getter
而键则是产生的计算属性的名称。
另外，你还可以传递一个自定义函数，
该函数将接收 state 的作为其第一个参数。
注意，虽然它可以通过 `this` 访问组件的实例，但它没有标注类型。

**`Example`**

```js
export default {
  computed: {
    // 其他计算属性
    // useCounterStore 有一个名为 `count` 的 state 属性以及一个名为 `double` 的 getter
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // 注意如果你想要使用 `this`，那你不能使用箭头函数
      custom(store) {
        return this.someComponentValue + store.n
      },
      doubleN: 'double'
    })
  },

  created() {
    this.n // 2
    this.doubleN // 4
  }
}
```

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### 返回值

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

通过生成一个对象传递到组件的 `computed` 字段中，
以允许使用来自一个 store 的 state 和 getter，
而不必使用组合式 API(`setup()`)，

**`Example`**

```js
export default {
  computed: {
    // 其他计算属性
    ...mapState(useCounterStore, ['count', 'double'])
  },

  created() {
    this.count // 2
    this.double // 4
  }
}
```

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### 返回值

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

___

### mapState %{#mapstate}%

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

通过生成一个对象，并传递至组件的 `computed` 字段，
以允许在不使用组合式 API(`setup()`)的情况下使用一个 store 的 state 和 getter。
该对象的值是 state 属性/getter，
而键是生成的计算属性名称。
你也可以选择传递一个自定义函数，该函数将接收 store 作为其第一个参数。
注意，虽然它可以通过 `this` 访问组件实例，但它没有标注类型。

**`Example`**

```js
export default {
  computed: {
    // 其他计算属性
    // useCounterStore 拥有一个名为 `count` 的 state 属性和一个名为 `double` 的 getter
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // 如果想使用 `this`，就不能使用箭头函数
      custom(store) {
        return this.someComponentValue + store.n
      },
      doubleN: 'double'
    })
  },

  created() {
    this.n // 2
    this.doubleN // 4
  }
}
```

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### 返回值

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

通过生成一个对象，并传递到组件的 `computed` 字段，
允许在不使用组合式 API(`setup()`)的情况下
使用一个 store 的 state 和 getter，

**`Example`**

```js
export default {
  computed: {
    // 其他计算属性
    ...mapState(useCounterStore, ['count', 'double'])
  },

  created() {
    this.count // 2
    this.double // 4
  }
}
```

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### 返回值

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

___

### mapStores %{#mapstores}%

▸ **mapStores**<`Stores`\>(...`stores`): [`_Spread`](pinia.md#_spread)<`Stores`\>

通过生成一个对象，传递到组件的 `computed` 字段
以允许在不使用组合式 API(`setup()`)的情况下使用 store。
它接受一个 store 定义的列表参数。

**`Example`**

```js
export default {
  computed: {
    // 其他计算属性
    ...mapStores(useUserStore, useCartStore)
  },

  created() {
    this.userStore // id 为 "user" 的 store
    this.cartStore // id 为 "cart" 的 store
  }
}
```

#### 类型参数

| 名称     | 类型            |
| :------- | :-------------- |
| `Stores` | 扩展 `any`[] |

#### 参数

| 名称        | 类型          | 描述                       |
| :---------- | :------------ | :--------------------------------- |
| `...stores` | [...Stores[]] | list of stores to map to an object |

#### 返回值

[`_Spread`](pinia.md#_spread)<`Stores`\>

___

### mapWritableState %{#mapwritablestate}%

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

除了创建的计算属性的 setter，其他与 `mapState()` 相同，
所以 state 可以被修改。
与 `mapState()` 不同的是，只有 `state` 属性可以被添加。

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\> |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties |

#### 返回值

[`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

通过生成一个对象并传递到组件的 `computed` 字段
以允许在不使用组合式 API(`setup()`)的情况下
使用来自一个 store 的 state 和 getter，。

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |

#### 参数

| 名称 | 类型  | 描述  |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `S`[] | array of state properties |

#### 返回值

[`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

___

### setActivePinia %{#setactivepinia}%

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

设置或取消设置激活的 pinia。
在 SSR 和内部调用 action 和 getter 时使用。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### 返回值

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### setMapStoreSuffix %{#setmapstoresuffix}%

▸ **setMapStoreSuffix**(`suffix`): `void`

改变由 `mapStores()` 添加的后缀。可以设置为空字符串。
默认为`"Store"`。如果你需要使用 TypeScript，
请确保扩展 MapStoresCustomization 接口。

#### 参数 %{#parameters}%

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `suffix` | `string` | new suffix |

#### 返回值

`void`

___

### skipHydrate %{#skiphydrate}%

▸ **skipHydrate**<`T`\>(`obj`): `T`

告诉 Pinia 跳过给定对象的激活过程。当你在 store 中返回一个有状态的对象，但它并不是真正的状态时，(仅)在 setup store 中这是很有用的。
例如，在一个 setup store 中返回一个路由器实例。

#### 类型参数

| 名称 | 类型  |
| :------ | :------ |
| `T` | `any` |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `obj` | `T` | target object |

#### 返回值

`T`

obj

___

### storeToRefs %{#storetorefs}%

▸ **storeToRefs**<`SS`\>(`store`): `ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

创建一个引用对象，包含 store 的所有 state、
getter 和 plugin 添加的 state 属性。
类似于 `toRefs()`，但专门为 Pinia store 设计，
所以 method 和非响应式属性会被完全忽略。

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`StateTree`](pinia.md#statetree) & [`_StoreWithGetters`](pinia.md#_storewithgetters)<[`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StateTree`](pinia.md#statetree), `SS`\> |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :--- | :------ |
| `store` | `SS` | store to extract the refs from |

#### 返回值

`ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>
