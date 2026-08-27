// @ts-check
import fs from 'node:fs'
import { globby } from 'globby'
import path from 'node:path'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

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
  const compressed = brotliCompressSync(file)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `\x1b[1;90m${path.basename(filePath)}\x1b[0m min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}

async function main() {
  const paths = await globby(path.resolve(__dirname, '../dist/*.js'))

  for (const file of paths) {
    checkFileSize(file)
  }
}

main()
