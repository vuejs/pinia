# Utilisation sans `setup()`

Pinia peut être utilisé même si vous n'utilisez pas l'API de composition (si vous utilisez Vue 2, vous devez installer le plugin `@vue/composition-api`). Bien que nous vous recommandions d'essayer l'API de composition et de l'apprendre, ce n'est peut-être pas encore le moment pour vous et votre équipe, vous êtes peut-être en train de migrer une application, ou pour toute autre raison. Il existe quelques fonctions :

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#options-api) (juste pour des raisons de commodité de migration, utilisez `mapState()` à la place)
- [mapActions](../core-concepts/actions.md#options-api)

## Donner accès à l'ensemble du magasin

Si vous avez besoin d'accéder à presque tout ce qui se trouve dans le magasin, il est peut-être trop difficile de cartographier toutes les propriétés du store... Au lieu de cela, vous pouvez accéder à l'ensemble du magasin avec `mapStores()` :

```js
import { mapStores } from 'pinia'

// deux stores avec les identifiants suivants
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // notez que nous ne passons pas un tableau, juste un store après l'autre.
    // chaque store sera accessible par son id + 'Store'.
    ...mapStores(useCartStore, useUserStore),
    }),
  },

  methods: {
    async buyStuff() {
      // les utiliser partout !
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

Par défaut, Pinia ajoutera le suffixe `"Store"` au `id` de chaque store. Vous pouvez personnaliser ce comportement en appelant la fonction `setMapStoreSuffix()` :

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// supprimer complètement le suffixe : this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (c'est bon, je ne vous jugerai pas)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

Par défaut, tous les map helpers supportent l'autocomplétion et vous n'avez rien à faire. Si vous appelez `setMapStoreSuffix()` pour changer le suffixe `"Store"`, vous devrez également l'ajouter quelque part dans un fichier TS ou dans votre fichier `global.d.ts`. L'endroit le plus pratique serait le même que celui où vous appelez `setMapStoreSuffix()` :

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // supprimer complètement le suffixe
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // donnez-lui la même valeur que ci-dessus
    suffix: ''
  }
}
```

:::warning
Si vous utilisez un fichier de déclaration TypeScript (comme `global.d.ts`), veillez à `importer 'pinia'` en haut du fichier pour exposer tous les types existants.
:::
