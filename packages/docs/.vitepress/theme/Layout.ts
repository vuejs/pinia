import Theme from 'vitepress/theme'
import { h, defineComponent } from 'vue'
import sponsors from '../components/sponsors.json'
import './sponsors.css'
import { darkStorageConfig } from '../theme/dark-theme'
import { useDark } from '@vueuse/core'
import VueMasteryHomeLink from '../components/VueMasteryHomeLink.vue'

export const Layout = defineComponent({
  name: 'CustomLayout',

  setup() {
    const isDark = useDark(darkStorageConfig)

    return () =>
      h(
        Theme.Layout,
        {},
        {
          'home-hero': () =>
            h('div', {}, [
              h(
                'div',
                {
                  class: 'vue-school-homepage-link',
                },
                [
                  h(
                    'a',
                    {
                      href: 'https://vueschool.io/lessons/introduction-to-pinia?friend=vuerouter&utm_source=pinia&utm_medium=link&utm_campaign=homepage',
                      target: '_blank',
                      rel: 'noopener',
                    },
                    [h('span', 'Watch Video Introduction')]
                  ),
                ]
              ),
              h(VueMasteryHomeLink),
            ]),
          'sidebar-top': () =>
            h('div', { class: 'sponsors sponsors-top' }, [
              h('span', 'Platinum Sponsors'),
              ...(sponsors.platinum.length
                ? sponsors.platinum.map(
                    ({ href, imgSrcDark, imgSrcLight, alt }) =>
                      h(
                        'a',
                        {
                          href,
                          target: '_blank',
                          rel: 'noopener',
                        },
                        [
                          h('img', {
                            src: isDark.value ? imgSrcDark : imgSrcLight,
                            alt,
                          }),
                        ]
                      )
                  )
                : [
                    h(
                      'a',
                      {
                        class: 'become-sponsor',
                        href: 'https://github.com/sponsors/posva',
                        target: '_blank',
                        rel: 'noopener',
                        alt: 'Your logo here',
                      },
                      'Become a Sponsor!'
                    ),
                  ]),
            ]),
          'sidebar-bottom': sponsors.gold.length
            ? () =>
                h('div', { class: 'sponsors' }, [
                  h('span', 'Sponsors'),
                  ...sponsors.gold.map(
                    ({ href, imgSrcDark, imgSrcLight, alt }) =>
                      h(
                        'a',
                        {
                          href,
                          target: '_blank',
                          rel: 'noopener',
                        },
                        [
                          h('img', {
                            src: isDark.value ? imgSrcDark : imgSrcLight,
                            alt,
                          }),
                        ]
                      )
                  ),
                ])
            : undefined,
        }
      )
  },
})
