export const AppVue = `
<script setup lang="ts">
import { useCounter } from './counter.ts'

const counter = useCounter()
</script>

<template>
  <button @click="counter.n++">Increment {{ counter.n }}</button>
</template>
`.trimStart()

export const counterTs = `
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounter = defineStore('counter', () => {
  const n = ref(0)

  return { n }
})
`.trimStart()
