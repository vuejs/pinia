# Introduction

Pinia [started](https://github.com/posva/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e) as an experiment to redesign what a Store for Vue could look like with the [Composition API](https://github.com/vuejs/composition-api) around November 2019. Since then, the initial principles are still the same, but Pinia works for both Vue 2 and Vue 3 **and doesn't require you to use the composition API**. The API is the same for both except for _installation_ and _SSR_, and these docs are targeted to Vue 3 **with notes about Vue 2** whenever necessary so it can be read by Vue 2 and Vue 3 users!

## Why should I use Pinia?

Pinia is a store library for Vue, it allows you to share a state across components/pages. If you are familiar with the Composition API, you might be thinking you can already share a global state with a simple `export const state = reactive({})`. This is true for single page applications but **exposes your application to security vulnerabilities** if it is server side rendered. But even in small single page applications, you get a lot from using Pinia:

- Devtools support
  - A timeline to track actions, mutations
  - Stores appear in components where they are used
  - Time travel and easier debugging
- Hot module replacement
  - Modify your stores without reloading your page
  - Keep any existing state while developing
- Plugins: extend Pinia features with plugins
- Proper TypeScript support or **autocompletion** for JS users
- Server Side Rendering Support

## Basic example

This is what using pinia looks like in terms of API (make sure to check the [Getting Started](./getting-started.md) for complete instructions). You start by creating a store:

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    }
  }
})
```

And then you _use_ it in a component:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
    // or using an action instead
    coutner.increment();
  },
}
```

You can even use a function (similar to a component `setup()`) to define a Store for more advanced use cases:

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

If you are still not into `setup()` and Composition API, don't worry, Pinia also support a similar set of [_map helpers_ like Vuex](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper). You define stores the same way but then use `mapStores()`, `mapState()`, or `mapActions()`:

```js
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

You will find more information about each _map helper_ in the core concepts.

## Why _Pinia_

Pinia (pronounced like `/peenya/` in English) is the closest word to _piña_ (_pineapple_ in Spanish) that is a valid package name. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## A more realistic example

Here is a more complete example of the API you will be using with Pinia **with types even in JavaScript**. For some people this might be enough to get started without reading further but we still recommend checking the rest of the documentation or even skipping this example and coming back once you have read about all of the _Core Concepts_.

```js
import { defineStore } from 'pinia'

export const todos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## Comparison with Vuex

Pinia tries to stay as close as Vuex's philosophy as possible. It was designed to test out a proposal for the next iteration of Vuex and it was a success as we currently have an open RFC for Vuex 5 with [an API very similar](https://github.com/vuejs/rfcs/discussions/270) to the one used by Pinia. Note that I (Eduardo), the author of Pinia, am part of the Vue.js Core Team and actively participate in the design of APIs like the Router and Vuex. My personal intention with this project is to redesign the experience of using a global Store while keeping the approachable philosophy of Vue. I keep the API of Pinia as close as Vuex as it keeps moving forward to make it easy for people to migrate to Vuex or to even fusion both projects (under Vuex) in the future.

### RFCs

While Vuex goes through RFC to gather as much feedback from the community as possible, Pinia doesn't. I test out ideas based on my experience developing applications, reading other people's code and answering questions on Discord.
This allows me to provide a solution that works, publish often, and make it evolve it while people use it by having breaking changes (very unlikely to have major breaking changes after its first stable release) in major releases if necessary.

### Comparison with Vuex 3.x/4.x

> Vuex 3.x is Vuex for Vue 2 while Vuex 4.x is for Vue 3

Pinia API is very different from Vuex ≤4, namely:

- _mutations_ no longer exist. They were very often perceived as **_extremely_ verbose**. They initially brought devtools integration but that is no longer an issue.
- No need to create custom complex wrappers to support TypeScript, everything is typed and the API is designed in a way to leverage TS type inference as much as possible.
- No more magic strings to inject, import the functions, call them, enjoy autocompletion!
- No need to dynamically add stores, they are all dynamic by default and you won't even notice. Note you can still manually use a store to register it whenever you want but because it is automatic you don't need to worry about it.
- No more nested structuring of _modules_. You can still nest stores implicitly by importing and _using_ a store inside another but Pinia offers a flat structuring by design while still enabling ways of cross composition among stores.
- No _namespaced modules_. Given the flat architecture of stores, "namespacing" stores is inherent to how they are defined and you could say all stores are namespaced.
