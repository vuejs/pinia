<template>
  <header>
    <h1>🍍 Pinia playground</h1>
    <nav>
      <template v-for="(page, i) in pages" :key="page.name">
        <router-link :to="page" v-slot="{ route }">{{
          route.fullPath
        }}</router-link>
        <template v-if="i < pages.length - 1"> · </template>
      </template>
    </nav>
  </header>

  <router-view />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const pages = router
  .getRoutes()
  .filter((route) => !route.meta.hide)
  .map((route) => ({ name: route.name }))
</script>

<style>
button {
  margin-right: 0.5rem;
}
</style>
