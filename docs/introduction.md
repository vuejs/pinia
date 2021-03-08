# Introduction

Pinia [started](https://github.com/posva/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e) as an experiment to redesign what a Store for Vue could look like with the [Composition API](https://github.com/vuejs/composition-api) around November 2019. Since then, the initial principals are still the same but Pinia works for both Vue 2 and Vue 3. The API is the same for both except for _installation_ and _SSR_ and these docs are targeted to Vue 3 with notes about Vue 2 whenever necessary so it can be used no matter if you are using Vue 2 or Vue 3!

## Basic example

You start by creating a store:

```js
import { defineStore } from 'pinia'

export const useCounter = defineStore({
  id: 'counter',
  state: () => ({ count: 0 }),
})
```

And then you _use_ it in a component:

```js
export default {
  setup() {
    const counter = useCounter()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
  },
}
```

## Why _Pinia_

Pinia is is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## A more realistic example

Here is a more complete example of the API you will be using with Pinia **with types** even in JavaScript:

```js
import { defineStore } from 'pinia'

export const todos = defineStore({
  id: 'todos',
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos() {
      // autocompletion! ✨
      return this.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos() {
      return this.todos.filter((todo) => !todo.isFinished)
    },
    filteredTodos() {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos()
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos()
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: nextId++, isFinished: false })
    },
  },
})
```
