# Nuxt.js %{#nuxt-js}%

Использование Pinia с [Nuxt](https://nuxt.com/) проще, так как Nuxt заботится о многих аспектах _рендеринга на стороне сервера_. Например, **вам не нужно беспокоиться о сериализации и XSS-атаках**. Pinia поддерживает Nuxt Bridge и Nuxt 3. Для поддержки чистого Nuxt 2, [см. ниже](#nuxt-2-without-bridge).

## Установка %{#installation}%

```bash
yarn add pinia @pinia/nuxt
# или с помощью npm
npm install pinia @pinia/nuxt
```

:::tip Совет
Если вы используете npm, возможно, вы столкнетесь с ошибкой _ERESOLVE unable to resolve dependency tree_. В этом случае добавьте следующее в ваш `package.json`:

```js
"overrides": {
  "vue": "latest"
}
```

:::

Мы предоставляем _модуль_, который обрабатывает все для вас, вам нужно только добавить его в раздел `modules` в файле `nuxt.config.js`:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... другие параметры
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

И вот, используйте свое хранилище как обычно!

## Использование хранилища за пределами `setup()` %{#using-the-store-outside-of-setup}%

Если вы хотите использовать хранилище за пределами `setup()`, не забудьте передать объект `pinia` в `useStore()`. Мы добавили его в [контекст](https://nuxtjs.org/docs/2.x/internals-glossary/context), поэтому у вас есть к нему доступ в `asyncData()` и `fetch()`:

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

Как и в случае с `onServerPrefetch()`, не нужно делать ничего особенного, если вы хотите вызвать действие хранилища внутри `asyncData()`:

```vue
<script setup>
const store = useStore()
const { data } = await useAsyncData('user', () => store.fetchUser())
</script>
```

## Автоматические импорты %{#auto-imports}%

По умолчанию `@pinia/nuxt` предоставляет один автоматический импорт: `usePinia()`, который аналогичен `getActivePinia()`, но лучше работает с Nuxt. Вы можете добавить автоматические импорты, чтобы упростить себе жизнь:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... другие параметры
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: [
      // автоматически импортировать `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
```

## Nuxt 2 без bridge %{#nuxt-2-without-bridge}%

Pinia поддерживает Nuxt 2 до версии `@pinia/nuxt` v0.2.1. Также убедитесь, что вместе с pinia вы установили [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/) наряду с pinia.

```bash
yarn add pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
# или при помощи
npm install pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
```

Мы поставляем _модуль_, который будет выполнять все действия за вас, вам нужно только добавить его в `buildModules` в файле `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  // ... другие параметры
  buildModules: [
    // Только для Nuxt 2:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

### TypeScript %{#typescript}%

Если вы используете Nuxt 2 (`@pinia/nuxt` < 0.3.0) с TypeScript или у вас есть `jsconfig.json`, вам также следует добавить типы для `context.pinia`:

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

Это также обеспечит автозаполнение 😉 .

### Использование Pinia совместно с Vuex %{#using-pinia-alongside-vuex}%

Рекомендуется **избегать совместного использования Pinia и Vuex**, но если необходимо использовать и то, и другое, то нужно указать pinia, чтобы она не отключала Vuex:

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... другие параметры
}
```
