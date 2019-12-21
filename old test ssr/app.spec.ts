import renderApp from './app/entry-server'
import { createRenderer } from 'vue-server-renderer'

const renderer = createRenderer()

// FIXME: add when ssr is available in vue 3
describe.skip('classic vue app', () => {
  it('renders using the store', async () => {
    const context = {
      rendered: () => {},
    }
    const app = await renderApp(context)

    // @ts-ignore
    const html = await renderer.renderToString(app)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )
  })

  it('resets the store', async () => {
    const context = {
      rendered: () => {},
    }
    let app = await renderApp(context)

    // @ts-ignore
    let html = await renderer.renderToString(app)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )

    // render again
    app = await renderApp(context)

    // @ts-ignore
    html = await renderer.renderToString(app)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )
  })
})
