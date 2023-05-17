# Рендеринг на стороні серверу (SSR) %{#server-side-rendering-ssr}%

:::tip
Якщо ви використовуєте **Nuxt.js,** вам потрібно натомість прочитати [**ці інструкції**](./nuxt.md).
:::

Створення сховищ за допомогою Pinia має працювати для SSR з коробки, якщо ви викликаєте свої функції `useStore()` у верхній частині функцій `setup`, `getters` і `actions`:

```vue
<script setup>
// це працює, тому що Pinia знає, яка програма працює всередині `setup`
const main = useMainStore()
</script>
```

## Використання сховища за межами `setup()` %{#using-the-store-outside-of-setup}%

Якщо вам потрібно використовувати сховища десь ще, вам потрібно передати екземпляр `pinia`, [який було передано до застосунку](#install-the-plugin) до виклику функції `useStore()`:

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ Це спрацює. Переконайтеся, що використовується коректне сховище для поточного запущеного застосунку.
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia зручно додає себе як `$pinia` до вашого застосунку, щоб ви могли використовувати її в таких функціях, як `serverPrefetch()`:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

Зауважте, що вам не потрібно робити нічого особливого коли використовуєте `onServerPrefetch()`:

```vue
<script setup>
const store = useStore()
onServerPrefetch(async () => {
  // ✅ Це спрацює
  await store.fetchData()
})
</script>
```

## Гідрація стану %{#state-hydration}%

Щоб гідратувати початковий стан, вам потрібно переконатися, що rootState включено десь у HTML, щоб Pinia міг забрати його пізніше. Залежно від того, що ви використовуєте для SSR, **вам потрібно екранувати стан сховища з міркувань безпеки**. Ми рекомендуємо використовувати [@nuxt/devalue](https://github.com/nuxt-contrib/devalue) який використовується Nuxt.js:

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// отримати rootState на стороні серверу
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// після відтворення сторінки створюється кореневий стан, який можна прочитати
// безпосередньо з `pinia.state.value`.

// серіалізація, екранування (ДУЖЕ важливо, якщо вміст стану може бути змінений
// користувачем, що майже завжди так), і розміщення його десь на сторінці,
// наприклад, як глобальна змінна.
devalue(pinia.state.value)
```

Залежно від того, що ви використовуєте для SSR, ви встановите змінну _початкового стану_, яка буде серіалізована в HTML. Ви також повинні захистити себе від атак XSS. Наприклад, з [vite-ssr](https://github.com/frandiox/vite-ssr) ви можете використовувати [параметр `transformState`](https://github.com/frandiox/vite-ssr#state-serialization) та `@nuxt/devalue`:

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
      // це буде перетворено в рядок і встановлено в window.__INITIAL_STATE__
      initialState.pinia = pinia.state.value
    } else {
      // на стороні клієнта ми відновлюємо стан
      pinia.state.value = initialState.pinia
    }
  }
)
```

Ви можете використовувати [інші альтернативи](https://github.com/nuxt-contrib/devalue#see-also) для `@nuxt/devalue` залежно від того, що вам потрібно, наприклад, якщо ви можете серіалізувати та десеріалізувати стан свого сховища за допомогою `JSON.stringify()`/`JSON.parse()`, **ви можете значно покращити продуктивність**.

Адаптуйте цю стратегію до свого середовища. Перед викликом будь-якої функції `useStore()` на стороні клієнта, переконайтеся, що стан pinia гідровано. Наприклад, якщо ми серіалізуємо стан у тег `<script>`, щоб зробити його доступним глобально на стороні клієнта через `window.__pinia`, ми можемо написати це так:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// має бути встановлено на стороні користувача
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
