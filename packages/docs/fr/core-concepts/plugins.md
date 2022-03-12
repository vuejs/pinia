# Les plugins
Pinia stores can be fully extended thanks to a low level API. Here is a list of things you can do:

- Ajouter de nouvelles propriétés aux magasins
- Ajouter de nouvelles options lors de la définition des magasins
- Ajouter de nouvelles méthodes aux stores
- Envelopper les méthodes existantes
- Modifier ou même annuler des actions
- Implémenter des effets secondaires comme le [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Appliquer **seulement** à des magasins spécifiques

Les plugins sont ajoutés à l'instance pinia avec `pinia.use()`. L'exemple le plus simple consiste à ajouter une propriété statique à tous les stores en retournant un objet :

```js
import { createPinia } from 'pinia'

// ajoutez une propriété nommée `secret` à chaque store créé après l'installation de ce plugin.
// cela peut être dans un fichier différent
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// donne le plugin à pinia
pinia.use(SecretPiniaPlugin)

// dans un autre fichier
const store = useStore()
store.secret // 'the cake is a lie'
```

Ceci est utile pour ajouter des objets globaux comme le routeur, la modale ou les gestionnaires de toast.

## Introduction

Un plugin Pinia est une fonction qui renvoie facultativement des propriétés à ajouter à un magasin. Il prend un argument facultatif, un _contexte_ :

```js
export function myPiniaPlugin(context) {
  context.pinia // l'application créée avec `createPinia()`
  context.app // l'application courante créée avec `createApp()` (Vue 3 uniquement)
  context.store // Le magasin auquel le plugin s'ajoute.
  context.options // L'objet d'options définissant le magasin passé à `defineStore()`.
  // ...
}
```

Cette fonction est ensuite passée à `pinia` avec `pinia.use()` :

```js
pinia.use(myPiniaPlugin)
```

Les plugins ne sont appliqués qu'aux stores **créés après que `pinia` soit passé à l'application**, sinon ils ne seront pas appliqués.

## Augmenter un Store

Vous pouvez ajouter des propriétés à chaque store en retournant simplement un objet de celles-ci dans un plugin :

```js
pinia.use(() => ({ hello: 'world' }))
```

Vous pouvez également définir la propriété directement sur le `store` mais **si possible utilisez la version de retour pour qu'ils puissent être automatiquement suivis par devtools** :

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

Toute propriété _retournée_ par un plugin sera automatiquement suivie par devtools, donc pour rendre `hello` visible dans devtools, assurez-vous de l'ajouter à `store._customProperties` **en mode dev uniquement** si vous voulez le déboguer dans devtools :

```js
// à partir de l'exemple ci-dessus
pinia.use(({ store }) => {
  store.hello = 'world'
  // assurez-vous que votre bundler gère cela. webpack et vite devraient le faire par défaut.
  if (process.env.NODE_ENV === 'development') {
    // ajoutez toutes les clés que vous avez définies dans le store
    store._customProperties.add('hello')
  }
})
```

Notez que chaque store est enveloppé de [`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive), ce qui déballe automatiquement tous les Ref (`ref()`, `computed()`, ...) qu'il contient :

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
// // chaque store a sa propre propriété `hello`.
  store.hello = ref('secret')
  // il est automatiquement déballé
  store.hello // 'secret'

  // tous les stores partagent la valeur `shared` propriété
  store.shared = sharedRef
  store.shared // 'shared'
})
```

C'est pourquoi vous pouvez accéder à toutes les propriétés calculées sans `.value` et pourquoi elles sont réactives.

### Ajouter un nouvel état

Si vous voulez ajouter de nouvelles propriétés d'état à un store ou des propriétés qui sont destinées à être utilisées pendant l'hydratation, **vous devrez les ajouter à deux endroits** :

- Sur le `store` afin que vous puissiez y accéder avec `store.myState`.
- Sur `store.$state` pour qu'il puisse être utilisé dans devtools et, **être sérialisé pendant SSR**.

Notez que cela vous permet de partager une propriété `ref` ou `computed` :

```js
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // Le `secret` est partagé entre tous les magasins.
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // il est automatiquement déballé
  store.secret // 'secret'

  const hasError = ref(false)
  store.$state.hasError = hasError
  // celui-ci doit toujours être défini
  store.hasError = toRef(store.$state, 'hasError')

  // dans ce cas, il est préférable de ne pas renvoyer `hasError` car il
  // sera affiché dans la section `state` dans le devtools
  // de toute façon et si nous le retournons, devtools l'affichera deux fois.
})
```

Notez que les changements d'état ou les ajouts qui se produisent dans un plugin (ce qui inclut l'appel à `store.$patch()`) se produisent avant que le store ne soit actif et donc **ne déclenchent pas d'abonnements**.

:::warning
If you are using **Vue 2**, Pinia is subject to the [same reactivity caveats](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats) as Vue. You will need to use `set` from `@vue/composition-api` when creating new state properties like `secret` and `hasError`:

```js
import { set } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!store.$state.hasOwnProperty('hello')) {
    const secretRef = ref('secret')
    // Si les données sont destinées à être utilisées pendant le SSR, vous devez
    // la définir sur la propriété `$state` pour qu'elle soit sérialisée et
    // récupérées pendant l'hydratation
    set(store.$state, 'secret', secretRef)
    // le mettre directement sur le magasin aussi pour que vous puissiez y accéder
    // dans les deux sens : `store.$state.secret` / `store.secret`
    set(store, 'secret', secretRef)
    store.secret // 'secret'
  }
})
```

:::

## Ajout de nouvelles propriétés externes

Lorsque vous ajoutez des propriétés externes, des instances de classes provenant d'autres bibliothèques, ou simplement des choses qui ne sont pas réactives, vous devez envelopper l'objet avec `markRaw()` avant de le passer à pinia. Voici un exemple d'ajout du routeur à chaque store :

```js
import { markRaw } from 'vue'
// adaptez-le en fonction de l'emplacement de votre routeur.
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## Appeler `$subscribe` dans les plugins

Vous pouvez utiliser [store.$subscribe](./state.md#subscribing-to-the-state) et [store.$onAction](./actions.md#subscribing-to-actions) dans des plugins également :

```ts
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // réagir aux changements du store
  })
  store.$onAction(() => {
    // réagir aux actions du store
  })
})
```

## Ajout de nouvelles options

Il est possible de créer de nouvelles options lors de la définition des stores pour ensuite les consommer à partir de plugins. Par exemple, vous pouvez créer une option `debounce` qui vous permet de débloquer n'importe quelle action :

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // ceci sera lu par un plugin plus tard
  debounce: {
    // Décale l'action searchContacts de 300ms
    searchContacts: 300,
  },
})
```

Le plugin peut alors lire cette option pour envelopper les actions et remplacer les actions originales :

```js
// use any debounce library
import debounce from 'lodash/debunce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // nous remplaçons les actions par de nouvelles actions
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

Notez que les options personnalisées sont passées comme troisième argument lors de l'utilisation de la syntaxe setup :

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // ceci sera lu par un plugin plus tard
    debounce: {
      // Décale l'action searchContacts de 300ms
      searchContacts: 300,
    },
  }
)
```

## TypeScript

Tout ce qui est montré ci-dessus peut être fait avec le support du typage, donc vous n'avez jamais besoin d'utiliser `any` ou `@ts-ignore`.

### Typage des plugins

Un plugin Pinia peut être typé comme suit :

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### Saisir les nouvelles propriétés des stores

Lorsque vous ajoutez de nouvelles propriétés aux stores, vous devez également étendre l'interface `PiniaCustomProperties`.

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // en utilisant un setter, nous pouvons autoriser à la fois les chaînes et les références.
    set hello(value: string | Ref<string>)
    get hello(): string

    // vous pouvez également définir des valeurs plus simples
    simpleNumber: number
  }
}
```

Il peut alors être écrit et lu en toute sécurité :

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.simpleNumber = Math.random()
  // @ts-expect-error : nous n'avons pas tapé correctement.
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties` est un type générique qui vous permet de référencer les propriétés d'un store. Imaginez l'exemple suivant où nous copions les options initiales en tant que `$options` (cela ne fonctionnerait que pour les magasins d'options) :

```ts
pinia.use(({ options }) => ({ $options: options }))
```

Nous pouvons utiliser correctement ce type en utilisant les 4 types génériques de `PiniaCustomProperties` :

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

:::tip
Lorsque vous étendez des types dans des génériques, ils doivent être nommés **exactement comme dans le code source**. `Id` ne peut pas être nommé `id` ou `I`, et `S` ne peut pas être nommé `State`. Voici la signification de chaque lettre :

- S: State
- G: Getters
- A: Actions
- SS: Setup Store / Store

:::

### Typing new state

Lorsque vous ajoutez de nouvelles propriétés d'état (à la fois, au `store` et au `store.$state`), vous devez ajouter le type à `PiniaCustomStateProperties` à la place. A la différence de `PiniaCustomProperties`, il ne reçoit que le générique `State` :

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### Taper de nouvelles options de création

Lorsque vous créez de nouvelles options pour `defineStore()`, vous devez étendre la `DefineStoreOptionsBase`. A la différence de `PiniaCustomProperties`, elle n'expose que deux génériques : le type State et le type Store, ce qui vous permet de limiter ce qui peut être défini. Par exemple, vous pouvez utiliser les noms des actions :

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

:::tip
Il existe également un type `StoreGetters` pour extraire les _getters_ d'un type Store. Vous pouvez également étendre les options des _setup stores_ ou des _option stores_ **seulement** en étendant les types `DefineStoreOptions` et `DefineSetupStoreOptions` respectivement.
:::

## Nuxt.js

Lorsque vous [utilisez pinia avec Nuxt](../ssr/nuxt.md), vous devez d'abord créer un [plugin Nuxt](https://nuxtjs.org/docs/2.x/directory-structure/plugins). Cela vous donnera accès à l'instance `pinia` :

```ts
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // réagir aux changements du store
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ pinia }) {
  pinia.use(MyPiniaPlugin);
}
export default myPlugin
```

Notez que l'exemple ci-dessus utilise TypeScript, vous devez supprimer les annotations de type `PiniaPluginContext` et `Plugin` ainsi que leurs importations si vous utilisez un fichier `.js`.
