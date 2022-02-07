import Theme from 'vitepress/theme'
import { h, defineComponent } from 'vue'
import sponsors from '../components/sponsors.json'
import './sponsors.css'
import { darkStorageConfig } from '../theme/dark-theme'
import { useDark } from '@vueuse/core'

export const Layout = defineComponent({
  name: 'CustomLayout',

  setup() {
    const isDark = useDark(darkStorageConfig)

    return () =>
      h(
        Theme.Layout,
        {},
        {
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
          'sidebar-bottom': () =>
            h('div', { class: 'sponsors' }, [
              h('span', 'Sponsors'),
              ...sponsors.gold.map(({ href, imgSrcDark, imgSrcLight, alt }) =>
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
            ]),
        }
      )
  },
})
