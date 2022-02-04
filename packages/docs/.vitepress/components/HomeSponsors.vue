<template>
  <div class="sponsors_outer">
    <div>
      <HomeSponsorsGroup v-if="sponsors.platinum.length" name="Platinum" size="96" />

      <HomeSponsorsGroup v-if="sponsors.gold.length" name="Gold" size="38" />

      <HomeSponsorsGroup v-if="sponsors.silver.length" name="Silver" size="24" />

      <div class="cta">
        <a class="become-sponsor" href="https://github.com/sponsors/posva">Become a Sponsor!</a>
      </div>
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
  background-color: var(--c-bg-accent);
  /* transition when toggling dark mode */
  transition: background-color 300ms ease-in-out, color 300ms ease-in-out;
}

.cta {
  margin-top: 1rem;
}
</style>

