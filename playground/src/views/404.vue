<template>
  <p>Select one of the pages ⤵️</p>

  <ul>
    <li v-for="page in pages">
      <router-link v-for="page in pages" :to="page">{{
        page.name
      }}</router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const pages = router
  .getRoutes()
  .filter((route) => !route.meta.hide)
  .map((route) => ({ name: route.name }))
</script>
