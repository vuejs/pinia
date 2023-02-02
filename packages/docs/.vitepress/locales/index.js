import en from './en.js'
import zh from './zh.js'
import ja from './ja'

export default {
  vitepressConfig: {
    '/': en.vitepressConfig,
    '/zh/': zh.vitepressConfig,
    '/ja/': ja.vitepressConfig,
  },
  themeConfig: {
    '/': en.themeConfig,
    '/zh/': zh.themeConfig,
    '/ja/': ja.themeConfig,
  },
}
