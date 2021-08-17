import fs from 'fs'
import { globby } from 'globby'
import path from 'path'
import chalk from 'chalk'
import { gzipSync } from 'zlib'
import { fileURLToPath } from 'url'
import { compress } from 'brotli-wasm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const file = fs.readFileSync(filePath)
  const minSize = (file.length / 1024).toFixed(2) + 'kb'
  const gzipped = gzipSync(file)
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
  const compressed = await compress(file)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}

async function main() {
  const paths = await globby(path.resolve(__dirname, '../dist/*.js'))

  for (const file of paths) {
    checkFileSize(file)
  }
}

main()
