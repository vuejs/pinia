# Migrer depuis la 0.0.7

Les versions après `0.0.7` : `0.1.0`, et `0.2.0`, sont venues avec quelques gros changements de rupture. Ce guide vous aide à migrer, que vous utilisiez Vue 2 ou Vue 3. Le changelog complet peut être trouvé dans le dépôt :

- [Pour Pinia <= 1 pour Vue 2](https://github.com/vuejs/pinia/blob/v1/CHANGELOG.md)
- [Pour Pinia >= 2 pour Vue 3](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)

Si vous avez des questions ou des problèmes concernant la migration, n'hésitez pas à [ouvrir une discussion](https://github.com/vuejs/pinia/discussions/categories/q-a) pour demander de l'aide.

## Fini le `store.state`.

Vous n'accédez plus à l'état du store via une propriété `state`, vous pouvez accéder directement à n'importe quelle propriété d'état.

Étant donné un store défini avec :

```js
const useStore({
  id: 'main',
  state: () => ({ counter: 0 })
})
```

Do

```diff
 const store = useStore()

-store.state.counter++
+store.counter.++
```

Vous pouvez toujours accéder à l'état complet du store avec `$state` si nécessaire :

```diff
-store.state = newState
+store.$state = newState
```

## Renommer les propriétés des stores

Toutes les propriétés du store (`id`, `patch`, `reset`, etc) sont maintenant préfixées avec `$` pour permettre les propriétés définies sur le store avec les mêmes noms. Astuce : vous pouvez refactoriser l'ensemble de votre codebase avec F2 (ou clic droit + Refactor) sur chacune des propriétés du store.

```diff
 const store = useStore()
-store.patch({ counter: 0 })
+store.$patch({ counter: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## L'instance Pinia

Il est maintenant nécessaire de créer une instance pinia et de l'installer :

Si vous utilisez Vue 2 (Pinia <= 1) :

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

Si vous utilisez Vue 3 (Pinia >= 2) :

```js
import { createApp } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

L'instance `pinia` est ce qui contient l'état et doit **être unique par application**. Consultez la section SSR de la documentation pour plus de détails.

## Changements SSR

Le plugin SSR `PiniaSsr` n'est plus nécessaire et a été supprimé.
Avec l'introduction des instances pinia, `getRootState()` n'est plus nécessaire et doit être remplacé par `pinia.state.value` :

Si vous utilisez Vue 2 (Pinia <= 1) :

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

`setActiveReq()` et `getActiveReq()` ont été remplacés par `setActivePinia()` et `getActivePinia()` respectivement. On ne peut passer `setActivePinia()` qu'à une instance `pinia` créée avec `createPinia()`. **Notez que la plupart du temps, vous n'utiliserez pas directement ces fonctions**.
