# Defining a Store

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

Avant de plonger dans les concepts de base, nous devons savoir qu'un store est défini à l'aide de `defineStore()` et qu'il nécessite un nom **unique**, passé comme premier argument :

```js
import { defineStore } from 'pinia'

// useStore peut être n'importe quoi comme useUser, useCart
// le premier argument est un identifiant unique du store dans votre application.
export const useStore = defineStore('main', {
  // other options...
})
```

Ce _nom_, également appelé _id_, est nécessaire et est utilisé par Pinia pour connecter le store aux devtools. Nommer la fonction retournée _use..._ est une convention entre composables pour rendre son utilisation idiomatique.

## Utilisation du store

Nous _définissons_ un store parce que le store ne sera pas créé avant que `useStore()` soit appelé à l'intérieur de `setup()` :

```js
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // vous pouvez renvoyer l'instance de store complète pour l'utiliser dans le modèle.
      store,
    }
  },
}
```

Vous pouvez définir autant de stores que vous le souhaitez et **vous devriez définir chaque store dans un fichier différent** pour tirer le meilleur parti de pinia (comme permettre automatiquement à votre bundle de faire du code split et de l'inférence TypeScript).

Si vous n'utilisez pas encore les composants `setup`, [vous pouvez toujours utiliser Pinia avec les _map helpers_](../cookbook/options-api.md).

Une fois que le store est instancié, vous pouvez accéder à n'importe quelle propriété définie dans `state`, `getters`, et `actions` directement sur le store. Nous les verrons en détail dans les pages suivantes, mais l'autocomplétion vous aidera.

Notez que `store` est un objet enveloppé avec `reactive`, ce qui signifie qu'il n'y a pas besoin d'écrire `.value` après les getters mais, comme `props` dans `setup`, **on ne peut pas le déstructurer** :

```js
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ Ça ne marchera pas car ça casse la réactivité.
    // c'est la même chose que de déstructurer à partir de `props`.    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // sera toujours "eduardo"
      name,
      // sera toujours égal à 2
      doubleCount,
      // celui-ci sera réactif
      doubleValue: computed(() => store.doubleCount),
      }
  },
})
```

Afin d'extraire les propriétés du store tout en conservant sa réactivité, vous devez utiliser `storeToRefs()`. Elle créera des références pour chaque propriété réactive. Ceci est utile lorsque vous n'utilisez que l'état du store sans appeler d'action. Notez que vous pouvez déstructurer les actions directement depuis le store car elles sont liées au store lui-même :

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // `name` et `doubleCount` sont des références réactives.
    // Ceci créera également des références pour les propriétés ajoutées par les plugins.
    // mais ignore toute action ou propriété non réactive (non ref/réactive).
    const { name, doubleCount } = storeToRefs(store)
    // l'action d'incrémentation peut être juste extraite
    const { increment } = store

    return {
      name,
      doubleCount
      increment,
    }
  },
})
```
