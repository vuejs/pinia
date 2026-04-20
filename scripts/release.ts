import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import semver, { type ReleaseType } from 'semver'
import prompts from '@posva/prompts'
import { execa, type Options as ExecaOptions } from 'execa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const {
  values: {
    tag: optionTag,
    dry: isDryRun,
    skipCleanCheck: skipCleanGitCheck,
    noDepsUpdate,
    noLockUpdate,
    skipBuild,
    noPublish,
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
    skipBuild: { type: 'boolean', default: false },
    noPublish: { type: 'boolean', default: false },
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
  --skipBuild         Skip building packages
  --tag               Publish under a given npm dist tag
  --dry               Dry run
  --skipCleanCheck    Skip checking if the git repo is clean
  --noDepsUpdate      Skip updating dependencies in package.json files
  --noPublish         Skip publishing packages
  --noLockUpdate      Skips updating the lock with "pnpm install"
  --all               Skip checking if the packages have changed since last release
`.trim(),
  )
  process.exit(0)
}

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

const run = (bin: string, args: string[], opts: ExecaOptions = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

const dryRun = async (bin: string, args: string[], opts: unknown = {}) =>
  console.log(chalk.blue(`[dry-run] ${bin} ${args.join(' ')}`), opts)

const runIfNotDry = isDryRun ? dryRun : run

const step = (...msg: string[]) => console.log(chalk.cyan(...msg))

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
    const isDirtyGit = !!(await run('git', ['status', '--porcelain'], { stdio: 'pipe' })).stdout

    if (isDirtyGit) {
      console.log(chalk.red(`Git repo isn't clean.`))
      return
    }

    const currentBranch = (await run('git', ['branch', '--show-current'], { stdio: 'pipe' })).stdout

    if (currentBranch !== EXPECTED_BRANCH) {
      console.log(
        chalk.red(`You should be on branch "${EXPECTED_BRANCH}" but are on "${currentBranch}"`),
      )
      return
    }
  } else {
    console.log(chalk.bold.white(`Skipping git checks...`))
  }

  if (!skipCleanGitCheck) {
    const isOutdatedRE = new RegExp(
      `\\W${EXPECTED_BRANCH}\\W.*(?:fast-forwardable|local out of date)`,
      'i',
    )

    const isOutdatedGit = isOutdatedRE.test(
      (await run('git', ['remote', 'show', 'origin'], { stdio: 'pipe' })).stdout as string,
    )

    if (isOutdatedGit) {
      console.log(chalk.red(`Git branch is not in sync with remote`))
      return
    }
  }

  const changedPackages = await getChangedPackages(...PKG_FOLDERS)

  if (!changedPackages.length) {
    console.log(chalk.red(`No packages have changed since last release`))
    return
  }

  if (isDryRun) {
    console.log(`\n${chalk.bold.blue('This is a dry run')}\n`)
  }

  let packagesToRelease = changedPackages

  // if there are more than one package, ask which ones to release
  if (packagesToRelease.length > 1) {
    // allow to select which packages
    const { pickedPackages } = await prompts({
      type: 'multiselect',
      name: 'pickedPackages',
      message: 'What packages do you want to release?',
      instructions: false,
      min: 1,
      choices: changedPackages.map((pkg) => {
        const rel = daysAgo(pkg.lastTagDate)
        const suffix = pkg.lastTag
          ? `${pkg.lastTag}${rel ? ` (${rel})` : ''}`
          : 'no previous release'
        return {
          title: `${pkg.name} ${chalk.dim(`— ${suffix}`)}`,
          value: pkg.name,
          selected: true,
        }
      }),
    })

    packagesToRelease = changedPackages.filter((pkg) => pickedPackages.includes(pkg.name))
  }

  step(`Ready to release ${packagesToRelease.map(({ name }) => chalk.bold.white(name)).join(', ')}`)

  const pkgWithVersions: PackageInfo[] = []
  for (const { name, path, pkg, relativePath, lastTag, lastTagDate } of packagesToRelease) {
    let { version } = pkg

    const prerelease = semver.prerelease(version)
    const preId = prerelease && prerelease[0]

    const versionIncrements: ReleaseType[] = [
      'patch',
      'minor',
      'major',
      ...(preId ? (['prepatch', 'preminor', 'premajor', 'prerelease'] as const) : []),
    ]

    const betaVersion = semver.inc(version, 'prerelease', 'beta')

    const { release } = await prompts({
      type: 'select',
      name: 'release',
      message: `Select release type for ${chalk.bold.white(name)}`,
      choices: versionIncrements
        .map((release) => {
          const newVersion = semver.inc(version, release, preId as string)
          return {
            value: newVersion,
            title: `${release}: ${name} (${newVersion})`,
          }
        })
        .concat(
          optionTag === 'beta'
            ? [
                {
                  title: `beta: ${name} (${betaVersion})`,
                  value: betaVersion,
                },
              ]
            : [],
        )
        .concat([{ value: 'custom', title: 'custom' }]),
    })

    if (release === 'custom') {
      version = (
        await prompts({
          type: 'text',
          name: 'version',
          message: `Input custom version (${chalk.bold.white(name)})`,
          initial: version,
        })
      ).version
    } else {
      version = release
    }

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
  const mainPkgIndex = packagesToRelease.findIndex(({ name }) => name === MAIN_PKG_NAME)
  if (mainPkgIndex > 0) {
    packagesToRelease.unshift(packagesToRelease.splice(mainPkgIndex, 1)[0]!)
  }

  const { yes: isReleaseConfirmed } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing \n${pkgWithVersions
      .map(({ name, version }) => `  · ${chalk.white(name)}: ${chalk.yellow.bold(`v${version}`)}`)
      .join('\n')}\nConfirm?`,
  })

  if (!isReleaseConfirmed) {
    return
  }

  step('\nUpdating versions in package.json files...')
  await updateVersions(pkgWithVersions)

  if (!noLockUpdate) {
    step('\nUpdating lock...')
    await runIfNotDry(`pnpm`, ['install'])
  }

  step('\nGenerating changelogs...')
  await Promise.all(
    pkgWithVersions.map(async (pkg) => {
      step(` -> ${pkg.name} (${pkg.path})`)
      const changelogExists = existsSync(join(pkg.path, 'CHANGELOG.md'))

      if (!changelogExists) {
        console.log(chalk.yellow(`No CHANGELOG.md found in ${pkg.name}`))
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
          'conventionalcommits',
          '-r',
          changelogExists ? '1' : '0',
          '--commit-path',
          // in the case of a mono repo with the main package at the root
          // using `.` would add all the changes of all packages
          ...(pkg.name === MAIN_PKG_NAME && IS_MAIN_PKG_AT_ROOT
            ? [join(pkg.path, 'src'), join(pkg.path, 'package.json')]
            : ['.']),
          ...(pkg.name === MAIN_PKG_NAME ? [] : ['--lerna-package', pkg.name]),
          ...(pkg.name === MAIN_PKG_NAME ? [] : ['--tag-prefix', `${pkg.name}@`]),
        ],
        { cwd: pkg.path },
      )
      await runIfNotDry(`pnpm`, ['exec', 'oxfmt', 'CHANGELOG.md'], { cwd: pkg.path })
      // NOTE: pnpm publish automatically copies the LICENSE file
    }),
  )

  const { yes: isChangelogCorrect } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: 'Are the changelogs correct?',
    initial: true,
  })

  if (!isChangelogCorrect) {
    return
  }

  step('\nBuilding all packages...')
  if (!skipBuild) {
    await runIfNotDry('pnpm', ['run', 'build'])
  } else {
    console.log(`(skipped)`)
  }

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
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
    const tagName = pkg.name === MAIN_PKG_NAME ? `v${pkg.version}` : `${pkg.name}@${pkg.version}`

    versionsToPush.push(`refs/tags/${tagName}`)
    await runIfNotDry('git', ['tag', '-a', `${tagName}`, '-m', `Release ${tagName}`])
  }

  if (!noPublish) {
    step('\nPublishing packages...')
    for (const pkg of pkgWithVersions) {
      await publishPackage(pkg)
    }

    step('\nPushing to Github...')
    // NOTE: push tags one by one, GitHub silently skips push events when >3
    // tags are pushed in a single command, so CI workflows would never trigger.
    for (const tag of versionsToPush) {
      await runIfNotDry('git', ['push', 'origin', tag])
    }
    await runIfNotDry('git', ['push'])
  } else {
    console.log(chalk.bold.white(`Skipping publishing...`))
  }
}

async function updateVersions(packageList: PackageInfo[]) {
  return Promise.all(
    packageList.map(({ pkg, version, path, name }) => {
      pkg.version = version
      if (!noDepsUpdate) {
        updateDeps(pkg, 'dependencies', packageList)
        updateDeps(pkg, 'peerDependencies', packageList)
      }
      const content = `${JSON.stringify(pkg, null, 2)}\n`
      return isDryRun
        ? dryRun('write', [name], {
            version: pkg.version,
            dependencies: pkg.dependencies,
            peerDependencies: pkg.peerDependencies,
          })
        : fs.writeFile(join(path, 'package.json'), content)
    }),
  )
}

function updateDeps(
  pkg: PackageJson,
  depType: 'dependencies' | 'peerDependencies',
  updatedPackages: PackageInfo[],
) {
  const deps = pkg[depType]
  if (!deps) return
  step(`Updating ${chalk.bold(depType)} for ${chalk.bold.white(pkg.name)}...`)
  Object.keys(deps).forEach((dep) => {
    const updatedDep = updatedPackages.find((pkg) => pkg.name === dep)
    // avoid updated peer deps that are external like @vue/devtools-api
    if (dep && updatedDep && deps[dep]) {
      // skip any workspace reference, pnpm will handle it
      if (deps[dep].startsWith('workspace:')) {
        console.log(chalk.yellow.dim(`${pkg.name} -> ${depType} -> ${dep}@${deps[dep]} (skipped)`))
      } else {
        console.log(chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@>=${updatedDep.version}`))
        deps[dep] = `>=${updatedDep.version}`
      }
    }
  })
}

async function publishPackage(pkg: PackageInfo) {
  step(`Publishing ${pkg.name}...`)

  try {
    await runIfNotDry(
      'pnpm',
      [
        'publish',
        ...(optionTag ? ['--tag', optionTag] : []),
        ...(skipCleanGitCheck ? ['--no-git-checks'] : []),
        '--access',
        'public',
        // only needed for branches other than main
        '--publish-branch',
        EXPECTED_BRANCH,
      ],
      {
        cwd: pkg.path,
        stdio: 'pipe',
      },
    )
    console.log(chalk.green(`Successfully published ${pkg.name}@${pkg.version}`))
  } catch (e: any) {
    if (e.stderr?.match?.(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkg.name}`))
    } else {
      throw e
    }
  }
}

/**
 * Get the last tag published for a package, along with its author date, or
 * null if there are no tags for this package.
 */
async function getLastTag(pkgName: string): Promise<{ tag: string; date: string | null } | null> {
  try {
    const { stdout: tag } = await run(
      'git',
      [
        'describe',
        '--tags',
        '--abbrev=0',
        '--match',
        pkgName === MAIN_PKG_NAME ? 'v*' : `${pkgName}@*`,
      ],
      { stdio: 'pipe' },
    )

    let date: string | null = null
    try {
      const { stdout } = await run('git', ['log', '-1', '--format=%as', tag as string], {
        stdio: 'pipe',
      })
      date = (stdout as string) || null
    } catch {
      // leave date null
    }

    return { tag: tag as string, date }
  } catch (error: any) {
    // 128 is the git exit code when there is nothing to describe
    if (error.exitCode !== 128) {
      console.error(error)
    }
    return null
  }
}

/**
 * Get the initial commit SHA to use as a diff baseline when a package has
 * no previous release tag.
 */
async function getFirstCommit(): Promise<string> {
  const { stdout } = await run('git', ['rev-list', '--max-parents=0', 'HEAD'], { stdio: 'pipe' })
  return stdout as string
}

/**
 * Get the packages that have changed. Based on `lerna changed` but without lerna.
 */
async function getChangedPackages(...folders: string[]): Promise<PackageInfo[]> {
  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) {
        console.warn(chalk.dim(`Skipping "${folder}" as it is not a directory`))
        return null
      }

      const pkg: PackageJson = JSON.parse(await fs.readFile(join(folder, 'package.json'), 'utf-8'))
      if (pkg.private) {
        console.info(chalk.dim(`Skipping "${pkg.name}" it's private`))
        return null
      }

      const lastTagInfo = await getLastTag(pkg.name)
      const diffStart = lastTagInfo?.tag ?? (await getFirstCommit())
      if (!lastTagInfo) {
        console.log(
          chalk.dim(`No previous tag for "${chalk.bold(pkg.name)}", diffing from first commit...`),
        )
      }

      const { stdout: hasChanges } = await run(
        'git',
        [
          'diff',
          '--name-only',
          diffStart,
          '--',
          // apparently {src,package.json} doesn't work
          join(folder, 'src'),
          // TODO: should not check dev deps and should compare to last tag changes
          join(folder, 'package.json'),
        ],
        { stdio: 'pipe' },
      )
      const relativePath = relative(join(__dirname, '..'), folder)

      const rel = daysAgo(lastTagInfo?.date ?? null)
      const releaseDescription = lastTagInfo
        ? `${lastTagInfo.tag}${rel ? ` (${rel})` : ''}`
        : 'no previous release'

      if (hasChanges || skipChangeCheck) {
        const changedFiles = (hasChanges as string).split('\n').filter(Boolean)
        console.log(
          chalk.dim.blueBright(
            `Found ${changedFiles.length} changed files in "${pkg.name}" since ${releaseDescription}`,
          ),
        )
        console.log(chalk.dim(`"${changedFiles.join('", "')}"`))

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
          chalk.dim(`Skipping "${pkg.name}" as it has no changes since ${releaseDescription}`),
        )
        return null
      }
    }),
  )

  return pkgs.filter((p): p is PackageInfo => !!p)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
