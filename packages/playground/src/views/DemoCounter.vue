<template>
  <h2>Counter Store</h2>

  <p>Counter :{{ counter.n }}. Double: {{ counter.double }}</p>

  <button @click="counter.n++">Increment</button>

  <hr />

  <p>
    <code>counter.$state</code>:
  </p>

  <pre>{{ counter.$state }}</pre>
</template>

<script lang="ts" setup>
import { useCounter } from '../stores/demo-counter'

const counter = useCounter()
</script>
