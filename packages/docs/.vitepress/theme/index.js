import Theme from 'vitepress/theme'
import VueSchoolLink from '../components/VueSchoolLink.vue'
import VueMasteryLogoLink from '../components/VueMasteryLogoLink.vue'
import { Layout } from './Layout'
import './custom.css'
import './code-theme.css'
// import { createPinia } from 'pinia'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,

  enhanceApp({ app }) {
    // app.use(createPinia())
    app.component('VueSchoolLink', VueSchoolLink)
    app.component('VueMasteryLogoLink', VueMasteryLogoLink)
  },
}

export default config
