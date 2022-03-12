# Server Side Rendering (SSR)

:::tip
Si vous utilisez **Nuxt.js,** vous devez lire [**ces instructions**](./nuxt.md) à la place.
:::

La création de stores avec Pinia devrait fonctionner sans problème pour SSR tant que vous appelez vos fonctions `useStore()` en haut des fonctions `setup`, `getters` et `actions` :

```js
export default defineComponent({
  setup() {
    // cela fonctionne parce que pinia sait quelle application est en cours d'exécution à l'intérieur de
    // `setup()`
    const main = useMainStore()
    return { main }
  },
})
```

## Utilisation du store en dehors de `setup()`

Si vous avez besoin d'utiliser le store ailleurs, vous devez passer l'instance `pinia` [qui a été passée à l'application](#install-the-plugin) à l'appel de fonction `useStore()` :

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ Cela fonctionnera en s'assurant que le bon store est utilisé pour l'application en cours d'exécution.
  // l'application en cours d'exécution
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia s'ajoute commodément à votre application sous le nom de `$pinia` afin que vous puissiez l'utiliser dans des fonctions comme `serverPrefetch()` :

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

## Hydratation de l'état

Pour hydrater l'état initial, vous devez vous assurer que le rootState est inclus quelque part dans le HTML pour que Pinia le récupère plus tard. En fonction de ce que vous utilisez pour SSR, **vous devriez échapper l'état pour des raisons de sécurité**. Nous recommandons d'utiliser [@nuxt/devalue](https://github.com/nuxt-contrib/devalue) qui est celui utilisé par Nuxt.js :

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// récupérer le rootState côté serveur
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// après le rendu de la page, l'état de la racine est construit et peut être lu directement
// sur `pinia.state.value`.

// sérialiser, échapper (TRÈS important si le contenu de l'état peut être modifié
// par l'utilisateur, ce qui est presque toujours le cas), et le placer quelque part sur
// la page, par exemple, comme une variable globale.
devalue(pinia.state.value)
```

En fonction de ce que vous utilisez pour SSR, vous définirez une variable _initial state_ qui sera sérialisée dans le HTML. Vous devez également vous protéger des attaques XSS. Par exemple, avec [vite-ssr](https://github.com/frandiox/vite-ssr), vous pouvez utiliser l'option [`transformState`](https://github.com/frandiox/vite-ssr#state-serialization) et `@nuxt/devalue` :

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
      // ceci sera mis sous forme de chaîne et défini comme window.__INITIAL_STATE__.
      initialState.pinia = pinia.state.value
    } else {
      // du côté client, nous restaurons l'état
      pinia.state.value = initialState.pinia
    }
  }
)
```

Vous pouvez utiliser [d'autres alternatives](https://github.com/nuxt-contrib/devalue#see-also) à `@nuxt/devalue` en fonction de vos besoins, par exemple si vous pouvez sérialiser et analyser votre état avec `JSON.stringify()`/`JSON.parse()`, **vous pourriez améliorer vos performances de beaucoup**.

Adaptez cette stratégie à votre environnement. Veillez à hydrater l'état de pinia avant d'appeler toute fonction `useStore()` côté client. Par exemple, si nous sérialisons l'état dans une balise `<script>` pour le rendre accessible globalement côté client via `window.__pinia`, nous pouvons écrire ceci :

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// doit être défini par l'utilisateur
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
