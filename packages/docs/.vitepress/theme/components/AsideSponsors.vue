<script setup>
const banners = [
  {
    id: 1,
    name: 'Vue.js Certification',
    link: 'https://certificates.dev/vuejs?friend=VUEROUTER',
    image: '/banners/vuejs-certification.svg',
  },
  {
    id: 2,
    name: 'Mastering Pinia',
    link: 'https://masteringpinia.com',
    image: '/banners/mastering-pinia.png',
  },
]
</script>

<template>
  <a
    v-for="banner in banners"
    :key="banner.id"
    :href="banner.link"
    target="_blank"
    :class="`banner_image_${banner.id}`"
  >
    <img :src="banner.image" :alt="banner.name" />
  </a>
</template>

<style scoped>
.banner_image_1 {
  padding: 25px 10px 0px 0px;
}

.banner_image_2 {
  padding: 15px 10px 15px 0px;
}
</style>
