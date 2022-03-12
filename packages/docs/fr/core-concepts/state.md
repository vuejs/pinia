# State

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Learn all about state in Pinia"
/>

L'état est, la plupart du temps, la partie centrale de votre boutique. Les gens commencent souvent par définir l'état qui représente leur application. Dans Pinia, l'état est défini comme une fonction qui renvoie l'état initial. Cela permet à Pinia de travailler à la fois du côté serveur et du côté client.

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // fonction de flèche recommandée pour l'inférence de type complète
  state: () => {
    return {
      // le type de toutes ces propriétés sera déduit automatiquement.
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

:::tip
Si vous utilisez Vue 2, les données que vous créez dans `state` suivent les mêmes règles que les `data` dans une instance Vue, c'est-à-dire que l'objet state doit être plain et que vous devez appeler `Vue.set()` lorsque vous **ajoutez de nouvelles** propriétés à celui-ci. **Voir aussi : [Vue#data](https://vuejs.org/v2/api/#data)**.
:::

## Accéder à l'état `state`

Par défaut, vous pouvez lire et écrire directement dans l'état en y accédant par l'instance `store` :

```js
const store = useStore()

store.counter++
```

## Réinitialisation de l'état

Vous pouvez _réinitialiser_ l'état à sa valeur initiale en appelant la méthode `$reset()` sur le store :

```js
const store = useStore()

store.$reset()
```

### Utilisation avec l'API Options

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Access Pinia State via the Options API"
/>

For the following examples, you can assume the following store was created:

```js
// Exemple de chemin de fichier :
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```

### Avec `setup()`

Bien que l'API de composition ne soit pas pour tout le monde, le hook `setup()` peut rendre l'utilisation de Pinia plus facile dans l'API d'options. Aucune fonction supplémentaire d'aide à la carte n'est nécessaire !

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    tripleCounter() {
      return this.counterStore.counter * 3
    },
  },
}
```

### Sans `setup()`

Si vous n'utilisez pas l'API de composition, et que vous utilisez `computed`, `methods`, ..., vous pouvez utiliser l'aide `mapState()` pour mapper les propriétés d'état comme des propriétés calculées en lecture seule :

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // donne accès à this.counter à l'intérieur du composant
    // même chose que la lecture de store.counter
    ...mapState(useCounterStore, ['counter'])
    // même chose que ci-dessus mais l'enregistre comme this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'counter',
      // vous pouvez également écrire une fonction qui obtient l'accès au store
      double: store => store.counter * 2,
      // il peut avoir accès à `this` mais il ne sera pas typé correctement...
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

#### Etat modifiable

Si vous voulez être capable d'écrire sur ces propriétés d'état (par exemple si vous avez un formulaire), vous pouvez utiliser `mapWritableState()` à la place. Notez que vous ne pouvez pas passer une fonction comme avec `mapState()` :

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // donne accès à this.counter à l'intérieur du composant et permet de le paramétrer
    // this.counter++
    // même chose que la lecture de store.counter
    ...mapWritableState(useCounterStore, ['counter'])
    // même chose que ci-dessus mais l'enregistre comme this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

:::tip
Vous n'avez pas besoin de `mapWritableState()` pour les collections comme les tableaux, à moins que vous ne remplaciez le tableau entier par `cartItems = []`, `mapState()` vous permet toujours d'appeler des méthodes sur vos collections.
:::

## Mutations de l'état

<!-- TODO: disable this with `strictMode` -->

En plus de muter directement le store avec `store.counter++`, vous pouvez aussi appeler la méthode `$patch`. Elle vous permet d'appliquer plusieurs changements en même temps avec un objet `state` partiel :

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

Cependant, certaines mutations sont vraiment difficiles ou coûteuses à appliquer avec cette syntaxe : toute modification de collection (par exemple, pousser, enlever, épisser un élément d'un tableau) nécessite de créer une nouvelle collection. Pour cette raison, la méthode `$patch` accepte également une fonction pour regrouper ce type de mutations qui sont difficiles à appliquer avec un objet patch :

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

La principale différence ici est que `$patch()` vous permet de regrouper plusieurs changements en une seule entrée dans les devtools. Notez que **les deux, les changements directs à `state` et `$patch()` apparaissent dans les devtools** et peuvent être remontés dans le temps (pas encore dans Vue 3).

## Remplacer l'état d'un magasin

Vous pouvez remplacer l'état entier d'un store en fixant sa propriété `$state` à un nouvel objet :

```js
store.$state = { counter: 666, name: 'Paimon' }
```

Vous pouvez également remplacer l'état entier de votre application en changeant le `state` de l'instance `pinia`. Ceci est utilisé pendant [SSR pour l'hydratation](../ssr/#state-hydration).

```js
pinia.state.value = {}
```

## S'abonner à l'état

Vous pouvez surveiller l'état et ses changements grâce à la méthode `$subscribe()` d'un store, similaire à la méthode [subscribe] de Vuex (https://vuex.vuejs.org/api/#subscribe). L'avantage de l'utilisation de `$subscribe()` par rapport à un `watch()` normal est que les _subscriptions_ ne se déclencheront qu'une seule fois après les _patchs_ (par exemple, en utilisant la version de la fonction ci-dessus).

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // identique à cartStore.$id
  mutation.storeId // 'cart'
  // disponible uniquement si mutation.type === 'patch object'.
  mutation.payload // patch object passed to cartStore.$patch()

  // persiste l'état entier dans le stockage local à chaque fois qu'il est modifié.
  localStorage.setItem('cart', JSON.stringify(state))
})
```

Par défaut, les abonnements aux états sont liés au composant où ils sont ajoutés (si le magasin est dans le `setup()` d'un composant). Cela signifie qu'ils seront automatiquement supprimés lorsque le composant sera démonté. Si vous voulez les conserver après le démontage du composant, passez `{ detached : true }` comme deuxième argument pour _détacher_ l'abonnement _state_ du composant actuel :

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // cet abonnement sera conservé après le démontage du composant.
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

:::tip
Vous pouvez observer l'état complet sur l'instance `pinia` :

```js
watch(
  pinia.state,
  (state) => {
    // persiste l'état entier dans le stockage local à chaque fois qu'il est modifié.
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
