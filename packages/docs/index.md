---
layout: home

title: Pinia
titleTemplate: The intuitive store for Vue.js

hero: 
  name: Pinia
  text: The intuitive store for Vue.js
  tagline: Type Safe, Extensible, and Modular by design. Forget you are even using a store.
  image:
    src: /logo.svg
    alt: Pinia
  actions:
    - theme: brand
      text: Get Started
      link: /introduction
    - theme: alt
      text: Demo
      link: https://stackblitz.com/github/piniajs/example-vue-3-vite


features:
  - title: 💡 Intuitive
    details: Stores are as familiar as components. API designed to let you write well organized stores.
  - title: 🔑 Type Safe
    details: Types are inferred, which means stores provide you with autocompletion even in JavaScript!
  - title: ⚙️ Devtools support
    details: Pinia hooks into Vue devtools to give you an enhanced development experience in both Vue 2 and Vue 3.
  - title: 🔌 Extensible
    details: React to store changes to extend Pinia with transactions, local storage synchronization, etc.
  - title: 🏗 Modular by design
    details: Build multiple stores and let your bundler code split them automatically.
  - title: 📦 Extremely light
    details: Pinia weighs ~1.5kb, you will forget it's even there!
---

<script setup>
import HomeSponsors from './.vitepress/theme/components/HomeSponsors.vue'
</script>

<HomeSponsors />
