# Migration de Vuex ≤4

Bien que la structure des stores Vuex et Pinia soit différente, une grande partie de la logique peut être réutilisée. Ce guide sert à vous aider tout au long du processus et à signaler certains gotchas courants qui peuvent apparaître.

## Préparation

Tout d'abord, suivez le [Guide de démarrage](../getting-started.md) pour installer Pinia.

## Restructuration des modules en stores

Vuex a le concept d'un store unique avec plusieurs _modules_. Ces modules peuvent éventuellement être espacés par des noms et même imbriqués les uns dans les autres.

La façon la plus simple de transformer ce concept pour l'utiliser avec Pinia est que chaque module que vous utilisiez auparavant est maintenant un _store_. Chaque store nécessite un `id` qui est similaire à un espace de nom dans Vuex. Cela signifie que chaque store a un espace de nom par conception. Les modules imbriqués peuvent également devenir chacun leur propre store. Les stores qui dépendent les uns des autres seront simplement importés par l'autre store.

La façon dont vous choisissez de restructurer vos modules Vuex en stores Pinia vous appartient entièrement, mais voici une suggestion :

```bash
# Exemple Vuex (en supposant que les modules sont espacés par des noms)
src
└── store
    ├── index.js           # Initialise Vuex, importe les modules
    └── modules
        ├── module1.js     # 'module1' namespace
        └── nested
            ├── index.js   # 'nested' namespace, imports module2 & module3
            ├── module2.js # 'nested/module2' namespace
            └── module3.js # 'nested/module3' namespace

# Pinia équivalent, notez que les identifiants correspondent aux espaces de noms précédents.
src
└── stores
    ├── index.js          # (Optionnel) Initialise Pinia, n'importe pas les stores.
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nested/module2' id
    ├── nested-module3.js # 'nested/module3' id
    └── nested.js         # 'nested' id
```

Cela crée une structure plate pour les stores mais préserve également l'espacement des noms précédent avec des `id` équivalents. Si vous aviez certains états/getters/actions/mutations à la racine du store (dans le fichier `store/index.js` de Vuex), vous pourriez souhaiter créer un autre store appelé quelque chose comme `root` qui contiendrait toutes ces informations.

Le répertoire pour Pinia est généralement appelé `stores` au lieu de `store`. C'est pour souligner que Pinia utilise plusieurs stores, au lieu d'un seul store dans Vuex.

Pour les grands projets, vous pouvez souhaiter effectuer cette conversion module par module plutôt que de tout convertir en une seule fois. Vous pouvez en fait mélanger Pinia et Vuex pendant la migration, cette approche peut donc aussi fonctionner et c'est une autre raison pour nommer le répertoire Pinia `stores` à la place.

## Convertir un seul module

Voici un exemple complet d'avant et d'après la conversion d'un module Vuex en store Pinia, voir ci-dessous pour un guide pas à pas. L'exemple Pinia utilise un store optionnel car sa structure est très similaire à Vuex :

```ts
// Module Vuex dans l'espace de nom 'auth/user'.
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // si vous utilisez une définition de type Vuex

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // combiner avec certains états d'autres modules
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // lire l'état d'un autre module nommé `auth`.
        ...rootState.auth.preferences,
        // lire un getter à partir d'un module nommé `email` imbriqué dans `auth`.
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      commit('updateUser', res)
    }
  },
  mutations: {
    updateUser (state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser (state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule
```

```ts
// Pinia Store
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // pour une conversion progressive, voir fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('auth/user', {
  // convertir en fonction
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // le récepteur firstName a été supprimé, il n'est plus nécessaire.
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // doit définir le type de retour à cause de l'utilisation de `this`.
    fullUserDetails (state): FullUserDetails {
      // importation à partir d'autres stores
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // Les autres récupérateurs sont maintenant sur `this`.
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // alternative si d'autres modules sont encore dans Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // pas de contexte comme premier argument, utiliser `this` à la place
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // les mutations peuvent maintenant devenir des actions, au lieu de `state` comme premier argument, utilisez `this`.
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // réinitialisation facile de l'état en utilisant `$reset`.
    clearUser () {
      this.$reset()
    }
  }
})
```

Décomposons ce qui précède en plusieurs étapes :

1. Ajoutez un `id` obligatoire pour le store, vous pouvez le garder identique à l'espace de nom précédent.
2. Convertir `state` en une fonction si ce n'est pas déjà le cas
3. Convertir les `getters`.
    1. Supprimez tous les getters qui renvoient des états sous le même nom (par exemple, `firstName : (state) => state.firstName`), ils ne sont pas nécessaires car vous pouvez accéder à n'importe quel état directement à partir de l'instance du store.
    2. Si vous avez besoin d'accéder à d'autres getters, ils sont sur `this` au lieu d'utiliser le deuxième argument. Rappelez-vous que si vous utilisez `this`, vous devrez utiliser une fonction régulière au lieu d'une fonction flèche. Notez également que vous devrez spécifier un type de retour en raison des limitations TS, voir [ici](../core-concepts/getters.md#accessing-other-getters) pour plus de détails.
    3. Si vous utilisez les arguments `rootState` ou `rootGetters`, remplacez-les en important directement l'autre store, ou s'ils existent toujours dans Vuex, accédez-y directement depuis Vuex.
4. Convertir les "actions"
    1. Enlevez le premier argument `context` de chaque action. Tout devrait être accessible depuis `this` à la place.
    2. Si vous utilisez d'autres stores, vous pouvez les importer directement ou y accéder sur Vuex, comme pour les getters.
5. Convertir les `mutations`
    1. Les mutations n'existent plus. Elles peuvent être converties en `actions` à la place, ou vous pouvez simplement assigner directement le store dans vos composants (par exemple, `userStore.firstName = 'First'`).
    2. Si vous convertissez en actions, enlevez le premier argument `state` et remplacez toutes les affectations par `this` à la place.
    3. Une mutation courante consiste à réinitialiser l'état à son état initial. Cette fonctionnalité est intégrée à la méthode `$reset` du store. Notez que cette fonctionnalité n'existe que pour les stores à option.

Comme vous pouvez le constater, la plupart de votre code peut être réutilisé. La sécurité des types devrait également vous aider à identifier ce qui doit être modifié si quelque chose vous échappe.

## Utilisation à l'intérieur des composants

Maintenant que votre module Vuex a été converti en store Pinia, tout composant ou autre fichier qui utilise ce module doit également être mis à jour.

Si vous utilisiez les aides `map` de Vuex auparavant, cela vaut la peine de regarder le [Guide d'utilisation sans setup()](./options-api.md) car la plupart de ces aides peuvent être réutilisées.

Si vous utilisiez `useStore`, alors importez directement le nouveau store et accédez à son état. Par exemple :

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/firstName'])

    return {
      firstName,
      fullName
    }
  }
})
```

```ts
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // vous pouvez également accéder à l'ensemble du store dans votre composant en le retournant
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## Utilisation en dehors des composants

La mise à jour de l'utilisation en dehors des composants devrait être simple tant que vous faites attention à _ne pas utiliser un store en dehors des fonctions_. Voici un exemple d'utilisation du store dans une garde de navigation Vue Router :

```ts
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
```

```ts
// Pinia
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // Must be used within the function!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

Vous trouverez plus de détails [ici](../core-concepts/outside-component-usage.md).

## Utilisation avancée de Vuex

Si votre store Vuex utilise certaines des fonctionnalités les plus avancées qu'il offre, voici quelques conseils sur la façon de réaliser la même chose dans Pinia. Certains de ces points sont déjà couverts dans [ce résumé de comparaison](../introduction.md#comparison-with-vuex-3-x-4-x).

### Modules dynamiques

Il n'est pas nécessaire d'enregistrer dynamiquement des modules dans Pinia. Les stores sont dynamiques par conception et ne sont enregistrés que lorsqu'ils sont nécessaires. Si un store n'est jamais utilisé, il ne sera jamais "enregistré".

### Remplacement à chaud des modules

HMR est également supporté mais devra être remplacé, voir le [Guide HMR](./hot-module-replacement.md).

### Les Plugins

Si vous utilisez un plugin Vuex public, vérifiez s'il existe une alternative Pinia. Si ce n'est pas le cas, vous devrez écrire votre propre plugin ou évaluer si le plugin est toujours nécessaire.

Si vous avez écrit votre propre plugin, il peut probablement être mis à jour pour fonctionner avec Pinia. Voir le [Guide des plugins](../core-concepts/plugins.md).
