import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://pinia.vuejs.kr'
export const META_TITLE = 'Pinia 🍍'
export const META_DESCRIPTION =
  '직관적이고 타입 안전한 가벼운 그리고 유연한 Vue 스토어'

export const koConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
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
      pattern: 'https://github.com/niceplugin/Vuejs-Pinia-KO/edit/main-korean/docs/:path',
      text: '이 페이지 편집 제안하기'
    },

    nav: [
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: '가이드',
        link: '/core-concepts/',
        activeMatch: '^/core-concepts/',
      },
      { text: 'API', link: '/api/', activeMatch: '^/api/' },
      { text: 'Cookbook', link: '/cookbook/', activeMatch: '^/cookbook/' },
      {
        text: '링크',
        items: [
          {
            text: '토론',
            link: 'https://github.com/vuejs/pinia/discussions',
          },
          {
            text: '변경사항',
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
          text: '소개',
          items: [
            {
              text: '피니아란?',
              link: '/introduction.html',
            },
            {
              text: '시작하기',
              link: '/getting-started.html',
            },
          ],
        },
        {
          text: '핵심 개념',
          items: [
            { text: 'Store (스토어) 다루기', link: '/core-concepts/' },
            { text: 'State (상태)', link: '/core-concepts/state.html' },
            { text: 'Getters (게터)', link: '/core-concepts/getters.html' },
            { text: 'Actions (액션)', link: '/core-concepts/actions.html' },
            { text: 'Plugins (플러그인)', link: '/core-concepts/plugins.html' },
            {
              text: '컴포넌트 외부의 스토어',
              link: '/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: '서버 사이드 렌더링 (SSR)',
          items: [
            {
              text: 'Vue와 Vite',
              link: '/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Cookbook',
          collapsed: false,
          items: [
            {
              text: '개요',
              link: '/cookbook/',
            },
            {
              text: 'Vuex ≤4에서 마이그레이션',
              link: '/cookbook/migration-vuex.html',
            },
            {
              text: '핫 모듈 교체 (HMR)',
              link: '/cookbook/hot-module-replacement.html',
            },
            {
              text: '테스팅',
              link: '/cookbook/testing.html',
            },
            {
              text: 'setup() 없이 사용하는 방법',
              link: '/cookbook/options-api.html',
            },
            {
              text: '스토어 조합하기',
              link: '/cookbook/composing-stores.html',
            },
            {
              text: 'VSCode 스니펫',
              link: '/cookbook/vscode-snippets.html',
            },
            {
              text: 'Vuex에서의 마이그레이션',
              link: '/cookbook/migration-vuex.html',
            },
            {
              text: 'v0/v1에서 v2로의 마이그레이션',
              link: '/cookbook/migration-v1-v2.html',
            },
            {
              text: '컴포저블 다루기',
              link: '/cookbook/composables.html',
            }
          ],
        },
      ],
    },
  },
}