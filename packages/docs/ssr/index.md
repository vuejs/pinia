# Рендеринг на стороне сервера (SSR) %{#server-side-rendering-ssr}%

:::tip Совет
Если вы используете **Nuxt.js,** то вместо этого необходимо прочитать [**эти инструкции**](./nuxt.md).
:::

Создание хранилищ с помощью Pinia должно работать из коробки для SSR, если вы вызываете свои функции `useStore()` в верхней части функций `setup`, `getters` и `actions`:

```vue
<script setup>
// это работает, потому что pinia знает, какое приложение
// запущено внутри `setup`
const main = useMainStore()
</script>
```

## Использование хранилища за пределами `setup()` %{#using-the-store-outside-of-setup}%

Если необходимо использовать хранилище в другом месте, то в вызов функции `useStore()` необходимо передать экземпляр `pinia`, [который был передан приложению](../getting-started.md#installation):

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ Это будет работать, если убедиться, что используется правильное хранилище для
  // текущего запущенного приложения
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia удобно добавляет себя как $`$pinia`в ваше приложение, так что вы можете использовать его в таких функциях, как`serverPrefetch()`:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

Обратите внимание, что при использовании `onServerPrefetch()` ничего особенного делать не нужно:

```vue
<script setup>
const store = useStore()
onServerPrefetch(async () => {
  // ✅ это работает
  await store.fetchData()
})
</script>
```

## Гидратация состояния %{#state-hydration}%

Чтобы гидратировать начальное состояние, вам нужно убедиться, что rootState вставлено где-то в HTML, чтобы Pinia могло его позже обнаружить. В зависимости от того, что вы используете для SSR, вам необходимо экранировать состояние по соображениям безопасности. Мы рекомендуем использовать [@nuxt/devalue](https://github.com/nuxt-contrib/devalue), который используется в Nuxt.js:

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// получение значения rootState на стороне сервера
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// после рендеринга страницы, корневое состояние построено и может быть прочитано
// непосредственно из `pinia.state.value`.

// сериализовать, экранировать (ОЧЕНЬ важно, если содержимое состояния может быть изменено
// пользователем, а это почти всегда так), и поместить его куда-нибудь на
// странице, например, в качестве глобальной переменной.
devalue(pinia.state.value)
```

В зависимости от того, что вы используете для SSR, вы установите переменную _начального состояния_, которая будет сериализована в HTML. Также вам следует защититься от атак XSS. Вы можете использовать [другие альтернативы](https://github.com/nuxt-contrib/devalue#see-also) вместо `@nuxt/devalue` в зависимости от ваших потребностей, например, если вы можете сериализовать и десереализировать состояние с помощью `JSON.stringify()`/`JSON.parse()`, то **можно существенно улучшить производительность**.

Если вы не используете Nuxt, вам придется самостоятельно обрабатывать сериализацию и гидратацию состояния. Вот несколько примеров:

- [Vitesse template](https://github.com/antfu/vitesse/blob/main/src/modules/pinia.ts)
- [vite-plugin-ssr](https://vite-plugin-ssr.com/pinia)

Адаптируйте эту стратегию под свою среду выполнения. **Убедитесь, что вы восстанавливаете состояние Pinia перед вызовом функции `useStore()`** на стороне клиента. Например, если мы сериализуем состояние в тег `<script>`, чтобы сделать его доступным глобально на клиентской стороне через `window.__pinia`, мы можем написать следующее:"

```ts
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// `isClient` зависит от среды выполнения, например, в Nuxt это `process.client`.
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
