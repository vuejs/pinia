# Server Side Rendering (SSR)

Creating stores with Pinia should work out of the box for SSR as long as you call your `useStore()` functions at the top of `setup` functions, `getters` and `actions`:

```ts
export default defineComponent({
  setup() {
    // this works because pinia knows what application is running
    const main = useMainStore()
    return { main }
  },
})
```

If you need to use the store somewhere else, you need to pass the `pinia` instance [that was passed to the app](#install-the-plugin) to the `useStore()` function call:

```ts
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

## Nuxt.js

Make sure to install [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/):

```bash
yarn add pinia @nuxtjs/composition-api
# or with npm
npm install pinia @nuxtjs/composition-api
```

If you are using Nuxt, we supply a _module_ to handle everything for you, you only need to add it to `buildModules` in your `nuxt.config.js` file:

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: ['@nuxtjs/composition-api', 'pinia/nuxt'],
}
```

If you are using TypeScript or have a `jsconfig.json`, you should also add the types for `context.pinia`:

```js
{
  "include": [
    // ...
    "pinia/nuxt/types"
  ]
}
```

## State hydration

To hydrate the initial state, you need to make sure the rootState is included somewhere in the HTML for Pinia to pick it up later on:

```js
import { createPinia } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is build and can be read
// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable. Note you need to use your own
// `escapeHTML()` function or use an existing package
escapeHTML(JSON.stringify(pinia.state.value))
```

Depending on what you are using for SSR, you will set an _initial state_ variable that will be serialized in the HTML. Example with [vite-ssr](https://github.com/frandiox/vite-ssr):

```js
export default viteSSR(App, { routes }, ({ initialState }) => {
  // ...
  if (import.meta.env.SSR) {
    initialState.pinia = JSON.stringify(pinia.state.value)
  }
})
```

And add a _module_ to load the state on the client. It should be picked up automatically by `vite-ssr`:

```ts
// modules/pinia.ts
import { createPinia } from 'pinia'
import { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router, app }) => {
  const pinia = createPinia()
  app.use(pinia)
  router.pinia = pinia

  if (isClient) {
    console.log('setting')
    // @ts-ignore
    if (window.__INITIAL_STATE__?.pinia) {
      // @ts-ignore
      pinia.state.value = JSON.parse(window.__INITIAL_STATE__.pinia)
    }
  }

  return pinia
}
```

Adapt this strategy to your environment. Make sure to hydrate pinia's state before calling any `useStore()` function on client side. For example, if we serialize the state into a `<script>` tag to make it accessible globally on client side through `window.__pinia`, we can write this:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// must be set by the user
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
