<script lang="ts" setup>
// import {useCounter }from '~/stores/counter'

const counter = useCounter()

useTestStore()
useSomeStoreStore()

await useAsyncData('counter', () => counter.asyncIncrement().then(() => true))

if (process.server) {
  counter.increment()
}
</script>

<template>
  <div>
    <p>Count: {{ counter.$state.count }}</p>
    <button @click="counter.increment()">+</button>
  </div>
</template>
