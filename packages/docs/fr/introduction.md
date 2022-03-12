# Introduction

<VueSchoolLink
  href="https://vueschool.io/lessons/introduction-to-pinia"
  title="Get started with Pinia"
/>

Pinia [a commencé](https://github.com/vuejs/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e) comme une expérience visant à redéfinir ce à quoi un store pour Vue pourrait ressembler avec l'[API de composition](https://github.com/vuejs/composition-api) aux alentours de novembre 2019. Depuis lors, les principes initiaux sont toujours les mêmes, mais Pinia fonctionne à la fois pour Vue 2 et Vue 3 **et ne vous oblige pas à utiliser l'API de composition**. L'API est la même pour les deux, à l'exception de l'_installation_ et de l'_SSR_, et ces documents sont destinés à Vue 3 **avec des notes sur Vue 2** chaque fois que nécessaire afin qu'ils puissent être lus par les utilisateurs de Vue 2 et Vue 3 !

## Pourquoi devrais-je utiliser Pinia ?

Pinia est une bibliothèque de stockage pour Vue, elle vous permet de partager un état ("state") entre les composants/pages. Si vous êtes familier avec l'API Composition, vous pensez peut-être que vous pouvez déjà partager un état global avec un simple `export const state = reactive({})`. Cela est vrai pour les applications à page unique mais **expose votre application à des vulnérabilités de sécurité** si elle est rendue côté serveur. Mais même dans les petites applications à page unique, vous gagnez beaucoup à utiliser Pinia :

- Support Devtools
  - Une chronologie pour suivre les actions, les mutations
  - Les stocks apparaissent dans les composants où ils sont utilisés
  - Voyage dans le temps et débogage plus facile
- Remplacement à chaud des modules
  - Modifiez vos magasins sans recharger votre page
  - Conservez tout état existant pendant le développement
- Plugins : étendre les fonctionnalités de Pinia avec des plugins
- Support approprié de TypeScript ou **autocomplétion** pour les utilisateurs de JS
- Support du rendu côté serveur

## Exemple de base

Voici à quoi ressemble l'utilisation de pinia en termes d'API (n'oubliez pas de consulter le document [Getting Started](./getting-started.md) pour obtenir des instructions complètes). Vous commencez par créer un magasin :

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // pourrait également être défini comme
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```

And then you _use_ it in a component:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // avec autocomplétion ✨
    counter.$patch({ count: counter.count + 1 })
    // ou en utilisant une action à la place
    counter.increment()
  },
}
```

Vous pouvez même utiliser une fonction (similaire à un composant `setup()`) pour définir un store pour des cas d'utilisation plus avancés :

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

Si vous n'êtes toujours pas intéressé par `setup()` et l'API de composition, ne vous inquiétez pas, Pinia supporte également un ensemble similaire de [_map helpers_ like Vuex](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper). Vous définissez les magasins de la même manière mais vous utilisez ensuite `mapStores()`, `mapState()`, ou `mapActions()` :

```js
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // autres propriétés calculées
    // ...
    // donne accès à this.counterStore et this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // donne un accès en lecture à this.count et this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // donne accès à this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

Vous trouverez plus d'informations sur chaque _aide de carte_ dans les concepts de base.

## Pourquoi _Pinia_

Pinia (prononcé `/piːnjʌ/`, comme "peenya" en anglais) est le mot le plus proche de _piña_ (_ananas_ en espagnol) qui soit un nom de paquet valide. Un ananas est en réalité un groupe de fleurs individuelles qui se réunissent pour créer un fruit multiple. Comme dans les magasins, chacun naît individuellement, mais ils sont tous reliés à la fin. C'est aussi un délicieux fruit tropical originaire d'Amérique du Sud.

## Un exemple plus réaliste

Voici un exemple plus complet de l'API que vous utiliserez avec Pinia **avec des types même en JavaScript**. Pour certaines personnes, cela peut être suffisant pour commencer sans lire davantage, mais nous vous recommandons tout de même de consulter le reste de la documentation ou même de sauter cet exemple et de revenir une fois que vous aurez lu tous les _concepts de base_.

```js
import { defineStore } from 'pinia'

export const todos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // le type sera automatiquement déduit en nombre
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // autocomplétion ! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // appeler d'autres getters avec autocomplétion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // n'importe quel nombre d'arguments, retourne une promesse ou pas
    addTodo(text) {
      // vous pouvez directement modifier l'état
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

### Comparaison avec Vuex

Pinia a commencé comme une exploration de ce à quoi pourrait ressembler la prochaine itération de Vuex, incorporant de nombreuses idées issues des discussions de l'équipe centrale pour Vuex 5. Finalement, nous avons réalisé que Pinia implémentait déjà la plupart de ce que nous voulions dans Vuex 5, et avons décidé d'en faire la nouvelle recommandation à la place.

Par rapport à Vuex, Pinia offre une API plus simple avec moins de cérémonies, propose des API de type Composition-API et, surtout, dispose d'une solide prise en charge de l'inférence de type lorsqu'elle est utilisée avec TypeScript.

### RFCs

Au départ, Pinia n'est passé par aucun RFC. J'ai testé des idées basées sur mon expérience de développement d'applications, de lecture du code d'autres personnes, de travail pour des clients qui utilisent Pinia, et de réponse aux questions sur Discord.
Cela m'a permis de fournir une solution qui fonctionne et qui est adaptée à une variété de cas et de tailles d'applications. Je publiais souvent et faisais évoluer la bibliothèque tout en conservant son API de base.

Maintenant que Pinia est devenue la solution de gestion d'état par défaut, elle est soumise au même processus RFC que les autres bibliothèques centrales de l'écosystème Vue et son API est entrée dans un état stable.

### Comparaison avec Vuex 3.x/4.x

> Vuex 3.x is Vuex for Vue 2 while Vuex 4.x is for Vue 3

L'API de Pinia est très différente de Vuex ≤4, à savoir :

- Les _mutations_ n'existent plus. Elles étaient très souvent perçues comme **_extrêmement_ verbeuses**. Elles apportaient initialement une intégration devtools mais ce n'est plus un problème.
- Il n'est pas nécessaire de créer des wrappers complexes personnalisés pour prendre en charge TypeScript, tout est typé et l'API est conçue de manière à exploiter au maximum l'inférence de type TS.
- Plus de chaînes magiques à injecter, importez les fonctions, appelez-les et profitez de l'autocomplétion !
- Pas besoin d'ajouter dynamiquement des magasins, ils sont tous dynamiques par défaut et vous ne le remarquerez même pas. Notez que vous pouvez toujours utiliser manuellement un magasin pour l'enregistrer quand vous le souhaitez, mais comme c'est automatique, vous n'avez pas besoin de vous en soucier.
- Plus de structuration imbriquée des _modules_. Vous pouvez toujours imbriquer des stores implicitement en important et en _utilisant_ un store à l'intérieur d'un autre, mais Pinia offre une structure plate par conception tout en permettant des moyens de composition croisée entre les stores. **Vous pouvez même avoir des dépendances circulaires entre les stores**.
- Pas de modules "namespaced". Étant donné l'architecture plate des magasins, l'espacement des noms des magasins est inhérent à la façon dont ils sont définis et on peut dire que tous les magasins sont espacés par des noms.

Pour des instructions plus détaillées sur la façon de convertir un projet Vuex ≤4 existant pour utiliser Pinia, consultez le [Guide de migration depuis Vuex](./cookbook/migration-vuex.md).
