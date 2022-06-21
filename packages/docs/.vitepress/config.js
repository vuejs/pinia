// @ts-check

const META_URL = 'https://pinia.vuejs.org'
const META_TITLE = 'Pinia 🍍'
const META_DESCRIPTION =
  'Intuitive, type safe, light and flexible Store for Vue'
const META_IMAGE = 'https://pinia.vuejs.org/social.png'

const isProduction = process.env.NODE_ENV

/**
 * @type {import('vitepress').UserConfig['head']}
 */
const productionHead = [
  [
    'script',
    {
      src: 'https://unpkg.com/thesemetrics@latest',
      async: '',
      type: 'text/javascript',
    },
  ],
]

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Pinia',
  lang: 'en-US',
  description: 'The Vue Store that you will enjoy using',
  locales: {
    '/': {
      title: 'Pinia',
      lang: 'en-US',
      description: 'The Vue Store that you will enjoy using',
    },
    '/kr/': {
      lang: 'ko-KR',
      title: 'Pinia',
      description: '值得你喜欢的 Vue Store',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],

    [
      'meta',
      { name: 'wwads-cn-verify', content: '5878a7ab84fb43402106c575658472fa' },
    ],

    [
      'meta',
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    [
      'meta',
      {
        property: 'og:url',
        content: META_URL,
      },
    ],
    [
      'meta',
      {
        property: 'og:title',
        content: META_TITLE,
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content: META_DESCRIPTION,
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: META_IMAGE,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:url',
        content: META_URL,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:title',
        content: META_TITLE,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:description',
        content: META_DESCRIPTION,
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image',
        content: META_IMAGE,
      },
    ],

    [
      'link',
      {
        rel: 'preload',
        href: '/dank-mono.css',
        as: 'style',
        onload: "this.onload=null;this.rel='stylesheet'",
      },
    ],

    ...(isProduction ? productionHead : []),
  ],

  themeConfig: {
    repo: 'vuejs/pinia',
    logo: '/logo.svg',
    docsDir: 'packages/docs',
    docsBranch: 'v2',
    editLinks: true,

    algolia: {
      appId: '69Y3N7LHI2',
      apiKey: '45441f4b65a2f80329fd45c7cb371fea',
      indexName: 'pinia',
    },

    carbonAds: {
      carbon: 'CEBICK3I',
      custom: 'CEBICK3M',
      placement: 'routervuejsorg',
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Suggest changes to this page',
        lastUpdated: 'Last Updated',

        nav: [
          { text: 'Guide', link: '/introduction.html' },
          { text: 'API', link: '/api/' },
          // { text: 'Config', link: '/config/' },
          // { text: 'Plugins', link: '/plugins/' },
          {
            text: 'Links',
            items: [
              {
                text: 'Discussions',
                link: 'https://github.com/vuejs/pinia/discussions',
              },
              {
                text: 'Chat',
                link: 'https://chat.vuejs.org',
              },
              {
                text: 'Twitter',
                link: 'https://twitter.com/posva',
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
              },
            ],
          },
        ],

        sidebar: [
          {
            text: 'Introduction',
            children: [
              {
                text: 'What is Pinia?',
                link: '/introduction.html',
              },
              {
                text: 'Getting Started',
                link: '/getting-started.html',
              },
            ],
          },
          {
            text: 'Core Concepts',
            children: [
              { text: 'Defining a Store', link: '/core-concepts/' },
              { text: 'State', link: '/core-concepts/state.html' },
              { text: 'Getters', link: '/core-concepts/getters.html' },
              { text: 'Actions', link: '/core-concepts/actions.html' },
              { text: 'Plugins', link: '/core-concepts/plugins.html' },
              {
                text: 'Stores outside of components',
                link: '/core-concepts/outside-component-usage.html',
              },
            ],
          },
          {
            text: 'Server-Side Rendering (SSR)',
            children: [
              {
                text: 'Vue and Vite',
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
            link: '/cookbook/',
            children: [
              {
                text: 'Migration from Vuex ≤4',
                link: '/cookbook/migration-vuex.html',
              },
              {
                text: 'Hot Module Replacement',
                link: '/cookbook/hot-module-replacement.html',
              },
              {
                text: 'Testing',
                link: '/cookbook/testing.html',
              },
              {
                text: 'Usage without setup()',
                link: '/cookbook/options-api.html',
              },
              {
                text: 'Composing Stores',
                link: '/cookbook/composing-stores.html',
              },
              {
                text: 'Migration from v0/v1 to v2',
                link: '/cookbook/migration-v1-v2.html',
              },
            ],
          },
        ],
      },
      '/kr/': {
        label: '한국어',
        selectText: '언어',
        editLinkText: '이 페이지에 대한 변경 제안',
        lastUpdated: '마지막 업데이트',
      
        nav: [
          { text: '가이드', link: '/kr/introduction.html' },
          { text: 'API', link: '/kr/api/' },
          // { text: 'Config', link: '/config/' },
          // { text: 'Plugins', link: '/plugins/' },
          {
            text: '연결',
            items: [
              {
                text: '토론',
                link: 'https://github.com/vuejs/pinia/discussions',
              },
              {
                text: '채팅',
                link: 'https://chat.vuejs.org',
              },
              {
                text: 'Twitter',
                link: 'https://twitter.com/posva',
              },
              {
                text: '변경사항',
                link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
              },
            ],
          },
        ],
      
        sidebar: [
          {
            text: '소계',
            children: [
              {
                text: 'Pinia가 무엇인가요？',
                link: '/kr/introduction.html',
              },
              {
                text: '시작하기',
                link: '/kr/getting-started.html',
              },
            ],
          },
          {
            text: '핵심 컨셉',
            children: [
              { text: 'Store 정의', link: '/kr/core-concepts/' },
              { text: '상태', link: '/kr/core-concepts/state.html' },
              { text: 'Getters', link: '/kr/core-concepts/getters.html' },
              { text: '액션', link: '/kr/core-concepts/actions.html' },
              { text: '플러그인', link: '/kr/core-concepts/plugins.html' },
              {
                text: '컴포넌트 외부 Stores',
                link: '/kr/core-concepts/outside-component-usage.html',
              },
            ],
          },
          {
            text: '서버 사이드 렌더링 (SSR)',
            children: [
              {
                text: 'Vue 와 Vite',
                link: '/kr/ssr/',
              },
              {
                text: 'Nuxt.js',
                link: '/kr/ssr/nuxt.html',
              },
            ],
          },
          {
            text: 'Cookbook',
            link: '/kr/cookbook/',
            children: [
              {
                text: 'Vuex ≤4 에서 마이그레이션',
                link: '/kr/cookbook/migration-vuex.html',
              },
              {
                text: '핫 모듈 교체',
                link: '/kr/cookbook/hot-module-replacement.html',
              },
              {
                text: '테스트',
                link: '/kr/cookbook/testing.html',
              },
              {
                text: 'setup() 없이 사용',
                link: '/kr/cookbook/options-api.html',
              },
              {
                text: '통합 Stores',
                link: '/kr/cookbook/composing-stores.html',
              },
              {
                text: 'v0/v1에서 v2 마이그레이션',
                link: '/kr/cookbook/migration-v1-v2.html',
              },
            ],
          },
        ],
      },
    },
  },
}