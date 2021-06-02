<template>
  <div class="sponsors_outer">
    <div>
      <HomeSponsorsGroup v-if="sponsors.platinum" name="Platinum" size="160" />

      <HomeSponsorsGroup v-if="sponsors.gold" name="Gold" size="140" />

      <HomeSponsorsGroup v-if="sponsors.silver" name="Silver" size="120" />

      <div class="cta">
        <a class="become-sponsor" href="https://github.com/sponsors/posva"
          >Become a Sponsor!</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import HomeSponsorsGroup from './HomeSponsorsGroup.vue'
import sponsors from './sponsors.json'
import { nextTick, onMounted } from 'vue'
import { isDark } from '../theme/dark-theme'

onMounted(() => {
  // wait to ticks to fix the problem of SSR with no color scheme
  nextTick(() => {
    isDark.value = !isDark.value
    return nextTick()
  }).then(() => {
    isDark.value = !isDark.value
  })
})
</script>

<style scoped>
.sponsors_outer {
  text-align: center;
  padding: 35px 40px 45px;
  background-color: var(--c-bg-accent);
  /* transition when toggling dark mode */
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
}

.cta {
  margin-top: 1rem;
}

.become-sponsor {
  font-size: 0.9em;
  font-weight: 700;
  width: auto;
  background-color: transparent;
  padding: 0.75em 2em;
  border-radius: 2em;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 2px solid var(--c-text);
  color: var(--c-text);
}

.become-sponsor:hover {
  background-color: var(--c-yellow);
  text-decoration: none;
  border-color: var(--c-yellow);
  color: var(--c-text-light-1);
}
</style>
