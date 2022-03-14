# Actions

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Learn all about actions in Pinia"
/>

Les actions sont l'équivalent des [méthodes](https://v3.vuejs.org/guide/data-methods.html#methods) dans les composants. Elles peuvent être définies avec la propriété `actions` dans `defineStore()` et **elles sont parfaites pour définir la logique métier** :

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

Comme les [getters](./getters.md), les actions ont accès à l'instance du store entier à travers `this` avec **un support complet de la typographie (et de l'autocomplétion ✨)**. **Contrairement à eux, les `actions` peuvent être asynchrones**, vous pouvez `attendre` à l'intérieur d'elles tout appel d'API ou même d'autres actions ! Voici un exemple utilisant [Mande](https://github.com/posva/mande). Notez que la bibliothèque que vous utilisez n'a pas d'importance tant que vous obtenez un `Promise`, vous pouvez même utiliser la fonction native `fetch` (navigateur uniquement) :

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // laisser le composant du formulaire afficher l'erreur
        return error
      }
    },
  },
})
```

Vous êtes également totalement libre de définir les arguments que vous voulez et de retourner n'importe quoi. Lorsque vous appelez des actions, tout sera automatiquement déduit !

Les actions sont invoquées comme des méthodes :

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // appeler l'action comme une méthode du store
    main.randomizeCounter()

    return {}
  },
})
```

## Accès aux actions d'autres magasins

Pour utiliser un autre store, vous pouvez directement l'_utiliser_ à l'intérieur de l'_action_ :

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## Usage avec `setup()`

Vous pouvez appeler directement n'importe quelle action comme une méthode du store :

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## Utilisation avec l'API Options

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

Pour les exemples suivants, vous pouvez supposer que le store suivant a été créé :

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment() {
      this.counter++
    }
  }
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
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
}
```

### Sans `setup()`

Si vous préférez ne pas utiliser l'API de composition, vous pouvez utiliser l'aide `mapActions()` pour transformer les propriétés des actions en méthodes dans votre composant :

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // donne accès à this.increment() à l'intérieur du composant
    // identique à l'appel depuis store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // même chose que ci-dessus mais l'enregistre comme this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```

## S'abonner à des actions

Il est possible d'observer les actions et leur résultat avec `store.$onAction()`. Le callback qui lui est passé est exécuté avant l'action elle-même. `after` gère les promesses et vous permet d'exécuter une fonction après la résolution de l'action. De la même manière, `onError` vous permet d'exécuter une fonction si l'action est lancée ou rejetée. Ces fonctions sont utiles pour suivre les erreurs au moment de l'exécution, comme [cette astuce dans la documentation de Vue](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors).

Voici un exemple qui enregistre avant l'exécution des actions et après leur résolution/rejet.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // nom de l'action
    store, // instance de store, identique à `someStore'.
    args, // tableau de paramètres passés à l'action
    after, // hook après le retour ou la résolution de l'action
    onError, // crochet si l'action est rejetée ou rejetée.
  }) => {
    // une variable partagée pour cet appel d'action spécifique
    const startTime = Date.now()
    // ceci se déclenchera avant qu'une action sur `store` soit exécutée.
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // cela se déclenchera si l'action réussit et après son exécution complète.
    // il attend tout retour promis
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // ceci se déclenchera si l'action jette ou renvoie une promesse qui rejette.
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// supprimer manuellement l'écouteur
unsubscribe()
```

Par défaut, les _souscriptions d'actions_ sont liées au composant où elles sont ajoutées (si le store est dans le `setup()` d'un composant). Cela signifie qu'ils seront automatiquement supprimés lorsque le composant sera démonté. Si vous voulez les conserver après le démontage du composant, passez `true` comme deuxième argument pour _détacher_ l'abonnement à l'action du composant actuel :

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // cet abonnement sera conservé après le démontage du composant.
    someStore.$onAction(callback, true)

    // ...
  },
}
```
