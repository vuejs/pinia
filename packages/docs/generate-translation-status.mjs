// @ts-check
import { writeFile, readFile } from 'fs/promises'
import simpleGit from 'simple-git'

// The path to the translation status file.
const STATUS_FILE_PATH = './.vitepress/translation-status.json'

const usage = `
Usage: pnpm run docs:translation-status <locale> [<commit>]
  locale: The target locale to update.
  commit: The target commit to update. It could be a branch, a tag, or a hash. Default to 'v2'.`

async function getCommitInfo(commit) {
  try {
    const git = simpleGit()
    const log = await git.log([commit, '-n', '1'])
    const { hash, date } = log.latest
    return { hash, date: new Date(date).toISOString().substring(0, 10) }
  } catch (err) {
    return { hash: '', date: '' }
  }
}

async function writeLangMap(lang, hash, date) {
  const data = {}
  try {
    const previousContent = await readFile(STATUS_FILE_PATH, 'utf8')
    const previousJson = JSON.parse(previousContent)
    Object.assign(data, previousJson)
  } catch (err) {
    console.log('No previous status file. Will create a new one.')
  }
  data[lang] = {
    hash,
    date,
  }
  await writeFile(STATUS_FILE_PATH, JSON.stringify(data, null, 2))
}

async function main() {
  if (process.argv.find((arg) => arg === '--help' || arg === '-h')) {
    console.log(usage)
    return
  }

  const locale = process.argv[2]
  const commit = process.argv[3] || 'v2'

  const { hash, date } = await getCommitInfo(commit)
  if (!hash) {
    console.log(`❌ No commit found for "${commit}".`)
    return
  } else {
    await writeLangMap(locale, hash, date)
    console.log(`✅ Updated ${locale} to "${hash}" (${date})`)
  }
}

main()
