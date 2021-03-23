---
home: true
heroImage: /logo.svg
actionText: Get Started
actionLink: /introduction.html

altActionText: Demo
altActionLink: https://esm.dev

features:
  - title: 💡 Intuitive
    details: Stores are as familiar as components. API designed to let you write well organized stores.
  - title: 🔑 Type Safe
    details: Types are inferred, which means stores provide you with autocompletion even in JavaScript!
  - title: ⚙️ Devtools support
    details: Pinia hooks into Vue devtools to give you a enhanced development experience in both Vue 2 and Vue 3.
  - title: 🔌 Extensible
    details: React to store changes to extend Pinia with transactions, local storage synchronization, etc.
  - title: 🏗 Modular by design
    details: Build multiple stores and let your bundler code split them automatically.
  - title: 📦 Extremely light
    details: Pinia weights around 1kb, you will forget it's even there!
footer: MIT Licensed | Copyright © 2019-present Eduardo San Martin Morote
---

<ThemeToggle/>

<HomeSponsors />

<script setup>
import HomeSponsors from './.vitepress/components/HomeSponsors.vue'
import ThemeToggle from './.vitepress/components/ThemeToggle.vue'
</script>
