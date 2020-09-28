/**
 * @jest-environment node
 */
import { createPinia } from '../src'
import { useCartStore } from './pinia/stores/cart'
import { createSSRApp, inject } from 'vue'
import { renderToString, ssrInterpolate } from '@vue/server-renderer'
import { useUserStore } from './pinia/stores/user'

describe('SSR', () => {
  const App = {
    ssrRender(ctx: any, push: any, parent: any) {
      push(
        `<div>${ssrInterpolate(ctx.user.name)}: ${ssrInterpolate(
          ctx.cart.items
        )}</div>`
      )
    },
    setup() {
      const cart = useCartStore()
      const user = useUserStore()
      user.name = inject('name', 'default')
      cart.addItem('one')
      return { cart, user }
    },
  }

  function createMyApp() {
    const app = createSSRApp(App)
    const pinia = createPinia()
    app.use(pinia)
    // const rootEl = document.createElement('div')
    // document.body.appendChild(rootEl)

    return { app }
  }

  it('keeps apps separated', async () => {
    const { app: a1 } = createMyApp()
    const { app: a2 } = createMyApp()

    expect(await renderToString(a1)).toMatchInlineSnapshot(`
      "<div>default: [
        {
          &quot;name&quot;: &quot;one&quot;,
          &quot;amount&quot;: 1
        }
      ]</div>"
    `)
    expect(await renderToString(a2)).toMatchInlineSnapshot(`
      "<div>default: [
        {
          &quot;name&quot;: &quot;one&quot;,
          &quot;amount&quot;: 1
        }
      ]</div>"
    `)
  })

  it('can use a different store', async () => {
    const { app: a1 } = createMyApp()
    const { app: a2 } = createMyApp()
    a1.provide('name', 'a1')
    a2.provide('name', 'a2')

    expect(await renderToString(a1)).toMatchInlineSnapshot(`
      "<div>a1: [
        {
          &quot;name&quot;: &quot;one&quot;,
          &quot;amount&quot;: 1
        }
      ]</div>"
    `)
    expect(await renderToString(a2)).toMatchInlineSnapshot(`
      "<div>a2: [
        {
          &quot;name&quot;: &quot;one&quot;,
          &quot;amount&quot;: 1
        }
      ]</div>"
    `)
  })
})
