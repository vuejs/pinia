import Vue from 'vue'
import { createApp } from './main'
import { PiniaSsr, getRootState } from '../../../src'

Vue.use(PiniaSsr)

export default function(context: any) {
  return new Promise(resolve => {
    const { app } = createApp()

    // This `rendered` hook is called when the app has finished rendering
    context.rendered = () => {
      // After the app is rendered, our store is now
      // filled with the state from our components.
      // When we attach the state to the context, and the `template` option
      // is used for the renderer, the state will automatically be
      // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
      context.state = getRootState(context.req)
    }

    resolve(app)
  })
}
