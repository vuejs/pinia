<template>
  <h3>{{ name }} Sponsors</h3>

  <a
    v-for="sponsor in list"
    :key="sponsor.href"
    :href="sponsor.href"
    :title="sponsor.alt"
    target="_blank"
    rel="sponsored noopener"
    :style="{ width: size + 'px' }"
    class="sponsor_wrapper"
  >
    <img
      :src="sponsor.imgSrcLight"
      :alt="sponsor.alt"
      :style="{ width: size + 'px' }"
    />
  </a>
  <br />
  <br />
</template>

<script>
import sponsors from './sponsors.json'

export default {
  name: 'HomeSponsorsGroup',

  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 140,
    },
  },

  computed: {
    list() {
      return sponsors[this.name.toLowerCase()]
    },
  },
}
</script>

<style scoped>
.sponsor_wrapper {
  padding: 5px;
  margin: 0 3px;

  width: 100px;
  display: inline-block;
  text-decoration: none;
  vertical-align: middle;

  transition: background-color 300ms ease-in-out;
}

h3 {
  margin: 0 0 10px;
}

img {
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.66;
}

html:not(.light) img {
  filter: invert(1) grayscale(100%);
}

img:hover {
  filter: none !important;
  opacity: 1;
}
</style>
