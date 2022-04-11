---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / PiniaPlugin

# 接口：PiniaPlugin

[pinia](../modules/pinia.md).PiniaPlugin

## Callable

### PiniaPlugin

▸ **PiniaPlugin**(`context`): `void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> & `PiniaCustomStateProperties`<[`StateTree`](../modules/pinia.md#statetree)\>\>

用于扩展每个 store 的插件。返回一个扩展 store 的对象或
没有返回值。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `context` | [`PiniaPluginContext`](pinia.PiniaPluginContext.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> | Context |

#### 返回值

`void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> & `PiniaCustomStateProperties`<[`StateTree`](../modules/pinia.md#statetree)\>\>

#### 定义于

[pinia/src/rootStore.ts:140](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L140)
