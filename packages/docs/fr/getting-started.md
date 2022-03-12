## Installation

Installez `pinia` avec votre gestionnaire de paquets préféré :

```bash
yarn add pinia
# ou avec npm
npm install pinia
```

:::tip
Si votre application utilise Vue 2, vous devez également installer l'api de composition : `@vue/composition-api`. Si vous utilisez Nuxt, vous devez suivre [ces instructions] (/ssr/nuxt.md).
:::

Si vous utilisez le CLI de Vue, vous pouvez essayer ce [**fiche non officielle**](https://github.com/wobsoriano/vue-cli-plugin-pinia).

Créez un pinia (le magasin racine) et passez-le à l'application :

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

Si vous utilisez Vue 2, vous devez également installer un plugin et injecter le `pinia` créé à la racine de l'application :

```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // autres options...
  // ...
  // Notez que la même instance de `pinia` peut être utilisée dans plusieurs applications Vue sur la même page.
  // la même page
  pinia,
})
```

Cela ajoutera également le support de devtools. Dans Vue 3, certaines fonctionnalités comme le voyage dans le temps et l'édition ne sont toujours pas prises en charge parce que vue-devtools n'expose pas encore les API nécessaires, mais les devtools ont beaucoup plus de fonctionnalités et l'expérience du développeur dans son ensemble est bien supérieure. Dans Vue 2, Pinia utilise l'interface existante pour Vuex (et ne peut donc pas être utilisé en parallèle).

## Qu'est-ce qu'un store ("zone de stockage") ?

Un store (comme Pinia) est une entité contenant un **état** ("state") et une logique commerciale qui n'est pas liée à votre arbre de composants. En d'autres termes, **il héberge l'état global**. C'est un peu comme un composant qui est toujours là et que tout le monde peut lire et écrire. Il possède **trois concepts**, les [state](./core-concepts/state.md), les [getters](./core-concepts/getters.md) et les [actions](./core-concepts/actions.md). On peut supposer que ces concepts sont l'équivalent des `data`, `computed` et `methods` dans les composants.

### Quand dois-je utiliser un Store

Un magasin doit contenir des données accessibles dans l'ensemble de votre application. Il peut s'agir de données utilisées à de nombreux endroits, par exemple les informations sur l'utilisateur affichées dans la barre de navigation, ou de données qui doivent être conservées au fil des pages, par exemple un formulaire très complexe à plusieurs étapes.

En revanche, il faut éviter d'inclure dans le store des données locales qui pourraient être hébergées dans un composant à la place, par exemple la visibilité d'un élément local à une page.

Toutes les applications n'ont pas besoin d'accéder à un état global, mais si les vôtres en ont besoin, Pinia vous facilitera la vie.
