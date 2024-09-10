<template>
  <div class="sponsors_outer">
    <div>
      <HomeSponsorsGroup
        v-if="sponsors.platinum.length"
        name="Platinum"
        size="96"
      />

      <HomeSponsorsGroup v-if="sponsors.gold.length" name="Gold" size="38" />

      <HomeSponsorsGroup
        v-if="sponsors.silver.length"
        name="Silver"
        size="24"
      />

      <div class="cta">
        <a class="become-sponsor" href="https://github.com/sponsors/posva">{{
          translations[site.lang] || translations.en
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeSponsorsGroup from './HomeSponsorsGroup.vue'
import sponsors from './sponsors.json'
import { useData } from 'vitepress'

const { site } = useData()
const translations = {
  en: 'Become a sponsor',
  'en-US': 'Become a Sponsor!',
  'zh-CN': '成为赞助者！',
}
</script>

<style scoped>
.become-sponsor {
  font-size: 0.9em;
  width: auto;
  text-align: center;
  background-color: transparent;
  padding: 0.75em 2em;
  border-radius: 2em;
  transition: all 0.3s ease;
  box-sizing: border-box;
  border: 2px solid var(--vp-button-brand-hover-bg);
  text-decoration: none;
}

.become-sponsor:hover {
  text-decoration: none;
  background-color: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-text) !important;
}

.sponsors-top .become-sponsor {
  font-size: 0.75em;
  padding: 0.2em;
  width: auto;
  max-width: 150px;
}

.sponsors_outer {
  text-align: center;
  padding: 35px 40px 45px;
  /* transition when toggling dark mode */
  transition:
    background-color 300ms ease-in-out,
    color 300ms ease-in-out;
}

.cta {
  margin-top: 2rem;
}
</style>
