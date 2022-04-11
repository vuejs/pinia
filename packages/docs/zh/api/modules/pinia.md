---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / pinia

# 模块：pinia

## 枚举{#enumerations}

- [MutationType](../enums/pinia.MutationType.md)

## 接口{#interfaces}

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
- [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
- [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## 类型别名{#type-aliases}

### PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

扩展每个 store 的插件。

**`deprecated`** 使用 PiniaPlugin 代替

#### 定义于

[pinia/src/rootStore.ts:149](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L149)

___

### StateTree

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Store 的通用状态

#### 定义于

[pinia/src/types.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L13)

___

### Store

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & `_ActionsTree` extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & `PiniaCustomStateProperties`<`S`\>

建立一个 store 的 Store 类型。

#### 类型参数

| 名称 | 类型                                           |
| :--- | :--------------------------------------------- |
| `Id` | 扩展自 `string` = `string`                    |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) = {} |
| `G`  | {}                                             |
| `A`  | {}                                             |

#### 定义于

[pinia/src/types.ts:472](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L472)

___

### StoreActions

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : `_ExtractActionsFromSetupStore`<`SS`\>

提取一个 store 类型的 action。
对 Setup Store 或 Option Store都有效。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

#### 定义于

[pinia/src/store.ts:727](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L727)

___

### StoreGeneric

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\>

通用的、类型不安全的 Store 版本。
在访问字符串时不会失败，
这使得编写不在意传递的 store 类型的通用函数更加容易。

#### 定义于

[pinia/src/types.ts:491](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L491)

___

### StoreGetters

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, `_ActionsTree`\> ? `_StoreWithGetters`<`G`\> : `_ExtractGettersFromSetupStore`<`SS`\>

提取一个 store 类型的 getter。
对 Setup Store 或 Option Store都有效。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

#### 定义于

[pinia/src/store.ts:740](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L740)

___

### StoreOnActionListener

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? `_ActionsTree` : `A`\>) => `void`

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### 类型{#type} declaration

▸ (`context`): `void`

`store.$onAction()` 的参数

##### 参数

| 名称      | 类型                                                                                                                            |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? `_ActionsTree` : `A`\> |

##### 返回值

`void`

#### 定义于

[pinia/src/types.ts:243](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L243)

___

### StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: `_ActionsTree` extends `A` ? `_StoreOnActionListenerContext`<[`StoreGeneric`](pinia.md#storegeneric), `string`, `_ActionsTree`\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### 定义于

[pinia/src/types.ts:227](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L227)

___

### StoreState

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\> ? `UnwrapRef`<`S`\> : `_ExtractStateFromSetupStore`<`SS`\>

提取一个 store 类型的 state。
对 Setup Store 或 Option Store 都有效。请注意，它会对 refs 解包。

#### 类型参数

| 名称 |
| :--- |
| `SS` |

#### 定义于

[pinia/src/store.ts:753](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L753)

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### 类型参数

| 名称 |
| :--- |
| `S`  |

#### 类型{#type} declaration

▸ (`mutation`, `state`): `void`

订阅的回调

##### 参数

| 名称       | 类型                                                                          |
| :--------- | :---------------------------------------------------------------------------- |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state`    | `UnwrapRef`<`S`\>                                                             |

##### 返回值

`void`

#### 定义于

[pinia/src/types.ts:148](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L148)

___

### SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

传递给订阅回调的上下文对象。

#### 类型参数

| 名称 |
| :--- |
| `S`  |

#### 定义于

[pinia/src/types.ts:140](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L140)

___

### \_Awaited

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### 类型参数

| 名称 |
| :--- |
| `T`  |

#### 定义于

[pinia/src/types.ts:164](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L164)

## 变量

### PiniaVuePlugin

• **PiniaVuePlugin**: `Plugin`

Vue 2 插件，必须安装该插件才能使 pinia 工作。注意
**如果你使用的是 Nuxt.js，你不需要这个插件**。请使用 `buildModule` 代替：
https://pinia.vuejs.org/ssr/nuxt.html。

**`example`**
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

**`param`** 从 'vue' 导入的 `Vue`.

#### 定义于

[pinia/src/vue2-plugin.ts:28](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/vue2-plugin.ts#L28)

## 函数

### acceptHMRUpdate

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

创建一个 _accept_ 函数，在 Vite 应用程序中传递给 `import.meta.hot`。

**`example`**
```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### 参数

| 名称              | 类型                                                                                                                                                                          | 描述                            |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\> | 热更新 defineStore 的返回值 |
| `hot`             | `any`                                                                                                                                                                         | `import.meta.hot`                       |

#### 返回值

`fn`

▸ (`newModule`): `any`

##### 参数

| 名称        | 类型  |
| :---------- | :---- |
| `newModule` | `any` |

##### 返回值

`any`

#### 定义于

[pinia/src/hmr.ts:73](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/hmr.ts#L73)

___

### createPinia

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

创建一个 Pinia 实例，供应用程序使用。

#### 返回值

[`Pinia`](../interfaces/pinia.Pinia.md)

#### 定义于

[pinia/src/createPinia.ts:10](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/createPinia.ts#L10)

___

### defineStore

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

| 名称      | 类型                                                                                                       | 描述                     |
| :-------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `id`      | `Id`                                                                                                       | id of the store (must be unique) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store      |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### 定义于

[pinia/src/store.ts:776](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L776)

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

创建一个 `useStore` 函数，检索 store 实例

#### 类型参数

| 名称 | 类型                                           |
| :--- | :--------------------------------------------- |
| `Id` | 扩展自 `string`                               |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) = {} |
| `G`  | 扩展自 `_GettersTree`<`S`\> = {}              |
| `A`  | {}                                             |

#### 参数

| 名称      | 类型                                                                                    | 描述                |
| :-------- | :-------------------------------------------------------------------------------------- | :-------------------------- |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options to define the store |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### 定义于

[pinia/src/store.ts:792](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L792)

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\>

创建一个 `useStore` 函数，检索 store 实例

#### 类型参数

| 名称 | 类型             |
| :--- | :--------------- |
| `Id` | 扩展自 `string` |
| `SS` | `SS`             |

#### 参数

| 名称         | 类型                                                                                                                                                                                                     | 描述                     |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `id`         | `Id`                                                                                                                                                                                                     | id of the store (must be unique) |
| `storeSetup` | () => `SS`                                                                                                                                                                                               | function that defines the store  |
| `options?`   | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\> | extra options                    |

#### 返回值

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\>

#### 定义于

[pinia/src/store.ts:807](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L807)

___

### getActivePinia

▸ `Const` **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

如果有的话，获取当前活跃的 pinia

#### 返回值

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### 定义于

[pinia/src/rootStore.ts:39](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L39)

___

### mapActions

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapActionsObjectReturn`<`A`, `KeyMapper`\>

允许直接使用来自你的 store 的 action，而不需要使用组合式 API（`setup()`），
通过生成一个对象来传播到组件的 `methods` 字段。
该对象的值是 action，
而键是产生的方法名称。

**`example`**
```js
export default {
  methods: {
    // 其他方法属性
    // useCounterStore 有两个 action，分别是 `increment` and `setCount`。
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

| 名称        | 类型                                                                              | 描述                               |
| :---------- | :-------------------------------------------------------------------------------- | :----------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from                          |
| `keyMapper` | `KeyMapper`                                                                       | object to define new names for the actions |

#### 返回值

`_MapActionsObjectReturn`<`A`, `KeyMapper`\>

#### 定义于

[pinia/src/mapHelpers.ts:326](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L326)

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): `_MapActionsReturn`<`A`\>

允许直接使用你 store 里的 action，
而不需要使用组合式 API（`setup()`），
通过生成一个对象，传播到组件的 `methods` 字段。

**`example`**
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
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | 扩展自 `_GettersTree`<`S`\>              |
| `A`  | `A`                                       |

#### 参数

| 名称       | 类型                                                                              | 描述                 |
| :--------- | :-------------------------------------------------------------------------------- | :--------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from            |
| `keys`     | keyof `A`[]                                                                       | array of action names to map |

#### 返回值

`_MapActionsReturn`<`A`\>

#### 定义于

[pinia/src/mapHelpers.ts:359](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L359)

___

### mapGetters

▸ `Const` **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

`mapState()` 的别名。你应该使用 `mapState()` 来代替。

**`deprecated`** 使用 `mapState()` 代替

#### 类型参数

| 名称        | 类型                                                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | 扩展自 `string`                                                                                                           |
| `S`         | 扩展自 [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | 扩展自 `_GettersTree`<`S`\>                                                                                               |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### 参数

| 名称        | 类型                                                                              |
| :---------- | :-------------------------------------------------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper`                                                                       |

#### 返回值

`_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### 定义于

[pinia/src/mapHelpers.ts:285](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L285)

▸ `Const` **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): `_MapStateReturn`<`S`, `G`, `Keys`\>

`mapState()` 的别名。你应该使用 `mapState()` 来代替。

**`deprecated`** 使用 `mapState()` 代替

#### 类型参数

| 名称   | 类型                                      |
| :----- | :---------------------------------------- |
| `Id`   | 扩展自 `string`                          |
| `S`    | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`    | 扩展自 `_GettersTree`<`S`\>              |
| `A`    | `A`                                       |
| `Keys` | 扩展自 `string` \| `number` \| `symbol`  |

#### 参数

| 名称       | 类型                                                                              |
| :--------- | :-------------------------------------------------------------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys`     | readonly `Keys`[]                                                                 |

#### 返回值

`_MapStateReturn`<`S`, `G`, `Keys`\>

#### 定义于

[pinia/src/mapHelpers.ts:285](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L285)

___

### mapState

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

允许在不使用组合式 API（`setup()`）的情况下使用一个 store的 state 和 getter，
通过生成一个对象，传播至组件的`computed`字段。
该对象的值是 state 属性/getter，
而键是生成的计算属性名称。
你也可以选择传递一个自定义函数，
该函数将接收 store 作为其第一个参数。
注意，虽然它可以通过 `this` 访问组件实例，但它不会被类型检查。

**`example`**
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

| 名称        | 类型                                                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | 扩展自 `string`                                                                                                           |
| `S`         | 扩展自 [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | 扩展自 `_GettersTree`<`S`\>                                                                                               |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### 参数

| 名称        | 类型                                                                              | 描述                          |
| :---------- | :-------------------------------------------------------------------------------- | :------------------------------------ |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from                     |
| `keyMapper` | `KeyMapper`                                                                       | object of state properties or getters |

#### 返回值

`_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### 定义于

[pinia/src/mapHelpers.ts:194](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L194)

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): `_MapStateReturn`<`S`, `G`, `Keys`\>

允许在不使用组合式 API（`setup()`）的情况下使用一个 store 的 state 和 getter，
方法是生成一个对象，
传播到组件的`computed`字段。

**`example`**
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

| 名称   | 类型                                      |
| :----- | :---------------------------------------- |
| `Id`   | 扩展自 `string`                          |
| `S`    | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`    | 扩展自 `_GettersTree`<`S`\>              |
| `A`    | `A`                                       |
| `Keys` | 扩展自 `string` \| `number` \| `symbol`  |

#### 参数

| 名称       | 类型                                                                              | 描述                         |
| :--------- | :-------------------------------------------------------------------------------- | :----------------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from                    |
| `keys`     | readonly `Keys`[]                                                                 | array of state properties or getters |

#### 返回值

`_MapStateReturn`<`S`, `G`, `Keys`\>

#### 定义于

[pinia/src/mapHelpers.ts:231](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L231)

___

### mapStores

▸ **mapStores**<`Stores`\>(...`stores`): `_Spread`<`Stores`\>

允许在不使用组合式 API（`setup()`）的情况下使用 store，
方法是生成一个对象，传播到组件的 `computed` 字段。
它接受一个 store 定义的列表。

**`example`**
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
| `Stores` | 扩展自 `any`[] |

#### 参数

| 名称        | 类型          | 描述                       |
| :---------- | :------------ | :--------------------------------- |
| `...stores` | [...Stores[]] | list of stores to map to an object |

#### 返回值

`_Spread`<`Stores`\>

#### 定义于

[pinia/src/mapHelpers.ts:96](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L96)

___

### mapWritableState

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapWritableStateObjectReturn`<`S`, `KeyMapper`\>

与 `mapState()` 相同，但是也创建了计算的 stter，
所以 state 可以被修改。
与 `mapState()` 不同的是，只有 `state` 属性可以被添加。

#### 类型参数

| 名称        | 类型                                      |
| :---------- | :---------------------------------------- |
| `Id`        | 扩展自 `string`                          |
| `S`         | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`         | 扩展自 `_GettersTree`<`S`\>              |
| `A`         | `A`                                       |
| `KeyMapper` | 扩展自 `Record`<`string`, keyof `S`\>    |

#### 参数

| 名称        | 类型                                                                              | 描述               |
| :---------- | :-------------------------------------------------------------------------------- | :------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from          |
| `keyMapper` | `KeyMapper`                                                                       | object of state properties |

#### 返回值

`_MapWritableStateObjectReturn`<`S`, `KeyMapper`\>

#### 定义于

[pinia/src/mapHelpers.ts:440](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L440)

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): `_MapWritableStateReturn`<`S`\>

允许在不使用组合式 API（`setup()`）的情况下
使用来自一个 store 的 state 和 getter，
方法是生成一个对象来传播到组件的`computed`字段。

#### 类型参数

| 名称 | 类型                                      |
| :--- | :---------------------------------------- |
| `Id` | 扩展自 `string`                          |
| `S`  | 扩展自 [`StateTree`](pinia.md#statetree) |
| `G`  | 扩展自 `_GettersTree`<`S`\>              |
| `A`  | `A`                                       |

#### 参数

| 名称       | 类型                                                                              | 描述              |
| :--------- | :-------------------------------------------------------------------------------- | :------------------------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from         |
| `keys`     | keyof `S`[]                                                                       | array of state properties |

#### 返回值

`_MapWritableStateReturn`<`S`\>

#### 定义于

[pinia/src/mapHelpers.ts:458](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L458)

___

### setActivePinia

▸ `Const` **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

设置或取消设置活跃的 pinia。
在 SSR 和内部调用 action 和 getter 时使用。

#### 参数

| 名称    | 类型                                                   | 描述   |
| :------ | :----------------------------------------------------- | :------------- |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### 返回值

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### 定义于

[pinia/src/rootStore.ts:33](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L33)

___

### setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

改变由 `mapStores()` 添加的后缀。可以设置为空字符串。
默认为`"Store"`。如果你需要使用 TypeScript，
请确保扩展 MapStoresCustomization 接口。

#### 参数

| 名称     | 类型     | 描述|
| :------- | :------- | :---------- |
| `suffix` | `string` | new suffix  |

#### 返回值

`void`

#### 定义于

[pinia/src/mapHelpers.ts:66](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L66)

___

### skipHydrate

▸ **skipHydrate**<`T`\>(`obj`): `T`

#### 类型参数

| 名称 | 类型  |
| :--- | :---- |
| `T`  | `any` |

#### 参数

| 名称  | 类型 |
| :---- | :--- |
| `obj` | `T`  |

#### 返回值

`T`

#### 定义于

[pinia/src/store.ts:85](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L85)

___

### storeToRefs

▸ **storeToRefs**<`SS`\>(`store`): `ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

创建一个引用对象，包含 store 的所有 state、
getter 和 plugin 添加的 state 属性。
类似于 `toRefs()`，但专门为 Pinia store 设计，
所以 method 和非响应式属性会被完全忽略。

#### 类型参数

| 名称 | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`, `SS`\> & {} & `_StoreWithGetters`<`_GettersTree`<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`, `SS`\> & `PiniaCustomStateProperties`<[`StateTree`](pinia.md#statetree), `SS`\> |

#### 参数

| 名称    | 类型 | 描述                   |
| :------ | :--- | :----------------------------- |
| `store` | `SS` | store to extract the refs from |

#### 返回值

`ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

#### 定义于

[pinia/src/storeToRefs.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/storeToRefs.ts#L13)
