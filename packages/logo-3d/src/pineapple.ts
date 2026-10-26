import {
  Bone,
  Group,
  NoColorSpace,
  type Mesh,
  type MeshStandardMaterial,
  Object3D,
  type Texture,
  Vector3,
} from 'three'
import { createBodyMesh } from './body.ts'
import {
  BLUSH,
  DEFAULT_EXPRESSION,
  DEFAULT_FACE_PARAMS,
  EXPRESSIONS,
  type ExpressionDef,
  type ExpressionName,
} from './expressions.ts'
import {
  CHEEK_RECT,
  createSocket,
  decal,
  DECAL_ORDER,
  EYE_RECT,
  MOUTH_RECT,
  PIXELS_PER_UNIT,
  SOCKETS,
} from './face.ts'
import {
  createCrown,
  CROWN_HEIGHT,
  DEFAULT_LEAF_THICKNESS,
  setLeafThickness,
} from './leaves.ts'
import {
  type Box,
  bounds,
  createRaster,
  glossLayers,
  type Layer,
  paint,
  type Raster,
  toTexture,
} from './paint.ts'
import { type SphereCollider, SpringBoneSystem } from './spring-bones.ts'

/** Body approximated with spheres, in Body space, for the leaves. */
const COLLIDERS = [
  { center: [0, 1.35, 0], radius: 1.42 },
  { center: [0, 2.2, 0], radius: 1.1 },
  { center: [0, 2.75, 0], radius: 0.62 },
] as const

function bake(rect: Box, layers: Layer[], name: string, color = true): Texture {
  const texture = toTexture(
    paint(createRaster(rect, PIXELS_PER_UNIT), layers),
    name
  )
  if (!color) texture.colorSpace = NoColorSpace
  return texture
}

/**
 * Node layout (also in the GLB):
 *
 * Pineapple
 * ├─ Body                 squash and stretch here, pivot on the ground
 * │  ├─ Body_Mesh         baked skin and X marks (color + normal map)
 * │  └─ Face
 * │     ├─ Socket_Eye_L   one decal per expression, userData.expression
 * │     ├─ Socket_Eye_R
 * │     ├─ Socket_Mouth
 * │     └─ Socket_Cheek_L / Socket_Cheek_R
 * └─ Crown                follows the top of the body
 *    └─ Leaf_*_0..4 bones (userData.spring) + Leaf_*_Mesh skinned meshes
 */
export function createPineappleScene(): Group {
  const root = new Group()
  root.name = 'Pineapple'

  const body = new Group()
  body.name = 'Body'
  body.add(createBodyMesh())

  const face = new Group()
  face.name = 'Face'
  body.add(face)

  const eyeL = createSocket(SOCKETS.eyeL)
  const eyeR = createSocket(SOCKETS.eyeR)
  const mouth = createSocket(SOCKETS.mouth)
  face.add(eyeL, eyeR, mouth)

  const names = Object.keys(EXPRESSIONS) as ExpressionName[]
  for (const name of names) {
    const def: ExpressionDef = EXPRESSIONS[name]
    const variants: [Object3D, Box, Layer[]][] = [
      [eyeL, EYE_RECT, def.eye(1, DEFAULT_FACE_PARAMS)],
      [eyeR, EYE_RECT, def.eye(-1, DEFAULT_FACE_PARAMS)],
      [mouth, MOUTH_RECT, def.mouth()],
    ]
    for (const [socket, limit, layers] of variants) {
      const rect = bounds(layers, limit)
      const id = `${socket.name.replace('Socket_', '')}_${name}`
      const kind = socket === mouth ? 'feature' : 'eye'
      const gloss =
        kind === 'eye'
          ? bake(rect, glossLayers(layers), `${id}_Gloss`, false)
          : undefined
      const mesh = decal(id, socket, rect, bake(rect, layers, id), kind, gloss)
      mesh.userData.expression = name
      socket.add(mesh)
    }
  }

  const blushRect = bounds(BLUSH, CHEEK_RECT)
  const blush = bake(blushRect, BLUSH, 'Blush')
  for (const spec of [SOCKETS.cheekL, SOCKETS.cheekR]) {
    const socket = createSocket(spec)
    socket.add(
      decal(
        `${spec.name.replace('Socket_', '')}_Blush`,
        socket,
        blushRect,
        blush,
        'cheek'
      )
    )
    face.add(socket)
  }

  root.add(body, createCrown())
  root.userData = {
    pinia: 2,
    defaultExpression: DEFAULT_EXPRESSION,
    expressions: names.map((name) => ({
      name,
      blush: EXPRESSIONS[name].blush,
      blink: EXPRESSIONS[name].blink,
      look: EXPRESSIONS[name].look,
    })),
    colliders: COLLIDERS,
    crownHeight: CROWN_HEIGHT,
  }
  return root
}

export interface ExpressionInfo {
  name: string
  blush: number
  blink: boolean
  look: boolean
}

export interface Pineapple {
  root: Object3D
  body: Object3D
  crown: Object3D
  sockets: { eyeL: Object3D; eyeR: Object3D; mouth: Object3D }
  leaves: Mesh[]
  springs: SpringBoneSystem
  expressions: ExpressionInfo[]
  readonly expression: string
  setExpression(name: string): void
  /** Squash (< 1) or stretch (> 1) the body, keeping its volume. Leaves stay on top. */
  setSquash(amount: number): void
  /** Moves both pupils, x and y in [-1, 1]. */
  look(x: number, y: number): void
  /** Each eye looks at a point, in world space. */
  lookAt(target: Vector3): void
  /** Pupil size multiplier. */
  setPupilSize(scale: number): void
  /** 0 = open, 1 = closed. Only for expressions that blink. */
  setBlink(amount: number): void
  /** Multiplier of the blush of each expression. */
  setBlush(scale: number): void
  /** Strength of the relief of the X marks. */
  setRelief(scale: number): void
  /** Half thickness of the leaves at their widest, in body units. */
  setLeafThickness(thickness: number): void
  readonly leafThickness: number
  update(dt: number): void
}

function byName(root: Object3D, name: string): Object3D {
  const o = root.getObjectByName(name)
  if (!o) throw new Error(`Pinia logo: missing node "${name}"`)
  return o
}

type DecalMaterial = MeshStandardMaterial & {
  userData: { baked?: Texture | null }
}

/** Wires a pineapple scene, either from `createPineappleScene()` or from the loaded GLB. */
export function bindPineapple(root: Object3D): Pineapple {
  const data = root.userData as {
    defaultExpression: string
    expressions: ExpressionInfo[]
    colliders: readonly { center: readonly number[]; radius: number }[]
    crownHeight: number
  }
  const body = byName(root, 'Body')
  const crown = byName(root, 'Crown')
  const bodyMesh = byName(root, 'Body_Mesh') as Mesh
  const sockets = {
    eyeL: byName(root, 'Socket_Eye_L'),
    eyeR: byName(root, 'Socket_Eye_R'),
    mouth: byName(root, 'Socket_Mouth'),
  }
  const blush: Mesh[] = []
  const leaves: Mesh[] = []
  root.traverse((o) => {
    // the GLB does not keep the draw order of transparent decals
    const kind = o.userData.decal as keyof typeof DECAL_ORDER | undefined
    if (kind) o.renderOrder = DECAL_ORDER[kind]
    if (o.name.endsWith('_Blush')) blush.push(o as Mesh)
    if ((o as Mesh).isMesh && (o as Mesh).geometry.getAttribute('_thickness'))
      leaves.push(o as Mesh)
  })

  const chains: Bone[][] = []
  for (const child of crown.children) {
    if (!(child as Bone).isBone) continue
    const chain: Bone[] = []
    let b: Object3D | undefined = child
    while (b) {
      chain.push(b as Bone)
      b = b.children.find((c) => (c as Bone).isBone)
    }
    chains.push(chain)
  }
  const colliders: SphereCollider[] = data.colliders.map((c) => ({
    object: body,
    center: new Vector3().fromArray(c.center as number[]),
    radius: c.radius,
  }))
  root.updateMatrixWorld(true)
  const springs = new SpringBoneSystem(chains, colliders)

  // eyes that move are redrawn into live textures
  const eyes = [
    {
      socket: sockets.eyeL,
      side: 1 as const,
      look: [0, 0] as [number, number],
    },
    {
      socket: sockets.eyeR,
      side: -1 as const,
      look: [0, 0] as [number, number],
    },
  ].map((e) => {
    const raster: Raster = createRaster(EYE_RECT, PIXELS_PER_UNIT)
    return {
      ...e,
      raster,
      texture: toTexture(raster, `${e.socket.name}_Live`),
      drawn: '',
      rect: '',
    }
  })

  let expression = data.defaultExpression
  let blinkAmount = 0
  let pupil = 1
  let blushScale = 1
  let leafThickness =
    (leaves[0]?.userData.leafThickness as number | undefined) ??
    DEFAULT_LEAF_THICKNESS

  const info = () => data.expressions.find((e) => e.name === expression)!
  const def = () => (EXPRESSIONS as Record<string, ExpressionDef>)[expression]

  function variant(socket: Object3D) {
    return socket.children.find((c) => c.userData.expression === expression) as
      | Mesh
      | undefined
  }

  function drawEyes() {
    const d = def()
    if (!d?.look) return
    for (const eye of eyes) {
      const mesh = variant(eye.socket)
      if (!mesh) continue
      const material = mesh.material as DecalMaterial
      if (material.userData.baked === undefined)
        material.userData.baked = material.map
      const key = `${expression}:${eye.look[0].toFixed(2)}:${eye.look[1].toFixed(2)}:${pupil}`
      // each decal fits its drawing, the live texture follows its size
      const rect = (mesh.userData.rect as Box | undefined) ?? EYE_RECT
      if (rect.join() !== eye.rect) {
        eye.raster = createRaster(rect, PIXELS_PER_UNIT)
        eye.texture.dispose()
        eye.texture = toTexture(eye.raster, `${eye.socket.name}_Live`)
        eye.rect = rect.join()
        eye.drawn = ''
      }
      if (key !== eye.drawn) {
        paint(eye.raster, d.eye(eye.side, { look: eye.look, pupil }))
        eye.texture.needsUpdate = true
        eye.drawn = key
      }
      if (material.map !== eye.texture) {
        material.map = eye.texture
        material.needsUpdate = true
      }
    }
  }

  function restoreEyes() {
    for (const eye of eyes) {
      const mesh = variant(eye.socket)
      const material = mesh?.material as DecalMaterial | undefined
      if (material && material.userData.baked !== undefined) {
        material.map = material.userData.baked
        material.needsUpdate = true
      }
    }
  }

  // GLTFLoader flips normalScale.y on meshes without tangents, keep that sign
  const baseScale = (bodyMesh.material as MeshStandardMaterial).normalScale
  const reliefSign = {
    x: Math.sign(baseScale.x) || 1,
    y: Math.sign(baseScale.y) || 1,
  }

  const _p = new Vector3()

  const pineapple: Pineapple = {
    root,
    body,
    crown,
    sockets,
    leaves,
    springs,
    expressions: data.expressions,
    get expression() {
      return expression
    },
    get leafThickness() {
      return leafThickness
    },
    setExpression(name) {
      if (!data.expressions.some((e) => e.name === name)) {
        throw new Error(`Pinia logo: unknown expression "${name}"`)
      }
      restoreEyes()
      expression = name
      for (const socket of Object.values(sockets)) {
        for (const child of socket.children) {
          if (child.userData.expression != null)
            child.visible = child.userData.expression === name
        }
      }
      this.setBlush(blushScale)
      this.setBlink(blinkAmount)
      for (const eye of eyes) eye.drawn = ''
      drawEyes()
    },
    setSquash(amount) {
      const side = 1 / Math.sqrt(amount)
      body.scale.set(side, amount, side)
      crown.position.y = data.crownHeight * amount
    },
    look(x, y) {
      const clamp = (v: number) => Math.max(-1, Math.min(1, v))
      for (const eye of eyes) eye.look = [clamp(x), clamp(y)]
      drawEyes()
    },
    lookAt(target) {
      for (const eye of eyes) {
        eye.socket.updateWorldMatrix(true, false)
        eye.socket.worldToLocal(_p.copy(target)).normalize()
        // in front: x and y of the direction, behind: saturated to the side
        const k = _p.z > 0 ? 1.8 : 3
        eye.look = [
          Math.max(-1, Math.min(1, _p.x * k)),
          Math.max(-1, Math.min(1, _p.y * k)),
        ]
      }
      drawEyes()
    },
    setPupilSize(scale) {
      pupil = scale
      drawEyes()
    },
    setBlink(amount) {
      blinkAmount = amount
      const y = info().blink ? Math.max(0.06, 1 - amount) : 1
      sockets.eyeL.scale.y = y
      sockets.eyeR.scale.y = y
    },
    setBlush(scale) {
      blushScale = scale
      for (const b of blush)
        (b.material as MeshStandardMaterial).opacity = Math.min(
          1,
          info().blush * scale
        )
    },
    setRelief(scale) {
      ;(bodyMesh.material as MeshStandardMaterial).normalScale.set(
        scale * reliefSign.x,
        scale * reliefSign.y
      )
    },
    setLeafThickness(thickness) {
      leafThickness = thickness
      for (const leaf of leaves) setLeafThickness(leaf, thickness)
    },
    update(dt) {
      root.updateMatrixWorld(true)
      springs.update(dt)
    },
  }
  pineapple.setExpression(expression)
  return pineapple
}

export function createPineapple(): Pineapple {
  return bindPineapple(createPineappleScene())
}
