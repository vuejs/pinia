# Interface: PiniaPlugin

## Callable

### PiniaPlugin

▸ **PiniaPlugin**(`context`): `void` \| `Partial`<[`PiniaCustomProperties`](PiniaCustomProperties.md)<`string`, [`StateTree`](../type_aliases.md#statetree), [`_GettersTree`](../type_aliases.md#getterstree)<[`StateTree`](../type_aliases.md#statetree)\>, [`_ActionsTree`](../type_aliases.md#actionstree)\> & [`PiniaCustomStateProperties`](PiniaCustomStateProperties.md)<[`StateTree`](../type_aliases.md#statetree)\>\>

Plugin to extend every store. Returns an object to extend the store or
nothing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`PiniaPluginContext`](PiniaPluginContext.md)<`string`, [`StateTree`](../type_aliases.md#statetree), [`_GettersTree`](../type_aliases.md#getterstree)<[`StateTree`](../type_aliases.md#statetree)\>, [`_ActionsTree`](../type_aliases.md#actionstree)\> | Context |

#### Returns

`void` \| `Partial`<[`PiniaCustomProperties`](PiniaCustomProperties.md)<`string`, [`StateTree`](../type_aliases.md#statetree), [`_GettersTree`](../type_aliases.md#getterstree)<[`StateTree`](../type_aliases.md#statetree)\>, [`_ActionsTree`](../type_aliases.md#actionstree)\> & [`PiniaCustomStateProperties`](PiniaCustomStateProperties.md)<[`StateTree`](../type_aliases.md#statetree)\>\>
