<template>
  <div class="banner banner-vuejsconf" v-if="isVisible">
    <a href="https://conf.vuejs.de/?utm_source=vuejs&utm_medium=referral&utm_campaign=banner-placement&utm_content=banner"
      target="_blank">
      <picture>
        <source media="(min-width:1200px)" srcset="/vuejsde-conf/vuejsdeconf_banner_large.png" />
        <source media="(min-width:920px)" srcset="/vuejsde-conf/vuejsdeconf_banner_medium.png" />
        <img src="/vuejsde-conf/vuejsdeconf_banner_small.png" alt="" />
      </picture>
    </a>
    <div class="close-btn" @click.stop.prevent="closeBanner">
      <span class="close">&times;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const nameStorage = 'VUEJSDECONF-BANNER-MAY-2024'

const resetLayoutTopHeight = () => {
  document.documentElement.classList.add('banner-dismissed')
}

const closeBanner = () => {
  // Hide the banner
  isVisible.value = false
  // Save action in the local storage
  localStorage.setItem(nameStorage, String(true))
  resetLayoutTopHeight()
}

onMounted(() => {
  isVisible.value = !localStorage.getItem(nameStorage)

  if (!isVisible.value) {
    resetLayoutTopHeight()
  }
})
</script>
<style>
html:not(.banner-dismissed) {
  --vp-layout-top-height: 60px;
}
</style>
<style scoped>
.banner {
  position: fixed;
  z-index: var(--vp-z-index-layout-top);
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  height: var(--vp-layout-top-height);
  line-height: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.banner-dismissed .banner {
  display: none;
}

a {
  text-decoration: underline;
}

.banner-vuejsconf {
  background: linear-gradient(90deg, #fff 50%, #43b883 50%);
}

.banner-vuejsconf a {
  display: inline-block;
  margin: 0 auto;
}

.banner-vuejsconf .close-btn {
  top: 10px;
  right: 10px;
  z-index: 99;
  position: absolute;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
}
</style>
