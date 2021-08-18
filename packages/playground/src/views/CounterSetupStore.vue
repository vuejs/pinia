<template>
  <h2>Local variables</h2>

  <button @click="n++">Increment local: {{ n }}</button>

  <h2>Counter Store</h2>

  <p>Counter :{{ counter.n }}. Double: {{ counter.double }}</p>

  <p>
    Increment the Store <br />

    <button @click="counter.increment()">+1</button>
    <button @click="counter.increment(10)">+10</button>
    <button @click="counter.increment(100)">+100</button>
    <button @click="counter.n++">Direct Increment</button>
    <button
      @click="
        counter.$patch((state) => {
          state.n++
          state.incrementedTimes++
        })
      "
    >
      Direct patch
    </button>
  </p>

  <p>
    Other actions <br />

    <button @click="counter.fail">Fail</button>
    <button @click="counter.decrementToZero(300)">Decrement to zero</button>
    <button @click="counter.changeMe()"><code>counter.changeMe()</code></button>
  </p>

  <hr />

  <p><code>counter.$state</code>:</p>

  <pre>{{ counter.$state }}</pre>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCounter } from '../stores/counterSetup'

const counter = useCounter()
const n = ref(0)
</script>
