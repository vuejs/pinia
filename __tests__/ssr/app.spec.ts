import renderApp from './app/entry-server'
import { createRenderer } from 'vue-server-renderer'

const renderer = createRenderer()

function createContext() {
  return {
    rendered: () => {},
    req: {},
  }
}

describe('classic vue app', () => {
  it('renders using the store', async () => {
    const context = createContext()
    const app = await renderApp(context)

    // @ts-ignore
    const html = await renderer.renderToString(app, context)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )
  })

  it('resets the store', async () => {
    let context = createContext()
    let app = await renderApp(context)

    // @ts-ignore
    let html = await renderer.renderToString(app, context)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )

    // render again with new request context
    context = createContext()
    app = await renderApp(context)

    // @ts-ignore
    html = await renderer.renderToString(app, context)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 1 x 2 = 2</p> <button>Increment</button></div>"`
    )
  })
})
