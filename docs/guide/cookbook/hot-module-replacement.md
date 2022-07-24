# HMR (Hot Module Replacement)

Pinia supports Hot Module replacement so you can edit your stores and interact with them directly in your app without reloading the page, allowing you to keep the existing state, add, or even remove state, actions, and getters.

At the moment, only [Vite](https://vitejs.dev/) is officially supported but any bundler implementing the `import.meta.hot` spec should work (e.g. [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot) seems to use `import.meta.webpackHot` instead of `import.meta.hot`).
You need to add this snippet of code next to any store declaration. Let's say you have three stores: `auth.js`, `cart.js`, and `chat.js`, you will have to add (and adapt) this after the creation of the _store definition_:

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // options...
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
