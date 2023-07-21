import { defineConfig, /*HeadConfig*/ } from 'vitepress'

export const META_IMAGE = 'https://pinia.vuejs.org/social.png'
// export const isProduction =
//   process.env.NETLIFY && process.env.CONTEXT === 'production'

// if (process.env.NETLIFY) {
//   console.log('Netlify build', process.env.CONTEXT)
// }

// const productionHead: HeadConfig[] = [
//   [
//     'script',
//     {
//       src: 'https://unpkg.com/thesemetrics@latest',
//       async: '',
//       type: 'text/javascript',
//     },
//   ],
// ]

export const sharedConfig = defineConfig({
  title: 'Pinia',
  appearance: 'dark',

  markdown: {
    theme: {
      dark: 'dracula-soft',
      light: 'vitesse-light',
    },

    attrs: {
      leftDelimiter: '%{',
      rightDelimiter: '}%',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],

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
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image',
        content: META_IMAGE,
      },
    ],

    // Vue School Top banner
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuerouter&type=top',
        // @ts-expect-error: vitepress bug
        async: true,
        type: 'text/javascript',
      },
    ],

    // ...(isProduction ? productionHead : []),
  ],

  themeConfig: {
    logo: '/logo.svg',
    outline: [2, 3],

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/posva' },
      {
        icon: 'github',
        link: 'https://github.com/vuejs/pinia',
      },
      {
        icon: 'discord',
        link: 'https://chat.vuejs.org',
      },
    ],

    footer: {
      copyright: 'MIT Licensed | Copyright © 2019-present Eduardo San Martin Morote',
      message: 'Translated by pinia.vuejs.kr',
    },

    editLink: {
      pattern: 'https://github.com/niceplugin/Vuejs-Pinia-KO/edit/main-korean/docs/:path',
      text: '이 페이지 편집 제안하기'
    },

    algolia: {
      appId: 'PTO6MRQ22K',
      apiKey: '0d5e8cf46df833b0dc402e94e5c22537',
      indexName: 'pinia-vuejs',
    },

    carbonAds: {
      code: "CEBICK3I",
      // custom: 'CEBICK3M',
      placement: "routervuejsorg",
    },
  },
})