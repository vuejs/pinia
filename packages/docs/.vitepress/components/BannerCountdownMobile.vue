<template>
  <ClientOnly>
    <VueCountdown
      v-if="remaining"
      :time="remaining"
      v-slot="data"
      class="vs-countdown-mobile-wrapper">
      <span
        v-for="part in ['days', 'hours', 'minutes', 'seconds']"
        :key="part">
        {{ data[part] }}{{ part[0].toLowerCase() }}
        <span
          v-if="part !== 'seconds'">
          :
        </span>
      </span>
    </VueCountdown>
  </ClientOnly>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'

const countdownTransform = (props) => {
  Object.entries(props).forEach(([key, value]) => {
    const digits = value < 10 ? `0${value}` : value
    props[key] = digits
  })
  return props
}

export default {
  components: {
    VueCountdown
  },
  props: {
    remaining: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isVisible () {
      return this.remaining > 0
    }
  }
}
</script>

<style>
.vs-countdown-mobile-wrapper {
  display: block;
  color: #40f98a;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

@media (min-width: 680px) {
  .vs-countdown-mobile-wrapper {
    display: none;
  }
}
</style>