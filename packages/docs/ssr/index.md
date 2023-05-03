# Server Side Rendering (SSR)

:::tip
If you are using **Nuxt.js,** you need to read [**these instructions**](./nuxt.md) instead.
:::

Creating stores with Pinia should work out of the box for SSR as long as you call your `useStore()` functions at the top of `setup` functions, `getters` and `actions`:

```vue
<script setup>
// this works because pinia knows what application is running inside of
// `setup`
const main = useMainStore()
</script>
```

## Using the store outside of `setup()`

If you need to use the store somewhere else, you need to pass the `pinia` instance [that was passed to the app](#install-the-plugin) to the `useStore()` function call:

```js
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

Note you don't need to do anything special when using `onServerPrefetch()`:

```vue
<script setup>
const store = useStore()
onServerPrefetch(async () => {
  // ✅ this will work
  await store.fetchData()
})
</script>
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

// after rendering the page, the root state is built and can be read directly
// on `pinia.state.value`.

// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable.
devalue(pinia.state.value)
```

Depending on what you are using for SSR, you will set an _initial state_ variable that will be serialized in the HTML. You should also protect yourself from XSS attacks. You can use [other alternatives](https://github.com/nuxt-contrib/devalue#see-also) to `@nuxt/devalue` depending on what you need, e.g. if you can serialize and parse your state with `JSON.stringify()`/`JSON.parse()`, **you could improve your performance by a lot**.

Adapt this strategy to your environment. Make sure to hydrate pinia's state before calling any `useStore()` function on client side. For example, if we serialize the state into a `<script>` tag to make it accessible globally on client side through `window.__pinia`, we can write this:

Here is one example of how it can look. Froms vite official quite for setting up our own express app for server side rendering, https://vuejs.org/guide/scaling-up/ssr.html. inside the `app.use('*'` section we need to take the state of the store from the server side rendered section an embed it into the HTML so when the HTML goes to the browser it can hydrate the store before hydrating the app.

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    let template: string
    let entry: any

    if (isProd) {
      template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
      entry = (await import(resolve('./dist/server/entry-ssr.js')))
    } else {
      // always read fresh template in dev
      template = fs.readFileSync(resolve('index.html'), 'utf-8')
      template = await vite!.transformIndexHtml(url, template)

      entry = (await vite!.ssrLoadModule('/src/entry-ssr.ts'))
    }

    let appHtml = await entry.render(url)
    appHtml += `<script>window.__pinia = ${JSON.stringify(entry.pinia.state.value)}</script>`
    const html = template.replace('<!--ssr-outlet-->', appHtml)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    next(e)
  }
})
```
and in `index.html` we need to have a `<!--ssr-outlet-->` string to replace with the rendered content. And we get the pinia state from the global window environment variable.
```html
<div id="app" class="my-3"><!--ssr-outlet--></div>
<script type="module">
  import { app, pinia } from '/src/entry'

  const initalState = window.__pinia
  if (initalState) pinia.state.value = initalState

  app.mount('#app')
</script>
```
