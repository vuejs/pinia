import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://pinia.vuejs.org'
export const META_TITLE = 'Pinia 🍍'
export const META_DESCRIPTION =
  'Интуитивное, типобезопасное, легковесное и гибкое хранилище для Vue'

export const ruConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ['meta', { property: 'og:url', content: META_URL }],
    ['meta', { property: 'og:description', content: META_DESCRIPTION }],
    ['meta', { property: 'twitter:url', content: META_URL }],
    ['meta', { property: 'twitter:title', content: META_TITLE }],
    ['meta', { property: 'twitter:description', content: META_DESCRIPTION }],
  ],

  themeConfig: {
    editLink: {
      pattern:
        'https://github.com/translation-ru/pinia/edit/v2/packages/docs/:path',
      text: 'Предложить изменения к этой странице',
    },

    nav: [
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: 'Руководство',
        link: '/core-concepts/',
        activeMatch: '^/core-concepts/',
      },
      { text: 'API', link: '/api/', activeMatch: '^/api/' },
      {
        text: 'Книга рецептов',
        link: '/cookbook/',
        activeMatch: '^/cookbook/',
      },
      {
        text: 'Ссылки',
        items: [
          {
            text: 'Обсуждения',
            link: 'https://github.com/vuejs/pinia/discussions',
          },
          {
            text: 'Список изменений',
            link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
          },
          {
            text: 'Сертификация по Vue.js',
            link: 'https://certification.vuejs.org/?friend=VUEROUTER',
          },
        ],
      },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'packages',
          items: [
            { text: 'pinia', link: '/api/modules/pinia.html' },
            { text: '@pinia/nuxt', link: '/api/modules/pinia_nuxt.html' },
            {
              text: '@pinia/testing',
              link: '/api/modules/pinia_testing.html',
            },
          ],
        },
      ],
      // catch-all fallback
      '/': [
        {
          text: 'Введение',
          items: [
            {
              text: 'Что такое Pinia?',
              link: '/introduction.html',
            },
            {
              text: 'Начало работы',
              link: '/getting-started.html',
            },
          ],
        },
        {
          text: 'Основные концепции',
          items: [
            { text: 'Определение хранилища', link: '/core-concepts/' },
            { text: 'Состояние', link: '/core-concepts/state.html' },
            { text: 'Геттеры', link: '/core-concepts/getters.html' },
            { text: 'Действия', link: '/core-concepts/actions.html' },
            { text: 'Плагины', link: '/core-concepts/plugins.html' },
            {
              text: 'Хранилища за пределами компонентов',
              link: '/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Рендеринг на стороне сервера (SSR)',
          items: [
            {
              text: 'Vue и Vite',
              link: '/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Книга рецептов',
          collapsed: false,
          items: [
            {
              text: 'Главная',
              link: '/cookbook/',
            },
            {
              text: 'Миграция с Vuex ≤4',
              link: '/cookbook/migration-vuex.html',
            },
            {
              text: 'Hot Module Replacement',
              link: '/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Тестирование',
              link: '/cookbook/testing.html',
            },
            {
              text: 'Использование без setup()',
              link: '/cookbook/options-api.html',
            },
            {
              text: 'Композиция хранилищ',
              link: '/cookbook/composing-stores.html',
            },
            {
              text: 'Сниппеты VSCode',
              link: '/cookbook/vscode-snippets.html',
            },
            {
              text: 'Миграция с v0/v1 до v2',
              link: '/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Работа с composables',
              link: '/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
