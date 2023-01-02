<script setup lang="ts">
const props = defineProps<{
  for: string,
}>()

const links = {
  'pinia-cheat-sheet': 'https://www.vuemastery.com/pinia?coupon=PINIA-DOCS&via=eduardo'
}

const link = links[props.for]
const forPiniaCheatSheet = props.for === 'pinia-cheat-sheet'
</script>

<template>
  <a :href="link" target="_blank">
    <span class="logo-wrapper">
      <img alt="Vue Mastery Logo" width="25px" src="https://firebasestorage.googleapis.com/v0/b/vue-mastery.appspot.com/o/flamelink%2Fmedia%2Fvue-mastery-logo-small.png?alt=media&token=941fcc3a-2b6f-40e9-b4c8-56b3890da108">
    </span>
    <span v-if="forPiniaCheatSheet" class="description">
      Get the <span class="highlight">Pinia Cheat Sheet</span> from Vue Mastery
    </span>
  </a>
</template>

<style scoped>
a {
  background-color: var(--c-bg-accent);
  border-radius: 8px;
  padding: 8px 16px 8px 8px;
  display: flex;
  align-items: center;
  margin-top:10px;
  margin-bottom:10px;
}
.description {
  flex: 1;
  line-height: 20px;
  color: var(--c-text);
  margin: 0 0 0 12px;
  transition: color 0.5s;
}
a:hover {
  text-decoration: none !important;
}
a:hover .highlight {
  text-decoration: underline;
}
.highlight {
  color: var(--c-brand);
}
.logo-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left:5px;
}
.logo-wrapper img {
  width: 25px;
  object-fit: contain;
}
@media (max-width: 576px) {
  .description {
    font-size: 12px;
    line-height: 18px;
  }
  .logo-wrapper {
    position: relative;
    width: 32px;
    height: 32px;
  }
}
</style>