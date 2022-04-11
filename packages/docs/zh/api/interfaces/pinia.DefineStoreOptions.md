---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptions

# 接口：DefineStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptions

`defineStore()` 的选项参数，用于设置 store。可以通过插件 API 扩展来增强 store 的功能。
@查看 [DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## 类型参数

| 名字 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## 层次结构{#hierarchy}

- [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineStoreOptions`**

## 属性{#properties}

### actions

• `Optional` **actions**: `A` & `ThisType`<`A` & `UnwrapRef`<`S`\> & [`_StoreWithState`](pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\>

action 的可选对象

#### 定义于

[pinia/src/types.ts:654](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L654)

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\> & `_GettersTree`<`S`\>

getter 的可选对象

#### 定义于

[pinia/src/types. ts:647](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L647)

___

### id

• **id**: `Id`

唯一的字符串密钥，用于识别整个应用程序中的 store。

#### 定义于

[pinia/src/types.ts:636](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L636)

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

| 名字 | 类型 | 描述 |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### 返回值

`void`

#### 定义于

[pinia/src/types.ts:687](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L687)

___

### state

▸ `Optional` **state**(): `S`

创建一个新 state 的函数。**必须是一个箭头函数**，
以确保正确的类型检查!

#### 返回值

`S`

#### 定义于

[pinia/src/types.ts:642](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L642)
