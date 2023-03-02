---
editLink: false
---

[Документация API](../index.md) / [@pinia/nuxt](../modules/pinia_nuxt.md) / ModuleOptions

# Интерфейс: ModuleOptions

[@pinia/nuxt](../modules/pinia_nuxt.md).ModuleOptions

## Свойства %{#Properties}%

### autoImports %{#Properties-autoImports}%

• `Optional` **autoImports**: (`string` \| [`string`, `string`])[]

Массив автоимпортов, добавляемых в файл nuxt.config.js.

**`Пример`**

```js
autoImports: [
 // автоматический импорт `defineStore`
 'defineStore',
 // автоматический импорт `defineStore` как `definePiniaStore`
 ['defineStore', 'definePiniaStore',
]
```

---

### disableVuex %{#Properties-disableVuex}%

• `Optional` **disableVuex**: `boolean`

Pinia отключает Vuex по умолчанию, установите эту опцию в `false`, чтобы избежать этого и использовать Pinia вместе с Vuex (только Nuxt 2).

**`По умолчанию`**

`true`
