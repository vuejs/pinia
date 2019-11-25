import renderApp from './app/entry-server'
import { createRenderer } from 'vue-server-renderer'

const renderer = createRenderer()

describe('classic vue app', () => {
  it('renders using the store', async () => {
    const context = {
      rendered: () => {},
    }
    const app = await renderApp(context)
    // TODO: is this really here?
    context.rendered()

    // @ts-ignore
    const html = await renderer.renderToString(app)
    expect(html).toMatchInlineSnapshot(
      `"<div data-server-rendered=\\"true\\"><h2>Hi anon</h2> <p>Count: 0 x 2 = 0</p> <button>Increment</button></div>"`
    )
  })
})
