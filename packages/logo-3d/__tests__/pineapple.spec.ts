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
import { PIXELS_PER_UNIT } from '../src/face.ts'
import { EXPRESSIONS } from '../src/expressions.ts'
import { bounds, createRaster, paint } from '../src/paint.ts'
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
    const raster = createRaster(mouth.userData.rect, PIXELS_PER_UNIT)
    expect([image.width, image.height]).toEqual([raster.width, raster.height])

    const rest = leafTips(p)
    simulate(p, 0.2, (t) => (p.root.rotation.y = t * 10))
    p.root.rotation.y = 0
    simulate(p, 0.01)
    const moved = leafTips(p).map((tip, i) => tip.distanceTo(rest[i]!))
    expect(Math.max(...moved)).toBeGreaterThan(0.05)
  })

  it('keeps the pupils inside the eye white', () => {
    for (const look of [
      [1, 1],
      [-1, 0],
      [0, -1],
    ] as [number, number][]) {
      const layers = EXPRESSIONS.happy.eye(1, { look, pupil: 1.4 })
      const raster = paint(
        createRaster(bounds(layers, [-1, -1, 1, 1]), 400),
        layers
      )
      const { width, height, rect, data } = raster
      let ink = 0
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          const k = (j * width + i) * 4
          if (data[k + 3]! < 250 || data[k]! > 60) continue
          ink++
          const x = rect[0] + ((i + 0.5) / width) * (rect[2] - rect[0])
          const y = rect[1] + ((j + 0.5) / height) * (rect[3] - rect[1])
          // the white is 0.26 wide and keeps a rim around the pupil
          expect(Math.hypot(x, y)).toBeLessThan(0.25)
        }
      }
      expect(ink).toBeGreaterThan(1000)
    }
  })

  it('changes the leaf volume with the thickness', () => {
    const p = createPineapple()
    const volume = () =>
      p.leaves.reduce((sum, leaf) => {
        const pos = leaf.geometry.getAttribute('position')
        const index = leaf.geometry.index!
        const a = new Vector3()
        const b = new Vector3()
        const c = new Vector3()
        let v = 0
        for (let i = 0; i < index.count; i += 3) {
          a.fromBufferAttribute(pos, index.getX(i))
          b.fromBufferAttribute(pos, index.getX(i + 1))
          c.fromBufferAttribute(pos, index.getX(i + 2))
          v += a.dot(b.cross(c)) / 6
        }
        return sum + Math.abs(v)
      }, 0)
    p.setLeafThickness(0.05)
    const thin = volume()
    p.setLeafThickness(0.1)
    expect(volume() / thin).toBeCloseTo(2, 1)
  })

  it('only lets the leaves move a bit when spinning', () => {
    const p = createPineapple()
    p.root.updateMatrixWorld(true)
    const rest = leafTips(p)
    const up = new Vector3(0, 1, 0)
    let angle = 0
    let vel = 15
    let maxSwing = 0
    let lastMoving = 0
    let bodyStops = 0
    for (let f = 0; f < 60 * 3; f++) {
      // the spin of the viewer: friction, then back to the front
      const dt = 1 / 60
      vel *= Math.exp(-1.6 * dt)
      if (Math.abs(vel) < 2) {
        const front = Math.round(angle / (Math.PI * 2)) * Math.PI * 2
        vel += ((front - angle) * 40 - vel * 6) * dt
      }
      angle += vel * dt
      if (Math.abs(vel) > 0.05) bodyStops = f / 60
      p.root.rotation.y = angle
      p.update(dt)
      p.root.updateMatrixWorld(true)
      // distance to where a rigid leaf tip would be
      const swing = Math.max(
        ...leafTips(p).map((tip, i) =>
          tip.distanceTo(rest[i]!.clone().applyAxisAngle(up, angle))
        )
      )
      maxSwing = Math.max(maxSwing, swing)
      if (swing > 0.05) lastMoving = f / 60
    }
    // leaves are about 2 units long
    expect(maxSwing).toBeLessThan(0.8)
    expect(maxSwing).toBeGreaterThan(0.1)
    // and settle right after the body stops
    expect(lastMoving - bodyStops).toBeLessThan(0.4)
  })

  it('shows the logo leaves first', () => {
    const p = createPineapple()
    const visible = () => p.leaves.filter((l) => l.visible).map((l) => l.name)
    p.setLeafCount(3)
    expect(visible()).toEqual(
      expect.arrayContaining([
        'Leaf_Center_Mesh',
        'Leaf_Left_Mesh',
        'Leaf_Right_Mesh',
      ])
    )
    expect(visible()).toHaveLength(3)
    p.setLeafCount(0)
    expect(visible()).toHaveLength(0)
  })
})
