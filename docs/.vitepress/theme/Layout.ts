import Theme from 'vitepress/theme'
import { h, nextTick } from 'vue'
import type { FunctionalComponent } from 'vue'
import sponsors from '../components/sponsors.json'
import './sponsors.css'
import { isDark } from './dark-theme'

export const Layout: FunctionalComponent = () =>
  h(
    Theme.Layout,
    {
      onVnodeMounted() {
        // wait to ticks to fix the problem of SSR with no color scheme
        nextTick(() => {
          isDark.value = !isDark.value
          return nextTick()
        }).then(() => {
          isDark.value = !isDark.value
        })
      },
    },
    {
      'sidebar-bottom': () =>
        h('div', { class: 'sponsors' }, [
          h(
            'a',
            {
              href: 'https://github.com/sponsors/posva',
              target: '_blank',
              rel: 'noopener',
            },
            [h('span', 'Sponsors')]
          ),
          ...sponsors.gold.map(({ href, imgSrcDark, imgSrcLight, alt }) =>
            h(
              'a',
              {
                href,
                target: '_blank',
                rel: 'noopener',
              },
              [h('img', { src: isDark.value ? imgSrcDark : imgSrcLight, alt })]
            )
          ),
        ]),
    }
  )

Layout.displayName = 'CustomLayout'
