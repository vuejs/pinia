---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / PiniaPlugin

# Interface: PiniaPlugin

[pinia](../modules/pinia.md).PiniaPlugin

## Appelable

### PiniaPlugin

▸ **PiniaPlugin**(`context`): `void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> & `PiniaCustomStateProperties`<[`StateTree`](../modules/pinia.md#statetree)\>\>

Plugin pour étendre chaque store. Retourne un objet pour étendre le store ou
rien.

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`PiniaPluginContext`](pinia.PiniaPluginContext.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> | Context |

#### Renvoie à

`void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\> & `PiniaCustomStateProperties`<[`StateTree`](../modules/pinia.md#statetree)\>\>

#### Défini dans

[pinia/src/rootStore.ts:140](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L140)
