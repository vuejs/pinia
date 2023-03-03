# Переход с версии 0.0.7

Версии после `0.0.7`: `0.1.0`, и `0.2.0`, содержат несколько серьезных изменений. Это руководство поможет вам осуществить миграцию независимо от того, используете ли вы Vue 2 или Vue 3. Весь журнал изменений можно найти в репозитории:

- [С Pinia <= 1 для Vue 2](https://github.com/vuejs/pinia/blob/v1/CHANGELOG.md)
- [С Pinia >= 2 для Vue 3](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)

Если у вас есть вопросы или проблемы, связанные с миграцией, не стесняйтесь [открыть дискуссию](https://github.com/vuejs/pinia/discussions/categories/q-a), чтобы попросить о помощи.

## Больше нет `store.state`

Вы больше не обращаетесь к состоянию хранилища состояния через свойство `state`, вы можете напрямую обращаться к любому свойству состояния.

Если хранилище определен с:

```js
const useStore({
  id: 'main',
  state: () => ({ count: 0 })
})
```

Do

```diff
 const store = useStore()

-store.state.count++
+store.count.++
```

Вы все еще можете получить доступ ко всему состоянию хранилища с помощью `$state`, когда это необходимо:

```diff
-store.state = newState
+store.$state = newState
```

## Переименование свойств хранилища

Все свойства хранилища (`id`, `patch`, `reset` и т.д.) теперь имеют префикс `$`, чтобы позволить свойствам, определенным в хранилище с такими же именами. Совет: вы можете рефакторить всю вашу кодовую базу с помощью F2 (или правый клик + Refactor) на каждом из свойств хранилища

```diff
 const store = useStore()
-store.patch({ count: 0 })
+store.$patch({ count: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## Экземпляр Pinia

Теперь необходимо создать экземпляр Pinia и установить его:

Если вы используете Vue 2 (Pinia <= 1):

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

Если вы используете Vue 3 (Pinia >= 2):

```js
import { createApp } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

Экземпляр `pinia` хранит состояние и должен быть **уникальным для каждого приложения**. Обратитесь к разделу документации SSR для более подробной информации.

## Изменения SSR

SSR плагин `PiniaSsr` больше не нужен и был удален.
С введением экземпляров pinia, `getRootState()` больше не нужен и должен быть заменен на `pinia.state.value`:

Если вы используете Vue 2 (Pinia <= 1):

```diff
// entry-server.js
-import { getRootState, PiniaSsr } from 'pinia',
+import { createPinia, PiniaVuePlugin } from 'pinia',


-// install plugin to automatically use correct context in setup and onServerPrefetch
-Vue.use(PiniaSsr);
+Vue.use(PiniaVuePlugin)

 export default context => {
+  const pinia = createPinia()
   const app = new Vue({
     // other options
+    pinia
   })

   context.rendered = () => {
     // pass state to context
-    context.piniaState = getRootState(context.req)
+    context.piniaState = pinia.state.value
   };

-   return { app }
+   return { app, pinia }
 }
```

`setActiveReq()` и `getActiveReq()` были заменены на `setActivePinia()` и `getActivePinia()` соответственно. `setActivePinia()` может быть передан только экземпляр `pinia`, созданный с помощью `createPinia()`. **Обратите внимание, что в большинстве случаев вы не будете напрямую использовать эти функции**.
