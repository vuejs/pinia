<script lang="ts" setup>
// import {useCounter }from '~/stores/counter'

const counter = useCounter()

useTestStore()
useSomeStoreStore()

const layerStore = useLayerStore()
// await useAsyncData('counter', () => counter.asyncIncrement().then(() => true))

if (import.meta.server) {
  counter.increment()
}
</script>

<template>
  <div>
    <p>Count: {{ counter.$state.count }}</p>
    <button @click="counter.increment()">+</button>

    <p>Layer: {{ layerStore.state }}</p>
  </div>
</template>
