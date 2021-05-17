<template>
  <p>Counter :{{ counterStore.n }}</p>

  <button @click="counterStore.increment">Increment</button>
  <button @click="counterStore.n++">Direct Increment</button>
  <button
    @click="
      counterStore.$patch((state) => {
        state.n++
        state.incrementedTimes++
      })
    "
  >
    Direct patch
  </button>
  <button @click="counterStore.fail">Fail</button>
  <button @click="counterStore.decrementToZero(300, true)">To ZERO</button>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { useCounter } from '../stores/counter'

const counterStore = useCounter()
const cartStore = useCartStore()
</script>
