<template>
  <div class="vuemastery-banner-wrapper" role="banner" v-if="isVisible">
    <div
      :class="{ 'show-flash': showFlash }"
      class="vuemastery-background-dim"
      ref="vuemastery-banner-flash"
    ></div>
    <a id="vm-banner" href="https://www.vuemastery.com/holiday" target="_blank">
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
      <div class="vm-banner-wrapper">
        <div class="vm-banner-content">
          <h1 class="vm-banner-title">Learn Vue with Evan You</h1>
          <p class="vm-banner-sub">Get 60% off a year of Vue courses</p>
        </div>
        <button id="vm-banner-cta">Unlock your discount</button>
      </div>
      <button id="vm-banner-close" @click.prevent="closeBanner">
        <span class="close">&times;</span>
      </button>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const showFlash = ref(false)
const nameStorage = 'VUEMASTERY-BANNER-DECEMBER-2023'

const closeBanner = () => {
  // Hide the banner
  isVisible.value = false
  // Save action in the local storage
  localStorage.setItem(nameStorage, String(true))
  document.documentElement.classList.remove('vuemastery-menu-fixed')
}

onMounted(() => {
  isVisible.value = !localStorage.getItem(nameStorage)
  if (isVisible.value) {
    document.documentElement.classList.add('vuemastery-menu-fixed')
    setTimeout(() => {
      showFlash.value = true
    }, 2000)
  }
})
</script>
<style scoped>
.vuemastery-banner-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 61;
  width: 100%;
  height: 100%;
  max-height: 70px;
  background: linear-gradient(45deg, #0a2b4e, #835ec2);
  background-size: 110%;
  background-position: 50% 50%;
  overflow: hidden;
  padding: 12px;
  margin: 0;
  transition: background-size 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);
}

.vuemastery-banner-wrapper:hover {
  background-size: 100%;
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

.vuemastery-banner-wrapper:hover:after {
  background-image: url(/vuemastery/unlock-vuemastery.svg);
}

#vm-banner {
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

.vm-banner-wrapper {
  display: flex;
  align-items: center;
}

.vm-banner-content {
  display: flex;
}

.vm-banner-title {
  margin: 0;
  padding: 0;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  background: linear-gradient(145deg, #c3ffac, #86ec87, #38a56a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.vm-banner-sub {
  margin: 0 2em;
  padding: 0;
  font-size: 16px;
  text-align: center;
  color: #fff;
}

#vm-banner-cta {
  position: relative;
  margin-left: 10px;
  padding: 10px 24px;
  background: linear-gradient(to top right, #41b782, #86d169);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
}

#vm-banner-cta:hover {
  background: linear-gradient(to bottom right, #41b782, #86d169);
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

#vm-banner-close > .close {
  font-size: 20px;
  font-weight: 600;
}

@media (max-width: 1200px) {
  #vm-banner-cta {
    display: none;
  }

  .vm-banner-content {
    flex-direction: column;
  }

  .vm-banner-sub {
    margin: 0 1em;
  }
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
  .vm-banner-title {
    font-size: 14px;
  }
  .vm-banner-sub {
    font-size: 12px;
    margin: 0;
  }
}

.vuemastery-background-dim {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.vuemastery-background-dim:after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: 0.5s;
  transition-delay: 0.5s;
}
.vuemastery-background-dim.show-flash:after {
  left: 100%;
}
</style>

<style>
html.vuemastery-menu-fixed {
  --vp-layout-top-height: 70px;
}
html.vuemastery-menu-fixed .VPNav,
html.vuemastery-menu-fixed .VPSidebar {
  top: 70px;
}
html.vuemastery-menu-fixed {
  scroll-padding-top: 134px;
  overflow: auto;
}
html.vuemastery-menu-fixed {
  margin-top: 72px;
}
@media (max-width: 960px) {
  html.vuemastery-menu-fixed .VPNav,
  html.vuemastery-menu-fixed .VPSidebar {
    top: 0;
  }
}
</style>
