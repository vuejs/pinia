<template>
  <div
    :class="vueMasteryClass"
    class="vuemastery-banner-wrapper"
    ref="$vueMasteryBanner"
    role="banner"
    v-if="isVisible"
  >
    <a
      id="vm-pinia-weekend"
      href="https://www.vuemastery.com/pinia"
      target="_blank"
    >
      <img
        id="vm-logo-full"
        src="/vuemastery/vuemastery-white.svg"
        alt="vuemastery"
      />
      <img
        id="vm-logo-small"
        src="https://firebasestorage.googleapis.com/v0/b/vue-mastery.appspot.com/o/flamelink%2Fmedia%2Fvue-mastery-logo-small.png?alt=media&token=941fcc3a-2b6f-40e9-b4c8-56b3890da108"
        alt="vuemastery"
      />
      <div class="vm-pinia-weekend-wrapper">
        <div class="vm-pinia-weekend-content">
          <h1 class="vm-pinia-weekend-title">
            PINIA WEEKEND <span>MARCH 24-26</span>
          </h1>
          <p class="vm-pinia-weekend-sub">
            Watch all 4 premium courses for free
          </p>
        </div>
        <button id="vm-banner-cta">Secure your spot</button>
      </div>
      <button id="vm-banner-close" @click.prevent="closeBanner">X</button>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'

const isVisible = ref<Boolean>(true)
const isMenuFixed = ref<Boolean>(false)
const $vueMasteryBanner = ref<HTMLElement | null>(null)

const nameStorage = 'VUEMASTERY-BANNER--PINIA-WEEKEND-MARCH-2023'

const getMenuPosition = () => {
  return $vueMasteryBanner.value?.clientHeight || 0
}

const isUnderBanner = () => {
  return window.pageYOffset > getMenuPosition()
}

const fixMenuAfterBanner = () => {
  if (isUnderBanner()) {
    if (!isMenuFixed.value) {
      // The menu will be fixed
      isMenuFixed.value = true
    }
  } else if (isMenuFixed.value) {
    // The menu stay under the banner
    isMenuFixed.value = false
  }
}

const toggleBannerEvents = (on: Boolean) => {
  // Add or remove event listerners attached to the DOM
  let method: 'addEventListener' | 'removeEventListener' = on
    ? 'addEventListener'
    : 'removeEventListener'
  window[method]('resize', getMenuPosition)
  window[method]('scroll', fixMenuAfterBanner)
}

const closeBanner = () => {
  console.log('closeBanner => ')
  // Remove events
  toggleBannerEvents(false)
  // Hide the banner
  isVisible.value = false
  // Save action in the local storage
  localStorage.setItem(nameStorage, String(true))
}

const initBanner = () => {
  // Add event listeners
  toggleBannerEvents(true)
  // Get the menu position
  getMenuPosition()
  // Check current page offset position
  isMenuFixed.value = isUnderBanner()
}

const vueMasteryClass = computed(() => {
  return {
    'vuemastery-menu-fixed': !isMenuFixed.value,
  }
})

onMounted(() => {
  isVisible.value = !localStorage.getItem(nameStorage)
  if (isVisible.value) {
    nextTick(initBanner)
  }
})
</script>
<style scoped>
.vuemastery-banner-wrapper {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 60;
  width: 100%;
  height: 100%;
  max-height: 70px;
  background: url(/vuemastery/background-vuemastery.svg) left center no-repeat;
  overflow: hidden;
  padding: 12px;
  margin: 0;
  background-size: cover;
}
.vuemastery-banner-wrapper:before {
  content: '';
  background: url(/vuemastery/background-bubbles-vuemastery.svg) left center
    no-repeat;
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-out 0.1s;
  transform: scale(1.1);
  width: 100%;
  height: 100%;
}

.vuemastery-banner-wrapper:after {
  content: '';
  background: url(/vuemastery/lock-vuemastery.svg) right center no-repeat;
  background-size: auto 100%;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.vuemastery-banner-wrapper:hover {
  background-size: 150% auto;
}
.vuemastery-banner-wrapper:hover:before {
  transform: scale(1);
}
.vuemastery-banner-wrapper:hover:after {
  background-image: url(/vuemastery/unlock-vuemastery.svg);
}

#vm-pinia-weekend {
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

#vm-logo-full {
  position: absolute;
  left: 15px;
  width: 120px;
}

#vm-logo-small {
  display: none;
}

#vm-banner-close {
  position: absolute;
  right: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
#vm-banner-close:hover {
  color: #9d9c9c;
}

.vm-pinia-weekend-wrapper {
  display: flex;
  align-items: center;
}

.vm-pinia-weekend-title {
  margin: 0;
  padding: 0;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  background: linear-gradient(145deg, #c3ffac, #86ec87, #38a56a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.vm-pinia-weekend-sub {
  margin: 0;
  padding: 0;
  font-size: 14px;
  text-align: center;
  color: #fff;
}

#vm-banner-cta {
  position: relative;
  margin-left: 10px;
  padding: 12px;
  background: linear-gradient(to top right, #41b782, #86d169);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4);
}
#vm-banner-cta:hover {
  background: linear-gradient(to bottom right, #41b782, #86d169);
}

@media (max-width: 850px) {
  .vuemastery-banner-wrapper:after {
    background: none;
  }
}

@media (max-width: 767px) {
  #vm-logo-full {
    left: 10px;
    width: 100px;
  }
  #vm-banner-cta {
    display: none;
  }
}

@media (max-width: 767px) {
  #vm-logo-full {
    display: none;
  }
  #vm-logo-small {
    position: absolute;
    display: block;
    left: 10px;
    width: 40px;
  }
  .vm-pinia-weekend-title {
    font-size: 14px;
  }
  .vm-pinia-weekend-sub {
    font-size: 12px;
  }
}
</style>

<style>
.Layout:has(.vuemastery-menu-fixed) > .VPNav {
  position: relative;
}

.Layout:has(.vuemastery-menu-fixed) > .VPSidebar {
  margin-top: 4em;
}
</style>