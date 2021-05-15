<template>I have a store "{{ userStore.name }}"</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>
