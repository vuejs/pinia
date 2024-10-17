<script lang="ts" setup>
const baseStore = useExampleStore();
const appStore = useXYZStore();
</script>
<template>
  <div>
    <p>Base store: {{ baseStore.example }}</p>
    <p>App store: {{ appStore.foo }}</p>
  </div>
</template>