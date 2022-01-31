import Theme from 'vitepress/theme'
import { h, nextTick, ref, createSlots, withCtx } from 'vue'
import type { FunctionalComponent } from 'vue'
import sponsors from '../components/sponsors.json'
import './sponsors.css'
import { darkStorageConfig } from '../theme/dark-theme'
import { useDark } from '@vueuse/core'

export const Layout: FunctionalComponent = () => {
  const showAds = ref(false)

  const isDark = useDark(darkStorageConfig)

  return h(
    Theme.Layout,
    {
      onVnodeMounted() {
        console.log('vnode mounted')
        nextTick(() => {
          console.log('showAds', showAds.value)
          showAds.value =
            typeof navigator !== 'undefined' &&
            typeof navigator.language === 'string' &&
            navigator.language.startsWith('zh')
        })
      },
    },
    createSlots(
      {
        // @ts-expect-error
        _: 2 /* DYNAMIC */,
        'sidebar-top': () =>
          // @ts-expect-error
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
          // @ts-expect-error
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
      },
      [
        showAds.value
          ? {
              name: 'page-top-ads',
              fn: () =>
                h('div', { id: 'wwads-container' }, [
                  h('div', {
                    class: 'wwads-cn wwads-vertical',
                    'data-id': 144,
                    style: {
                      maxWidth: '150px',
                    },
                  }),
                ]),
            }
          : undefined,
      ]
    )
  )
}

Layout.displayName = 'CustomLayout'
