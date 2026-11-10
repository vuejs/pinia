# 从 v2 迁移至 v3 %{#migrating-from-v2-to-v3}%

<!-- <RuleKitLink /> -->

Pinia v3 是一个 _无聊_ 的大版本，它没有任何新功能。它移除了已弃用的 API，并更新了主要依赖。它只支持 Vue 3。如果你使用的是 Vue 2，你可以继续使用 v2。如果你需要帮助，可以[预约 Pinia 作者的帮助](https://cal.com/posva/consultancy)。

对于大多数用户来说，迁移应该**不需要任何修改**。本指南是为了在你遇到问题时提供帮助。

## 弃用 %{#deprecations}%

### `defineStore({ id })` %{#definestore-id}%

接收一个带有 `id` 属性的对象的 `defineStore()` 签名已被弃用。你应该使用 `id` 参数来代替：

```ts
defineStore({ // [!code --]
  id: 'storeName', // [!code --]
defineStore('storeName', { // [!code ++]
  // ...
})
```

### `PiniaStorePlugin` %{#piniastoreplugin}%

这个已弃用的类型别名已被移除，请使用 `PiniaPlugin` 代替。

## 新版本 %{#new-versions}%

- 只支持 Vue 3。
- 需要 TypeScript 5 或更新的版本。
- devtools API 已升级至 [v7](https://devtools.vuejs.org)。

## Nuxt %{#nuxt}%

Nuxt 模块已更新为支持 Nuxt 3。如果你使用的是 Nuxt 2 或 Nuxt bridge，你可以继续使用旧版本的 Pinia。
