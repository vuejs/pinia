# Composer des Stores

Composer des stores consiste à avoir des stores qui s'utilisent les uns les autres et il y a une règle à suivre :

Si **deux stores ou plus s'utilisent mutuellement**, ils ne peuvent pas créer une boucle infinie par le biais de _getters_ ou d'_actions_. Ils ne peuvent pas **tous les deux** lire directement l'état de l'autre dans leur fonction de configuration :

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ Ce n'est pas possible car y essaie aussi de lire x.name
  y.name

  function doSomething() {
    // ✅ Lire les propriétés des y dans les calculs ou les actions
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ Ce n'est pas possible car x essaie aussi de lire y.name
  x.name

  function doSomething() {
    // ✅ Lire les propriétés de x dans les calculs ou les actions
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Les stores imbriqués

Notez que si un store utilise un autre store, **il n'est pas nécessaire de créer un nouveau store dans un fichier séparé**, vous pouvez l'importer directement. Considérez cela comme une imbrication.

Vous pouvez appeler `useOtherStore()` en haut de n'importe quel getter ou action :

```js
import { useUserStore } from './user'

export const cartStore = defineStore('cart', {
  getters: {
    // ... autres getters
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },

  actions: {
    purchase() {
      const user = useUserStore()

      return apiPurchase(user.id, this.list)
    },
  },
})
```

## Getters partagés

Vous pouvez simplement appeler `useOtherStore()` à l'intérieur d'un _getter_ :

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

## Actions partagées

Il en va de même pour les _actions_ :

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // une autre action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
