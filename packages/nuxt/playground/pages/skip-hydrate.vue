<script lang="ts" setup>
const store = useWithSkipHydrateStore()
</script>

<template>
  <h2>skipHydrate() test</h2>
  <pre>{{ store.skipped }}</pre>
</template>
