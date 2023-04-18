const _fs = require('fs')
const path = require('path')
const TypeDoc = require('typedoc')
const { PageEvent } = TypeDoc

const fs = _fs.promises

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
      if (page.url !== 'index.md' && page.contents) {
        page.contents = prependYAML(page.contents, {
          // TODO: figure out a way to point to the source files?
          editLink: false,
        })
      }

      // avoid duplicated id titles
      if (page.contents) {
        const lines = page.contents.split('\n')
        const titleStack = []
        let currentLevel = 0
        const TITLE_LEVEL = /^#+/
        const existingIds = new Map()
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (!line.startsWith('#')) continue
          const level = line.match(TITLE_LEVEL)[0].length

          // remove extra levels
          if (level <= currentLevel) {
            titleStack.splice(level - 1)
          }
          // add the current title
          titleStack.push(line.slice(level).trim())
          currentLevel = level

          // no need to add ids to h1
          if (level < 2) continue

          // ignore the root level (h1) to match the sidebar
          const slugifiedTitle = slugify(titleStack.slice(1).join('-'))
            // ensure the link is valid vuejs/router#1743
            .replaceAll('\\', '')
          let id
          if (existingIds.has(slugifiedTitle)) {
            const current = existingIds.get(slugifiedTitle)
            existingIds.set(slugifiedTitle, current + 1)
            id = ` %{#${slugifiedTitle}_${current + 1}}%`
          } else {
            existingIds.set(slugifiedTitle, 0)
            id = ` %{#${slugifiedTitle}}%`
          }
          const newLine = line + id
          lines.splice(i, 1, newLine)
        }

        page.contents = lines.join('\n')
      }
    }
  )

  async function serve() {
    // TODO: in 0.24
    // app.bootstrapWithPlugins(options)
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
    // TODO: same as above
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

/**
 * @typedef {Record<string, string | number | boolean>} FrontMatterVars
 */

/**
 * Prepends YAML block to a string
 * @param {string} contents - string to prepend to
 * @param {FrontMattersVars} vars - object of required front matter variables
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
