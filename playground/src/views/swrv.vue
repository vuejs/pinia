<template>
  <h3>Pinia + <a href="https://github.com/posva/vue-promised">SWRV</a></h3>

  <main>
    <section>
      <button
        :disabled="state !== 'ready'"
        @click="fetchRandomJoke"
        style="margin-bottom: 4px"
      >
        {{ buttonText }}
      </button>

      <div style="min-height: 9rem" v-if="jokes.current">
        <blockquote :key="jokes.current.id">
          <i>{{ jokes.current.setup }}</i>
          <br />
          <br />
          <p class="appear" @animationend="state = 'ready'">
            {{ jokes.current.punchline }}
          </p>
        </blockquote>
      </div>
    </section>
  </main>

  <pre>{{ jokes.$state }}</pre>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useJokesSetup } from '../stores/jokes-swrv'

// const jokes = useJokes()
const jokes = useJokesSetup()

const texts = {
  loading: 'Fetching the joke...',
  waiting: 'Wait for it...',
  ready: 'Another one?',
}

const state = ref<'waiting' | 'loading' | 'ready'>('waiting')

const buttonText = computed(() => texts[state.value])

function fetchRandomJoke() {
  state.value = 'loading'

  jokes.fetchJoke().finally(() => {
    state.value = 'waiting'
    console.log('done fetching', jokes.current)
  })
}

onMounted(() => {
  console.log('mounted')
  // @ts-expect-error
  window.jo = jokes
  console.log('new pending')
  fetchRandomJoke()
})
</script>

<style>
@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.appear {
  opacity: 0;
  animation: appear 1s ease-in-out 3s;
  animation-fill-mode: forwards;
}
</style>
