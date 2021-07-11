<template>
  <h3>{{ name }} Sponsors</h3>

  <p>
    <a
      v-for="sponsor in list"
      :key="sponsor.href"
      :href="sponsor.href"
      :title="sponsor.alt"
      target="_blank"
      rel="sponsored noopener"
      :style="{ width: size + 'px' }"
      class="sponsor_wrapper"
      :class="
        isDark && sponsor.imgSrcLight === sponsor.imgSrcDark && 'apply-bg'
      "
    >
      <img
        :src="sponsor.imgSrc"
        :class="
          isDark &&
          sponsor.imgSrcLight === sponsor.imgSrcDark &&
          'invert-colors'
        "
        :alt="sponsor.alt"
        :style="{ width: size + 'px' }"
      />
    </a>
  </p>
</template>

<script setup lang="ts">
import sponsors from './sponsors.json'
import { isDark } from '../theme/dark-theme'
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  name: {
    type: String as PropType<'gold' | 'platinum' | 'silver' | 'bronze'>,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 140,
  },
})

const list = computed(() =>
  sponsors[props.name.toLowerCase()].map((sponsor) => ({
    ...sponsor,
    imgSrc: isDark.value ? sponsor.imgSrcDark : sponsor.imgSrcLight,
  }))
)
</script>

<style scoped>
.sponsor_wrapper {
  padding: 5px;
  margin: 0 3px;

  border-radius: 5px;

  width: 100px;
  display: inline-block;
  text-decoration: none;
  vertical-align: middle;

  transition: background-color 300ms ease-in-out;
}

p {
  margin: 0;
}

h3 {
  margin: 0 0 10px;
}

img {
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.66;
}

html:not(.light) img.invert-colors {
  filter: invert(1) grayscale(100%);
  background-color: transparent;
}

.sponsor_wrapper.apply-bg:hover {
  background-color: var(--c-text);
}

.sponsor_wrapper:hover img {
  filter: none !important;
  opacity: 1;
}
</style>
