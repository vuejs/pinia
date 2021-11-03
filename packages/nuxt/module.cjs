'use strict';

const kit = require('@nuxt/kit');
const vueDemi = require('vue-demi');

const module$1 = kit.defineNuxtModule({
  name: "pinia",
  configKey: "pinia",
  defaults: {
    disableVuex: true
  },
  setup(options, nuxt) {
    if (nuxt.options.features && options.disableVuex) {
      nuxt.options.features.store = false;
    }
    nuxt.options.alias.pinia = "pinia/dist/pinia.mjs";
    kit.addPlugin({ src: require.resolve("./templates/plugin.mjs") });
    if (vueDemi.isVue2 && !nuxt.options.build.transpile.includes("pinia")) {
      nuxt.options.build.transpile.push("pinia");
    }
  }
});

module.exports = module$1;
