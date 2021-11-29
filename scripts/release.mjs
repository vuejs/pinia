import minimist from 'minimist'
import _fs from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import semver from 'semver'
import enquirer from 'enquirer'
import { execa } from 'execa'
import pSeries from 'p-series'
import { globby } from 'globby'

const { prompt } = enquirer
const fs = _fs.promises

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = minimist(process.argv.slice(2))
let {
  skipBuild,
  tag: optionTag,
  dry: isDryRun,
  skipCleanCheck: skipCleanGitCheck,
} = args

// const preId =
//   args.preid ||
//   (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const EXPECTED_BRANCH = 'v2'

const incrementVersion = (increment) =>
  semver.inc(currentVersion, increment, preId)
const bin = (name) => resolve(__dirname, '../node_modules/.bin/' + name)
/**
 * @param bin {string}
 * @param args {string}
 * @param opts {import('execa').CommonOptions<string>}
 * @returns
 */
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
const runIfNotDry = isDryRun ? dryRun : run
const getPkgRoot = (pkg) => resolve(__dirname, '../packages/' + pkg)
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  if (!skipCleanGitCheck) {
    const isDirtyGit = !!(
      await run('git', ['status', '--porcelain'], { stdio: 'pipe' })
    ).stdout

    if (isDirtyGit) {
      console.log(chalk.red(`Git repo isn't clean.`))
      return
    }

    const currentBranch = (
      await run('git', ['branch', '--show-current'], { stdio: 'pipe' })
    ).stdout

    if (currentBranch !== EXPECTED_BRANCH) {
      console.log(
        chalk.red(
          `You should be on brach "${EXPECTED_BRANCH}" but are on "${currentBranch}"`
        )
      )
      return
    }
  } else {
    console.log(chalk.bold.white(`Skipping git checks...`))
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
      console.log(chalk.red(`Git branch is not in sync with remote`))
      return
    }
  }

  const changedPackages = await getChangedPackages()
  if (!changedPackages.length) {
    console.log(chalk.red(`No packages have changed since last release`))
    return
  }

  if (isDryRun) {
    console.log('\n' + chalk.bold.blue('This is a dry run') + '\n')
  }

  step(
    `Ready to release ${changedPackages
      .map(({ name }) => chalk.bold.white(name))
      .join(', ')}`
  )

  const pkgWithVersions = await pSeries(
    changedPackages.map(({ name, path, pkg }) => async () => {
      let { version } = pkg

      const prerelease = semver.prerelease(version)
      const preId = prerelease && prerelease[0]

      const versionIncrements = [
        'patch',
        'minor',
        'major',
        ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
      ]

      const { release } = await prompt({
        type: 'select',
        name: 'release',
        message: `Select release type for ${chalk.bold.white(name)}`,
        choices: versionIncrements
          .map((i) => `${i}: ${name} (${semver.inc(version, i, preId)})`)
          .concat(['custom']),
      })

      if (release === 'custom') {
        version = (
          await prompt({
            type: 'input',
            name: 'version',
            message: `Input custom version (${chalk.bold.white(name)})`,
            initial: version,
          })
        ).version
      } else {
        version = release.match(/\((.*)\)/)[1]
      }

      if (!semver.valid(version)) {
        throw new Error(`invalid target version: ${version}`)
      }

      return { name, path, version, pkg }
    })
  )

  const { yes: isReleaseConfirmed } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing \n${pkgWithVersions
      .map(
        ({ name, version }) =>
          `  · ${chalk.white(name)}: ${chalk.yellow.bold('v' + version)}`
      )
      .join('\n')}\nConfirm?`,
  })

  if (!isReleaseConfirmed) {
    return
  }

  step('\nUpdating versions in package.json files...')
  await updateVersions(pkgWithVersions)

  step('\nGenerating changelogs...')
  for (const pkg of pkgWithVersions) {
    await runIfNotDry(`yarn`, ['changelog'], { cwd: pkg.path })
    await runIfNotDry(`yarn`, ['prettier', '--write', 'CHANGELOG.md'], {
      cwd: pkg.path,
    })
    await fs.copyFile(
      resolve(__dirname, '../LICENSE'),
      resolve(pkg.path, 'LICENSE')
    )
  }

  const { yes: isChangelogCorrect } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: 'Are the changelogs correct?',
  })

  if (!isChangelogCorrect) {
    return
  }

  step('\nBuilding all packages...')
  if (!skipBuild && !isDryRun) {
    await run('yarn', ['build'])
    await run('yarn', ['build:dts'])
  } else {
    console.log(`(skipped)`)
  }

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', [
      'add',
      'packages/*/CHANGELOG.md',
      'packages/*/package.json',
    ])
    await runIfNotDry('git', [
      'commit',
      '-m',
      `release: ${pkgWithVersions
        .map(({ name, version }) => `${name}@${version}`)
        .join(' ')}`,
    ])
  } else {
    console.log('No changes to commit.')
  }

  step('\nCreating tags...')
  let versionsToPush = []
  for (const pkg of pkgWithVersions) {
    versionsToPush.push(`refs/tags/${pkg.name}@${pkg.version}`)
    await runIfNotDry('git', ['tag', `${pkg.name}@${pkg.version}`])
  }

  step('\nPublishing packages...')
  for (const pkg of pkgWithVersions) {
    await publishPackage(pkg)
  }

  step('\nPushing to Github...')
  await runIfNotDry('git', ['push', 'origin', ...versionsToPush])
  await runIfNotDry('git', ['push'])
}

/**
 *
 * @param packageList {{ name: string; path: string; version: string, pkg: any }}
 */
async function updateVersions(packageList) {
  return Promise.all(
    packageList.map(({ pkg, version, path, name }) => {
      pkg.version = version
      updateDeps(pkg, 'dependencies', packageList)
      updateDeps(pkg, 'peerDependencies', packageList)
      const content = JSON.stringify(pkg, null, 2) + '\n'
      return isDryRun
        ? dryRun('write', [name], content)
        : fs.writeFile(join(path, 'package.json'), content)
    })
  )
}

function updateDeps(pkg, depType, updatedPackages) {
  const deps = pkg[depType]
  if (!deps) return
  step(`Updating ${chalk.bold(depType)} for ${chalk.bold.white(pkg.name)}...`)
  Object.keys(deps).forEach((dep) => {
    const updatedDep = updatedPackages.find((pkg) => pkg.name === dep)
    // avoid updated peer deps that are external like @vue/devtools-api
    if (dep && updatedDep) {
      console.log(
        chalk.yellow(
          `${pkg.name} -> ${depType} -> ${dep}@~${updatedDep.version}`
        )
      )
      deps[dep] = '~' + updatedDep.version
    }
  })
}

async function publishPackage(pkg) {
  step(`Publishing ${pkg.name}...`)

  try {
    await runIfNotDry(
      'yarn',
      [
        'publish',
        '--new-version',
        pkg.version,
        '--no-commit-hooks',
        '--no-git-tag-version',
        ...(optionTag ? ['--tag', optionTag] : []),
        '--access',
        'public',
      ],
      {
        cwd: pkg.path,
        stdio: 'pipe',
      }
    )
    console.log(
      chalk.green(`Successfully published ${pkg.name}@${pkg.version}`)
    )
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkg.name}`))
    } else {
      throw e
    }
  }
}

/**
 * Get the packages that have changed based on `lerna changed`.
 *
 * @returns {Promise<{ name: string; path: string; pkg: any; version: string }[]}
 */
async function getChangedPackages() {
  const { stdout: lastTag } = await run(
    'git',
    ['describe', '--tags', '--abbrev=0'],
    { stdio: 'pipe' }
  )
  const folders = await globby(join(__dirname, '../packages/*'), {
    onlyFiles: false,
  })

  const pkgs = await Promise.all(
    folders.map(async (folder) => {
      if (!(await fs.lstat(folder)).isDirectory()) return null

      const pkg = JSON.parse(await fs.readFile(join(folder, 'package.json')))
      if (!pkg.private) {
        const { stdout: hasChanges } = await run(
          'git',
          [
            'diff',
            lastTag,
            '--',
            // apparently {src,package.json} doesn't work
            join(folder, 'src'),
            join(folder, 'package.json'),
          ],
          { stdio: 'pipe' }
        )

        if (hasChanges) {
          return {
            path: folder,
            name: pkg.name,
            version: pkg.version,
            pkg,
          }
        } else {
          return null
        }
      }
    })
  )

  return pkgs.filter((p) => p)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
