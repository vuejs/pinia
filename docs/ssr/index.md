# Server Side Rendering (SSR)

:::tip
If you are using **Nuxt.js,** you need to read [**these instructions**](./nuxt.md) instead.
:::

Creating stores with Pinia should work out of the box for SSR as long as you call your `useStore()` functions at the top of `setup` functions, `getters` and `actions`:

```ts
export default defineComponent({
  setup() {
    // this works because pinia knows what application is running inside of
    // `setup()`
    const main = useMainStore()
    return { main }
  },
})
```

## Using the store outside of `setup()`

If you need to use the store somewhere else, you need to pass the `pinia` instance [that was passed to the app](#install-the-plugin) to the `useStore()` function call:

```ts
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia conveniently adds itself as `$pinia` to your app so you can use it in functions like `serverPrefetch()`:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

## State hydration

To hydrate the initial state, you need to make sure the rootState is included somewhere in the HTML for Pinia to pick it up later on. Depending on what you are using for SSR, **you should escape the state for security reasons**. We recommend using [@nuxt/devalue](https://github.com/nuxt-contrib/devalue) which is the one used by Nuxt.js:

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is build and can be read
// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable.
devalue(pinia.state.value)
```

Depending on what you are using for SSR, you will set an _initial state_ variable that will be serialized in the HTML. Example with [vite-ssr](https://github.com/frandiox/vite-ssr):

```js
export default viteSSR(App, { routes }, ({ initialState }) => {
  // ...
  if (import.meta.env.SSR) {
    initialState.pinia = devalue(pinia.state.value)
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
      pinia.state.value = window.__INITIAL_STATE__.pinia
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
