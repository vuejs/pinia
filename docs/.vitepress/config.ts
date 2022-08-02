import { defineConfig, UserConfig } from 'vitepress'

const head: UserConfig['head'] = [
  ['link', { rel: 'icon', href: `/logo.png` }],
]

const config = defineConfig({
  markdown: {
    attrs: {
      leftDelimiter: '%{',
      rightDelimiter: '}%',
    },
  },

  lang: 'ko',
  title: 'Pinia',
  description: 'Vue.js 공식 Store',
  head,
  // serviceWorker: true,

  lastUpdated: true,

  themeConfig: {
    logo: '/logo.png',

    editLink: {
      pattern: 'https://github.com/niceplugin/Vuejs-Pinia-KO/edit/main-korean/docs/:path',
      text: '이 페이지 편집 제안하기'
    },

    lastUpdatedText: '마지막 수정일',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/niceplugin/Vuejs-Pinia-KO' },
      { icon: 'slack', link: 'https://vuejs-korea.slack.com/' }
    ],

    // carbonAds: {
    //   carbon: 'CEBICK3I',
    //   custom: 'CEBICK3M',
    //   placement: 'routervuejsorg',
    // },

    // algolia: {
    //   appId: 'BTNTW3I1XP',
    //   apiKey: '771d10c8c5cc48f7922f15048b4d931c',
    //   indexName: 'next_router_vuejs',
    //   // searchParameters: {
    //   //   facetFilters: ['tags:guide,api,migration'],
    //   // },
    // },

    nav: [
      {
        text: '가이드',
        link: '/guide/getting-started.html',
      },
      {
        text: 'API (공식 페이지로 이동)',
        link: 'https://pinia.vuejs.org/api/',
      },
      // {
      //   text: 'API 참고서',
      //   items: [
      //     {
      //       text: '@pinia/nuxt',
      //       link: '/api/modules/pinia_nuxt.html'
      //     },
      //     {
      //       text: '@pinia/testing',
      //       link: '/api/modules/pinia_testing.html'
      //     },
      //     {
      //       text: 'pinia',
      //       link: '/api/modules/pinia.html'
      //     },
      //   ],
      // },
      {
        text: '변경사항',
        link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '소개',
          items: [
            {
              text: '피니아란?',
              link: '/guide/introduction.html',
            },
            {
              text: '시작하기',
              link: '/guide/getting-started.html',
            },
          ],
        },
        {
          text: '핵심 개념',
          items: [
            { text: 'Store (스토어) 다루기', link: '/guide/core-concepts/' },
            { text: 'State (상태)', link: '/guide/core-concepts/state.html' },
            { text: 'Getters (게터)', link: '/guide/core-concepts/getters.html' },
            { text: 'Actions (액션)', link: '/guide/core-concepts/actions.html' },
            { text: 'Plugins (플러그인)', link: '/guide/core-concepts/plugins.html' },
            {
              text: '컴포넌트 외부의 스토어',
              link: '/guide/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: '서버 사이드 렌더링 (SSR)',
          items: [
            {
              text: 'Vue와 Vite',
              link: '/guide/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/guide/ssr/nuxt.html',
            },
            {
              text: '컴포저블 다루기',
              link: '/guide/cookbook/composables.html#ssr',
            },
          ],
        },
        {
          text: '자세한 해설서',
          items: [
            {
              text: '개요',
              link: '/guide/cookbook/',
            },
            {
              text: 'Vuex ≤4에서 마이그레이션',
              link: '/guide/cookbook/migration-vuex.html',
            },
            {
              text: '핫 모듈 교체 (HMR)',
              link: '/guide/cookbook/hot-module-replacement.html',
            },
            {
              text: '테스팅 (번역중)',
              link: '/guide/cookbook/testing.html',
            },
            {
              text: 'setup() 없이 사용하기',
              link: '/guide/cookbook/options-api.html',
            },
            {
              text: '스토어 구성하기',
              link: '/guide/cookbook/composing-stores.html',
            },
          ],
        },
      ]
    },

    footer: {
      message: 'Translated by pinia.vuejs.kr',
      copyright: 'MIT Licensed | Copyright © 2019-present Eduardo San Martin Morote'
    },
  },
})

export default config
