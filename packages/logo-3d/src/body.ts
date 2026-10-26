import {
  BufferGeometry,
  Color,
  DataTexture,
  Float32BufferAttribute,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  RGBAFormat,
  SRGBColorSpace,
  UnsignedByteType,
  Vector2,
  Vector3,
} from 'three'
import {
  arcOffset,
  fromSvg,
  normalFromTangent,
  type ProfileSample,
  sampleProfile,
  surfacePoint,
  thetaFromFront,
} from './profile.ts'

const BODY_TOP = new Color('#ffe56c')
const BODY_BOTTOM = new Color('#ffc63a')
const CROSS_LOW = new Color('#ecb732')
const CROSS_HIGH = new Color('#ffc73b')
// gradient "e" of logo.svg goes from 17.5% of the height to the bottom
const GRADIENT_START_H = 2.75

// the mesh stays light, details are in the textures and the analytic normals
const AROUND = 64
const MESH_ROWS = 32
// fine sampling, only for lookups
const PROFILE_SEGMENTS = 400
const profile = sampleProfile(PROFILE_SEGMENTS)
// samples are evenly spaced along the outline, so v is proportional to arc length
const PROFILE_LENGTH = profile.reduce(
  (sum, p, i) =>
    i ? sum + Math.hypot(p.r - profile[i - 1]!.r, p.h - profile[i - 1]!.h) : 0,
  0
)

/** Profile at v in [0, 1], interpolated. */
function profileAt(v: number): ProfileSample {
  const f = Math.max(0, Math.min(PROFILE_SEGMENTS, v * PROFILE_SEGMENTS))
  const j = Math.min(PROFILE_SEGMENTS - 1, Math.floor(f))
  const a = profile[j]!
  const b = profile[j + 1]!
  const t = f - j
  return {
    r: a.r + (b.r - a.r) * t,
    h: a.h + (b.h - a.h) * t,
    tr: a.tr + (b.tr - a.tr) * t,
    th: a.th + (b.th - a.th) * t,
  }
}

/** Arc length along the outline at a height. */
function arcAt(h: number): number {
  for (let j = 1; j <= PROFILE_SEGMENTS; j++) {
    const a = profile[j - 1]!
    const b = profile[j]!
    if (h <= b.h)
      return (
        ((j - 1 + (h - a.h) / (b.h - a.h || 1)) / PROFILE_SEGMENTS) *
        PROFILE_LENGTH
      )
  }
  return PROFILE_LENGTH
}

function gradient(h: number, out: Color): Color {
  const t = Math.min(1, Math.max(0, (GRADIENT_START_H - h) / GRADIENT_START_H))
  return out.copy(BODY_TOP).lerp(BODY_BOTTOM, t)
}

export function createBodyMesh(textures = createBodyTextures()): Mesh {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const p = new Vector3()
  const n = new Vector3()

  for (let j = 0; j <= MESH_ROWS; j++) {
    const s = profileAt(j / MESH_ROWS)
    for (let i = 0; i <= AROUND; i++) {
      // seam at the back
      const theta = -Math.PI + (i / AROUND) * Math.PI * 2
      surfacePoint(theta, s.h, p)
      normalFromTangent(theta, s.tr, s.th, n)
      positions.push(p.x, p.y, p.z)
      normals.push(n.x, n.y, n.z)
      uvs.push(i / AROUND, j / MESH_ROWS)
    }
  }
  const row = AROUND + 1
  for (let j = 0; j < MESH_ROWS; j++) {
    for (let i = 0; i < AROUND; i++) {
      const a = j * row + i
      const b = a + 1
      const d = a + row
      const e = d + 1
      indices.push(a, b, d, b, e, d)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setIndex(indices)
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

  const mesh = new Mesh(
    geometry,
    new MeshStandardMaterial({
      name: 'Pineapple_Skin',
      map: textures.map,
      normalMap: textures.normalMap,
      normalScale: new Vector2(1, 1),
      roughness: 0.82,
    })
  )
  mesh.name = 'Body_Mesh'
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

type Stroke = [[number, number], [number, number]]

// the three X marks of logo.svg, in svg px
const LOGO_CROSSES: Stroke[][] = [
  [
    [
      [70.5, 377.5],
      [144.5, 454.5],
    ],
    [
      [134.5, 386.5],
      [87.5, 436.5],
    ],
  ],
  [
    [
      [297.5, 377.5],
      [223.5, 454.5],
    ],
    [
      [233.5, 386.5],
      [280.5, 436.5],
    ],
  ],
  [
    [
      [214.5, 207.5],
      [165.5, 256.5],
    ],
    [
      [204.5, 256.5],
      [155.5, 207.5],
    ],
  ],
]

// same marks as arc offsets (u, v) around their center, for the hidden sides
const LOWER_CROSS: Stroke[] = [
  [
    [-0.37, 0.385],
    [0.37, -0.385],
  ],
  [
    [0.27, 0.295],
    [-0.2, -0.205],
  ],
]
const UPPER_CROSS: Stroke[] = [
  [
    [0.295, 0.245],
    [-0.195, -0.245],
  ],
  [
    [0.195, -0.245],
    [-0.295, 0.245],
  ],
]

const deg = Math.PI / 180
const RING_CROSSES: [theta: number, h: number, shape: Stroke[]][] = [
  ...[92, 152, -92, -152].map((a) => [a * deg, 0.85, LOWER_CROSS] as const),
  ...[60, 120, 180, -60, -120].map(
    (a) => [a * deg, 2.69, UPPER_CROSS] as const
  ),
  ...[122, 180, -122].map((a) => [a * deg, 1.77, LOWER_CROSS] as const),
] as [number, number, Stroke[]][]

const STROKE_RADIUS = 0.055
/** height of the embossed strokes, for the normal map */
const STROKE_HEIGHT = 0.024

/** Every X mark stroke as a polyline of (θ, h) on the body. */
function crossStrokes(): [theta: number, h: number][][] {
  const strokes: [number, number][][] = []
  const sample = (at: (f: number) => [number, number]) =>
    strokes.push(Array.from({ length: 11 }, (_, i) => at(i / 10)))

  for (const cross of LOGO_CROSSES) {
    for (const [a, b] of cross) {
      sample((f) => {
        const [x, h] = fromSvg(
          a[0] + (b[0] - a[0]) * f,
          a[1] + (b[1] - a[1]) * f
        )
        return [thetaFromFront(x, h), h]
      })
    }
  }
  for (const [theta, h, shape] of RING_CROSSES) {
    for (const [a, b] of shape) {
      sample((f) =>
        arcOffset(theta, h, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
      )
    }
  }
  return strokes
}

function texture(
  data: Uint8Array,
  width: number,
  height: number,
  name: string,
  color: boolean
) {
  const t = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType)
  t.name = name
  t.colorSpace = color ? SRGBColorSpace : NoColorSpace
  t.wrapS = RepeatWrapping
  t.magFilter = LinearFilter
  t.minFilter = LinearMipmapLinearFilter
  t.generateMipmaps = true
  t.anisotropy = 8
  t.needsUpdate = true
  return t
}

/**
 * Bakes the skin: logo gradient plus the X marks, and a normal map for their
 * relief. Distances are measured on the surface, so strokes keep their width
 * everywhere, including the ones projected from the front of the logo.
 */
export function createBodyTextures(width = 2048, height = 1024) {
  const rows = Array.from({ length: height }, (_, j) => {
    const p = profileAt((j + 0.5) / height)
    return { ...p, s: ((j + 0.5) / height) * PROFILE_LENGTH }
  })
  const bump = new Float32Array(width * height)
  const cover = new Float32Array(width * height)
  const shade = new Float32Array(width * height)
  const dTheta = (Math.PI * 2) / width
  const ds = PROFILE_LENGTH / height
  const AO = 0.06

  for (const stroke of crossStrokes()) {
    const pts = stroke.map(([theta, h]) => [theta, arcAt(h)] as const)
    const thetas = pts.map((p) => p[0])
    const arcs = pts.map((p) => p[1])
    const pad = STROKE_RADIUS + AO
    const s0 = Math.min(...arcs) - pad
    const s1 = Math.max(...arcs) + pad
    const j0 = Math.max(0, Math.floor(s0 / ds))
    const j1 = Math.min(height - 1, Math.ceil(s1 / ds))
    for (let j = j0; j <= j1; j++) {
      const { r, s } = rows[j]!
      if (r < 0.05) continue
      const tPad = pad / r
      const c0 = Math.floor((Math.min(...thetas) - tPad + Math.PI) / dTheta)
      const c1 = Math.ceil((Math.max(...thetas) + tPad + Math.PI) / dTheta)
      const px = Math.max(r * dTheta, ds)
      for (let c = c0; c <= c1; c++) {
        const theta = -Math.PI + (c + 0.5) * dTheta
        // distance to the polyline, in surface units around this texel
        let d = Infinity
        for (let k = 1; k < pts.length; k++) {
          const ax = (thetas[k - 1]! - theta) * r
          const ay = arcs[k - 1]! - s
          const bx = (thetas[k]! - theta) * r
          const by = arcs[k]! - s
          const dx = bx - ax
          const dy = by - ay
          const t = Math.max(
            0,
            Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1))
          )
          d = Math.min(d, Math.hypot(ax + dx * t, ay + dy * t))
        }
        const k = j * width + (((c % width) + width) % width)
        const q = Math.max(0, 1 - (d / STROKE_RADIUS) ** 2)
        bump[k] = Math.max(bump[k]!, Math.sqrt(q))
        cover[k] = Math.max(
          cover[k]!,
          Math.max(0, Math.min(1, 0.5 - (d - STROKE_RADIUS) / px))
        )
        shade[k] = Math.max(
          shade[k]!,
          Math.max(0, 1 - Math.max(0, d - STROKE_RADIUS) / AO)
        )
      }
    }
  }

  const map = new Uint8Array(width * height * 4)
  const normal = new Uint8Array(width * height * 4)
  const base = new Color()
  const mark = new Color()
  const tmp = new Color()
  const n = new Vector3()
  for (let j = 0; j < height; j++) {
    const { r, h } = rows[j]!
    gradient(h, base)
    mark.copy(CROSS_LOW).lerp(CROSS_HIGH, Math.min(1, Math.max(0, h - 1.6)))
    const pxU = Math.max(1e-4, r * dTheta)
    for (let i = 0; i < width; i++) {
      const k = j * width + i
      const c = tmp
        .copy(base)
        .multiplyScalar(1 - 0.06 * shade[k]! * (1 - cover[k]!))
      c.lerp(mark, cover[k]!).convertLinearToSRGB()
      map.set([c.r * 255, c.g * 255, c.b * 255, 255], k * 4)

      const left = bump[j * width + ((i + width - 1) % width)]!
      const right = bump[j * width + ((i + 1) % width)]!
      const down = bump[Math.max(0, j - 1) * width + i]!
      const up = bump[Math.min(height - 1, j + 1) * width + i]!
      n.set(
        (-(right - left) * STROKE_HEIGHT) / (2 * pxU),
        (-(up - down) * STROKE_HEIGHT) / (2 * ds),
        1
      ).normalize()
      normal.set(
        [
          (n.x * 0.5 + 0.5) * 255,
          (n.y * 0.5 + 0.5) * 255,
          (n.z * 0.5 + 0.5) * 255,
          255,
        ],
        k * 4
      )
    }
  }

  return {
    map: texture(map, width, height, 'Pineapple_Skin_Color', true),
    normalMap: texture(normal, width, height, 'Pineapple_Skin_Normal', false),
  }
}
