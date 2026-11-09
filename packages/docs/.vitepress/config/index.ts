import { defineConfig } from 'vitepress'
import { enConfig } from './en'
import { sharedConfig } from './shared'
import { zhConfig } from './zh'

export default defineConfig({
  ...sharedConfig,

  locales: {
    root: { label: 'English', lang: 'en-US', link: '/', ...enConfig },
    zh: { label: '简体中文', lang: 'zh-CN', link: '/zh/', ...zhConfig },
    es: {
      label: 'Español',
      lang: 'es-ES',
      link: 'https://es-pinia.vercel.app/',
    },
    pt: {
      label: 'Português',
      lang: 'pt-PT',
      link: 'https://pinia-docs-pt.netlify.app/',
    },
    uk: {
      label: 'Українська',
      lang: 'uk-UA',
      link: 'https://pinia-ua.netlify.app',
    },
    ru: {
      label: 'Русский',
      lang: 'ru-RU',
      link: 'https://pinia-ru.netlify.app',
    },
  },
})
