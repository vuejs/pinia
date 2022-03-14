# Getters

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Learn all about getters in Pinia"
/>

Les Getters sont exactement l'équivalent des [valeurs calculées](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values) pour l'état d'un Store. Ils peuvent être définis avec la propriété `getters` dans `defineStore()`. Ils reçoivent le `state` comme premier paramètre **pour encourager** l'utilisation de la fonction flèche :

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
})
```

La plupart du temps, les getters ne s'appuieront que sur l'état, cependant, ils peuvent avoir besoin d'utiliser d'autres getters. Pour cette raison, nous pouvons avoir accès à _l'instance du store entier_ par le biais de `this` lors de la définition d'une fonction régulière **mais il est nécessaire de définir le type du retour (en TypeScript)**. Ceci est dû à une limitation connue de TypeScript et **n'affecte pas les getters définis avec une fonction flèche ni les getters n'utilisant pas `this`** :

```ts
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // déduit automatiquement que le type de retour est un nombre.
    doubleCount(state) {
      return state.counter * 2
    },
    // le type de retour **doit** être défini explicitement
    doublePlusOne(): number {
      // autocomplétion et typages pour l'ensemble du magasin ✨.
      return this.doubleCount + 1
    },
  },
})
```

Vous pouvez alors accéder au getter directement sur l'instance du magasin :

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```

## Accès à d'autres récupérateurs

Comme pour les propriétés calculées, vous pouvez combiner plusieurs getters. Accédez à n'importe quel autre getter via `this`. Même si vous n'utilisez pas TypeScript, vous pouvez indiquer à votre IDE les types avec la [JSDoc](https://jsdoc.app/tags-returns.html) :

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // Le type est automatiquement déduit parce que nous n'utilisons pas `this`.
    doubleCount: (state) => state.counter * 2,
    // ici, nous devons ajouter le type nous-mêmes (en utilisant JSDoc en JS). Nous pouvons également
    // utiliser ceci pour documenter le getter
    /**
     * Renvoie la valeur du compteur multipliée par deux plus un.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount + 1
    },
  },
})
```

## Passer des arguments aux getters

Les _Getters_ ne sont que des propriétés _calculées_ en coulisse, il n'est donc pas possible de leur passer des paramètres. Cependant, vous pouvez retourner une fonction à partir du _getter_ pour accepter des arguments :

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

et l'utilisation en composant :

```vue
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

Notez que lorsque vous faites cela, **les getters ne sont plus mis en cache**, ils sont simplement des fonctions que vous invoquez. Vous pouvez cependant mettre en cache certains résultats à l'intérieur du getter lui-même, ce qui est peu courant mais devrait s'avérer plus performant :

```js
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

## Accès aux getters d'autres magasins

Pour utiliser les getters d'autres stores, vous pouvez directement les _utiliser_ à l'intérieur du _getter_ :

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## Utilisation avec `setup()`

Vous pouvez accéder directement à n'importe quel getter comme une propriété du store (exactement comme les propriétés d'état) :

```js
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```

## Utilisation avec l'API Options

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

Pour les exemples suivants, vous pouvez supposer que le store suivant a été créé :

```js
// Exemple de chemin de fichier :
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter() {
      return this.counter * 2
    }
  }
})
```

### Avec `setup()`

Bien que l'API de composition ne soit pas pour tout le monde, le hook `setup()` peut rendre l'utilisation de Pinia plus facile dans l'API d'options. Aucune fonction supplémentaire d'aide à mapper n'est nécessaire !

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2
    },
  },
}
```

### Sans `setup()`

Vous pouvez utiliser la même fonction `mapState()` que celle utilisée dans la [section précédente de state](./state.md#options-api) pour faire correspondre les getters :

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // donne accès à this.doubleCounter à l'intérieur du composant.
    // identique à la lecture de store.doubleCounter
    ...mapState(useCounterStore, ['doubleCount'])
    // même chose que ci-dessus mais l'enregistre comme this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // vous pouvez également écrire une fonction qui obtient l'accès au store
      double: store => store.doubleCount,
    }),
  },
}
```
