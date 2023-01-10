---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaCustomProperties

# Interface: PiniaCustomProperties<Id, S, G, A\> %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>}%

[pinia](../modules/pinia.md).PiniaCustomProperties

Interface to be extended by the user when they add properties through plugins.

## Type parameters %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Accessors %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Accessors}%

### route %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Accessors-route}%

• `get` **route**(): `RouteLocationNormalized`

#### Returns %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Accessors-route-Returns}%

`RouteLocationNormalized`

• `set` **route**(`value`): `void`

#### Parameters %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Accessors-route-Parameters}%

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### Returns %{#Interface:-PiniaCustomProperties<Id,-S,-G,-A\>-Accessors-route-Returns_1}%

`void`
