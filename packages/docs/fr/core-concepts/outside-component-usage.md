# Utiliser un store en dehors d'un composant

Les stores Pinia dépendent de l'instance `pinia` pour partager la même instance de store à travers tous les appels. La plupart du temps, cela fonctionne dès le départ en appelant simplement votre fonction `useStore()`. Par exemple, dans `setup()`, vous n'avez pas besoin de faire autre chose. Mais les choses sont un peu différentes en dehors d'un composant.
Dans les coulisses, `useStore()` _injecte_ l'instance `pinia` que vous avez donnée à votre `app`. Cela signifie que si l'instance `pinia` ne peut pas être injectée automatiquement, vous devez la fournir manuellement à la fonction `useStore()`.
Vous pouvez résoudre ce problème différemment selon le type d'application que vous écrivez.

## Applications à page unique

Si vous ne faites pas de SSR (Server Side Rendering), tout appel à `useStore()` après avoir installé le plugin pinia avec `app.use(pinia)` fonctionnera :

```js
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  échoue car il est appelé avant que la pinia ne soit créée.
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ fonctionne car l'instance de pinia est maintenant active
const userStore = useUserStore()
```

Le moyen le plus simple de s'assurer que cela est toujours appliqué est de _déférer_ les appels à `useStore()` en les plaçant dans des fonctions qui seront toujours exécutées après l'installation de pinia.

Examinons cet exemple d'utilisation d'un store à l'intérieur d'une garde de navigation avec Vue Router :

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Selon l'ordre des importations, cela peut échouer
const store = useStore()

router.beforeEach((to, from, next) => {
  // on voulait utiliser le store ici
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ Cela fonctionnera car le routeur commence sa navigation après que
  // le routeur est installé et pinia le sera aussi.
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## Apps SSR

Lorsque vous utilisez le Server Side Rendering, vous devez passer l'instance `pinia` à `useStore()`. Cela empêche pinia de partager l'état global entre différentes instances d'applications.

Il y a une section entière dédiée à cela dans le [guide SSR](/ssr/index.md), ceci n'est qu'une courte explication :
