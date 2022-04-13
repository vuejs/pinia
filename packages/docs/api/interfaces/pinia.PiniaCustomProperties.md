---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaCustomProperties

# Interface: PiniaCustomProperties<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaCustomProperties

Interface to be extended by the user when they add properties through plugins.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](../modules/pinia.md#_actionstree) |

## Properties

### $nuxt

• **$nuxt**: `Context`

Nuxt context.

#### Defined in

[nuxt/src/module.ts:68](https://github.com/vuejs/pinia/blob/6ce186f/packages/nuxt/src/module.ts#L68)

___

### double

• **double**: `number`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:14](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L14)

___

### globalA

• **globalA**: `string`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:11](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L11)

___

### globalB

• **globalB**: `string`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:12](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L12)

___

### hasApp

• **hasApp**: `boolean`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:9](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L9)

___

### idFromPlugin

• **idFromPlugin**: `Id`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:10](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L10)

___

### pluginN

• **pluginN**: `number`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:7](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L7)

___

### shared

• **shared**: `number`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:13](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L13)

___

### uid

• **uid**: `number`

#### Defined in

[pinia/__tests__/storePlugins.spec.ts:8](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/__tests__/storePlugins.spec.ts#L8)

## Accessors

### route

• `get` **route**(): `RouteLocationNormalized`

#### Returns

`RouteLocationNormalized`

#### Defined in

[playground/src/main.ts:17](https://github.com/vuejs/pinia/blob/6ce186f/packages/playground/src/main.ts#L17)

• `set` **route**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### Returns

`void`

#### Defined in

[playground/src/main.ts:14](https://github.com/vuejs/pinia/blob/6ce186f/packages/playground/src/main.ts#L14)
