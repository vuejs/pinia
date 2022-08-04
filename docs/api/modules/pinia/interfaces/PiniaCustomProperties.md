# Interface: PiniaCustomProperties<Id, S, G, A\>

Interface to be extended by the user when they add properties through plugins.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../type_aliases.md#statetree) = [`StateTree`](../type_aliases.md#statetree) |
| `G` | [`_GettersTree`](../type_aliases.md#getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../type_aliases.md#actionstree) |

## Accessors

### route

• `get` **route**(): `RouteLocationNormalized`

#### Returns

`RouteLocationNormalized`

• `set` **route**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### Returns

`void`
