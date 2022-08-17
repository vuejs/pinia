<template>
  <a
    v-if="isVisible"
    id="vs"
    href="https://vuejsforge.com/?friend=vuerouter&utm_source=pinia&utm_medium=website&utm_campaign=affiliate&utm_content=top_banner"
    target="_blank"
    rel="noreferrer">
    <div class="vs-iso">
      <img src="/images/vueschool/vf-iso.svg" alt="Vue Forge Logo">
    </div>
    <div class="vs-logo">
      <img src="/images/vueschool/vf-logo.svg" alt="Vue Forge Logo">
    </div>
    <div class="vs-core">
      <div class="vs-slogan-wrapper">
        <div class="vs-slogan">
          Join the 2nd edition of the largest hands-on Vue.js Event
        </div>
        <div class="vs-subline">
          Starts 30 Aug. Build your own e-commerce app!
        </div>
      </div>
      <div class="vs-button">
        JOIN FOR FREE
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
export default {
  data () {
    return {
      isVisible: false,
      remaining: 0
    }
  },
  mounted () {
    const now = new Date()
    const end = new Date('2022-09-01T00:00:00+02:00')
    this.remaining = end - now
    this.isVisible = !localStorage.getItem('VF2') && this.remaining > 0
    if (this.isVisible) document.body.classList.add('has-top-banner')
  },
  methods: {
    close () {
      this.isVisible = false
      document.body.classList.remove('has-top-banner')
      localStorage.setItem('VF2', 1)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

#vs {
  align-items: center;
  background-color: #0A1124;
  box-sizing: border-box;
  color: #fff;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  justify-content: center;
  position: fixed;
  padding: 0 10px;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  height: 72px;
  display: flex;
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

#vs .vs-iso {
  position: absolute;
  left: 10px;
  height: 28px;
}

#vs .vs-iso img {
  height: 28px;
}

#vs .vs-logo {
  position: absolute;
  display: none;
  left: 40px;
}

#vs .vs-core {
  display: flex;
  align-items: center;
  width: 288px;
}

#vs .vs-core .vs-slogan {
  color: #FFF;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}

#vs .vs-core .vs-slogan-wrapper .vs-subline {
  color: #cfc1e3;
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
  #vs {
    background-image: url(/images/vueschool/bg-tablet.png);
  }

  #vs .vs-iso {
    display: inline-block;
  }

  #vs .vs-core {
    width: auto;
  }

  #vs .vs-core .vs-slogan-wrapper {
    margin-right: 26px;
  }

  #vs .vs-core .vs-slogan {
    font-size: 16px;
  }

  #vs .vs-core .vs-slogan-wrapper .vs-subline {
    font-size: 16px;
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
  #vs {
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
