import fs from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import semver, { type ReleaseType } from 'semver'
import * as p from '@clack/prompts'
import { spawn } from 'node:child_process'

/**
 * Simple console colors
 */
const c = {
  reset: '\x1b[0m',
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  white: (s: string) => `\x1b[37m${s}\x1b[0m`,
  boldWhite: (s: string) => `\x1b[1;37m${s}\x1b[0m`,
  boldYellow: (s: string) => `\x1b[1;33m${s}\x1b[0m`,
  dimBlue: (s: string) => `\x1b[2;94m${s}\x1b[0m`,
  dimYellow: (s: string) => `\x1b[2;33m${s}\x1b[0m`,
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const {
  values: {
    tag: optionTag,
    dry: isDryRun,
    skipCleanCheck: skipCleanGitCheck,
    noDepsUpdate,
    noLockUpdate,
    all: skipChangeCheck,
    help: showHelp,
  },
} = parseArgs({
  options: {
    tag: { type: 'string' },
    dry: { type: 'boolean', default: false },
    skipCleanCheck: { type: 'boolean', default: false },
    noDepsUpdate: { type: 'boolean', default: false },
    noLockUpdate: { type: 'boolean', default: false },
    all: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
})

if (showHelp) {
  console.log(
    `
Usage: node release.ts [flags]
       node release.ts [ -h | --help ]

Flags:
  --tag               Publish under a given npm dist tag
  --dry               Dry run
  --skipCleanCheck    Skip checking if the git repo is clean
  --noDepsUpdate      Skip updating dependencies in package.json files
  --noLockUpdate      Skips updating the lock with "pnpm install"
  --all               Skip checking if the packages have changed since last release
`.trim()
  )
  process.exit(0)
}

// const preId =
//   args.preId ||
//   (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const EXPECTED_BRANCH = 'v4'
// this package will use tags like v1.0.0 while the rest will use the full package name like @pinia/testing@1.0.0
const MAIN_PKG_NAME = 'pinia'
// whether the main package is at the root of the mono repo or true if this is not a mono repo
const IS_MAIN_PKG_AT_ROOT = false
// array of folders of packages to release
const PKG_FOLDERS = [
  // comment for multiline format
  join(__dirname, '../packages/pinia'),
  join(__dirname, '../packages/testing'),
  join(__dirname, '../packages/nuxt'),
]

// files to add and commit after building a new version
const FILES_TO_COMMIT = [
  // comment for multiline format
  'packages/*/package.json',
  'packages/*/CHANGELOG.md',
]

interface RunOptions {
  stdio?: 'inherit' | 'pipe'
  cwd?: string
}

interface RunResult {
  stdout: string
}

function run(
  bin: string,
  args: string[],
  opts: RunOptions = {}
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const { stdio = 'inherit', cwd } = opts

    const child = spawn(bin, args, {
      cwd,
      stdio: stdio === 'pipe' ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    })

    let stdout = ''
    let stderr = ''

    if (stdio === 'pipe') {
      child.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString()
      })
      child.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
      })
    }

    child.on('error', reject)

    child.on('close', (code) => {
      const result = { stdout: stdout.trimEnd() }
      if (code !== 0) {
        const error = new Error(
          `Command failed: ${bin} ${args.join(' ')}`
        ) as Error & {
          exitCode: number | null
        }
        error.exitCode = code
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

const dryRun = async (bin: string, args: string[], opts: unknown = {}) =>
  console.log(c.blue(`[dry-run] ${bin} ${args.join(' ')}`), opts)

const runIfNotDry = isDryRun ? dryRun : run

const step = (...msg: string[]) => console.log(c.cyan(msg.join(' ')))

function daysAgo(isoDate: string | null): string | null {
  if (!isoDate) return null
  const then = new Date(`${isoDate}T00:00:00Z`).getTime()
  if (Number.isNaN(then)) return null
  const now = Date.now()
  const days = Math.max(0, Math.floor((now - then) / 86_400_000))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

interface PackageJson {
  name: string
  version: string
  private?: boolean
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: any
}

interface PackageInfo {
  name: string
  path: string
  relativePath: string
  version: string
  pkg: PackageJson
  start: string
  lastTag: string | null
  lastTagDate: string | null
}

async function main() {
  if (!skipCleanGitCheck) {
    const isDirtyGit = !!(
      await run('git', ['status', '--porcelain'], { stdio: 'pipe' })
    ).stdout

    if (isDirtyGit) {
      console.log(c.red(`Git repo isn't clean.`))
      return
    }

    const currentBranch = (
      await run('git', ['branch', '--show-current'], { stdio: 'pipe' })
    ).stdout

    if (currentBranch !== EXPECTED_BRANCH) {
      console.log(
        c.red(
          `You should be on branch "${EXPECTED_BRANCH}" but are on "${currentBranch}"`
        )
      )
      return
    }
  } else {
    console.log(c.boldWhite(`Skipping git checks...`))
  }

  if (!skipCleanGitCheck) {
    const isOutdatedRE = new RegExp(
      `\\W${EXPECTED_BRANCH}\\W.*(?:fast-forwardable|local out of date)`,
      'i'
    )

    const isOutdatedGit = isOutdatedRE.test(
      (await run('git', ['remote', 'show', 'origin'], { stdio: 'pipe' })).stdout
    )

    if (isOutdatedGit) {
      console.log(c.red(`Git branch is not in sync with remote`))
      return
    }
  }

  const changedPackages = await getChangedPackages(...PKG_FOLDERS)

  if (!changedPackages.length) {
    console.log(c.red(`No packages have changed since last release`))
    return
  }

  if (isDryRun) {
    console.log(`\n${c.blue(c.bold('This is a dry run'))}\n`)
  }

  let packagesToRelease = changedPackages

  // if there are more than one package, ask which ones to release
  if (packagesToRelease.length > 1) {
    // allow to select which packages
    const pickedPackages = await p.multiselect<string>({
      id: 'pickedPackages',
      message: 'What packages do you want to release?',
      required: true,
      initialValues: changedPackages.map((pkg) => pkg.name),
      options: changedPackages.map((pkg) => {
        const rel = daysAgo(pkg.lastTagDate)
        const suffix = pkg.lastTag
          ? `${pkg.lastTag}${rel ? ` (${rel})` : ''}`
          : 'no previous release'
        return {
          label: `${pkg.name} ${c.dim(`— ${suffix}`)}`,
          value: pkg.name,
        }
      }),
    })

    if (p.isCancel(pickedPackages)) {
      p.cancel('Release aborted')
      return
    }

    packagesToRelease = changedPackages.filter((pkg) =>
      pickedPackages.includes(pkg.name)
    )
  }

  step(
    `Ready to release ${packagesToRelease.map(({ name }) => c.boldWhite(name)).join(', ')}`
  )

  // Build per-package release-type options up front so we can batch the prompts
  const releaseConfigs = packagesToRelease.map(({ name, pkg }) => {
    const { version } = pkg

    const prerelease = semver.prerelease(version)
    const preId = prerelease && prerelease[0]

    const prereleaseTypes = ['beta', 'alpha', 'rc']
    const isPrereleaseTag = !!optionTag && prereleaseTypes.includes(optionTag)

    // For prerelease tags: show prepatch/preminor/premajor with the tag, plus prerelease if already on one
    // For regular releases: show patch/minor/major, plus pre* variants if already on a prerelease
    const versionIncrements: ReleaseType[] = isPrereleaseTag
      ? [
          'prepatch',
          'preminor',
          'premajor',
          ...(preId ? (['prerelease'] as const) : []),
        ]
      : [
          'patch',
          'minor',
          'major',
          ...(preId
            ? (['prepatch', 'preminor', 'premajor', 'prerelease'] as const)
            : []),
        ]

    const options = versionIncrements
      .map((release) => {
        // Use optionTag for prerelease increments when a prerelease tag is specified
        const identifier = isPrereleaseTag ? optionTag : (preId as string)
        const newVersion = semver.inc(version, release, identifier)
        return {
          value: newVersion!,
          label: `${release}: ${name} (${newVersion})`,
        }
      })
      .concat([{ value: 'custom', label: 'custom' }])

    return { name, currentVersion: version, options }
  })

  // Ask for release types — batch across packages when more than one
  const releaseAnswers: Record<string, string | symbol> =
    releaseConfigs.length === 1
      ? {
          [releaseConfigs[0]!.name]: await p.select<string>({
            id: `release:${releaseConfigs[0]!.name}`,
            message: `Select release type for ${c.boldWhite(releaseConfigs[0]!.name)}`,
            options: releaseConfigs[0]!.options,
          }),
        }
      : await p.batch(
          Object.fromEntries(
            releaseConfigs.map((cfg) => [
              cfg.name,
              p.batch.select<string>({
                id: `release:${cfg.name}`,
                message: `Select release type for ${c.boldWhite(cfg.name)}`,
                options: cfg.options,
              }),
            ])
          )
        )

  for (const answer of Object.values(releaseAnswers)) {
    if (p.isCancel(answer)) {
      p.cancel('Release aborted')
      return
    }
  }

  // For 'custom' selections, ask for an explicit version — batch when more than one
  const customPkgs = releaseConfigs.filter(
    (cfg) => releaseAnswers[cfg.name] === 'custom'
  )

  const customAnswers: Record<string, string | symbol> =
    customPkgs.length === 0
      ? {}
      : customPkgs.length === 1
        ? {
            [customPkgs[0]!.name]: await p.text({
              id: `custom:${customPkgs[0]!.name}`,
              message: `Input custom version (${c.boldWhite(customPkgs[0]!.name)})`,
              initialValue: customPkgs[0]!.currentVersion,
            }),
          }
        : await p.batch(
            Object.fromEntries(
              customPkgs.map((cfg) => [
                cfg.name,
                p.batch.text({
                  id: `custom:${cfg.name}`,
                  message: `Input custom version (${c.boldWhite(cfg.name)})`,
                  initialValue: cfg.currentVersion,
                }),
              ])
            )
          )

  for (const answer of Object.values(customAnswers)) {
    if (p.isCancel(answer)) {
      p.cancel('Release aborted')
      return
    }
  }

  const pkgWithVersions: PackageInfo[] = []
  for (const {
    name,
    path,
    pkg,
    relativePath,
    lastTag,
    lastTagDate,
  } of packagesToRelease) {
    const selection = releaseAnswers[name] as string
    const version =
      selection === 'custom' ? (customAnswers[name] as string) : selection

    if (!semver.valid(version)) {
      throw new Error(`invalid target version: ${version}`)
    }

    pkgWithVersions.push({
      name,
      path,
      relativePath,
      version,
      pkg,
      // start is set later
      start: '',
      lastTag,
      lastTagDate,
    })
  }

  // put the main package first as others might depend on it
  const mainPkgIndex = packagesToRelease.findIndex(
    ({ name }) => name === MAIN_PKG_NAME
  )
  if (mainPkgIndex > 0) {
    packagesToRelease.unshift(packagesToRelease.splice(mainPkgIndex, 1)[0])
  }

  // Skip confirms in agent mode: they add no value, and a post-changelog confirm
  // would force the script to re-run after changelog generation (duplicating the
  // side-effects from updateVersions through conventional-changelog).
  if (!p.isAgent()) {
    const isReleaseConfirmed = await p.confirm({
      id: 'confirmRelease',
      message: `Releasing \n${pkgWithVersions
        .map(
          ({ name, version }) =>
            `  · ${c.white(name)}: ${c.boldYellow(`v${version}`)}`
        )
        .join('\n')}\nConfirm?`,
    })

    if (p.isCancel(isReleaseConfirmed) || !isReleaseConfirmed) {
      p.cancel('Release aborted')
      return
    }
  }

  step('\nUpdating versions in package.json files...')
  updateVersions(pkgWithVersions)

  if (!IS_MAIN_PKG_AT_ROOT && mainPkgIndex > -1) {
    step('\nCopying README from root to main package...')
    const originalReadme = resolve(__dirname, '../README.md')
    const targetReadme = resolve(
      __dirname,
      '../',
      pkgWithVersions.find((p) => p.name === MAIN_PKG_NAME)!.relativePath,
      'README.md'
    )
    if (!isDryRun) {
      fs.copyFileSync(originalReadme, targetReadme)
    } else {
      console.log(`(skipped) cp "${originalReadme}" "${targetReadme}"`)
    }
  }

  if (!noLockUpdate) {
    step('\nUpdating lock...')
    await runIfNotDry(`pnpm`, ['install'])
  }

  step('\nGenerating changelogs...')
  await Promise.all(
    pkgWithVersions.map(async (pkg) => {
      step(` -> ${pkg.name} (${pkg.path})`)
      const changelogExists = fs.existsSync(join(pkg.path, 'CHANGELOG.md'))

      if (!changelogExists) {
        console.log(c.yellow(`No CHANGELOG.md found in ${pkg.name}`))
      }

      await runIfNotDry(
        `pnpm`,
        [
          'exec',
          'conventional-changelog',
          '-i',
          'CHANGELOG.md',
          '--same-file',
          '-p',
          'angular',
          '-r',
          changelogExists ? '1' : '0',
          '--commit-path',
          // in the case of a mono repo with the main package at the root
          // using `.` would add all the changes of all packages
          ...(pkg.name === MAIN_PKG_NAME && IS_MAIN_PKG_AT_ROOT
            ? [join(pkg.path, 'src'), join(pkg.path, 'package.json')]
            : ['.']),
          ...(pkg.name === MAIN_PKG_NAME
            ? []
            : ['--tag-prefix', `${pkg.name}@`]),
        ],
        { cwd: pkg.path }
      )
      // NOTE: lint-staged is set up to format the markdown
      // NOTE: pnpm publish automatically copies the LICENSE file
    })
  )

  if (!p.isAgent()) {
    const isChangelogCorrect = await p.confirm({
      id: 'confirmChangelog',
      message: 'Are the changelogs correct?',
      initialValue: true,
    })

    if (p.isCancel(isChangelogCorrect) || !isChangelogCorrect) {
      p.cancel('Release aborted')
      return
    }
  }

  const { stdout } = await run('git', ['diff', 'HEAD'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', ...FILES_TO_COMMIT])
    await runIfNotDry('git', [
      'commit',
      '-m',
      `release: ${pkgWithVersions.map(({ name, version }) => `${name}@${version}`).join(' ')}`,
    ])
  } else {
    console.log('No changes to commit.')
  }

  step('\nCreating tags...')
  const versionsToPush: string[] = []
  for (const pkg of pkgWithVersions) {
    const tagName =
      pkg.name === MAIN_PKG_NAME
        ? `v${pkg.version}`
        : `${pkg.name}@${pkg.version}`

    versionsToPush.push(`refs/tags/${tagName}`)
    await runIfNotDry('git', [
      'tag',
      '-a',
      `${tagName}`,
      '-m',
      `Release ${tagName}`,
    ])
  }

  step('\nPushing to Github...')
  // NOTE: push tags one by one, GitHub silently skips push events when >3
  // tags are pushed in a single command, so CI workflows would never trigger.
  for (const tag of versionsToPush) {
    await runIfNotDry('git', ['push', 'origin', tag])
  }
  await runIfNotDry('git', ['push'])
}

function updateVersions(packageList: PackageInfo[]) {
  for (const { version, path, pkg, name } of packageList) {
    pkg.version = version
    if (!noDepsUpdate) {
      updateDeps(pkg, 'dependencies', packageList)
      updateDeps(pkg, 'peerDependencies', packageList)
    }
    const content = `${JSON.stringify(pkg, null, 2)}\n`
    if (isDryRun) {
      dryRun('write', [name], {
        version: pkg.version,
        dependencies: pkg.dependencies,
        peerDependencies: pkg.peerDependencies,
      })
    } else {
      fs.writeFileSync(join(path, 'package.json'), content)
    }
  }
}

function updateDeps(
  pkg: PackageJson,
  depType: 'dependencies' | 'peerDependencies',
  updatedPackages: PackageInfo[]
) {
  const deps = pkg[depType]
  if (!deps) return
  step(`Updating ${c.bold(depType)} for ${c.boldWhite(pkg.name)}...`)
  Object.keys(deps).forEach((dep) => {
    const updatedDep = updatedPackages.find((pkg) => pkg.name === dep)
    // avoid updated peer deps that are external like @vue/devtools-api
    if (dep && updatedDep && deps[dep]) {
      // skip any workspace reference, pnpm will handle it
      if (deps[dep].startsWith('workspace:')) {
        console.log(
          c.dimYellow(
            `${pkg.name} -> ${depType} -> ${dep}@${deps[dep]} (skipped)`
          )
        )
      } else {
        console.log(
          c.yellow(
            `${pkg.name} -> ${depType} -> ${dep}@>=${updatedDep.version}`
          )
        )
        deps[dep] = `>=${updatedDep.version}`
      }
    }
  })
}

/**
 * Get the last tag published for a package, along with its author date, or
 * null if there are no tags for this package.
 */
async function getLastTag(
  pkgName: string
): Promise<{ tag: string; date: string | null } | null> {
  const pattern = pkgName === MAIN_PKG_NAME ? 'v*' : `${pkgName}@*`
  const prefix = pkgName === MAIN_PKG_NAME ? 'v' : `${pkgName}@`

  try {
    const { stdout } = await run('git', ['tag', '-l', pattern], {
      stdio: 'pipe',
    })
    const tags = stdout.split('\n').filter(Boolean)

    if (tags.length === 0) {
      return null
    }

    const sortedTags = tags
      .map((tag) => ({ tag, version: semver.parse(tag.replace(prefix, '')) }))
      .filter(
        (t): t is { tag: string; version: semver.SemVer } => t.version !== null
      )
      .sort((a, b) => semver.rcompare(a.version, b.version))

    if (!sortedTags[0]) {
      return null
    }

    const tag = sortedTags[0].tag
    let date: string | null = null
    try {
      const { stdout: dateStdout } = await run(
        'git',
        ['log', '-1', '--format=%as', tag],
        {
          stdio: 'pipe',
        }
      )
      date = dateStdout || null
    } catch {
      // leave date null
    }

    return { tag, date }
  } catch (error: any) {
    console.error(error)
    return null
  }
}

/**
 * Get the initial commit SHA to use as a diff baseline when a package has
 * no previous release tag.
 */
async function getFirstCommit(): Promise<string> {
  const { stdout } = await run('git', ['rev-list', '--max-parents=0', 'HEAD'], {
    stdio: 'pipe',
  })
  return stdout
}

/**
 * Get the packages that have changed. Based on `lerna changed` but without lerna.
 */
async function getChangedPackages(
  ...folders: string[]
): Promise<PackageInfo[]> {
  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!fs.lstatSync(folder).isDirectory()) {
        console.warn(c.dim(`Skipping "${folder}" as it is not a directory`))
        return null
      }

      const pkg: PackageJson = JSON.parse(
        fs.readFileSync(join(folder, 'package.json'), 'utf-8')
      )
      if (pkg.private) {
        console.info(c.dim(`Skipping "${pkg.name}" it's private`))
        return null
      }

      const lastTagInfo = await getLastTag(pkg.name)
      const diffStart = lastTagInfo?.tag ?? (await getFirstCommit())
      if (!lastTagInfo) {
        console.log(
          c.dim(
            `No previous tag for "${c.bold(pkg.name)}", diffing from first commit...`
          )
        )
      }

      const hasChanges = (
        await run(
          'git',
          [
            'diff',
            '--name-only',
            diffStart,
            '--',
            // TODO: should allow build files tsdown.config.ts
            // apparently {src,package.json} doesn't work
            join(folder, 'src'),
            join(folder, 'index.js'),
            // TODO: should not check dev deps and should compare to last tag changes
            join(folder, 'package.json'),
          ],
          { stdio: 'pipe' }
        )
      ).stdout
      const relativePath = relative(join(__dirname, '..'), folder)

      const rel = daysAgo(lastTagInfo?.date ?? null)
      const releaseDescription = lastTagInfo
        ? `${lastTagInfo.tag}${rel ? ` (${rel})` : ''}`
        : 'no previous release'

      if (hasChanges || skipChangeCheck) {
        const changedFiles = hasChanges.split('\n').filter(Boolean)
        console.log(
          c.dimBlue(
            `Found ${changedFiles.length} changed files in "${pkg.name}" since ${releaseDescription}`
          )
        )
        console.log(c.dim(`"${changedFiles.join('", "')}"`))

        return {
          path: folder,
          relativePath,
          name: pkg.name,
          version: pkg.version,
          pkg,
          start: diffStart,
          lastTag: lastTagInfo?.tag ?? null,
          lastTagDate: lastTagInfo?.date ?? null,
        }
      } else {
        console.warn(
          c.dim(
            `Skipping "${pkg.name}" as it has no changes since ${releaseDescription}`
          )
        )
        return null
      }
    })
  )

  return pkgs.filter((p): p is PackageInfo => !!p)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
