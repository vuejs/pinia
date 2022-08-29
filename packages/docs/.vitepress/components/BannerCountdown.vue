<template>
  <ClientOnly>
    <VueCountdown
      v-if="remaining"
      :time="remaining"
      :transform="countdownTransform"
      v-slot="data"
      class="vs-countdown-wrapper">
      <div
        v-for="part in ['days', 'hours', 'minutes', 'seconds'].filter(part => part !== 'days' || data[part] !== '00')"
        :key="part"
        class="vs-countdown-item">
        <div
          class="vs-countdown-part">
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
  },
  methods: {
    countdownTransform
  }
}
</script>

<style>
.vs-countdown-wrapper {
  align-items: center;
  gap: 4px;
  margin-right: 32px;
  line-height: 1;
  display: none;
}

.vs-countdown-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vs-countdown-wrapper .vs-countdown-part {
  background: rgba(68, 249, 137, 0.5);
  border-radius: 2px;
  padding: 4px 0;
  color: #44F989;
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
  color: #44F989;
  font-weight: bold;
}

@media (min-width: 680px) {
  .vs-countdown-wrapper {
    display: flex;
  }
}
</style>