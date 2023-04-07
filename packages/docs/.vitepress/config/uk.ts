import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://pinia.vuejs.org'
export const META_TITLE = 'Pinia 🍍'
export const META_DESCRIPTION =
  'Інтуїтивне, з безпечною типізацією, легке та гнучке сховище для Vue'

export const ukConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
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
      pattern: 'https://github.com/vuejs/pinia/edit/v2/packages/docs/:path',
      text: 'Запропонувати зміни на цій сторінці',
    },

    nav: [
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: 'Гід',
        link: '/core-concepts/',
        activeMatch: '^/core-concepts/',
      },
      { text: 'API', link: '/api/', activeMatch: '^/api/' },
      { text: 'Рецепти', link: '/cookbook/', activeMatch: '^/cookbook/' },
      {
        text: 'Посилання',
        items: [
          {
            text: 'Обговорення',
            link: 'https://github.com/vuejs/pinia/discussions',
          },
          {
            text: 'Журнал змін',
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
          text: 'Вступ',
          items: [
            {
              text: 'Що таке Pinia?',
              link: '/introduction.html',
            },
            {
              text: 'Початок',
              link: '/getting-started.html',
            },
          ],
        },
        {
          text: 'Основні концепції',
          items: [
            { text: 'Визначення сховища', link: '/core-concepts/' },
            { text: 'Стан', link: '/core-concepts/state.html' },
            { text: 'Гетери', link: '/core-concepts/getters.html' },
            { text: 'Дії', link: '/core-concepts/actions.html' },
            { text: 'Плагіни', link: '/core-concepts/plugins.html' },
            {
              text: 'Сховища поза компонентами',
              link: '/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Рендеринг на стороні серверу (SSR)',
          items: [
            {
              text: 'Vue і Vite',
              link: '/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Рецепти',
          collapsible: true,
          collapsed: false,
          items: [
            {
              text: 'Індекс',
              link: '/cookbook/',
            },
            {
              text: 'Міграція з Vuex ≤4',
              link: '/cookbook/migration-vuex.html',
            },
            {
              text: 'Гаряча заміна модулів',
              link: '/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Тестування',
              link: '/cookbook/testing.html',
            },
            {
              text: 'Використання без setup()',
              link: '/cookbook/options-api.html',
            },
            {
              text: 'Компонування сховищ',
              link: '/cookbook/composing-stores.html',
            },
            {
              text: 'Міграція з v0/v1 до v2',
              link: '/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Робота з копмозиційними функціями',
              link: '/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
