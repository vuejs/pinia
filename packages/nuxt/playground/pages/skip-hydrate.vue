<script lang="ts" setup>
const store = useWithSkipHydrateStore()
const skipHydrateState = computed(() => {
  return store.skipped?.text === 'I should not be serialized or hydrated'
    ? 'skipHydrate-wrapped state is correct'
    : 'skipHydrate-wrapped state is incorrect'
})
</script>

<template>
  <h2>skipHydrate() test</h2>
  <p>{{ skipHydrateState }}</p>
</template>
