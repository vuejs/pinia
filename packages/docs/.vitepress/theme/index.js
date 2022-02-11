import Theme from 'vitepress/theme'
import VueSchoolLink from '../components/VueSchoolLink.vue'
import { Layout } from './Layout'
import './custom.css'
import './code-theme.css'
// import { createPinia } from '../../../pinia'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,

  enhanceApp({ app }) {
    app.component('VueSchoolLink', VueSchoolLink)
  },
}

export default config
