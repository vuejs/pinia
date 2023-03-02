# Nuxt.js

Использование Pinia с [Nuxt.js](https://nuxtjs.org/) легкое, поскольку Nuxt берет на себя заботу о многих вещах, когда дело доходит до _рендеринга на стороне сервера_. Например, **вам не нужно заботиться о сериализации или XSS атаках**. Pinia поддерживает Nuxt Bridge и Nuxt 3. Для поддержки только Nuxt 2, [смотрите ниже](#nuxt-2-without-bridge).

## Установка

```bash
yarn add pinia @pinia/nuxt
# или с помощью npm
npm install pinia @pinia/nuxt
```

:::tip
Если вы используете npm, вы можете столкнуться с ошибкой _ERESOLVE unable to resolve dependency tree_. В этом случае добавьте следующее в ваш `package.json`:

```js
"overrides": {
  "vue": "latest"
}
```

:::

Мы поставляем _модуль_, который все сделает за вас, вам нужно только добавить его в `modules` в вашем файле `nuxt.config.js`:

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

И все, пользуйтесь своим хранилищем как обычно!

## Использование хранилища за пределами `setup()`

Если вы хотите использовать магазин вне `setup()`, не забудьте передать объект `pinia` в `useStore()`. Мы добавили его в [контекст](https://nuxtjs.org/docs/2.x/internals-glossary/context), чтобы у вас был доступ к нему в `asyncData()` и `fetch()`:

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

Как и в случае с `onServerPrefetch()`, вам не нужно делать ничего особенного, если вы хотите вызвать действие хранилища внутри `asyncData()`:

```vue
<script setup>
const store = useStore()
const { data } = await useAsyncData('user', () => store.fetchUser())
</script>
```

## Auto imports

By default `@pinia/nuxt` exposes one single auto import: `usePinia()`, which is similar to `getActivePinia()` but works better with Nuxt. You can add auto imports to make your life easier:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... другие параметры
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
```

## Nuxt 2 без моста

Pinia поддерживает Nuxt 2 до `@pinia/nuxt` v0.2.1. Обязательно установите [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/) вместе с `pinia`:

```bash
yarn add pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
# или с помощью npm
npm install pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
```

Мы поставляем _модуль_, который все сделает за вас, вам нужно только добавить его в `buildModules` в вашем файле `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  // ... другие параметры
  buildModules: [
    // Nuxt 2 только:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

### TypeScript

If you are using Nuxt 2 (`@pinia/nuxt` < 0.3.0) with TypeScript or have a `jsconfig.json`, you should also add the types for `context.pinia`:

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

Это также обеспечит автозаполнение 😉 .

### Использование Pinia вместе с Vuex

Рекомендуется **избегать использования как Pinia с Vuex**, но если вам необходимо использовать и то, и другое, вам нужно указать pinia, чтобы не отключать ее:

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
