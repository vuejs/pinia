---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API 文档](../index.md) / [pinia](../modules/pinia.md) / PiniaCustomProperties

# 接口：PiniaCustomProperties<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaCustomProperties

当用户通过插件添加属性时，接口可被扩展。

## 类型参数

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## 属性{#properties}

### $nuxt

• **$nuxt**: `Context`

Nuxt 上下文

#### 定义于

[nuxt/src/module.ts:68](https://github.com/posva/pinia/blob/46c50b2/packages/nuxt/src/module.ts#L68)

___

### double

• **double**: `number`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:14](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L14)

___

### globalA

• **globalA**: `string`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:11](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L11)

___

### globalB

• **globalB**: `string`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:12](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L12)

___

### hasApp

• **hasApp**: `boolean`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:9](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L9)

___

### idFromPlugin

• **idFromPlugin**: `Id`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:10](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L10)

___

### pluginN

• **pluginN**: `number`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:7](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L7)

___

### shared

• **shared**: `number`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L13)

___

### uid

• **uid**: `number`

#### 定义于

[pinia/__tests__/storePlugins.spec.ts:8](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L8)

## Accessors

### route

• `get` **route**(): `RouteLocationNormalized`

#### 返回值

`RouteLocationNormalized`

#### 定义于

[playground/src/main.ts:17](https://github.com/posva/pinia/blob/46c50b2/packages/playground/src/main.ts#L17)

• `set` **route**(`value`): `void`

#### 参数

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### 返回值

`void`

#### 定义于

[playground/src/main.ts:14](https://github.com/posva/pinia/blob/46c50b2/packages/playground/src/main.ts#L14)
