import { defineConfig } from 'vitepress'
import { enConfig } from './en'
import { sharedConfig } from './shared'
import { ruConfig } from './ru'

export default defineConfig({
  ...sharedConfig,

  locales: {
    root: { label: 'Русский', lang: 'ru', link: '/', ...ruConfig },
  },
})
