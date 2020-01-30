import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

beforeAll(() => {
  Vue.use(VueCompositionAPI as any)
})
