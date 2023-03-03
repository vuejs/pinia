---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / PiniaPlugin

# Интерфейс: PiniaPlugin

[pinia](../modules/pinia.md).PiniaPlugin

## Callable %{#Callable}%

### PiniaPlugin %{#Callable-PiniaPlugin}%

▸ **PiniaPlugin**(`context`): `void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<[`StateTree`](../modules/pinia.md#statetree)\>\>

Плагин для расширения каждого хранилища. Возвращает объект для расширения хранилища или ничего.

#### Параметры %{#Callable-PiniaPlugin-Parameters}%

| Имя       | Тип                                                                                                                                                                                                                                                                 | Описание |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| `context` | [`PiniaPluginContext`](pinia.PiniaPluginContext.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> | Context  |

#### Возвращает %{#Callable-PiniaPlugin-Returns}%

`void` \| `Partial`<[`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), [`_GettersTree`](../modules/pinia.md#_getterstree)<[`StateTree`](../modules/pinia.md#statetree)\>, [`_ActionsTree`](../modules/pinia.md#_actionstree)\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<[`StateTree`](../modules/pinia.md#statetree)\>\>
