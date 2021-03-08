# Server Side Rendering

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

On client side, you must hydrate pinia's state before calling any `useStore()` function. For example, if we serialize the state into a `<script>` tag to make it accessible globally on client side through `window.__pinia`, we can write this:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// must be set by the user
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
