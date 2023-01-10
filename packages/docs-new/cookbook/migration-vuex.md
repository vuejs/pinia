# Migrating from Vuex ≤4

Although the structure of Vuex and Pinia stores is different, a lot of the logic can be reused. This guide serves to help you through the process and point out some common gotchas that can appear.

## Preparation

First, follow the [Getting Started guide](../getting-started.md) to install Pinia.

## Restructuring Modules to Stores

Vuex has the concept of a single store with multiple _modules_. These modules can optionally be namespaced and even nested within each other.

The easiest way to transition that concept to be used with Pinia is that each module you used previously is now a _store_. Each store requires an `id` which is similar to a namespace in Vuex. This means that each store is namespaced by design. Nested modules can also each become their own store. Stores that depend on each other will simply import the other store.

How you choose to restructure your Vuex modules into Pinia stores is entirely up to you, but here is one suggestion:

```bash
# Vuex example (assuming namespaced modules)
src
└── store
    ├── index.js           # Initializes Vuex, imports modules
    └── modules
        ├── module1.js     # 'module1' namespace
        └── nested
            ├── index.js   # 'nested' namespace, imports module2 & module3
            ├── module2.js # 'nested/module2' namespace
            └── module3.js # 'nested/module3' namespace

# Pinia equivalent, note ids match previous namespaces
src
└── stores
    ├── index.js          # (Optional) Initializes Pinia, does not import stores
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nestedModule2' id
    ├── nested-module3.js # 'nestedModule3' id
    └── nested.js         # 'nested' id
```

This creates a flat structure for stores but also preserves the previous namespacing with equivalent `id`s. If you had some state/getters/actions/mutations in the root of the store (in the `store/index.js` file of Vuex) you may wish to create another store called something like `root` which holds all that information.

The directory for Pinia is generally called `stores` instead of `store`. This is to emphasize that Pinia uses multiple stores, instead of a single store in Vuex.

For large projects you may wish to do this conversion module by module rather than converting everything at once. You can actually mix Pinia and Vuex together during the migration so this approach can also work and is another reason for naming the Pinia directory `stores` instead.

## Converting a Single Module

Here is a complete example of the before and after of converting a Vuex module to a Pinia store, see below for a step-by-step guide. The Pinia example uses an option store as the structure is most similar to Vuex:

```ts
// Vuex module in the 'auth/user' namespace
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // if using a Vuex type definition

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
    // combine with some state from other modules
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // read the state from another module named `auth`
        ...rootState.auth.preferences,
        // read a getter from a namespaced module called `email` nested under `auth`
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
import vuexStore from '@/store' // for gradual conversion, see fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('authUser', {
  // convert to a function
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // firstName getter removed, no longer needed
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // must define return type because of using `this`
    fullUserDetails (state): FullUserDetails {
      // import from other stores
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // other getters now on `this`
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // alternative if other modules are still in Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // no context as first argument, use `this` instead
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // mutations can now become actions, instead of `state` as first argument use `this`
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // easily reset state using `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
```

Let's break the above down into steps:

1. Add a required `id` for the store, you may wish to keep this the same as the namespace before. It is also recommended to make sure the `id` is in _camelCase_ as it makes it easier to use with `mapStores()`.
2. Convert `state` to a function if it was not one already
3. Convert `getters`
    1. Remove any getters that return state under the same name (eg. `firstName: (state) => state.firstName`), these are not necessary as you can access any state directly from the store instance
    2. If you need to access other getters, they are on `this` instead of using the second argument. Remember that if you are using `this` then you will have to use a regular function instead of an arrow function. Also note that you will need to specify a return type because of TS limitations, see [here](../core-concepts/getters.md#accessing-other-getters) for more details
    3. If using `rootState` or `rootGetters` arguments, replace them by importing the other store directly, or if they still exist in Vuex then access them directly from Vuex
4. Convert `actions`
    1. Remove the first `context` argument from each action. Everything should be accessible from `this` instead
    2. If using other stores either import them directly or access them on Vuex, the same as for getters
5. Convert `mutations`
    1. Mutations do not exist any more. These can be converted to `actions` instead, or you can just assign directly to the store within your components (eg. `userStore.firstName = 'First'`)
    2. If converting to actions, remove the first `state` argument and replace any assignments with `this` instead
    3. A common mutation is to reset the state back to its initial state. This is built in functionality with the store's `$reset` method. Note that this functionality only exists for option stores.

As you can see most of your code can be reused. Type safety should also help you identify what needs to be changed if anything is missed.

## Usage Inside Components

Now that your Vuex module has been converted to a Pinia store, any component or other file that uses that module needs to be updated too.

If you were using `map` helpers from Vuex before, it's worth looking at the [Usage without setup() guide](./options-api.md) as most of those helpers can be reused.

If you were using `useStore` then instead import the new store directly and access the state on it. For example:

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/fullName'])

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
      // you can also access the whole store in your component by returning it
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## Usage Outside Components

Updating usage outside of components should be simple as long as you're careful to _not use a store outside of functions_. Here is an example of using the store in a Vue Router navigation guard:

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

More details can be found [here](../core-concepts/outside-component-usage.md).

## Advanced Vuex Usage

In the case your Vuex store using some of the more advanced features it offers, here is some guidance on how to accomplish the same in Pinia. Some of these points are already covered in [this comparison summary](../introduction.md#comparison-with-vuex-3-x-4-x).

### Dynamic Modules

There is no need to dynamically register modules in Pinia. Stores are dynamic by design and are only registered when they are needed. If a store is never used, it will never be "registered".

### Hot Module Replacement

HMR is also supported but will need to be replaced, see the [HMR Guide](./hot-module-replacement.md).

### Plugins

If you use a public Vuex plugin then check if there is a Pinia alternative. If not you will need to write your own or evaluate whether the plugin is still necessary.

If you have written a plugin of your own, then it can likely be updated to work with Pinia. See the [Plugin Guide](../core-concepts/plugins.md).
