---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaPlugin

# Interface: PiniaPlugin

[pinia](../modules/pinia.md).PiniaPlugin

## Callable %{#Callable}%

### PiniaPlugin %{#Callable-PiniaPlugin}%

▸ **PiniaPlugin**(`context`): `void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<[`StateTree`](../modules/pinia.md#statetree)\>\>

Plugin to extend every store. Returns an object to extend the store or
nothing.

#### Parameters %{#Callable-PiniaPlugin-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`PiniaPluginContext`](pinia.PiniaPluginContext.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> | Context |

#### Returns %{#Callable-PiniaPlugin-Returns}%

`void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<[`StateTree`](../modules/pinia.md#statetree)\>\>
