# Migration de la version 0.x (v1) vers la v2

À partir de la version `2.0.0-rc.4`, pinia supporte à la fois Vue 2 et Vue 3 ! Cela signifie que toutes les nouvelles mises à jour seront appliquées à cette version 2 afin que les utilisateurs de Vue 2 et Vue 3 puissent en bénéficier. Si vous utilisez Vue 3, cela ne change rien pour vous car vous utilisiez déjà la rc et vous pouvez consulter [le CHANGELOG](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md) pour une explication détaillée de tout ce qui a changé. Sinon, **ce guide est pour vous** !

## Dépréciations

Jetons un coup d'oeil à tous les changements que vous devez appliquer à votre code. Tout d'abord, assurez-vous que vous utilisez déjà la dernière version 0.x pour voir les éventuelles dépréciations :

```shell
npm i 'pinia@^0.x.x'
# or with yarn
yarn add 'pinia@^0.x.x'
```

Si vous utilisez ESLint, pensez à utiliser [ce plugin](https://github.com/gund/eslint-plugin-deprecation) pour trouver tous les usages dépréciés. Sinon, vous devriez être en mesure de les voir tels qu'ils apparaissent croisés. Ce sont les API dépréciées qui ont été supprimées :

- `createStore()` devient `defineStore()`.
- Dans les abonnements, `storeName` devient `storeId`.
- `PiniaPlugin` a été renommé `PiniaVuePlugin` (plugin Pinia pour Vue 2)
- `$subscribe()` n'accepte plus un _boolean_ comme second paramètre, passez un objet avec `detached : true` à la place.
- Les plugins Pinia ne reçoivent plus directement l'`id` du store. Utilisez `store.$id` à la place.

## Changements de rupture

Après les avoir supprimés, vous pouvez mettre à jour vers la v2 avec :

```shell
npm i 'pinia@^2.x.x'
# or with yarn
yarn add 'pinia@^2.x.x'
```

And start updating your code.

### Generic Store type

Ajouté dans [2.0.0-rc.0](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md#200-rc0-2021-07-28)

Remplacez toute utilisation du type `GenericStore` par `StoreGeneric`. C'est le nouveau type de store générique qui devrait accepter n'importe quel type de store. Si vous écriviez des fonctions utilisant le type `Store` sans passer ses génériques (par exemple `Store<Id, State, Getters, Actions>`), vous devriez également utiliser `StoreGeneric` car le type `Store` sans générique crée un type de store vide.

```diff
-function takeAnyStore(store: Store) {}
+function takeAnyStore(store: StoreGeneric) {}

-function takeAnyStore(store: GenericStore) {}
+function takeAnyStore(store: StoreGeneric) {}
```

## `DefineStoreOptions` pour les plugins

Si vous écriviez des plugins, en utilisant TypeScript, et que vous étendiez le type `DefineStoreOptions` pour ajouter des options personnalisées, vous devriez le renommer en `DefineStoreOptionsBase`. Ce type s'appliquera à la fois aux stores de configuration et d'options.

```diff
 declare module 'pinia' {
-  export interface DefineStoreOptions<S, Store> {
+  export interface DefineStoreOptionsBase<S, Store> {
     debounce?: {
       [k in keyof StoreActions<Store>]?: number
     }
   }
 }
```

## `PiniaStorePlugin` a été renommé

Le type `PiniaStorePlugin` a été renommé en `PiniaPlugin`.

```diff
-import { PiniaStorePlugin } from 'pinia'
+import { PiniaPlugin } from 'pinia'

-const piniaPlugin: PiniaStorePlugin = () => {
+const piniaPlugin: PiniaPlugin = () => {
   // ...
 }
```

**Notez que ce changement ne peut être effectué qu'après la mise à niveau vers la dernière version de Pinia sans dépréciations**.

## Version de `@vue/composition-api`.

Comme pinia s'appuie désormais sur `effectScope()`, vous devez utiliser au moins la version `1.1.0` de `@vue/composition-api` :

```shell
npm i @vue/composition-api@latest
# or with yarn
yarn add @vue/composition-api@latest
```

## support de webpack 4

Si vous utilisez webpack 4 (Vue CLI utilise webpack 4), vous pouvez rencontrer une erreur comme celle-ci :

```
ERROR  Failed to compile with 18 errors

 error  in ./node_modules/pinia/dist/pinia.mjs

Can't import the named export 'computed' from non EcmaScript module (only default export is available)
```

Ceci est dû à la modernisation des fichiers dist pour supporter les modules ESM natifs dans Node.js. Les fichiers utilisent maintenant l'extension `.mjs` et `.cjs` pour permettre à Node d'en bénéficier. Pour résoudre ce problème, vous avez deux possibilités :

- Si vous utilisez Vue CLI 4.x, mettez à jour vos dépendances. Cela devrait inclure la correction ci-dessous.
  - Si la mise à jour n'est pas possible pour vous, ajoutez ceci à votre `vue.config.js` :
    ```js
    // vue.config.js
    module.exports = {
      configureWebpack: {
        module: {
          rules: [
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: 'javascript/auto',
            },
          ],
        },
      },
    }
    ```
- Si vous manipulez manuellement webpack, vous devrez lui faire savoir comment gérer les fichiers `.mjs` :
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  }
  ```

## Devtools

Pinia v2 ne détourne plus Vue Devtools v5, elle nécessite Vue Devtools v6. Vous trouverez le lien de téléchargement sur la [documentation Vue Devtools](https://devtools.vuejs.org/guide/installation.html#chrome) pour le **canal beta** de l'extension.

## Nuxt

Si vous utilisez Nuxt, pinia a maintenant son paquetage Nuxt dédié 🎉. Installez-le avec :

```shell
npm i @pinia/nuxt
# or with yarn
yarn add @pinia/nuxt
```

Assurez-vous également de **mettre à jour votre paquetage `@nuxtjs/composition-api`.

Adaptez ensuite votre `nuxt.config.js` et votre `tsconfig.json` si vous utilisez TypeScript :

```diff
 // nuxt.config.js
 module.exports {
   buildModules: [
     '@nuxtjs/composition-api/module',
-    'pinia/nuxt',
+    '@pinia/nuxt',
   ],
 }
```

```diff
 // tsconfig.json
 {
   "types": [
     // ...
-    "pinia/nuxt/types"
+    "@pinia/nuxt"
   ]
 }
```

Il est également recommandé de lire [la section dédiée à Nuxt](../ssr/nuxt.md).
