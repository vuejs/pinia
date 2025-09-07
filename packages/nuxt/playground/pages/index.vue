<script lang="ts" setup>
// import {useCounter }from '~/stores/counter'

const counter = useCounter()

useTestStore() // ~/domain/one/stores/testStore.ts
useSomeStoreStore() // ~/stores/nested/some-stores.ts
useBasicStore() // ~~/layers/layer-domain/stores/basic.ts

// await useAsyncData('counter', () => counter.asyncIncrement().then(() => true))

if (import.meta.server) {
  counter.increment()
}
</script>

<template>
  <div>
    <p>Count: {{ counter.$state.count }}</p>
    <button @click="counter.increment()">+</button>
  </div>
</template>
