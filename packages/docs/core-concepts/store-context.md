# Passing context to stores

<MasteringPiniaLink
href="https://masteringpinia.com/lessons/What-is-a-pinia-plugin"
title="Learn all about Pinia plugins"
/>

When building complex apps it can happen that you need to inject data or function
in stores when they are first instanced.

Context is added to the pinia instance with `pinia.provide()`. With it you can
define a property of the context object that will be passed to the store when it
is initialized.

When using the setup API :

```js
import { createPinia, defineStore } from 'pinia'

// add a property named `secret` to every store that is created
// after this plugin is installed this could be in a different file
const API_URL = 'https://localhost/blog/'

const pinia = createPinia()
// provide the contextual data
pinia.provide('apiUrl', API_URL)

// in your store declaration
const useStore = defineStore('blog', ({ context }) => {
  console.log(`API URL is ${context.apiUrl}`)
  // logs "API URL is https://localhost/blog/"

  return {
    // your store's implementation
  }
})
```

When using the Option API :

```js
import { createPinia, defineStore } from 'pinia'

const API_URL = 'https://localhost/blog/'

const pinia = createPinia()
// provide the contextual data to every store intantiations
pinia.provide('apiUrl', API_URL)

// in your store declaration
const useStore = defineStore('blog', {
  state: (context) => {
    console.log(`API URL is ${context.apiUrl}`)
    // logs "API URL is https://localhost/blog/"
    return {
      // your store's state
    }
  },
})
```

## Changing the context value after the fact

Context is only provided when the store is first initialized and is not reactive
by default, if you pass in a value and modify it outside the store it will not
be reflected inside of it unless you use references :

```js
import { createPinia, defineStore } from 'pinia'

const api = {
  url: 'https://localhost/blog/',
}

const pinia = createPinia()
  // this can't be updated
  .provide('api', api)
  // but this can
  .provide('apiUrl', api.url)

api.url = 'https://example.com/blog/'

// in your store declaration
const useStore = defineStore('blog', (context) => {
  console.log(`API URL is ${context.apiUrl}`)
  // logs "API URL is https://localhost/blog/"

  console.log(`API URL is ${context.api.url}`)
  // logs "API URL is https://example.com/blog/"
  return {
    // your store's state
  }
})
```

## The context object is readonly

When accessed in the store the context properties are readonly, you can add new
ones (not advised) but you can't update the existing ones.

```js
import { createPinia, defineStore } from 'pinia'

const pinia = createPinia().provide('api', 'https://localhost/blog/')

// in your store declaration
const useStore = defineStore('blog', (context) => {
  context.api = 'https://example.com/blog/'
  // this will throw a TypeError

  return {
    // your store's state
  }
})
```

## Typing the context data

When adding new fields in the context object you should extend the
`PiniaSetupContext` interface so calls to `.provide()` and access to properties
on `context` are validated by TypeScript.

```ts
import 'pinia'

interface MyLogger {
  info(message: string): void
  error(error: Error): void
}

declare module 'pinia' {
  export interface PiniaSetupContext {
    // type the context of the example above
    apiUrl: string

    // you can also pass in more complex things like functions or objects
    sendMail: (message: string, to: string) => void
    logger: MyLogger
  }
}
```
