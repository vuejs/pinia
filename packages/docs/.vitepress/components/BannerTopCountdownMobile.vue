<template>
  <ClientOnly>
    <VueCountdown
      v-if="remaining && remaining > 0"
      :time="remaining"
      :transform="countdownTransformDaysToHours"
      v-slot="data"
      class="vs-countdown-mobile-wrapper"
      :style="{ color }">
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

export default {
  components: {
    VueCountdown
  },
  props: {
    remaining: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#ff2556'
    },
    countdownTransformDaysToHours: {
      type: Function,
      required: true
    }
  }
}
</script>

<style>
.vs-countdown-mobile-wrapper {
  font-family: 'Roboto', sans-serif;
  display: block;
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
