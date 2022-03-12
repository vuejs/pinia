# HMR (Hot Module Replacement)

Pinia supporte le remplacement de modules à chaud afin que vous puissiez modifier vos stores et interagir avec eux directement dans votre application sans recharger la page, ce qui vous permet de conserver l'état existant, d'ajouter ou même de supprimer l'état, les actions et les getters.

Pour l'instant, seul [Vite](https://vitejs.dev/) est officiellement supporté mais tout bundler implémentant la spécification `import.meta.hot` devrait fonctionner (par exemple, [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot) semble utiliser `import.meta.webpackHot` au lieu de `import.meta.hot`).
Vous devez ajouter ce bout de code à côté de toute déclaration de store. Disons que vous avez trois stores : `auth.js`, `cart.js`, et `chat.js`, vous devrez ajouter (et adapter) ceci après la création de la _définition du store_ :

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // options...
})

// assurez-vous de passer la bonne définition de magasin, `useAuth` dans ce cas.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
