---
editLink: false
---

[Документация API](../index.md) / [pinia](../modules/pinia.md) / PiniaPluginContext

# Интерфейс: PiniaPluginContext<Id, S, G, A\>

[pinia](../modules/pinia.md).PiniaPluginContext

Контекстный аргумент, переданный плагинам Pinia.

## Типы параметров %{#Type-parameters}%

| Имя  | Тип                                                                                                 |
| :--- | :-------------------------------------------------------------------------------------------------- |
| `Id` | extends `string` = `string`                                                                         |
| `S`  | extends [`StateTree`](../modules/pinia.md#statetree) = [`StateTree`](../modules/pinia.md#statetree) |
| `G`  | [`_GettersTree`](../modules/pinia.md#_getterstree)<`S`\>                                            |
| `A`  | [`_ActionsTree`](../modules/pinia.md#_actionstree)                                                  |

## Свойства %{#Properties}%

### app %{#Properties-app}%

• **app**: `App`<`any`\>

Текущее приложение, созданное с помощью `Vue.createApp()`.

---

### options %{#Properties-options}%

• **options**: [`DefineStoreOptionsInPlugin`](pinia.DefineStoreOptionsInPlugin.md)<`Id`, `S`, `G`, `A`\>

Начальные параметры, определяющие хранилище при вызове `defineStore()`.

---

### pinia %{#Properties-pinia}%

• **pinia**: [`Pinia`](pinia.Pinia.md)

pinia instance.

---

### store %{#Properties-store}%

• **store**: [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>

Действующее хранилище расширяется.
