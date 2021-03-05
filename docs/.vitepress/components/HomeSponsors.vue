<template>
  <div class="sponsors_outer">
    <div>
      <HomeSponsorsGroup v-if="sponsors.platinum" name="Platinum" size="160" />

      <HomeSponsorsGroup v-if="sponsors.gold" name="Gold" size="140" />

      <HomeSponsorsGroup v-if="sponsors.silver" name="Silver" size="120" />

      <a
        class="become-sponsor button white"
        href="https://github.com/sponsors/posva"
        >Become a Sponsor!</a
      >
    </div>
  </div>
</template>

<script setup>
import HomeSponsorsGroup from './HomeSponsorsGroup.vue'
import sponsors from './sponsors.json'
</script>

<style scoped>
.sponsors_outer {
  text-align: center;
  padding: 35px 40px 45px;
  margin: 0 -2.5rem;
  background-color: var(--c-bg-accent);
  /* transition when toggling dark mode */
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
}

.become-sponsor {
  margin-top: 40px;
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
  background-color: var(--c-brand);
  text-decoration: none;
  border-color: var(--c-brand);
  color: var(--c-brand-text);
}
</style>
