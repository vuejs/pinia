<template>
  <ClientOnly>
    <VueCountdown
      v-if="remaining && remaining > 0"
      :time="remaining"
      :transform="countdownTransformDaysToHours"
      v-slot="data"
      class="vs-countdown-wrapper"
      :style="{ color }">
      <div
        v-for="part in ['days', 'hours', 'minutes', 'seconds'].filter(part => part !== 'days' || data[part] !== '00')"
        :key="part"
        class="vs-countdown-item">
        <div
          class="vs-countdown-part"
          :style="{ background }">
          <div class="vs-countdown-number">
            {{ data[part] }}
          </div>
          <div class="vs-countdown-text">
            {{ part }}
          </div>
        </div>
        <div
          v-if="part !== 'seconds'"
          class="vs-countdown-colon">
          :
        </div>
      </div>
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
    background: {
      type: String,
      default: 'rgba(255, 37, 86, 0.25)'
    },
    countdownTransformDaysToHours: {
      type: Function,
      required: true
    }
  }
}
</script>

<style>
.vs-countdown-wrapper {
  font-family: 'Roboto', sans-serif;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
  line-height: 1;
  display: none;
}

.vs-countdown-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vs-countdown-wrapper .vs-countdown-part {
  border-radius: 2px;
  padding: 4px 0;
  text-align: center;
  width: 42px;
}

.vs-countdown-wrapper .vs-countdown-part .vs-countdown-number {
  font-size: 28px;
  font-weight: 500;
  line-height: 28px;
}

.vs-countdown-wrapper .vs-countdown-part .vs-countdown-text {
  font-size: 8px;
  text-transform: uppercase;
}

.vs-countdown-colon {
  font-weight: bold;
}

@media (min-width: 680px) {
  .vs-countdown-wrapper {
    display: flex;
  }
}
</style>
