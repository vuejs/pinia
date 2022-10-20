const position = {
  false: 'push',
  true: 'unshift',
}

const renderPermalink = (slug, opts, state, permalink) => {
  try {
    const tokens = state.tokens
    const token = tokens[permalink]
    const title = tokens[permalink + 1].children
      .filter((token) => token.type === 'text' || token.type === 'code_inline')
      .reduce((acc, t) => acc + t.content, '')
    const match = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/.exec(title)
    slug = match ? match[2] : slug
    token.attrSet('id', slug)
    const space = () =>
      Object.assign(new state.Token('text', '', 0), { content: ' ' })

    const linkTokens = [
      Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [
          ...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []),
          ['href', opts.permalinkHref(slug, state)],
          ...Object.entries(opts.permalinkAttrs(slug, state)),
        ],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: opts.permalinkSymbol,
      }),
      new state.Token('link_close', 'a', -1),
    ]
    if (opts.permalinkSpace) {
      linkTokens[position[!opts.permalinkBefore]](space())
    }
    state.tokens[permalink + 1].children[position[opts.permalinkBefore]](
      ...linkTokens
    )
  } catch (e) {}
}

export default renderPermalink
