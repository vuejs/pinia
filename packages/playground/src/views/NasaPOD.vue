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

    <template v-if="!isReady && isLoading">
      <div class="spinner"></div>
    </template>

    <template v-else-if="image">
      <h3 class="mb-4 text-center">{{ image.title }}</h3>

      <figure class="mb-0">
        <iframe
          v-if="image.url.includes('youtube.com')"
          width="560"
          height="315"
          :key="image.url"
          :src="image.url"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <img
          v-else
          class="max-w-full m-auto max-h-[75vh]"
          :src="image.url"
          :alt="image.title"
        />
        <figcaption class="mt-2">{{ image.explanation }}</figcaption>
      </figure>
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNasaPOD } from '../stores/nasa-pod'

const nasa = useNasaPOD()

const today = new Date().toISOString().slice(0, 10)

const { image, currentDate, isLoading, isReady } = storeToRefs(nasa)
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
