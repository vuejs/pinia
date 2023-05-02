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

    outline: {
      label: 'На цій сторінці',
    },

    docFooter: {
      prev: 'Попередня сторінка',
      next: 'Наступна сторінка',
    },

    nav: [
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: 'Гід',
        link: '/uk/core-concepts/',
        activeMatch: '^/uk/core-concepts/',
      },
      { text: 'API', link: '/uk/api/', activeMatch: '^/uk/api/' },
      { text: 'Рецепти', link: '/uk/cookbook/', activeMatch: '^/uk/cookbook/' },
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
      '/uk/api/': [
        {
          text: 'packages',
          items: [
            { text: 'pinia', link: '/uk/api/modules/pinia.html' },
            { text: '@pinia/nuxt', link: '/uk/api/modules/pinia_nuxt.html' },
            {
              text: '@pinia/testing',
              link: '/uk/api/modules/pinia_testing.html',
            },
          ],
        },
      ],
      // catch-all fallback
      '/uk/': [
        {
          text: 'Вступ',
          items: [
            {
              text: 'Що таке Pinia?',
              link: '/uk/introduction.html',
            },
            {
              text: 'Початок',
              link: '/uk/getting-started.html',
            },
          ],
        },
        {
          text: 'Основні концепції',
          items: [
            { text: 'Визначення сховища', link: '/uk/core-concepts/' },
            { text: 'Стан', link: '/uk/core-concepts/state.html' },
            { text: 'Гетери', link: '/uk/core-concepts/getters.html' },
            { text: 'Дії', link: '/uk/core-concepts/actions.html' },
            { text: 'Плагіни', link: '/uk/core-concepts/plugins.html' },
            {
              text: 'Сховища поза компонентами',
              link: '/uk/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Рендеринг на стороні серверу (SSR)',
          items: [
            {
              text: 'Vue і Vite',
              link: '/uk/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/uk/ssr/nuxt.html',
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
              link: '/uk/cookbook/',
            },
            {
              text: 'Міграція з Vuex ≤4',
              link: '/uk/cookbook/migration-vuex.html',
            },
            {
              text: 'Гаряча заміна модулів',
              link: '/uk/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Тестування',
              link: '/uk/cookbook/testing.html',
            },
            {
              text: 'Використання без setup()',
              link: '/uk/cookbook/options-api.html',
            },
            {
              text: 'Компонування сховищ',
              link: '/uk/cookbook/composing-stores.html',
            },
            {
              text: 'Міграція з v0/v1 до v2',
              link: '/uk/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Робота з композиційними функціями',
              link: '/uk/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
