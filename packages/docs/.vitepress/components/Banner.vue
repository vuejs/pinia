<template>
  <a
    v-if="isVisible"
    id="vs"
    href="https://vueschool.io/free-weekend?friend=vuerouter&utm_source=vuerouter&utm_medium=website&utm_campaign=affiliate&utm_content=top_banner"
    target="_blank"
    rel="noreferrer">
    <div
      class="vs-background-wrapper">
      <div class="vs-logo">
        <img src="/images/vueschool/vs-iso.svg" class="logo-small">
        <img src="/images/vueschool/vs-logo.svg" class="logo-big">
      </div>
      <div class="vs-core">
        <div class="vs-slogan-wrapper">
          <div class="vs-slogan">
            Free Weekend 1st & 2nd of October
          </div>
          <div class="vs-subline">
            Get Access to ALL Vue School premium courses
          </div>
        </div>
        <div class="vs-button-wrapper">
          <div class="vs-button">
            Book my spot
          </div>
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
export default {
  data () {
    return {
      isVisible: false,
      isActive: null,
      remaining: 0
    }
  },
  mounted () {
    const now = new Date()
    const end = new Date('2022-10-07T00:00:00+02:00')
    this.isActive = now < end
    this.remaining = end - now
    this.isVisible = !localStorage.getItem('VS_FREE_WEEKEND') && this.remaining > 0
    if (this.isVisible) document.body.classList.add('has-top-banner')
  },
  methods: {
    close () {
      this.isVisible = false
      document.body.classList.remove('has-top-banner')
      localStorage.setItem('VS_FREE_WEEKEND', 1)
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
  background: linear-gradient(to left, #161a35, #283065);
}

#vs .vs-background-wrapper {
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
  background-image: linear-gradient(to bottom, #5ccc45, #419E2D), linear-gradient(to bottom, #388f26, #50b83b);
}

#vs .vs-logo {
  position: absolute;
  left: 10px;
}

#vs .vs-logo .logo-big {
  display: none;
}

#vs .vs-core {
  display: flex;
  align-items: center;
  width: 288px;
}

#vs .vs-core .vs-slogan-wrapper {
  text-align: center;
  width: 170px;
  margin: 0 auto;
}

#vs .vs-core .vs-slogan {
  color: #fff;
  font-weight: bold;
  font-size: 10px;
}

#vs .vs-core .vs-subline {
  color: #c6cdf7;
  font-size: 10px;
  margin-top: 4px;
}

#vs .vs-core .vs-button-wrapper {
  padding: 2px;
  background-image: linear-gradient(to bottom, #388f26, #50b83b);
  border-radius: 60px;
  overflow: hidden;
}

#vs .vs-core .vs-button {
  border-radius: 60px;
  color: #FFF;
  padding: 8px 6px;
  background-image: linear-gradient(to bottom, #5ccc45, #368c24), linear-gradient(to bottom, #388f26, #50b83b);
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.3px;
  white-space: nowrap;
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
  #vs .vs-background-wrapper {
    background-image: url(/images/vueschool/bg-tablet.svg);
  }

  #vs .vs-logo {
    left: 20px;
  }

  #vs .vs-logo .logo-small {
    display: none;
  }

  #vs .vs-logo .logo-big {
    display: inline-block;
    width: 90px;
  }

  #vs .vs-core {
    width: auto;
    margin-right: -60px;
  }

  #vs .vs-core .vs-slogan-wrapper {
    margin: 0 12px 0 0;
    width: auto;
  }

  #vs .vs-core .vs-slogan {
    font-size: 16px;
  }

  #vs .vs-core .vs-subline {
    font-size: 15px;
    text-align: left;
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
  #vs .vs-background-wrapper {
    background-image: url(/images/vueschool/bg-desktop.svg);
    background-position: top right -300px;
  }

  #vs .vs-logo .logo-big {
    display: inline-block;
    width: auto;
  }

  #vs .vs-core {
    margin-right: 0;
  }
}

@media (min-width: 1280px) {
  #vs .vs-background-wrapper {
    background-position: top right;
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
</style>
