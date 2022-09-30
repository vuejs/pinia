---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsInPlugin

# 接口：DefineStoreOptionsInPlugin<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptionsInPlugin

创建 pinia 插件时可用的 `options`。

## 类型参数

| 名字 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## 层次结构{#hierarchy}

- `Omit`<[`DefineStoreOptions`](pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"`` \| ``"actions"``\>

  ↳ **`DefineStoreOptionsInPlugin`**

## 属性{#properties}

### actions

• **actions**: `A`

提取的 action 对象。当使用 setup API 建立 store 时，由 useStore() 添加，
否则使用传递给 `defineStore()` 的对象。
如果没有定义 action，则默认为一个空对象。

#### 定义于

[pinia/src/types.ts:723](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L723)

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\> & `_GettersTree`<`S`\>

getter 的可选对象

#### 继承于

Omit.getters

#### 定义于

[pinia/src/types.ts:647](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L647)

## 方法

### hydrate

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

当 store 定义中使用了复杂的状态（如仅客户端的引用），并且从 `pinia.state` 中复制值是不够时，允许在 SSR 期间对 store 进行 hydrating。

**`example`**
如果在你的 `state` 中，你使用了任何 `customRef`，任何 `computed`，或任何在服务器和客户端有不同值的 `ref`，
你需要手动对它们进行 hydrate。 
例如，一个存储在本地存储的自定义 ref：

```ts
const useStore = defineStore('main', {
  state: () => ({
    n: useLocalStorage('key', 0)
  }),
  hydrate(storeState, initialState) {
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.n = useLocalStorage('key', 0)
  }
})
```

#### 参数

| 名字 | 类型 | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### 返回值

`void`

#### 继承于

Omit.hydrate

#### 定义于

[pinia/src/types.ts:687](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L687)

___

### state

▸ `Optional` **state**(): `S`

创建一个新 state 的函数。**必须是一个箭头函数**，
以确保正确的类型检查!

#### 返回值

`S`

#### 继承于

Omit.state

#### 定义于

[pinia/src/types.ts:642](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L642)