// @ts-check
import { readFile } from 'fs/promises'
import simpleGit from 'simple-git'

// The path to the translation status file.
const STATUS_FILE_PATH = './.vitepress/translation-status.json'

const usage = `
Usage: pnpm run docs:compare-to-translate <locale> [<commit>]
  locale: The target locale to compare.
  commit: The target commit to compare. It could be a branch, a tag, or a hash. Default to 'v2'.`

async function getLocaleHash(lang) {
  try {
    const content = await readFile(STATUS_FILE_PATH, 'utf8')
    const data = JSON.parse(content)
    return data[lang]?.hash
  } catch (err) {
    console.log('No previous status file. Will create a new one.')
  }
}

async function main() {
  if (process.argv.find((arg) => arg === '--help' || arg === '-h')) {
    console.log(usage)
    return
  }

  const locale = process.argv[2]
  const commit = process.argv[3] || 'v2'

  const hash = await getLocaleHash(locale)
  if (hash) {
    console.log(`The last checkpoint of docs(${locale}) is "${hash}".\n`)
    const git = simpleGit()
    const result = await git.diff([`${hash}..${commit}`, '.'])
    console.log(result)
    console.log(
      `\nAfter finishing the translation, you can run\n"pnpm run docs:translation-status ${locale} ${hash}"\nor\n"pnpm run docs:translation-status ${locale}${
        commit !== 'v2' ? ' ' + commit : ''
      }"\nto update the translation status file.`
    )
  } else {
    console.log(`No docs(${locale}) checkpoint found.\n`)
    console.log(usage)
  }
}

main()
