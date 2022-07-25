<template>
  <a
    v-if="isVisible"
    id="vs"
    href="https://vueschool.io/sales/summer-vue/?friend=vuerouter"
    target="_blank"
    rel="noreferrer">
    <div class="vs-iso">
      <img src="/images/vueschool/vs-iso.svg" alt="Vue School Logo">
    </div>
    <div class="vs-logo">
      <img src="/images/vueschool/vs-logo.svg" alt="Vue School Logo">
    </div>
    <div class="vs-core">
      <div class="vs-backpack">
        <img src="/images/vueschool/vs-backpack.png" alt="Backpack">
      </div>
      <div class="vs-slogan-wrapper">
        <div class="vs-slogan">
          Learn Vue this summer and <span class="vs-slogan-light">save 40%</span>
        </div>
        <div class="vs-subline">
          <span
            v-if="isExtended"
            :style="{ fontWeight: 'bold', marginRight: '8px' }">
            Extended!
          </span>
          <span
            v-else>
            Limited time offer
          </span>
          <BannerCountdown
            v-bind="{ remaining }" />
        </div>
      </div>
      <div class="vs-button">
        Get Offer
      </div>
    </div>
    <div
      id="vs-close"
      class="vs-close"
      @click.stop.prevent="close">
      <img src="/images/vueschool/close.svg" alt="Close">
    </div>
  </a>
</template>

<script>
import BannerCountdown from './BannerCountdown.vue'

export default {
  components: {
    BannerCountdown
  },
  data () {
    return {
      isActive: null,
      isExtended: null,
      isVisible: false,
      remaining: 0
    }
  },
  mounted () {
    const now = new Date()
    const extension = new Date('2022-07-27T00:00:00+02:00')
    const end = new Date('2022-07-29T00:00:00+02:00')

    this.isActive = now < end
    this.isExtended = now > extension && now < end

    this.remaining = (this.isExtended ? end : extension) - now
    this.isVisible = !localStorage.getItem('VS_SUMMER_22') && this.remaining > 0
    if (this.isVisible) document.body.classList.add('has-top-banner')
  },
  methods: {
    close () {
      this.isVisible = false
      document.body.classList.remove('has-top-banner')
      localStorage.setItem('VS_SUMMER_22', 1)
    }
  }
}
</script>

<style>
#vs {
  align-items: center;
  background-color: #202A5A;
  box-sizing: border-box;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  justify-content: center;
  position: fixed;
  padding: 0 10px;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  height: 5rem;
  display: flex;
}

#vs:hover {
  text-decoration: none;
}

@media (min-width: 680px) {
  #vs {
    height: 5rem;
  }
}

#vs:hover .vs-core .vs-button {
  background: #f22606;
}

#vs .vs-iso {
  position: absolute;
  left: 20px;
  height: 26px;
  display: none;
}

#vs .vs-iso img {
  height: 26px;
}

@media (min-width: 680px) {
  #vs .vs-iso {
    left: 40px;
    height: 40px;
    display: inline-block;
  }
  #vs .vs-iso img {
    height: 40px;
  }
}

@media (min-width: 900px) {
  #vs .vs-iso {
    display: none;
  }
}

#vs .vs-logo {
  position: absolute;
  display: none;
  left: 40px;
}

@media (min-width: 900px) {
  #vs .vs-logo {
    display: block;
  }
}

#vs .vs-core {
  display: flex;
  align-items: center;
}

#vs .vs-core .vs-backpack {
  margin-right: 26px;
}

#vs .vs-core .vs-backpack img {
  height: 44px;
}

#vs .vs-core .vs-slogan-wrapper {
  margin-right: 26px;
}

#vs .vs-core .vs-slogan {
  color: #FFF;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
}

@media (min-width: 680px) {
  #vs .vs-core .vs-slogan {
    font-size: 18px;
  }
}

#vs .vs-core .vs-slogan > .vs-slogan-light {
  color: #00b5ff;
  display: block;
}

#vs .vs-core .vs-slogan-wrapper .vs-subline {
  color: #FFF;
  text-align: center;
  font-size: 12px;
}

@media (min-width: 680px) {
  #vs .vs-core .vs-slogan-wrapper .vs-subline {
    font-size: 16px;
  }
}

@media (min-width: 900px) {
  #vs .vs-core .vs-slogan > .vs-slogan-light {
    text-align: center;
    display: inline;
  }
}

#vs .vs-core .vs-button {
  color: #fff;
  padding: 13px 24px;
  border-radius: 40px;
  display: none;
  background: #ff5338;
  font-weight: bold;
  text-transform: uppercase;
}

@media (min-width: 680px) {
  #vs .vs-core .vs-button {
    display: inline-block;
  }
}

#vs .vs-close {
  right: 10px;
  position: absolute;
  padding: 10px;
}

@media (min-width: 680px) {
  #vs .vs-close {
    right: 20px;
  }
}

#vs .vs-close:hover {
  color: #56d8ff;
}

/********************************************/

.has-top-banner .theme {
  margin-top: 80px;
}

.has-top-banner .theme .nav-bar {
  margin-top: 80px;
}

.has-top-banner .theme .sidebar {
  margin-top: 80px;
}

.has-top-banner .theme .page {
  margin-top: 80px;
}

@media (min-width: 680px) {
  .has-top-banner .theme {
    margin-top: 80px;
  }

  .has-top-banner .theme .nav-bar {
    margin-top: 80px;
  }

  .has-top-banner .theme .sidebar {
    margin-top: 80px;
  }

  .has-top-banner .theme .page {
    margin-top: 80px;
  }
}

</style>
