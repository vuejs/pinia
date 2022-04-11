---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / \_StoreWithState

# 接口：\_StoreWithState<Id, S, G, A\>

[pinia](../modules/pinia.md)._StoreWithState

具有 state 和功能的基础 store。不应直接使用。

## 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## 层次结构{#hierarchy}

- [`StoreProperties`](pinia.StoreProperties.md)<`Id`\>

  ↳ **`_StoreWithState`**

## 属性{#properties}

### $id

• **$id**: `Id`

store 的唯一标识符


#### 继承于

[StoreProperties](pinia.StoreProperties.md).[$id](pinia.StoreProperties.md#$id)

#### 定义于

[pinia/src/types.ts:265](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L265)

___

### $state

• **$state**: `UnwrapRef`<`S`\> & `PiniaCustomStateProperties`<`S`\>

Store 的 State。设置它可替换整个 state。

#### 定义于

[pinia/src/types.ts:337](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L337)

## 方法

### $dispose

▸ **$dispose**(): `void`

停止 store 的相关影响作用域，并从 store 注册表中删除它。
插件可以覆盖此方法来清理已添加的任何效果。例如， devtools 插件停止显示来自 devtools 的已停止的 store。

#### 返回值

`void`

#### 定义于

[pinia/src/types.ts:425](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L425)

___

### $onAction

▸ **$onAction**(`callback`, `detached?`): () => `void`

设置一个回调，当一个 action 即将被调用时，就会被调用。
回调接收一个对象，
其包含被调用 action的所有相关信息：
- `store`: 被调用的 store
- `name`: action 的名称
- `args`: 传递给 action 的参数

在这些之上，它接收两个函数，
允许在 action 完成或失败时设置回调。

它还会返回一个函数来删除回调。
请注意，当在组件内调用 `store.$onAction()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

**`example`**

```js
store.$onAction(({ after, onError }) => {
 // 在这里，你可以在所有的钩子之间共享变量，
 // 同时设置 watcher 和清理它们。
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

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `callback` | [`StoreOnActionListener`](../modules/pinia.md#storeonactionlistener)<`Id`, `S`, `G`, `A`\> | callback called before every action |
| `detached?` | `boolean` | detach the subscription from the context this is called from |

#### 返回值

`fn`

删除 watcher 的函数

▸ (): `void`

设置一个回调，当一个 action 即将被调用时，就会被调用。
回调接收一个对象，
其包含被调用 action的所有相关信息：
- `store`: 被调用的 store
- `name`: action 的名称
- `args`: 传递给 action 的参数

在这些之上，它接收两个函数，
允许在 action 完成或失败时设置回调。

它还会返回一个函数来删除回调。
请注意，当在组件内调用 `store.$onAction()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

**`example`**

```js
store.$onAction(({ after, onError }) => {
  // 在这里，你可以在所有的钩子之间共享变量，
  // 同时设置 watcher 和清理它们。
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

function that removes the watcher

#### 定义于

[pinia/src/types.ts:415](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L415)

___

### $patch

▸ **$patch**(`partialState`): `void`

将一个 state 补丁应用于当前状态。允许传递嵌套值

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `partialState` | `_DeepPartial`<`UnwrapRef`<`S`\>\> | patch to apply to the state |

#### 返回值

`void`

#### 定义于

[pinia/src/types.ts:344](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L344)

▸ **$patch**<`F`\>(`stateMutator`): `void`

将多个变化分组到一个函数中。
当 mutation 对象（如 Sets 或数组）或者应用对象补丁不实用时很有用，例如追加到数组中。
传递给 `$patch()` 的函数**必须是同步的**。

#### 类型参数

| 名称 | 类型 |
| :------ | :------ |
| `F` | extends (`state`: `UnwrapRef`<`S`\>) => `any` |

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `stateMutator` | `ReturnType`<`F`\> extends `Promise`<`any`\> ? `never` : `F` | function that mutates `state`, cannot be async |

#### 返回值

`void`

#### 定义于

[pinia/src/types.ts:353](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L353)

___

### $reset

▸ **$reset**(): `void`

通过建立一个新的状态对象，将 store 重设为初始状态。
TODO: make this options only

#### 返回值

`void`

#### 定义于

[pinia/src/types.ts:362](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L362)

___

### $subscribe

▸ **$subscribe**(`callback`, `options?`): () => `void`

设置一个回调，当状态发生变化时被调用。它还会返回一个函数来移除回调。
请注意，当在组件内调用 `store.$subscribe()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `callback` | [`SubscriptionCallback`](../modules/pinia.md#subscriptioncallback)<`S`\> | callback passed to the watcher |
| `options?` | { `detached?`: `boolean`  } & `WatchOptions`<`boolean`\> | `watch` options + `detached` to detach the subscription from the context (usually a component) this is called from. Note that the `flush` option does not affect calls to `store.$patch()`. |

#### 返回值

`fn`

删除 watcher 的函数

▸ (): `void`

设置一个回调，当状态发生变化时被调用。它还会返回一个函数来移除回调。
请注意，当在组件内调用 `store.$subscribe()` 时，除非 `detached` 被设置为 true，
否则当组件被卸载时，它将被自动清理掉。

##### 返回值

`void`

function that removes the watcher

#### 定义于

[pinia/src/types.ts:374](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L374)
