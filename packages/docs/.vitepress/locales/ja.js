export default {
  vitepressConfig: {
    title: 'Pinia',
    lang: 'ja-JP',
    description: 'The Vue Store that you will enjoy using',
  },
  themeConfig: {
    label: '日本語',
    selectText: 'Languages',
    editLinkText: 'このページの変更を提案',
    lastUpdated: 'Last Updated',

    nav: [
      { text: 'Guide', link: '/ja/introduction.html' },
      { text: 'API', link: '/ja/api/' },
      // { text: 'Config', link: '/ja/config/' },
      // { text: 'Plugins', link: '/ja/plugins/' },
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

    sidebar: {
      '/ja/api/': [
        {
          text: 'packages',
          children: [
            { text: 'pinia', link: '/ja/api/modules/pinia.html' },
            { text: '@pinia/nuxt', link: '/ja/api/modules/pinia_nuxt.html' },
            {
              text: '@pinia/testing',
              link: '/ja/api/modules/pinia_testing.html',
            },
          ],
        },
      ],
      // catch-all fallback
      '/ja/': [
        {
          text: 'Introduction',
          children: [
            {
              text: 'What is Pinia? 🇯🇵',
              link: '/ja/introduction.html',
            },
            {
              text: 'Getting Started 🇯🇵',
              link: '/ja/getting-started.html',
            },
          ],
        },
        {
          text: 'Core Concepts',
          children: [
            { text: 'Defining a Store 🇯🇵', link: '/ja/core-concepts/' },
            { text: 'State 🇯🇵', link: '/ja/core-concepts/state.html' },
            { text: 'Getters 🇯🇵', link: '/ja/core-concepts/getters.html' },
            { text: 'Actions 🇯🇵', link: '/ja/core-concepts/actions.html' },
            { text: 'Plugins', link: '/ja/core-concepts/plugins.html' },
            {
              text: 'Stores outside of components 🇯🇵',
              link: '/ja/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Server-Side Rendering (SSR)',
          children: [
            {
              text: 'Vue and Vite',
              link: '/ja/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ja/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Cookbook',
          link: '/ja/cookbook/',
          children: [
            {
              text: 'Migration from Vuex ≤4',
              link: '/ja/cookbook/migration-vuex.html',
            },
            {
              text: 'Hot Module Replacement 🇯🇵',
              link: '/ja/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Testing 🇯🇵',
              link: '/ja/cookbook/testing.html',
            },
            {
              text: 'Usage without setup()',
              link: '/ja/cookbook/options-api.html',
            },
            {
              text: 'Composing Stores 🇯🇵',
              link: '/ja/cookbook/composing-stores.html',
            },
            {
              text: 'Migration from v0/v1 to v2',
              link: '/ja/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Dealing with composables 🇯🇵',
              link: '/ja/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
