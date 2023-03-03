# Рендеринг на стороне сервера (SSR)

:::tip
Если вы используете **Nuxt.js,** вам нужно прочитать [**эти инструкции**](./nuxt.md) вместо этого.
:::

Создание хранилища состояния с помощью Pinia должно работать из коробки для SSR, если вы вызываете ваши функции `useStore()` в верхней части функций `setup`, `getters` и `actions`:

```vue
<script setup>
// это работает, потому что pinia знает, какое приложение запущено внутри
// `setup`
const main = useMainStore()
</script>
```

## Использование хранилища состояния вне `setup()`

Если вам нужно использовать хранилище где-то еще, вам нужно передать экземпляр `pinia` [который был передан приложению](#install-the-plugin) в вызов функции `useStore()`:

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

Pinia удобно добавляет себя как `$pinia` в ваше приложение, чтобы вы могли использовать его в таких функциях, как `serverPrefetch()`:

```js
export default {
    serverPrefetch() {
        const store = useStore(this.$pinia)
    },
}
```

Обратите внимание, что вам не нужно делать ничего особенного при использовании `onServerPrefetch()`:

```vue
<script setup>
const store = useStore()
onServerPrefetch(async () => {
    // ✅ это будет работать
    await store.fetchData()
})
</script>
```

## Гидратация состояния

Чтобы гидратировать начальное состояние, вам нужно убедиться, что rootState включен где-нибудь в HTML, чтобы Pinia могла подхватить его позже. В зависимости от того, что вы используете для SSR, **вам следует исключить состояние из соображений безопасности**. Мы рекомендуем использовать [@nuxt/devalue](https://github.com/nuxt-contrib/devalue), который используется Nuxt.js:

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// получить rootState на стороне сервера
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// после рендеринга страницы, корневое состояние построено и может быть прочитано непосредственно
// на `pinia.state.value`.

// сериализуйте, сохраните (ОЧЕНЬ важно, если содержимое состояния может быть изменено
// пользователем, что почти всегда так и есть), и поместите его куда-нибудь на
// странице, например, как глобальную переменную.
devalue(pinia.state.value)
```

В зависимости от того, что вы используете для SSR, вы установите переменную _initial state_, которая будет сериализована в HTML. Вы также должны защитить себя от XSS атак. Например, с [vite-ssr](https://github.com/frandiox/vite-ssr) вы можете использовать опцию [`transformState`](https://github.com/frandiox/vite-ssr#state-serialization) и `@nuxt/devalue`:

```js
import devalue from '@nuxt/devalue'

export default viteSSR(
    App,
    {
        routes,
        transformState(state) {
            return import.meta.env.SSR ? devalue(state) : state
        },
    },
    ({ initialState }) => {
        // ...
        if (import.meta.env.SSR) {
            // это будет структурировано и установлено в window.__INITIAL_STATE__
            initialState.pinia = pinia.state.value
        } else {
            // на стороне клиента, мы восстанавливаем состояние
            pinia.state.value = initialState.pinia
        }
    }
)
```

Вы можете использовать [другие альтернативы](https://github.com/nuxt-contrib/devalue#see-also) к `@nuxt/devalue` в зависимости от того, что вам нужно, например, если вы можете сериализовать и разобрать ваше состояние с помощью `JSON.stringify()`/`JSON.parse()`, **вы можете значительно повысить производительность**.

Адаптируйте эту стратегию к своему окружению. Обязательно гидратируйте состояние pinia перед вызовом любой функции `useStore()` на стороне клиента. Например, если мы сериализуем состояние в тег `<script>`, чтобы сделать его глобально доступным на стороне клиента через `window.__pinia`, мы можем написать следующее:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// должен быть установлен пользователем
if (isClient) {
    pinia.state.value = JSON.parse(window.__pinia)
}
```
