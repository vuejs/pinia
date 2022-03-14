# Nuxt.js

L'utilisation de Pinia avec [Nuxt.js](https://nuxtjs.org/) est plus facile car Nuxt s'occupe de beaucoup de choses quand il s'agit du _rendu côté serveur_. Par exemple, **vous n'avez pas besoin de vous soucier de la sérialisation ni des attaques XSS**.

## Installation

Assurez-vous d'installer [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/) avec `pinia` :

```bash
yarn add pinia @pinia/nuxt @nuxtjs/composition-api
# or with npm
npm install pinia @pinia/nuxt @nuxtjs/composition-api
```

Nous fournissons un _module_ qui s'occupe de tout pour vous, il vous suffit de l'ajouter à `buildModules` dans votre fichier `nuxt.config.js` :

```js
// nuxt.config.js
export default {
  // ... autres options
  buildModules: [
    // Nuxt 2 only:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

Et c'est tout, utilisez votre store comme d'habitude !

## Utiliser le store en dehors de `setup()`

Si vous voulez utiliser un store Nous l'avons ajouté au [contexte](https://nuxtjs.org/docs/2.x/internals-glossary/context) pour que vous y ayez accès dans `asyncData()` et `fetch()` :

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

## Utilisation du contexte Nuxt dans les magasins

Vous pouvez également utiliser [le contexte](https://nuxtjs.org/docs/2.x/internals-glossary/context) dans n'importe quel store en utilisant la propriété injectée `$nuxt` :

```js
import { useUserStore } from '~/stores/userStore'

defineStore('cart', {
  actions: {
    purchase() {
      const user = useUserStore()
      if (!user.isAuthenticated()) {
        this.$nuxt.redirect('/login')
      }
    },
  },
})
```

## Utilisation de Pinia avec Vuex

Il est recommandé d' **éviter d'utiliser à la fois Pinia et Vuex** mais si vous devez utiliser les deux, vous devez indiquer à pinia de ne pas le désactiver :

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... autre option
}
```

## TypeScript

Si vous utilisez TypeScript ou si vous avez un `jsconfig.json`, vous devez également ajouter les types pour `context.pinia` :

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

Cela vous permettra également d'avoir l'autocomplétion 😉 .
