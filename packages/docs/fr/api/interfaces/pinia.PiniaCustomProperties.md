---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / PiniaCustomProperties

# Interface: PiniaCustomProperties<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaCustomProperties

Interface à étendre par l'utilisateur lorsqu'il ajoute des propriétés par le biais de plugins.

## Les types paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `_GettersTree`<`S`\> |
| `A` | `_ActionsTree` |

## Les propriétés

### $nuxt

• **$nuxt**: `Context`

Nouveau contexte.

#### Défini dans

[nuxt/src/module.ts:68](https://github.com/posva/pinia/blob/46c50b2/packages/nuxt/src/module.ts#L68)

___

### double

• **double**: `number`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:14](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L14)

___

### globalA

• **globalA**: `string`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:11](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L11)

___

### globalB

• **globalB**: `string`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:12](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L12)

___

### hasApp

• **hasApp**: `boolean`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:9](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L9)

___

### idFromPlugin

• **idFromPlugin**: `Id`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:10](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L10)

___

### pluginN

• **pluginN**: `number`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:7](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L7)

___

### shared

• **shared**: `number`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L13)

___

### uid

• **uid**: `number`

#### Défini dans

[pinia/__tests__/storePlugins.spec.ts:8](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/__tests__/storePlugins.spec.ts#L8)

## Accesseurs

### route

• `get` **route**(): `RouteLocationNormalized`

#### Renvoie à

`RouteLocationNormalized`

#### Défini dans

[playground/src/main.ts:17](https://github.com/posva/pinia/blob/46c50b2/packages/playground/src/main.ts#L17)

• `set` **route**(`value`): `void`

#### Les paramètres

| Name | Type |
| :------ | :------ |
| `value` | `RouteLocationNormalizedLoaded` \| `Ref`<`RouteLocationNormalizedLoaded`\> |

#### Renvoie à

`void`

#### Défini dans

[playground/src/main.ts:14](https://github.com/posva/pinia/blob/46c50b2/packages/playground/src/main.ts#L14)
