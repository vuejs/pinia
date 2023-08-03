// @ts-check
const fs = require('node:fs/promises')
const path = require('node:path')
const TypeDoc = require('typedoc')
const { PageEvent } = TypeDoc

const DEFAULT_OPTIONS = {
  // disableOutputCheck: true,
  cleanOutputDir: true,
  excludeInternal: true,
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

  const slugify = (s) => s.replaceAll(' ', '-')
  // encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))

  app.renderer.on(
    PageEvent.END,
    /**
     *
     * @param {import('typedoc/dist/lib/output/events').PageEvent} page
     */
    (page) => {
      if (!page.contents) {
        return
      }
      page.contents = prependYAML(page.contents, {
        // TODO: figure out a way to point to the source files?
        editLink: false,
      })
    }
  )

  async function serve() {
    await app.bootstrapWithPlugins(options)
    app.convertAndWatch(handleProject)
  }

  async function build() {
    if (
      (await exists(options.out)) &&
      (await fs.stat(options.out)).isDirectory()
    ) {
      await fs.rm(options.out, { recursive: true })
    }
    await app.bootstrapWithPlugins(options)
    const project = app.convert()
    if (!project) {
      throw new Error('No project')
    }
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

/**
 * @typedef {Record<string, string | number | boolean>} FrontMatterVars
 */

/**
 * Prepends YAML block to a string
 * @param {string} contents - string to prepend to
 * @param {FrontMatterVars} vars - object of required front matter variables
 */
function prependYAML(contents, vars) {
  return contents
    .replace(/^/, toYAML(vars) + '\n\n')
    .replace(/[\r\n]{3,}/g, '\n\n')
}

/**
 * Converts YAML object to a YAML string
 * @param {FrontMatterVars} vars
 */
function toYAML(vars) {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === 'string' ? `"${escapeDoubleQuotes(value)}"` : value
      }`
  )
  .join('\n')}
---`
  return yaml
}

/**
 * Escapes double quotes in a string
 * @param {string} str - string to escape
 */
function escapeDoubleQuotes(str) {
  return str.replace(/"/g, '\\"')
}
