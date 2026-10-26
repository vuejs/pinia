import {
  Bone,
  BufferGeometry,
  Color,
  Euler,
  Float32BufferAttribute,
  Matrix4,
  type Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { fromSvg } from './profile.ts'

export interface SpringParams {
  /** pull back to the rest pose */
  stiffness: number
  /** 0 = keeps all velocity, 1 = no inertia */
  drag: number
  gravity: number
  /** radius of the joint tail used against colliders */
  hitRadius: number
}

interface LeafSpec {
  name: string
  base: [x: number, y: number, z: number]
  /** rotation in the front plane, positive leans left */
  roll: number
  /** lean backwards */
  pitch: number
  yaw: number
  length: number
  halfWidth: number
  /** curl backwards from base to tip */
  bend: number
  /** [t, color] from base (0) to tip (1) */
  gradient: [number, string][]
}

/** Crown origin, in body space. Leaf bases are inside the body. */
export const CROWN_HEIGHT = 3.05

const deg = Math.PI / 180
const SIDE_GRADIENT: [number, string][] = [
  [0, '#3f8a46'],
  [0.57, '#51a256'],
  [1, '#52ce63'],
]

function logoLeaf(
  name: string,
  base: [number, number],
  tip: [number, number],
  halfWidth: number,
  z: number,
  pitch: number,
  yaw: number,
  bend: number,
  gradient: [number, string][]
): LeafSpec {
  const [bx, bh] = fromSvg(...base)
  const [tx, th] = fromSvg(...tip)
  const length = Math.hypot(tx - bx, th - bh) / Math.cos(pitch)
  return {
    name,
    base: [bx, bh - CROWN_HEIGHT, z],
    roll: Math.atan2(-(tx - bx), th - bh),
    pitch,
    yaw,
    length,
    halfWidth,
    bend,
    gradient,
  }
}

// base and tip of each leaf of logo.svg, with all its transforms applied
const LEAVES: LeafSpec[] = [
  logoLeaf(
    'Leaf_Center',
    [194.46, 239.2],
    [220.8, 24.7],
    0.5,
    0.06,
    6 * deg,
    0,
    0.28,
    [
      [0, '#45b457'],
      [0.59, '#52ce63'],
      [1, '#8ae99c'],
    ]
  ),
  logoLeaf(
    'Leaf_Left',
    [179.6, 255.6],
    [73.8, 88.8],
    0.56,
    -0.12,
    14 * deg,
    14 * deg,
    0.36,
    SIDE_GRADIENT
  ),
  logoLeaf(
    'Leaf_Right',
    [207.5, 259.9],
    [350.6, 123.6],
    0.56,
    -0.12,
    14 * deg,
    -14 * deg,
    0.36,
    SIDE_GRADIENT
  ),
  {
    name: 'Leaf_Back_Left',
    base: [-0.12, -0.5, -0.22],
    roll: -16 * deg,
    pitch: 20 * deg,
    yaw: Math.PI - 40 * deg,
    length: 1.75,
    halfWidth: 0.48,
    bend: 0.4,
    gradient: SIDE_GRADIENT,
  },
  {
    name: 'Leaf_Back_Right',
    base: [0.18, -0.5, -0.22],
    roll: 18 * deg,
    pitch: 20 * deg,
    yaw: Math.PI + 40 * deg,
    length: 1.6,
    halfWidth: 0.46,
    bend: 0.42,
    gradient: SIDE_GRADIENT,
  },
  // fill the crown when seen from the sides, mostly hidden from the front
  {
    name: 'Leaf_Side_Left',
    base: [-0.16, -0.42, -0.2],
    roll: 0,
    pitch: -20 * deg,
    yaw: -90 * deg,
    length: 1.8,
    halfWidth: 0.47,
    bend: 0.45,
    gradient: SIDE_GRADIENT,
  },
  {
    name: 'Leaf_Side_Right',
    base: [0.2, -0.42, -0.2],
    roll: 0,
    pitch: -20 * deg,
    yaw: 90 * deg,
    length: 1.75,
    halfWidth: 0.47,
    bend: 0.45,
    gradient: SIDE_GRADIENT,
  },
]

/** Spring parameters per joint, from the base (embedded in the body) to the tip. */
const JOINT_SPRINGS: SpringParams[] = [
  { stiffness: 4.5, drag: 0.55, gravity: 0, hitRadius: 0.06 },
  { stiffness: 1.6, drag: 0.32, gravity: 0.08, hitRadius: 0.07 },
  { stiffness: 1.1, drag: 0.26, gravity: 0.1, hitRadius: 0.07 },
  { stiffness: 0.8, drag: 0.22, gravity: 0.12, hitRadius: 0.06 },
]
const BONE_T = [0, 0.32, 0.56, 0.78, 1]

/** vertices around the cross-section */
const RING = 16
const T_SEGMENTS = 22

function widthAt(t: number): number {
  return Math.pow(Math.sin(Math.PI * Math.pow(t, 0.82)), 0.78)
}

/** Thickness along the leaf, 1 around the widest part, round at the tip. */
function thicknessAt(t: number): number {
  return Math.pow(widthAt(t), 0.55) * (1 - 0.35 * t)
}

/** Half of the thickness at the widest part of the leaves, in body units. */
export const DEFAULT_LEAF_THICKNESS = 0.05

/**
 * Changes the leaf thickness in place. Works on loaded GLBs too: the offset of
 * each vertex for a thickness of 1 is in the `_thickness` attribute.
 */
export function setLeafThickness(mesh: Mesh, thickness: number) {
  const g = mesh.geometry
  const pos = g.getAttribute('position')
  const off = g.getAttribute('_thickness')
  if (!off) return
  const current =
    (mesh.userData.leafThickness as number | undefined) ??
    DEFAULT_LEAF_THICKNESS
  const delta = Math.max(0.004, thickness) - current
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + off.getX(i) * delta,
      pos.getY(i) + off.getY(i) * delta,
      pos.getZ(i) + off.getZ(i) * delta
    )
  }
  mesh.userData.leafThickness = current + delta
  pos.needsUpdate = true
  g.computeVertexNormals()
  g.computeBoundingSphere()
}

function spineFrame(
  spec: LeafSpec,
  t: number,
  out: { p: Vector3; n: Vector3 }
) {
  // integrate the curled spine in closed form: angle grows with t²
  const steps = 24
  out.p.set(0, 0, 0)
  for (let i = 0; i < steps; i++) {
    const tm = ((i + 0.5) / steps) * t
    const a = spec.bend * tm * tm
    const dl = (spec.length * t) / steps
    out.p.y += Math.cos(a) * dl
    out.p.z -= Math.sin(a) * dl
  }
  const a = spec.bend * t * t
  out.n.set(0, Math.sin(a), Math.cos(a))
}

function gradientColor(stops: [number, string][], t: number, out: Color) {
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i]!
    if (t <= t1 || i === stops.length - 1) {
      const [t0, c0] = stops[i - 1]!
      out
        .set(c0)
        .lerp(new Color(c1), Math.min(1, Math.max(0, (t - t0) / (t1 - t0))))
      return out
    }
  }
  return out
}

function leafOrientation(spec: LeafSpec): Quaternion {
  // yaw, then roll in the front plane, then lean back
  return new Quaternion()
    .setFromEuler(new Euler(0, spec.yaw, 0))
    .multiply(new Quaternion().setFromEuler(new Euler(0, 0, spec.roll)))
    .multiply(new Quaternion().setFromEuler(new Euler(-spec.pitch, 0, 0)))
}

function createLeaf(spec: LeafSpec, material: MeshStandardMaterial) {
  const orientation = leafOrientation(spec)
  const toCrown = new Matrix4().compose(
    new Vector3(...spec.base),
    orientation,
    new Vector3(1, 1, 1)
  )

  // bone chain along the spine, rest rotations are identity below the root
  const bones: Bone[] = []
  const frame = { p: new Vector3(), n: new Vector3() }
  const prev = new Vector3()
  BONE_T.forEach((t, i) => {
    const bone = new Bone()
    bone.name = `${spec.name}_${i}`
    spineFrame(spec, t, frame)
    if (i === 0) {
      bone.position.set(...spec.base)
      bone.quaternion.copy(orientation)
    } else {
      bone.position.copy(frame.p).sub(prev)
      bones[i - 1]!.add(bone)
    }
    if (i < JOINT_SPRINGS.length)
      bone.userData.spring = { ...JOINT_SPRINGS[i]! }
    prev.copy(frame.p)
    bones.push(bone)
  })

  const positions: number[] = []
  const offsets: number[] = []
  const colors: number[] = []
  const uvs: number[] = []
  const skinIndex: number[] = []
  const skinWeight: number[] = []
  const indices: number[] = []
  const color = new Color()
  const point = new Vector3()
  const offset = new Vector3()
  const rotation = new Matrix4().extractRotation(toCrown)

  // one closed surface with a round (elliptic) cross-section
  for (let j = 0; j <= T_SEGMENTS; j++) {
    const t = j / T_SEGMENTS
    spineFrame(spec, t, frame)
    const w = widthAt(t) * spec.halfWidth
    const th = thicknessAt(t)
    gradientColor(spec.gradient, t, color)

    let k = 0
    while (k < BONE_T.length - 2 && t > BONE_T[k + 1]!) k++
    let f = (t - BONE_T[k]!) / (BONE_T[k + 1]! - BONE_T[k]!)
    f = f * f * (3 - 2 * f)

    for (let i = 0; i < RING; i++) {
      const phi = (i / RING) * Math.PI * 2
      const s = Math.cos(phi)
      const b = Math.sin(phi)
      // edges recede behind the midrib
      const fold = -0.22 * Math.pow(Math.abs(s), 1.6) * w
      offset
        .copy(frame.n)
        .multiplyScalar(b * th)
        .applyMatrix4(rotation)
      point
        .copy(frame.p)
        .addScaledVector(new Vector3(1, 0, 0), s * w)
        .addScaledVector(frame.n, fold)
        .applyMatrix4(toCrown)
        .addScaledVector(offset, DEFAULT_LEAF_THICKNESS)
      positions.push(point.x, point.y, point.z)
      offsets.push(offset.x, offset.y, offset.z)

      // darker back, lighter midrib
      const shade =
        (0.78 + 0.22 * Math.max(0, Math.min(1, b * 2 + 0.5))) *
        (1 + 0.1 * (1 - Math.abs(s)))
      colors.push(color.r * shade, color.g * shade, color.b * shade)
      uvs.push(i / RING, t)
      skinIndex.push(k, k + 1, 0, 0)
      skinWeight.push(1 - f, f, 0, 0)
    }
  }
  for (let j = 0; j < T_SEGMENTS; j++) {
    for (let i = 0; i < RING; i++) {
      const a = j * RING + i
      const b = j * RING + ((i + 1) % RING)
      const c = a + RING
      const d = b + RING
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setIndex(indices)
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndex, 4))
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeight, 4))
  geometry.setAttribute('_thickness', new Float32BufferAttribute(offsets, 3))
  geometry.computeVertexNormals()

  const mesh = new SkinnedMesh(geometry, material)
  mesh.name = `${spec.name}_Mesh`
  mesh.userData.leafThickness = DEFAULT_LEAF_THICKNESS
  mesh.castShadow = true
  mesh.receiveShadow = true
  return { mesh, root: bones[0]!, bones }
}

/** Crown with all the leaves. Each leaf is a skinned mesh driven by a spring bone chain. */
export function createCrown(): Object3D {
  const crown = new Object3D()
  crown.name = 'Crown'
  crown.position.y = CROWN_HEIGHT
  const material = new MeshStandardMaterial({
    name: 'Pineapple_Leaf',
    vertexColors: true,
    roughness: 0.8,
  })

  const leaves = LEAVES.map((spec) => {
    const leaf = createLeaf(spec, material)
    crown.add(leaf.root, leaf.mesh)
    return leaf
  })
  crown.updateMatrixWorld(true)
  for (const { mesh, bones } of leaves) {
    mesh.bind(new Skeleton(bones), mesh.matrixWorld)
  }
  return crown
}
