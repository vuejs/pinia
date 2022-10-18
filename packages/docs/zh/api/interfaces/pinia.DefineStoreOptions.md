---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptions

# 接口：DefineStoreOptions<Id, S, G, A\> {#interface-definestoreoptions-id-s-g-a}

[pinia](../modules/pinia.md).DefineStoreOptions

用于 option store 的 `defineStore()` 的配置参数。
可以通过插件 API 扩展来增强 store。

**`See`**

[DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## 类型参数 {#type-parameters}

| 名字 | 类型 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## 层次结构 {#hierarchy}

- [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineStoreOptions`**

## 属性 {#properties}

### actions {#actions}

• `Optional` **actions**: `A` & `ThisType`<`A` & `UnwrapRef`<`S`\> & [`_StoreWithState`](pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\>

action 的可选对象

___

### getters {#getters}

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & [`_StoreWithGetters`](../modules/pinia.md#_storewithgetters)<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\>\> & [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>

getter 的可选对象

___

### id {#id}

• **id**: `Id`

唯一的字符串密钥，用于识别整个应用程序中的 store。

___

### state {#state}

• `Optional` **state**: () => `S`

#### 类型声明 {#type-declaration}

▸ (): `S`

创建一个新 state 的函数。
**必须是一个箭头函数**，以确保正确的类型检查!

##### 返回值 {#returns}

`S`

## 方法 {#methods}

### hydrate {#hydrate}

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

当 store 定义中使用了复杂的 state（如仅客户端的引用），并且仅从 `pinia.state` 中复制值是不够时，
允许在 SSR 期间对 store 进行 hydrating。

**`Example`**

如果在你的 `state` 中，你使用了任何在服务器和客户端有不同值的 `customRef`、`computed` 或 `ref`，
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

#### 参数 {#parameters}

| 名字 | 类型 | 描述 |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### 返回值 {#returns}

`void`
