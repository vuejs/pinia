const _fs = require('fs')
const path = require('path')
const TypeDoc = require('typedoc')
const { PageEvent } = require('typedoc/dist/lib/output/events')
const {
  prependYAML,
} = require('typedoc-plugin-markdown/dist/utils/front-matter')

const fs = _fs.promises

const DEFAULT_OPTIONS = {
  disableOutputCheck: true,
  readme: 'none',
  out: path.resolve(__dirname, './api'),
  entryDocument: 'index.md',
  hideBreadcrumbs: false,
  hideInPageTOC: true,
}

/**
 *
 * @param {Partial<import('typedoc').TypeDocOptions>} config
 */
exports.createTypeDocApp = function createTypeDocApp(config = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...config,
  }

  const app = new TypeDoc.Application()

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader())
  // app.options.addReader(new TypeDoc.TypeDocReader())

  /** @type {'build' | 'serve'} */
  let targetMode = 'build'

  app.renderer.on(
    PageEvent.END,
    /**
     *
     * @param {import('typedoc/dist/lib/output/events').PageEvent} page
     */
    (page) => {
      if (page.url !== 'index.md' && page.contents) {
        page.contents = prependYAML(page.contents, {
          sidebar: 'auto',
          sidebarDepth: 3,
        })
      }
    }
  )

  async function serve() {
    app.bootstrap(options)
    app.convertAndWatch(handleProject)
  }

  async function build() {
    if (
      (await exists(options.out)) &&
      (await fs.stat(options.out)).isDirectory()
    ) {
      await fs.rm(options.out, { recursive: true })
    }
    app.bootstrap(options)
    const project = app.convert()
    return handleProject(project)
  }

  /**
   *
   * @param {import('typedoc').ProjectReflection} project
   */
  async function handleProject(project) {
    if (project) {
      // Rendered docs
      try {
        await app.generateDocs(project, options.out)
        app.logger.info(`generated at ${options.out}.`)
      } catch (error) {
        app.logger.error(error)
      }
    } else {
      app.logger.error('No project')
    }
  }

  return {
    build,
    serve,
    /**
     *
     * @param {'build' | 'serve'} command
     */
    setTargetMode(command) {
      targetMode = command
    },
  }
}

async function exists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}
