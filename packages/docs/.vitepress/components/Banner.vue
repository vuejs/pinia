<template>
  <a
    v-if="isVisible"
    id="vs"
    href="https://vueschool.com/sales/vuejsforge?friend=vuerouter&utm_source=vuerouter&utm_medium=website&utm_campaign=affiliate&utm_content=top_banner"
    target="_blank"
    rel="noreferrer">
    <div
      class="vs-background-wrapper">
      <div class="vs-core">
        <div class="vs-backpack">
          <img src="/images/vueschool/vs-backpack.png" alt="Backpack">
        </div>
        <div class="vs-slogan-wrapper">
          <div class="vs-slogan">
            Save 50% for a limited time
            <span
              v-if="isExtended">
              &middot; Extended!
            </span>
          </div>
          <div class="vs-subline">
            Vue.js Premium Video Courses
          </div>
          <BannerCountdownMobile
            v-bind="{ remaining }" />
        </div>
        <BannerCountdown
          v-bind="{ remaining }" />
        <div class="vs-button">
          BUY NOW
        </div>
      </div>
      <div
        id="vs-close"
        class="vs-close"
        @click.stop.prevent="close">
        <img src="/images/vueschool/close.svg" alt="Close">
      </div>
    </div>
  </a>
</template>

<script>
import BannerCountdown from './BannerCountdown.vue'
import BannerCountdownMobile from './BannerCountdownMobile.vue'

export default {
  components: {
    BannerCountdown,
    BannerCountdownMobile
  },
  data () {
    return {
      isVisible: false,
      isActive: null,
      isExtended: null,
      isVisible: false,
      remaining: 0
    }
  },
  mounted () {
    const now = new Date()
    const extension = new Date('2022-09-01T00:00:00+02:00')
    const end = new Date('2022-09-02T00:00:00+02:00')
    this.isActive = now < end
    this.isExtended = now > extension && now < end
    this.remaining = (this.isExtended ? end : extension) - now
    this.isVisible = !localStorage.getItem('VF_OFFER') && this.remaining > 0
    if (this.isVisible) document.body.classList.add('has-top-banner')
  },
  methods: {
    close () {
      this.isVisible = false
      document.body.classList.remove('has-top-banner')
      localStorage.setItem('VF_OFFER', 1)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

#vs {
  background-color: #0A1124;
  box-sizing: border-box;
  color: #fff;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  height: 72px;
  background: radial-gradient(circle at 98% 31%, #1f4491, #050a1e 56%);
}

.vs-background-wrapper {
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 0 10px;
  height: 100%;
  width: 100%;
  background-image: url(/images/vueschool/bg-mobile.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top right;
}

#vs:hover {
  text-decoration: none;
}

#vs:hover .vs-core .vs-button {
  background: rgb(240, 80, 35);
  color: #FFF;
}

#vs .vs-core {
  display: flex;
  align-items: center;
  width: 288px;
}

#vs .vs-core .vs-backpack {
  height: 46px;
  margin-right: 16px;
}

#vs .vs-core .vs-backpack img {
  height: 100%;
}

#vs .vs-core .vs-slogan-wrapper {
  margin-right: 12px;
}

#vs .vs-core .vs-slogan {
  color: #fdb92c;
  font-weight: bold;
  font-size: 12px;
}

#vs .vs-core .vs-subline {
  color: #FFF;
  text-align: center;
  font-size: 10px;
  margin-top: 4px;
  font-weight: bold;
}

#vs .vs-core .vs-button {
  color: #000;
  padding: 8px 6px;
  border-radius: 4px;
  background: #ffbb27;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.3px;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

#vs .vs-close {
  right: 0;
  position: absolute;
  padding: 10px;
}

#vs .vs-close:hover {
  color: #56d8ff;
}

@media (min-width: 680px) {
  .vs-background-wrapper {
    background-image: url(/images/vueschool/bg-tablet.png);
  }

  #vs .vs-iso {
    display: inline-block;
  }

  #vs .vs-core {
    width: auto;
  }

  #vs .vs-core .vs-slogan-wrapper {
    margin-right: 32px;
  }

  #vs .vs-core .vs-slogan {
    font-size: 16px;
  }

  #vs .vs-core .vs-subline {
    font-size: 16px;
    text-align: left;
  }

  #vs .vs-core {
    margin-right: 40px;
  }

  #vs .vs-core .vs-button {
    font-size: 13px;
    padding: 8px 15px;
  }

  #vs .vs-close {
    right: 20px;
  }
}

@media (min-width: 900px) {
  .vs-background-wrapper {
    background-image: url(/images/vueschool/bg-desktop.png);
  }

  #vs .vs-iso {
    display: none;
  }

  #vs .vs-logo {
    display: block;
  }

  #vs .vs-core {
    margin-right: 0;
  }
}

/********************************************/

.has-top-banner .theme {
  margin-top: 72px;
}

.has-top-banner .theme .nav-bar {
  margin-top: 72px;
}

.has-top-banner .theme .sidebar {
  margin-top: 72px;
}

.has-top-banner .theme .page {
  margin-top: 72px;
}

@media (min-width: 680px) {
  .has-top-banner .theme {
    margin-top: 72px;
  }

  .has-top-banner .theme .nav-bar {
    margin-top: 72px;
  }

  .has-top-banner .theme .sidebar {
    margin-top: 72px;
  }

  .has-top-banner .theme .page {
    margin-top: 72px;
  }
}

</style>
