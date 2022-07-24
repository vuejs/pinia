import { defineConfig, UserConfig } from 'vitepress'

const head: UserConfig['head'] = [
  ['link', { rel: 'icon', href: `/logo.png` }],
]

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  head.push([
    'script',
    {
      src: 'https://unpkg.com/thesemetrics@latest',
      async: '',
    },
  ])
}

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
          text: 'Introduction',
          items: [
            {
              text: 'What is Pinia?',
              link: '/guide/introduction.html',
            },
            {
              text: 'Getting Started',
              link: '/guide/getting-started.html',
            },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Defining a Store', link: '/guide/core-concepts/' },
            { text: 'State', link: '/guide/core-concepts/state.html' },
            { text: 'Getters', link: '/guide/core-concepts/getters.html' },
            { text: 'Actions', link: '/guide/core-concepts/actions.html' },
            { text: 'Plugins', link: '/guide/core-concepts/plugins.html' },
            {
              text: 'Stores outside of components',
              link: '/guide/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Server-Side Rendering (SSR)',
          items: [
            {
              text: 'Vue and Vite',
              link: '/guide/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/guide/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Cookbook',
          items: [
            {
              text: '개요',
              link: '/guide/cookbook/',
            },
            {
              text: 'Migration from Vuex ≤4',
              link: '/guide/cookbook/migration-vuex.html',
            },
            {
              text: 'Hot Module Replacement',
              link: '/guide/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Testing',
              link: '/guide/cookbook/testing.html',
            },
            {
              text: 'Usage without setup()',
              link: '/guide/cookbook/options-api.html',
            },
            {
              text: 'Composing Stores',
              link: '/guide/cookbook/composing-stores.html',
            },
            {
              text: 'Migration from v0/v1 to v2',
              link: '/guide/cookbook/migration-v1-v2.html',
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
