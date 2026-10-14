# Nuxt

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/ssr-friendly-state"
  title="Learn about SSR best practices"
/>

Using Pinia with [Nuxt](https://nuxt.com/) is easier since Nuxt takes care of a lot of things when it comes to _server side rendering_. For instance, **you don't need to care about serialization nor XSS attacks**. Pinia supports Nuxt 3 and 4.

<RuleKitLink />

## Installation

```bash
npx nuxi@latest module add pinia
```

This will add both `@pinia/nuxt` and `pinia` to your project. **If you notice that `pinia` is not installed, please install it manually** with your package manager: `npm i pinia @vue/devtools-api`. Since v4, `@vue/devtools-api` is a required peer dependency of `pinia`.

:::tip
If you're using npm, you might encounter an _ERESOLVE unable to resolve dependency tree_ error. In that case, add the following to your `package.json`:

```js
"overrides": {
  "vue": "latest"
}
```

:::

We supply a _module_ to handle everything for you, you only need to add it to `modules` in your `nuxt.config.js` file:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... other options
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

And that's it, use your store as usual!

## Awaiting for actions in pages

As with `onServerPrefetch()`, you can call a store action within the `callOnce()` composable.
This will allow Nuxt to run the action only once and avoids refetching data that is already present.

```vue{3-4}
<script setup>
const store = useStore()
// we could also extract the data, but it's already present in the store
await callOnce('user', () => store.fetchUser())
</script>
```

Depending on your requirements, you can choose to run the action only once on the client, or on every navigation (which is closer to data fetching behavior of `useFetch()`/`useAsyncData()`)

```vue{3}
<script setup>
const store = useStore()
await callOnce('user', () => store.fetchUser(), { mode: 'navigation' })
</script>
```

::: tip

If you want to use a store outside of `setup()` or an _injection aware_ context (e.g. Navigation guards, other stores, Nuxt Middlewares, etc), remember to pass the `pinia` instance to `useStore()`, for the reasons alluded to [here](https://pinia.vuejs.org/core-concepts/outside-component-usage.html#SSR-Apps). Retrieving the `pinia` instance might vary.

```ts
import { useStore } from '~/stores/myStore'

// this line is usually inside a function that is able to retrieve
// the pinia instance
const store = useStore(pinia)
```

Fortunately, most of the time you **don't need to go through this hassle**.

:::

## Auto imports

By default `@pinia/nuxt` exposes a few auto imports:

- `usePinia()`, which is similar to `getActivePinia()` but works better with Nuxt.
- `defineStore()` to define stores
- `storeToRefs()` when you need to extract individual refs from a store
- `acceptHMRUpdate()` for [hot module replacement](../cookbook/hot-module-replacement.md)

It also automatically imports **all stores** defined within your `stores` folder (`app/stores` in Nuxt 4). It doesn't lookup for nested stores though. You can customize this behavior by setting the `storesDirs` option:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // ... other options
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
})
```

Note the folders are relative to the root of your project. If you change the `srcDir` option, you need to adapt the paths accordingly.

## Testing

How Pinia fits in your tests depends on the kind of test (see [Nuxt's testing docs](https://nuxt.com/docs/getting-started/testing#organizing-your-tests)):

- **Unit tests** run without a Nuxt app, e.g. to test a store itself or a composable that uses one. Use a fresh pinia per test or `createTestingPinia()`, see [Testing stores](../cookbook/testing.md).
- **Nuxt tests** run inside a Nuxt app that is created once and shared by all tests in a file (or by all files with Vitest's `isolate: false`). The app's pinia instance is shared too, and with it the state of all stores, so state changed in one test leaks into the next one. See [Resetting stores in Nuxt tests](#Resetting-stores-in-Nuxt-tests).
- **End-to-end tests** don't need anything specific to Pinia.

### Resetting stores in Nuxt tests

Prefer tests that don't depend on the state left by previous tests: set the state each test needs at its start (e.g. with `store.$patch()`).

If you really need fresh stores in every test, you can dispose all of them and delete their state before each test:

```ts
// vitest.setup.ts
import { beforeEach } from 'vitest'
import { getStores } from 'pinia'
import { usePinia } from '#imports'

beforeEach(() => {
  const pinia = usePinia()
  for (const store of getStores(pinia)) {
    store.$dispose()
    delete pinia.state.value[store.$id]
  }
})
```

Note this only resets stores: code that kept a reference to a disposed store won't pick up the new one, and other global state of the Nuxt app is left untouched.
