import Theme from 'vitepress/theme'
import { h, nextTick } from 'vue'
import type { FunctionalComponent } from 'vue'
import sponsors from '../components/sponsors.json'
import './sponsors.css'
import { darkStorageConfig } from '../theme/dark-theme'
import { useDark } from '@vueuse/core'

export const Layout: FunctionalComponent = () => {
  const showWwAds =
    typeof navigator !== 'undefined' &&
    typeof navigator.language === 'string' &&
    navigator.language.startsWith('zh')

  const isDark = useDark(darkStorageConfig)

  const slots = {
    'sidebar-top': () =>
      h('div', { class: 'sponsors sponsors-top' }, [
        h('span', 'Platinum Sponsors'),
        ...(sponsors.platinum.length
          ? sponsors.platinum.map(({ href, imgSrcDark, imgSrcLight, alt }) =>
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
            [h('img', { src: isDark.value ? imgSrcDark : imgSrcLight, alt })]
          )
        ),
      ]),
  }

  if (showWwAds) {
    slots['page-top-ads'] = () =>
      h('div', { id: 'wwads-container' }, [
        h('div', {
          class: 'wwads-cn wwads-vertical',
          'data-id': 144,
          style: {
            maxWidth: '150px',
          },
        }),
      ])
  }

  return h(
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
    slots
  )
}

Layout.displayName = 'CustomLayout'
