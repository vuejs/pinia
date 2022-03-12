---
home: true
heroImage: /logo.svg
actionText: Get Started
actionLink: /introduction.html

altActionText: Demo
altActionLink: https://stackblitz.com/github/piniajs/example-vue-3-vite

features:
  - title: 💡 Intuitif
    details: Les Stores sont aussi familiers que les composants. API conçue pour vous permettre d'écrire des stores bien organisés.
  - title: 🔑 Type Sécurité
    details: Les types sont déduits, ce qui signifie que les stores vous fournissent une autocomplétion même en JavaScript !
  - title: ⚙️ Support Devtools
    details: Pinia s'intègre aux outils de développement de Vue pour vous offrir une expérience de développement améliorée dans Vue 2 et Vue 3.
  - title: 🔌 Extensible
    details: React to store changes to extend Pinia with transactions, local storage synchronization, etc.
  - title: 🏗 Modulaire par conception
    details: Créez plusieurs stores et laissez votre code de regroupement les diviser automatiquement.
  - title: 📦 Extrêmement léger
    details: Pinia pèse environ 1kb, vous oublierez même qu'il est là !
footer: MIT Licensed | Copyright © 2019-present Eduardo San Martin Morote
---

<ThemeToggle/>
<!-- <TestStore/> -->

<HomeSponsors />

<script setup>
import HomeSponsors from '../.vitepress/components/HomeSponsors.vue'
import ThemeToggle from '../.vitepress/components/ThemeToggle.vue'
// import TestStore from './.vitepress/components/TestStore.vue'
</script>
