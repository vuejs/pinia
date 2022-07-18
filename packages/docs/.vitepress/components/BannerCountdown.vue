<template>
  <ClientOnly>
    <VueCountdown
      v-if="remaining"
      :time="remaining"
      v-slot="data">
      <span
        v-for="part in ['days', 'hours', 'minutes', 'seconds']"
        :key="part">
        {{ data[part] }}{{ part[0].toLowerCase() }}
        <span
          v-if="part !== 'seconds'"
          class="px-1 text-xl font-bold">
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

<style scoped>
span {
  color: #ff5338;
  font-weight: bold;
}
</style>