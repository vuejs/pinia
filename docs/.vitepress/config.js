// @ts-check

const META_URL = 'https://pinia.esm.dev'
const META_TITLE = 'Pinia 🍍'
const META_DESCRIPTION =
  'Intuitive, type safe, light and flexible Store for Vue'
const META_IMAGE = 'https://pinia.esm.dev/social.png'

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
  lang: 'en',
  description: 'The Vue Store that you will enjoy using',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
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
    repo: 'posva/pinia',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'v2',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    // TODO: get keys once ready
    // algolia: {
    //   apiKey: 'b573aa848fd57fb47d693b531297403c',
    //   indexName: 'vitejs',
    // },

    carbonAds: {
      carbon: 'CEBICK3I',
      custom: 'CEBICK3M',
      placement: 'routervuejsorg',
    },

    nav: [
      { text: 'Guide', link: '/introduction.html' },
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: 'Links',
        items: [
          {
            text: 'Twitter',
            link: 'https://twitter.com/posva',
          },
          {
            text: 'Changelog',
            link: 'https://github.com/posva/pinia/blob/v2/CHANGELOG.md',
          },
        ],
      },
    ],

    sidebar: {
      // catch-all fallback
      '/': [
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
          ],
        },
        {
          text: 'Server-Side Rendering (SSR)',
          link: '/server-side-rendering.html',
        },
        {
          text: 'Cookbook',
          link: '/cookbook/',
          children: [
            {
              text: 'Composing Stores',
              link: '/cookbook/composing-stores.html',
            },
          ],
        },
      ],
    },
  },
}
