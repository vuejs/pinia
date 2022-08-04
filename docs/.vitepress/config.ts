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
        link: '/guide/getting-started.md',
      },
      {
        text: 'API (모듈별: 번역 준비중)',
        items: [
          {
            text: 'pinia',
            link: '/api/modules/pinia/index.md'
          },
          {
            text: '@pinia/nuxt',
            link: '/api/modules/pinia_nuxt/index.md'
          },
          {
            text: '@pinia/testing',
            link: '/api/modules/pinia_testing/index.md'
          },
        ],
      },
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
              link: '/guide/introduction.md',
            },
            {
              text: '시작하기',
              link: '/guide/getting-started.md',
            },
          ],
        },
        {
          text: '핵심 개념',
          items: [
            { text: 'Store (스토어) 다루기', link: '/guide/core-concepts/' },
            { text: 'State (상태)', link: '/guide/core-concepts/state.md' },
            { text: 'Getters (게터)', link: '/guide/core-concepts/getters.md' },
            { text: 'Actions (액션)', link: '/guide/core-concepts/actions.md' },
            { text: 'Plugins (플러그인)', link: '/guide/core-concepts/plugins.md' },
            {
              text: '컴포넌트 외부의 스토어',
              link: '/guide/core-concepts/outside-component-usage.md',
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
              link: '/guide/ssr/nuxt.md',
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
              link: '/guide/cookbook/migration-vuex.md',
            },
            {
              text: '핫 모듈 교체 (HMR)',
              link: '/guide/cookbook/hot-module-replacement.md',
            },
            {
              text: '테스팅',
              link: '/guide/cookbook/testing.md',
            },
            {
              text: 'setup() 없이 사용하기',
              link: '/guide/cookbook/options-api.md',
            },
            {
              text: '스토어 구성하기',
              link: '/guide/cookbook/composing-stores.md',
            },
          ],
        },
      ],
      '/api/modules/pinia/': [
        {
          text: '',
          items: [
            {
              text: 'Type Aliases',
              link: '/api/modules/pinia/type_aliases'
            },
            {
              text: 'Variables',
              link: '/api/modules/pinia/variables'
            },
            {
              text: 'Functions',
              link: '/api/modules/pinia/functions'
            },
          ]
        },
        {
          text: 'Enumerations',
          items: [
            {
              text: 'MutationType',
              link: '/api/modules/pinia/enums/MutationType'
            },
          ],
        },
        {
          text: 'Interfaces',
          items: [
            {
              text: 'DefineSetupStoreOptions',
              link: '/api/modules/pinia/interfaces/DefineSetupStoreOptions.md'
            },
            {
              text: 'DefineStoreOptions',
              link: '/api/modules/pinia/interfaces/DefineStoreOptions.md'
            },
            {
              text: 'DefineStoreOptionsBase',
              link: '/api/modules/pinia/interfaces/DefineStoreOptionsBase.md'
            },
            {
              text: 'DefineStoreOptionsInPlugin',
              link: '/api/modules/pinia/interfaces/DefineStoreOptionsInPlugin.md'
            },
            {
              text: 'MapStoresCustomization',
              link: '/api/modules/pinia/interfaces/MapStoresCustomization.md'
            },
            {
              text: 'Pinia',
              link: '/api/modules/pinia/interfaces/Pinia.md'
            },
            {
              text: 'PiniaCustomProperties',
              link: '/api/modules/pinia/interfaces/PiniaCustomProperties.md'
            },
            {
              text: 'PiniaCustomStateProperties',
              link: '/api/modules/pinia/interfaces/PiniaCustomStateProperties.md'
            },
            {
              text: 'PiniaPlugin',
              link: '/api/modules/pinia/interfaces/PiniaPlugin.md'
            },
            {
              text: 'PiniaPluginContext',
              link: '/api/modules/pinia/interfaces/PiniaPluginContext.md'
            },
            {
              text: 'StoreDefinition',
              link: '/api/modules/pinia/interfaces/StoreDefinition.md'
            },
            {
              text: 'StoreProperties',
              link: '/api/modules/pinia/interfaces/StoreProperties.md'
            },
            {
              text: 'SubscriptionCallbackMutationDirect',
              link: '/api/modules/pinia/interfaces/SubscriptionCallbackMutationDirect.md'
            },
            {
              text: 'SubscriptionCallbackMutationPatchFunction',
              link: '/api/modules/pinia/interfaces/SubscriptionCallbackMutationPatchFunction.md'
            },
            {
              text: 'SubscriptionCallbackMutationPatchObject',
              link: '/api/modules/pinia/interfaces/SubscriptionCallbackMutationPatchObject.md'
            },
            {
              text: '\_StoreOnActionListenerContext',
              link: '/api/modules/pinia/interfaces/_StoreOnActionListenerContext.md'
            },
            {
              text: '\_StoreWithState',
              link: '/api/modules/pinia/interfaces/_StoreWithState.md'
            },
            {
              text: '\_SubscriptionCallbackMutationBase',
              link: '/api/modules/pinia/interfaces/_SubscriptionCallbackMutationBase.md'
            },
          ],
        },
      ],
      '/api/modules/pinia_nuxt/': [
        {
          text: '',
          items: [
            {
              text: '@pinia/nuxt',
              link: '/api/modules/pinia_nuxt/index.md'
            },
          ]
        },
        {
          text: 'Interfaces',
          items: [
            {
              text: 'ModuleOptions ⚠️(자료없음)',
              link: '/api/modules/pinia_nuxt/interfaces/ModuleOptions.md'
            },
          ]
        },
      ],
      '/api/modules/pinia_testing/': [
        {
          text: '',
          items: [
            {
              text: '@pinia/testing',
              link: '/api/modules/pinia_testing/index.md'
            },
          ]
        },
        {
          text: 'Interfaces',
          items: [
            {
              text: 'TestingOptions',
              link: '/api/modules/pinia_testing/interfaces/TestingOptions.md'
            },
            {
              text: 'TestingPinia',
              link: '/api/modules/pinia_testing/interfaces/TestingPinia.md'
            },
          ]
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
