<script lang="ts" setup>
const counter = useCounter()

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
