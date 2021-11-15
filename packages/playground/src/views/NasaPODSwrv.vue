<template>
  <section>
    <h2>Nasa Picture of the day</h2>

    <section class="py-4 text-center date-selector">
      <button @click="decrementDay(currentDate)">Previous Day</button>
      <p class="inline-block mx-2">
        <input type="date" v-model="currentDate" />
      </p>
      <button
        @click="incrementDay(currentDate)"
        :disabled="currentDate >= today"
      >
        Next Day
      </button>
    </section>

    <template v-if="error">
      <p>
        ❌ Error:
        <br />
        {{ error }}
      </p>
    </template>

    <template v-else-if="isValidating">
      <div class="spinner"></div>
    </template>

    <template v-else-if="image">
      <h3 class="mb-4 text-center">{{ image.title }}</h3>

      <figure class="mb-0">
        <img
          class="max-w-full m-auto max-h-[75vh]"
          :src="image.url"
          :key="image.url"
          :alt="image.title"
        />
        <figcaption class="mt-2">{{ image.explanation }}</figcaption>
      </figure>
    </template>

    <template v-else-if="isValidating">
      <div class="spinner"></div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useNasaStore } from '../stores/nasa'

const nasa = useNasaStore()

const today = new Date().toISOString().slice(0, 10)

const { image, error, currentDate, isValidating } = toRefs(nasa.$state)
const { incrementDay, decrementDay } = nasa
</script>

<style scoped>
.date-selector {
  padding: 1rem 0;
  text-align: center;
}

.date-selector > p {
  display: inline-block;
  margin: 0 0.4rem;
}

button {
  margin: 0;
}
</style>
