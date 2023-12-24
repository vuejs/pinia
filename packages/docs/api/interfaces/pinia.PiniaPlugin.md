---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaPlugin

# Interface: PiniaPlugin

[pinia](../modules/pinia.md).PiniaPlugin

Plugin to extend every store.

## Callable

### PiniaPlugin

▸ **PiniaPlugin**(`context`): `void` \| `Partial`\<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)\<`string`, [`StateTree`](../modules/pinia.md#StateTree), [`_GettersTree`](../modules/pinia.md#_GettersTree)\<[`StateTree`](../modules/pinia.md#StateTree)\>, [`_ActionsTree`](../modules/pinia.md#_ActionsTree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)\<[`StateTree`](../modules/pinia.md#StateTree)\>\>

Plugin to extend every store. Returns an object to extend the store or
nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`PiniaPluginContext`](pinia.PiniaPluginContext.md)\<`string`, [`StateTree`](../modules/pinia.md#StateTree), [`_GettersTree`](../modules/pinia.md#_GettersTree)\<[`StateTree`](../modules/pinia.md#StateTree)\>, [`_ActionsTree`](../modules/pinia.md#_ActionsTree)\> | Context |

#### Returns

`void` \| `Partial`\<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)\<`string`, [`StateTree`](../modules/pinia.md#StateTree), [`_GettersTree`](../modules/pinia.md#_GettersTree)\<[`StateTree`](../modules/pinia.md#StateTree)\>, [`_ActionsTree`](../modules/pinia.md#_ActionsTree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)\<[`StateTree`](../modules/pinia.md#StateTree)\>\>
