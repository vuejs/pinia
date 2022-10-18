export default {
  vitepressConfig: {
    title: 'Pinia',
    lang: 'zh-CN',
    description: '值得你喜欢的 Vue Store',
  },
  themeConfig: {
    label: '简体中文',
    selectText: '选择语言',
    editLinkText: '对本页提出修改建议',
    lastUpdated: '最后更新',

    nav: [
      { text: '指南', link: '/zh/introduction.html' },
      { text: 'API', link: '/zh/api/' },
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: '相关链接',
        items: [
          {
            text: '论坛',
            link: 'https://github.com/vuejs/pinia/discussions',
          },
          {
            text: '聊天室',
            link: 'https://chat.vuejs.org',
          },
          {
            text: 'Twitter',
            link: 'https://twitter.com/posva',
          },
          {
            text: '更新日志',
            link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
          },
        ],
      },
    ],

    sidebar: {
      '/zh/api/': [
        {
          text: 'packages',
          children: [
            { text: 'pinia', link: '/zh/api/modules/pinia.html' },
            { text: '@pinia/nuxt', link: '/zh/api/modules/pinia_nuxt.html' },
            {
              text: '@pinia/testing',
              link: '/zh/api/modules/pinia_testing.html',
            },
          ],
        },
      ],
      '/zh/': [
        {
          text: '介绍',
          children: [
            {
              text: 'Pinia 是什么？',
              link: '/zh/introduction.html',
            },
            {
              text: '开始',
              link: '/zh/getting-started.html',
            },
          ],
        },
        {
          text: '核心概念',
          children: [
            { text: '定义一个 Store', link: '/zh/core-concepts/' },
            { text: 'State', link: '/zh/core-concepts/state.html' },
            { text: 'Getter', link: '/zh/core-concepts/getters.html' },
            { text: 'Action', link: '/zh/core-concepts/actions.html' },
            { text: '插件', link: '/zh/core-concepts/plugins.html' },
            {
              text: '组件外的 Store',
              link: '/zh/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: '服务端渲染 (SSR)',
          children: [
            {
              text: 'Vue 与 Vite',
              link: '/zh/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/zh/ssr/nuxt.html',
            },
          ],
        },
        {
          text: '手册',
          link: '/zh/cookbook/',
          children: [
            {
              text: '从 Vuex ≤4 迁移',
              link: '/zh/cookbook/migration-vuex.html',
            },
            {
              text: '热更新',
              link: '/zh/cookbook/hot-module-replacement.html',
            },
            {
              text: '测试',
              link: '/zh/cookbook/testing.html',
            },
            {
              text: '不使用 setup() 的用法',
              link: '/zh/cookbook/options-api.html',
            },
            {
              text: '组合式 Stores',
              link: '/zh/cookbook/composing-stores.html',
            },
            {
              text: '从 v0/v1 迁移至 v2',
              link: '/zh/cookbook/migration-v1-v2.html',
            },
            {
              text: '处理组合式函数',
              link: '/zh/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
