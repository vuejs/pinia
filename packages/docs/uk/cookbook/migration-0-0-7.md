# Міграція з 0.0.7 %{#migrating-from-0-0-7}%

Версії після `0.0.7`: `0.1.0`, та `0.2.0`, прийшли з кількома серйозними змінами. Цей посібник допоможе вам перейти незалежно від того, використовуєте ви Vue 2 або Vue 3. Весь журнал змін можна знайти в репозиторії:

- [Для Pinia <= 1 для Vue 2](https://github.com/vuejs/pinia/blob/v1/CHANGELOG.md)
- [Для Pinia >= 2 для Vue 3](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)

Якщо у вас є запитання чи проблеми щодо міграції, не соромтеся [відкрити обговорення](https://github.com/vuejs/pinia/discussions/categories/q-a), щоб попросити допомоги.

## Більше немає `store.state` %{#no-more-store-state}%

Ви більше не отримуєте доступ до стану сховища через властивість `state`, ви можете отримати прямий доступ до будь-якої властивості стану.

Дано сховище, визначене за допомогою:

```js
const useStore({
  id: 'main',
  state: () => ({ count: 0 })
})
```

Виконайте

```diff
 const store = useStore()

-store.state.count++
+store.count.++
```

За потреби ви все ще можете отримати доступ до всього стану сховища за допомогою `$state`:

```diff
-store.state = newState
+store.$state = newState
```

## Перейменування властивостей сховища %{#rename-of-store-properties}%

Усі властивості сховища (`id`, `patch`, `reset`, тощо) тепер мають префікс `$`, щоб дозволити властивостям, які визначені в сховищі, мати ті ж самі імена. Порада: ви можете виконати рефакторинг усієї кодової бази за допомогою клавіші F2 (або клік правою кнопкою миші + Refactor) на кожній із властивостей сховища

```diff
 const store = useStore()
-store.patch({ count: 0 })
+store.$patch({ count: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## Екземпляр Pinia %{#the-pinia-instance}%

Тепер необхідно створити екземпляр pinia та встановити його:

Якщо ви використовуєте Vue 2 (Pinia <= 1):

```js
import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

const pinia = createPinia()
Vue.use(PiniaVuePlugin)
new Vue({
  el: '#app',
  pinia,
  // ...
})
```

Якщо ви використовуєте Vue 3 (Pinia >= 2):

```js
import { createApp } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

Екземпляр `pinia` - це те, що зберігає стан і **має бути унікальним для кожного застосунку**. Щоб отримати докладніші відомості, перегляньте розділ документації з SSR.

## Зміни SSR

Плагін SSR `PiniaSsr` більше не потрібен і його видалено.
З появою екземплярів pinia `getRootState()` більше не потрібен і його слід замінити на `pinia.state.value`:

Якщо ви використовуєте Vue 2 (Pinia <= 1):

```diff
// entry-server.js
-import { getRootState, PiniaSsr } from 'pinia',
+import { createPinia, PiniaVuePlugin } from 'pinia',


-// встановіть плагін, щоб автоматично використовувати правильний контекст у налаштуваннях і onServerPrefetch
-Vue.use(PiniaSsr);
+Vue.use(PiniaVuePlugin)

 export default context => {
+  const pinia = createPinia()
   const app = new Vue({
     // інші налаштування
+    pinia
   })

   context.rendered = () => {
     // передача стану контексту
-    context.piniaState = getRootState(context.req)
+    context.piniaState = pinia.state.value
   };

-   return { app }
+   return { app, pinia }
 }
```

`setActiveReq()` і `getActiveReq()` були замінені на `setActivePinia()` і `getActivePinia()` відповідно. `setActivePinia()` може передаватися лише екземпляру `pinia`, створеному за допомогою `createPinia()`. **Зауважте, що у більшості випадків ви не використовуватимете безпосередньо ці функції**.
