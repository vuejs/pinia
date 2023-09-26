---
editLink: false
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
