import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  type Texture,
  Vector3,
} from 'three'
import type { Box } from './paint.ts'
import { arcOffset, fromSvg, surfaceFrame, thetaFromFront } from './profile.ts'

/**
 * Face features are textures on decals: thin patches that follow the skin.
 * Socket space is x right, y up, z out of the skin, in body units.
 */

export interface SocketSpec {
  name: string
  /** front view position, from logo.svg */
  x: number
  h: number
}

// logo.svg face group, mirrored so features are symmetric
const [EYE_X, EYE_H] = fromSvg(184.47 + 65, 304)
const [, MOUTH_H] = fromSvg(0, 333)
const [CHEEK_X, CHEEK_H] = fromSvg(184.47 + 79, 332)

/** Character left is +x (the character faces +z). */
export const SOCKETS = {
  eyeL: { name: 'Socket_Eye_L', x: EYE_X, h: EYE_H },
  eyeR: { name: 'Socket_Eye_R', x: -EYE_X, h: EYE_H },
  mouth: { name: 'Socket_Mouth', x: 0, h: MOUTH_H },
  cheekL: { name: 'Socket_Cheek_L', x: CHEEK_X, h: CHEEK_H },
  cheekR: { name: 'Socket_Cheek_R', x: -CHEEK_X, h: CHEEK_H },
} satisfies Record<string, SocketSpec>

/** Area covered by each decal, in socket space. */
export const EYE_RECT: Box = [-0.36, -0.46, 0.36, 0.58]
export const MOUTH_RECT: Box = [-0.27, -0.2, 0.27, 0.14]
export const CHEEK_RECT: Box = [-0.3, -0.16, 0.3, 0.16]
export const PIXELS_PER_UNIT = 420

export function createSocket(spec: SocketSpec): Object3D {
  const theta = thetaFromFront(spec.x, spec.h)
  const f = surfaceFrame(theta, spec.h)
  const socket = new Object3D()
  socket.name = spec.name
  socket.position.copy(f.position)
  socket.quaternion.setFromRotationMatrix(
    new Matrix4().makeBasis(f.tangent, f.bitangent, f.normal)
  )
  // kept in the GLB so features can be wrapped after loading too
  socket.userData.surface = { theta, h: spec.h }
  return socket
}

/** Wraps flat socket space geometry on the body surface. Mutates and returns it. */
export function conform(
  geometry: BufferGeometry,
  socket: Object3D
): BufferGeometry {
  const { theta, h } = socket.userData.surface as { theta: number; h: number }
  socket.updateMatrix()
  const toSocket = socket.matrix.clone().invert()
  const rotation = new Matrix4().extractRotation(toSocket)
  const pos = geometry.getAttribute('position')
  const nor = geometry.getAttribute('normal')
  const p = new Vector3()
  const n = new Vector3()
  for (let i = 0; i < pos.count; i++) {
    const [t, ph] = arcOffset(theta, h, pos.getX(i), pos.getY(i))
    const f = surfaceFrame(t, ph, pos.getZ(i))
    p.copy(f.position).applyMatrix4(toSocket)
    pos.setXYZ(i, p.x, p.y, p.z)
    if (nor) {
      n.set(0, 0, 0)
        .addScaledVector(f.tangent, nor.getX(i))
        .addScaledVector(f.bitangent, nor.getY(i))
        .addScaledVector(f.normal, nor.getZ(i))
        .applyMatrix4(rotation)
        .normalize()
      nor.setXYZ(i, n.x, n.y, n.z)
    }
  }
  pos.needsUpdate = true
  geometry.computeBoundingSphere()
  return geometry
}

/** Flat grid over a rect, uv 0..1, lifted by z. */
export function patch(rect: Box, z: number, cell = 0.09): BufferGeometry {
  const [x0, y0, x1, y1] = rect
  const nx = Math.max(2, Math.ceil((x1 - x0) / cell))
  const ny = Math.max(2, Math.ceil((y1 - y0) / cell))
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      positions.push(x0 + ((x1 - x0) * i) / nx, y0 + ((y1 - y0) * j) / ny, z)
      normals.push(0, 0, 1)
      uvs.push(i / nx, j / ny)
    }
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i
      indices.push(a, a + 1, a + nx + 1, a + 1, a + nx + 2, a + nx + 1)
    }
  }
  const g = new BufferGeometry()
  g.setIndex(indices)
  g.setAttribute('position', new Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  return g
}

/** Draw order of the decals, the GLB does not keep it. */
export const DECAL_ORDER = { cheek: 1, feature: 2, eye: 2 }

export function decal(
  name: string,
  socket: Object3D,
  rect: Box,
  map: Texture,
  kind: 'eye' | 'feature' | 'cheek',
  gloss?: Texture
): Mesh {
  // only the eyes are glossy, through a mask, everything else stays matte like the flat logo
  const material =
    kind === 'eye'
      ? new MeshPhysicalMaterial({
          name: `${name}_Material`,
          map,
          roughness: 0.85,
          roughnessMap: gloss ?? null,
          clearcoat: 1,
          clearcoatMap: gloss ?? null,
          clearcoatRoughness: 0.08,
        })
      : new MeshStandardMaterial({
          name: `${name}_Material`,
          map,
          roughness: 0.85,
        })
  material.transparent = true
  material.depthWrite = false
  const mesh = new Mesh(
    conform(patch(rect, kind === 'cheek' ? 0.004 : 0.007), socket),
    material
  )
  mesh.name = name
  mesh.renderOrder = DECAL_ORDER[kind]
  mesh.userData.decal = kind
  return mesh
}
