import Vue from 'vue'
// import VueCompositionApi from '@vue/composition-api'
import App from './App'
import { useStore } from './store'
import { setActiveReq } from '../../../src'

// Done in setup.ts
// Vue.use(VueCompositionApi)

export function createApp() {
  // create router and store instances
  setActiveReq({})
  const store = useStore()

  store.state.counter++

  // create the app instance, injecting both the router and the store
  const app = new Vue({
    render: h => h(App),
  })

  // expose the app, the router and the store.
  return { app, store }
}
