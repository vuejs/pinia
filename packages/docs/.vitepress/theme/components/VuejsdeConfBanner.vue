<template>
  <div class="banner banner-vuejsconf" v-if="isVisible">
    <a href="https://conf.vuejs.de/tickets/?voucher=COMMUNITY&utm_source=vuejs&utm_medium=referral&utm_campaign=banner-placement&utm_content=banner"
      target="_blank">
      <picture>
        <source media="(min-width:1260px)"
          srcset="/vuejsde-conf/vuejsdeconf_banner_large.png, /vuejsde-conf/vuejsdeconf_banner_large_2x.png 2x" />
        <source media="(min-width:970px)"
          srcset="/vuejsde-conf/vuejsdeconf_banner_medium.png, /vuejsde-conf/vuejsdeconf_banner_medium_2x.png 2x" />
        <source media="(min-width:576px)"
          srcset="/vuejsde-conf/vuejsdeconf_banner_small.png, /vuejsde-conf/vuejsdeconf_banner_small_2x.png 2x" />
        <source media="(min-width:320px)"
          srcset="/vuejsde-conf/vuejsdeconf_banner_smallest.png, /vuejsde-conf/vuejsdeconf_banner_smallest_2x.png 2x"
          alt="" />
        <img src="/vuejsde-conf/vuejsdeconf_banner_smallest_2x.png" alt="" />
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

const nameStorage = 'VUEJSDECONF-BANNER-SEPTEMBER-2024'

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
  --vp-layout-top-height: 72px;
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
  color: #000;
}

.banner-dismissed .banner {
  display: none;
}

a {
  text-decoration: underline;
}

.close {
  font-size: 24px;
}

.banner-vuejsconf {
  background: linear-gradient(90deg, #fff 50%, #6f97c4 50%);
}

.banner-vuejsconf a {
  display: inline-block;
  margin: 0 auto;
}

.banner-vuejsconf .close-btn {
  top: 0;
  left: 0;
  z-index: 99;
  position: absolute;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
}
</style>
