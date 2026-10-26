import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { createPineappleScene } from '../src/pineapple.ts'
import './node-polyfills.ts'

const out = fileURLToPath(new URL('../public/pinia.glb', import.meta.url))
const scene = createPineappleScene()
const glb = (await new GLTFExporter().parseAsync(scene, {
  binary: true,
  // every expression is exported, bindPineapple() picks the visible one
  onlyVisible: false,
})) as ArrayBuffer

await writeFile(out, Buffer.from(glb))
console.log(`${out} (${(glb.byteLength / 1024).toFixed(0)} KiB)`)
