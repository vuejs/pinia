# Рендеринг на стороні серверу (SSR)

:::tip
Якщо ви використовуєте **Nuxt.js,** вам потрібно натомість прочитати [**ці інструкції**](./nuxt.md).
:::

Створення сховищ за допомогою Pinia має працювати для SSR з коробки, якщо ви викликаєте свої функції `useStore()` у верхній частині функцій `setup`, `getters` і `actions`:

```vue
<script setup>
// це працює, тому що Pinia знає, який застосунок працює всередині
// `setup`
const main = useMainStore()
</script>
```

## Використання сховища за межами `setup()`

Якщо вам потрібно використовувати сховища десь ще, вам потрібно передати екземпляр `pinia`, [який було передано до застосунку](../getting-started.md#installation) до виклику функції `useStore()`:

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ Це спрацює. Переконайтеся, що використовується коректне сховище для
    // поточного запущеного застосунку.
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

## Гідрація стану

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

Залежно від того, що ви використовуєте для SSR, ви встановите змінну _початкового стану_, яка буде серіалізована в HTML. Ви також повинні захистити себе від атак XSS. Ви можете використовувати [інші альтернативи](https://github.com/nuxt-contrib/devalue#see-also) для `@nuxt/devalue` залежно від того, що вам потрібно, наприклад, якщо ви можете серіалізувати та проаналізувати свій стан за допомогою `JSON.stringify()`/`JSON.parse()`, **ви можете значно покращити свою продуктивність**.

Якщо ви не використовуєте Nuxt, вам доведеться самостійно виконувати серіалізацію та гідратацію стану. Ось кілька прикладів:

- [Vitesse template](https://github.com/antfu/vitesse/blob/main/src/modules/pinia.ts)
- [vite-plugin-ssr](https://vite-plugin-ssr.com/pinia)

Адаптуйте цю стратегію до свого середовища. **Переконайтеся, що стан pinia гідровано перед викликом будь-якої функції `useStore()`** на стороні клієнта. Наприклад, якщо ми серіалізуємо стан у тег `<script>`, щоб зробити його доступним глобально на стороні клієнта через `window.__pinia`, ми можемо написати це так:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// `isClient` залежить від середовища, наприклад, на Nuxt це `process.client`
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
