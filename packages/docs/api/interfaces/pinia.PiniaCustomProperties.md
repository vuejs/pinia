---
sidebar: "auto"
editLink: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaCustomProperties

# Interface: PiniaCustomProperties<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaCustomProperties

Interface to be extended by the user when they add properties through plugins.

## Type parameters %{#Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Accessors %{#Accessors}%

### route %{#Accessors-route}%

• `get` **route**(): `RouteLocationNormalized`

#### Returns %{#Accessors-route-Returns}%

`RouteLocationNormalized`

• `set` **route**(`value`): `void`

#### Parameters %{#Accessors-route-Parameters}%

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### Returns %{#Accessors-route-Returns_1}%

`void`
