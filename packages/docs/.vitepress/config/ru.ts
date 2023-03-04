import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://pinia.vuejs.org'
export const META_TITLE = 'Pinia 🍍'
export const META_DESCRIPTION =
  'Интуитивно понятная, безопасная, легкая и гибкая библиотека управления состояниями для Vue'

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
    outlineTitle: 'На этой странице',
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема',
    lastUpdatedText: 'Последнее обновление',
    editLink: {
      pattern: 'https://github.com/vuejs/pinia/edit/v2/packages/docs/:path',
      text: 'Предложить изменения на этой странице',
    },

    nav: [
      // { text: 'Config', link: '/ru/config/' },
      // { text: 'Plugins', link: '/ru/plugins/' },
      {
        text: 'Руководство',
        link: '/ru/core-concepts/',
        activeMatch: '^/core-concepts/',
      },
      { text: 'API', link: '/ru/api/', activeMatch: '^/api/' },
      {
        text: 'Книга рецептов',
        link: '/ru/cookbook/',
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
            text: 'Changelog',
            link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
          },
        ],
      },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'packages',
          items: [
            { text: 'pinia', link: '/ru/api/modules/pinia.html' },
            {
              text: '@pinia/nuxt',
              link: '/ru/api/modules/pinia_nuxt.html',
            },
            {
              text: '@pinia/testing',
              link: '/ru/api/modules/pinia_testing.html',
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
              link: '/ru/introduction.html',
            },
            {
              text: 'Начало работы',
              link: '/ru/getting-started.html',
            },
          ],
        },
        {
          text: 'Основные концепции',
          items: [
            {
              text: 'Определение хранилища',
              link: '/ru/core-concepts/',
            },
            {
              text: 'Состояние',
              link: '/ru/core-concepts/state.html',
            },
            {
              text: 'Геттеры',
              link: '/ru/core-concepts/getters.html',
            },
            {
              text: 'Экшены',
              link: '/ru/core-concepts/actions.html',
            },
            {
              text: 'Плагины',
              link: '/ru/core-concepts/plugins.html',
            },
            {
              text: 'Использование вне компонента',
              link: '/ru/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Рендеринг на стороне сервера (SSR)',
          items: [
            {
              text: 'Vue и Vite',
              link: '/ru/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ru/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Книга рецептов',
          collapsible: true,
          collapsed: false,
          items: [
            {
              text: 'Главная',
              link: '/ru/cookbook/',
            },
            {
              text: 'Миграция с Vuex ≤4',
              link: '/ru/cookbook/migration-vuex.html',
            },
            {
              text: 'Горячая замена модулей',
              link: '/ru/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Тестирование',
              link: '/ru/cookbook/testing.html',
            },
            {
              text: 'Options API',
              link: '/ru/cookbook/options-api.html',
            },
            {
              text: 'Composables хранилища',
              link: '/ru/cookbook/composing-stores.html',
            },
            {
              text: 'Миграция с v0/v1 на v2',
              link: '/ru/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Работа с composables',
              link: '/ru/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
