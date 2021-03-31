import { PluginFunction } from 'vue'
import { piniaSymbol } from './rootStore'

export const PiniaPlugin: PluginFunction<void> = function (_Vue) {
  // Equivalent of
  // app.config.globalProperties.$pinia = pinia
  _Vue.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.pinia) {
        options.pinia.Vue = _Vue
        // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/master/src/apis/inject.ts#L25
        /* istanbul ignore else */
        if (!(this as any)._provided) {
          const provideCache = {}
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          })
        }
        ;(this as any)._provided[piniaSymbol as any] = options.pinia

        // propagate the pinia instance in an SSR friendly way
        // avoid adding it to nuxt twice
        if (!this.$pinia) {
          this.$pinia = options.pinia
        }
      } else if (!this.$pinia && options.parent && options.parent.$pinia) {
        this.$pinia = options.parent.$pinia
      }
    },
  })
}
