import defaultTheme from 'vitepress/theme'
import './styles/vars.css'
import Wip from '../components/Wip.vue'

export default {
  ...defaultTheme,
  enhanceApp({ app }) {
    app.component('TranslateWip', Wip)
  }
}