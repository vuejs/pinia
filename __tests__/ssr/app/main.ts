import Vue from 'vue'
// import VueCompositionApi from '@vue/composition-api'
import App from './App'

// Done in setup.ts
// Vue.use(VueCompositionApi)

export function createApp() {
  // create the app instance, injecting both the router and the store
  const app = new Vue({
    // @ts-ignore
    render: (h) => h(App),
  })

  // expose the app, the router and the store.
  return { app }
}
