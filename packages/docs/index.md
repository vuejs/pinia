---
layout: home

title: Pinia
titleTemplate: Интуитивное хранилище для Vue.js

hero:
  name: Pinia
  text: Интуитивное хранилище для Vue.js
  tagline: Типобезопасное, расширяемое и с модульной конструкцией. Можно даже забыть, что вы используете хранилище.
  image:
    src: /logo.svg
    alt: Pinia
  actions:
    - theme: brand
      text: Начало работы
      link: /introduction
    - theme: alt
      text: Демо
      link: https://stackblitz.com/github/piniajs/example-vue-3-vite
    - theme: cta mastering-pinia
      text: ' '
      link: https://masteringpinia.com
    - theme: cta vueschool
      text: Смотреть вступительное видео
      link: https://vueschool.io/lessons/introduction-to-pinia?friend=vuerouter&utm_source=pinia&utm_medium=link&utm_campaign=homepage
    - theme: cta vue-mastery
      text: Получить шпаргалку по Pinia
      link: https://www.vuemastery.com/pinia?coupon=PINIA-DOCS&via=eduardo

features:
  - title: 💡 Интуитивное
    details: Хранилища вам так же знакомы, как и компоненты. API спроектировано для создания хорошо организованных хранилищ.
  - title: 🔑 Типобезопасное
    details: Присутствует вывод типов, что позволяет вашим хранищам предоставлять автозаполнение даже на JavaScript!
  - title: ⚙️ Поддержка Devtools
    details: Pinia подключается к Vue devtools, что позволяет расширить возможности разработки как в Vue 2, так и в Vue 3.
  - title: 🔌 Расширяемое
    details: Реагируйте на изменения хранилища, чтобы расширить Pinia с помощью транзакций, синхронизации с Local Storage и т.д.
  - title: 🏗 Модульная конструкция
    details: Создавайте несколько хранилищ и позвольте вашему сборщику кода автоматически разделить их.
  - title: 📦 Чрезвычайно легкое
    details: Размер Pinia ~1.5kb, вы забудете, что она вообще есть!
---

<script setup>
import HomeSponsors from './.vitepress/theme/components/HomeSponsors.vue'
import './.vitepress/theme/styles/home-links.css'
</script>

<HomeSponsors />
