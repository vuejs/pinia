import Theme from 'vitepress/theme'
import { Layout } from './Layout'
import './custom.css'
import './code-theme.css'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,
}

export default config
