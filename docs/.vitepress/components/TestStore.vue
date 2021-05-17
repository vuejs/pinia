<template>
  <p>
    I have a store "{{ userStore.name }}". I have
    {{ cartStore.items.length }} items in the cart.
  </p>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'

const userStore = useUserStore()
const cartStore = useCartStore()
</script>
