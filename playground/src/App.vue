<template>
  <button @click="n++">Increment {{ n }}</button>
  <pre>{{ counter.$state }}</pre>
  <!-- <button @click="counter.newOne()">Click me</button> -->
  <TestStore />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TestStore from './components/TestStore.vue'
import { useCounter } from './stores/counter'

const counter = useCounter()

const n = ref(4)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
