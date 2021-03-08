// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'Pinia',
  description: 'The Vue Store that takes care of you',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
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
      { text: 'Guide', link: '/guide/' },
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
          link: '/ssr.html',
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
