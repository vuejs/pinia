---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / \_StoreWithState

# 接口：\_StoreWithState<Id, S, G, A\> %{#interface-storewithstate-id-s-g-a}%

[pinia](../modules/pinia.md)._StoreWithState

具有 state 和部分功能的基础 store。不应直接使用。

## 类型参数 %{#type-parameters}%

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## 层次结构 %{#hierarchy}%

- [`StoreProperties`](pinia.StoreProperties.md)<`Id`\>

  ↳ **`_StoreWithState`**

## 属性

### $id %{#id}%

• **$id**: `Id`

store 的唯一标识符

#### 继承于

[StoreProperties](pinia.StoreProperties.md).[$id](pinia.StoreProperties.md#$id)

___

### $state %{#state}%

• **$state**: `UnwrapRef`<`S`\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<`S`\>

Store 的 State。给它赋值可替换整个 state。

___

### \_customProperties %{#customproperties}%

• **\_customProperties**: `Set`<`string`\>

供 devtools 插件使用，用于检索插件添加的属性。
生产版本会被移除。
用户可以用它来添加应在 devtools 中显示的 store 属性键。

#### 继承自

[StoreProperties](pinia.StoreProperties.md).[_customProperties](pinia.StoreProperties.md#_customproperties)

## 方法 %{#methods}%

### $dispose %{#dispose}%

▸ **$dispose**(): `void`

停止 store 的相关作用域，并从 store 注册表中删除它。
插件可以覆盖此方法来清理已添加的任何副作用函数。
例如， devtools 插件停止显示来自 devtools 的已停止的 store。

#### 返回值

`void`

___

### $onAction %{#onaction}%

▸ **$onAction**(`callback`, `detached?`): () => `void`

设置一个回调，当一个 action 即将被调用时，就会被调用。
回调接收一个对象，
其包含被调用 action 的所有相关信息：

- `store`: 被调用的 store
- `name`: action 的名称
- `args`: 传递给 action 的参数

除此之外，它会接收两个函数，
允许在 action 完成或失败时执行的回调。

它还会返回一个用来删除回调的函数。
请注意，当在组件内调用 `store.$onAction()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

**`Example`**

```js
store.$onAction(({ after, onError }) => {
 // 你可以在这里创建所有钩子之间的共享变量，
 // 同时设置侦听器并清理它们。
 after((resolvedValue) => {
   // 可以用来清理副作用 
   // `resolvedValue` 是 action 返回的值，
   // 如果是一个 Promise，它将是已经 resolved 的值
 })
 onError((error) => {
   // 可以用于向上传递错误
 })
})
```

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `callback` | [`StoreOnActionListener`](../modules/pinia.md#storeonactionlistener)<`Id`, `S`, `G`, `A`\> | callback called before every action |
| `detached?` | `boolean` | detach the subscription from the context this is called from |

#### 返回值

`fn`

删除侦听器的函数

▸ (): `void`

设置一个回调，当一个 action 即将被调用时，就会被调用。
回调接收一个对象，
其包含被调用 action 的所有相关信息：

- `store`: 被调用的 store
- `name`: action 的名称
- `args`: 传递给 action 的参数

除此之外，它会接收两个函数，
允许在 action 完成或失败时执行的回调。

它还会返回一个用来来删除回调的函数。
请注意，当在组件内调用 `store.$onAction()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

**`Example`**

```js
store.$onAction(({ after, onError }) => {
  // 你可以在这里创建所有钩子之间的共享变量，
  // 同时设置侦听器并清理它们。
 after((resolvedValue) => {
   // 可以用来清理副作用 
   // `resolvedValue` 是 action 返回的值，
   // 如果是一个 Promise，它将是已解决的值
 })
 onError((error) => {
   // 可以用于向上传递错误
 })
})
```

##### 返回值

`void`

移除侦听器的函数

___

### $patch %{#patch}%

▸ **$patch**(`partialState`): `void`

将一个 state 补丁应用于当前状态。允许传递嵌套值

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `partialState` | [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`UnwrapRef`<`S`\>\> | patch to apply to the state |

#### 返回值

`void`

▸ **$patch**<`F`\>(`stateMutator`): `void`

将多个变更分组到一个函数中。
当 mutation 对象(如 Sets 或数组)或者应用对象补丁不方便时很有用，例如追加到数组中。
传递给 `$patch()` 的函数**必须是同步的**。

#### 类型参数 %{#type-parameters_1}%

| 名称 | 类型 |
| :------ | :------ |
| `F` | extends (`state`: `UnwrapRef`<`S`\>) => `any` |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `stateMutator` | `ReturnType`<`F`\> extends `Promise`<`any`\> ? `never` : `F` | function that mutates `state`, cannot be async |

#### 返回值 {returns}

`void`

___

### $reset %{#reset}%

▸ **$reset**(): `void`

通过建立一个新的状态对象，将 store 重设为初始状态。
TODO: make this options only

#### 返回值

`void`

___

### $subscribe %{#subscribe}%

▸ **$subscribe**(`callback`, `options?`): () => `void`

设置一个回调，当状态发生变化时被调用。它会返回一个用来移除此回调的函数。
请注意，当在组件内调用 `store.$subscribe()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `callback` | [`SubscriptionCallback`](../modules/pinia.md#subscriptioncallback)<`S`\> | callback passed to the watcher |
| `options?` | { `detached?`: `boolean`  } & `WatchOptions`<`boolean`\> | `watch` options + `detached` to detach the subscription from the context (usually a component) this is called from. Note that the `flush` option does not affect calls to `store.$patch()`. |

#### 返回值

`fn`

删除侦听器的函数

▸ (): `void`

设置一个回调，当状态发生变化时被调用。它还会返回一个用来移除回调的函数。
请注意，当在组件内调用 `store.$subscribe()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

##### 返回值

`void`

移除侦听器的函数
