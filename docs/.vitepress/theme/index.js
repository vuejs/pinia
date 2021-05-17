import Theme from 'vitepress/theme'
import './custom.css'
import './code-theme.css'
// import { createPinia } from '../../../src'

const { Layout } = Theme

const existingMounted = Layout.mounted || (() => {})

Layout.mounted = function () {
  existingMounted.call(this)

  const storedTheme = localStorage.getItem('pinia-color-scheme')
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')

  if (mediaQuery.matches || storedTheme === 'light') {
    const htmlElement = document.body.parentElement
    htmlElement.classList.add('light')
  }
}

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,
  enhanceApp({ app }) {
    // app.use(createPinia())
  },
}

export default config
