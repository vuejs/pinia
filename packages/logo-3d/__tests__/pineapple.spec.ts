import {
  Bone,
  type Mesh,
  type MeshStandardMaterial,
  Object3D,
  Vector3,
} from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { describe, expect, it } from 'vitest'
import '../scripts/node-polyfills.ts'
import { MOUTH_RECT, PIXELS_PER_UNIT } from '../src/face.ts'
import { createRaster } from '../src/paint.ts'
import {
  bindPineapple,
  createPineapple,
  createPineappleScene,
  type Pineapple,
} from '../src/pineapple.ts'

// GLTFLoader decodes embedded images with createImageBitmap, keep only their size
Object.assign(globalThis, {
  self: globalThis,
  createImageBitmap: async (blob: Blob) => {
    const png = new DataView(await blob.arrayBuffer())
    return { width: png.getUint32(16), height: png.getUint32(20), close() {} }
  },
})

function visibleVariants(socket: Object3D): string[] {
  return socket.children
    .filter((c) => c.visible && c.userData.expression)
    .map((c) => c.userData.expression)
}

function leafTips(p: Pineapple): Vector3[] {
  const tips: Vector3[] = []
  p.crown.traverse((o) => {
    if ((o as Bone).isBone && !o.children.length)
      tips.push(o.getWorldPosition(new Vector3()))
  })
  return tips
}

function simulate(p: Pineapple, seconds: number, each?: (t: number) => void) {
  for (let t = 0; t < seconds; t += 1 / 60) {
    each?.(t)
    p.update(1 / 60)
  }
}

describe('Pinia 3D logo', () => {
  it('shows one expression per socket', () => {
    const p = createPineapple()
    expect(p.expression).toBe('happy')
    for (const socket of Object.values(p.sockets))
      expect(visibleVariants(socket)).toEqual(['happy'])

    p.setExpression('love')
    for (const socket of Object.values(p.sockets))
      expect(visibleVariants(socket)).toEqual(['love'])
    expect(() => p.setExpression('nope')).toThrow(/unknown expression/)
  })

  it('accepts custom features in a socket', () => {
    const p = createPineapple()
    const custom = new Object3D()
    custom.userData.expression = 'happy'
    p.sockets.mouth.add(custom)
    p.setExpression('sad')
    expect(custom.visible).toBe(false)
    p.setExpression('happy')
    expect(custom.visible).toBe(true)
  })

  it('leaves lag behind a moving body and settle back', () => {
    const p = createPineapple()
    p.root.updateMatrixWorld(true)
    const rest = leafTips(p)

    simulate(p, 0.25, (t) => (p.root.position.x = t * 8))
    const offset = new Vector3(2, 0, 0)
    const moving = leafTips(p)
    const lag = moving.map((tip, i) =>
      tip.distanceTo(rest[i]!.clone().add(offset))
    )
    expect(Math.max(...lag)).toBeGreaterThan(0.1)

    simulate(p, 4)
    const settled = leafTips(p).map((tip, i) =>
      tip.distanceTo(rest[i]!.clone().add(offset))
    )
    expect(Math.max(...settled)).toBeLessThan(Math.max(...lag) / 3)
  })

  it('keeps the crown on top when squashed', () => {
    const p = createPineapple()
    const top = () => p.crown.getWorldPosition(new Vector3()).y
    const before = top()
    p.setSquash(0.8)
    p.root.updateMatrixWorld(true)
    expect(top()).toBeCloseTo(before * 0.8)
  })

  it('round trips through GLB with expressions and spring bones', async () => {
    const glb = (await new GLTFExporter().parseAsync(createPineappleScene(), {
      binary: true,
      onlyVisible: false,
    })) as ArrayBuffer
    const gltf = await new GLTFLoader().parseAsync(glb, '')
    const p = bindPineapple(gltf.scene.getObjectByName('Pineapple')!)

    expect(p.expressions.map((e) => e.name)).toEqual(
      createPineapple().expressions.map((e) => e.name)
    )
    p.setExpression('wink')
    expect(visibleVariants(p.sockets.eyeL)).toEqual(['wink'])
    expect(p.springs.joints.length).toBe(7 * 4)
    const mouth = p.sockets.mouth.children.find((c) => c.visible) as Mesh
    const image = (mouth.material as MeshStandardMaterial).map!.image as {
      width: number
      height: number
    }
    const raster = createRaster(MOUTH_RECT, PIXELS_PER_UNIT)
    expect([image.width, image.height]).toEqual([raster.width, raster.height])

    const rest = leafTips(p)
    simulate(p, 0.2, (t) => (p.root.rotation.y = t * 10))
    p.root.rotation.y = 0
    simulate(p, 0.01)
    const moved = leafTips(p).map((tip, i) => tip.distanceTo(rest[i]!))
    expect(Math.max(...moved)).toBeGreaterThan(0.05)
  })
})
