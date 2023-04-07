import { defineConfig } from 'vitepress'
import { enConfig } from './en'
import { sharedConfig } from './shared'
import { zhConfig } from './zh'
import { ukConfig } from './uk'

export default defineConfig({
  ...sharedConfig,

  locales: {
    root: { label: 'English', lang: 'en-US', link: '/', ...enConfig },
    zh: { label: '简体中文', lang: 'zh-CN', link: '/zh/', ...zhConfig },
    uk: { label: 'Українська', lang: 'uk-UA', link: '/uk/', ...ukConfig },
  },
})
