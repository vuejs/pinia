/**
 * @jest-environment node
 */
import { createPinia } from '../src'
import { Component, createSSRApp, inject } from 'vue'
import { renderToString, ssrInterpolate } from '@vue/server-renderer'
import { useUserStore } from './pinia/stores/user'
import { useCartStore } from './pinia/stores/cart'

describe('SSR', () => {
  const App = {
    ssrRender(ctx: any, push: any, _parent: any) {
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

  function createMyApp(MyApp: Component = App) {
    const app = createSSRApp(MyApp)
    const pinia = createPinia()
    app.use(pinia)
    // const rootEl = document.createElement('div')
    // document.body.appendChild(rootEl)

    return { app, pinia }
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

  it('automatically hydrates', async () => {
    const { app, pinia } = createMyApp({
      ssrRender(ctx: any, push: any, _parent: any) {
        push(
          `<p>${ssrInterpolate(ctx.user.name)}: ${ssrInterpolate(
            ctx.cart.rawItems.join(', ')
          )}</p>`
        )
      },
      setup() {
        const cart = useCartStore()
        const user = useUserStore()
        return { cart, user }
      },
    })

    pinia.state.value.user = {
      name: 'Tom',
      isAdmin: false,
    }

    pinia.state.value.cart = {
      id: 10,
      rawItems: ['water', 'water', 'apples'],
    }

    expect(await renderToString(app)).toBe(`<p>Tom: water, water, apples</p>`)
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
