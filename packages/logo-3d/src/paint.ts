import {
  Color,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  RGBAFormat,
  SRGBColorSpace,
  UnsignedByteType,
  Vector2,
} from 'three'

/**
 * Tiny signed distance painter. Shapes are written in feature units (the
 * socket space of the face) and rasterized with analytic anti-aliasing, so the
 * same code bakes the GLB textures in Node and redraws the eyes live.
 */

export type Box = [x0: number, y0: number, x1: number, y1: number]

export interface Sdf {
  /** negative inside */
  d: (x: number, y: number) => number
  box: Box
}

export interface Layer {
  shape: Sdf
  color: string
  opacity?: number
  /** soft edge width, in units */
  feather?: number
  /** gets the clearcoat, everything else is matte */
  gloss?: boolean
}

export function circle(cx: number, cy: number, r: number): Sdf {
  return {
    d: (x, y) => Math.hypot(x - cx, y - cy) - r,
    box: [cx - r, cy - r, cx + r, cy + r],
  }
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): Sdf {
  const m = Math.min(rx, ry)
  return {
    d: (x, y) => (Math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * m,
    box: [cx - rx, cy - ry, cx + rx, cy + ry],
  }
}

function segmentDistance(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(
    0,
    Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1))
  )
  return Math.hypot(x - ax - dx * t, y - ay - dy * t)
}

function boxOf(points: [number, number][], pad: number): Box {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  return [
    Math.min(...xs) - pad,
    Math.min(...ys) - pad,
    Math.max(...xs) + pad,
    Math.max(...ys) + pad,
  ]
}

/** Round stroke through points. */
export function line(points: [number, number][], radius: number): Sdf {
  return {
    d: (x, y) => {
      let min = Infinity
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1]!
        const [bx, by] = points[i]!
        min = Math.min(min, segmentDistance(x, y, ax, ay, bx, by))
      }
      return min - radius
    },
    box: boxOf(points, radius),
  }
}

/** Filled closed polygon. */
export function polygon(points: [number, number][] | Vector2[]): Sdf {
  const p = points.map((v) =>
    Array.isArray(v) ? v : ([v.x, v.y] as [number, number])
  )
  return {
    d: (x, y) => {
      let min = Infinity
      let inside = false
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const [ax, ay] = p[i]!
        const [bx, by] = p[j]!
        min = Math.min(min, segmentDistance(x, y, ax, ay, bx, by))
        if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax)
          inside = !inside
      }
      return inside ? -min : min
    },
    box: boxOf(p, 0),
  }
}

/** Area below the line through a and b, whatever their order. */
export function below(a: [number, number], b: [number, number]): Sdf {
  // normal pointing up
  const flip = b[0] - a[0] < 0 ? -1 : 1
  const nx = -(b[1] - a[1]) * flip
  const ny = (b[0] - a[0]) * flip
  const len = Math.hypot(nx, ny)
  return {
    d: (x, y) => ((x - a[0]) * nx + (y - a[1]) * ny) / len,
    box: [-Infinity, -Infinity, Infinity, Infinity],
  }
}

export function intersect(a: Sdf, b: Sdf): Sdf {
  return {
    d: (x, y) => Math.max(a.d(x, y), b.d(x, y)),
    box: [
      Math.max(a.box[0], b.box[0]),
      Math.max(a.box[1], b.box[1]),
      Math.min(a.box[2], b.box[2]),
      Math.min(a.box[3], b.box[3]),
    ],
  }
}

export function ring(shape: Sdf, width: number): Sdf {
  return {
    d: (x, y) => Math.abs(shape.d(x, y)) - width,
    box: [
      shape.box[0] - width,
      shape.box[1] - width,
      shape.box[2] + width,
      shape.box[3] + width,
    ],
  }
}

export interface Raster {
  width: number
  height: number
  /** area covered by the texture, row 0 is the bottom */
  rect: Box
  data: Uint8Array
}

export function createRaster(rect: Box, pixelsPerUnit: number): Raster {
  const width = Math.ceil(((rect[2] - rect[0]) * pixelsPerUnit) / 4) * 4
  const height = Math.ceil(((rect[3] - rect[1]) * pixelsPerUnit) / 4) * 4
  return { width, height, rect, data: new Uint8Array(width * height * 4) }
}

const _c = new Color()

/** Clears and draws layers in order, with straight alpha. */
export function paint(raster: Raster, layers: Layer[]): Raster {
  const { width: w, height: h, rect, data } = raster
  const sx = (rect[2] - rect[0]) / w
  const sy = (rect[3] - rect[1]) / h
  const px = Math.max(sx, sy)

  // transparent texels take the first color, so filtering has no dark fringe
  _c.set(layers[0]?.color ?? '#000').convertLinearToSRGB()
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = _c.r * 255
    data[i * 4 + 1] = _c.g * 255
    data[i * 4 + 2] = _c.b * 255
    data[i * 4 + 3] = 0
  }

  for (const layer of layers) {
    _c.set(layer.color).convertLinearToSRGB()
    const r = _c.r * 255
    const g = _c.g * 255
    const b = _c.b * 255
    const opacity = layer.opacity ?? 1
    const edge = Math.max(px, layer.feather ?? 0)
    const [bx0, by0, bx1, by1] = layer.shape.box
    const i0 = Math.max(0, Math.floor((bx0 - edge - rect[0]) / sx))
    const i1 = Math.min(w - 1, Math.ceil((bx1 + edge - rect[0]) / sx))
    const j0 = Math.max(0, Math.floor((by0 - edge - rect[1]) / sy))
    const j1 = Math.min(h - 1, Math.ceil((by1 + edge - rect[1]) / sy))
    for (let j = j0; j <= j1; j++) {
      const y = rect[1] + (j + 0.5) * sy
      for (let i = i0; i <= i1; i++) {
        const d = layer.shape.d(rect[0] + (i + 0.5) * sx, y)
        let a = Math.max(0, Math.min(1, 0.5 - d / edge))
        if (a <= 0) continue
        a *= opacity
        const k = (j * w + i) * 4
        const da = data[k + 3]! / 255
        const oa = a + da * (1 - a)
        const f = a / oa
        data[k] = r * f + data[k]! * (1 - f)
        data[k + 1] = g * f + data[k + 1]! * (1 - f)
        data[k + 2] = b * f + data[k + 2]! * (1 - f)
        data[k + 3] = oa * 255
      }
    }
  }
  return raster
}

/** Smallest box holding every layer, plus a margin, inside `limit`. */
export function bounds(layers: Layer[], limit: Box, pad = 0.02): Box {
  const box: Box = [Infinity, Infinity, -Infinity, -Infinity]
  for (const { shape, feather = 0 } of layers) {
    const e = feather + pad
    box[0] = Math.min(box[0], shape.box[0] - e)
    box[1] = Math.min(box[1], shape.box[1] - e)
    box[2] = Math.max(box[2], shape.box[2] + e)
    box[3] = Math.max(box[3], shape.box[3] + e)
  }
  return [
    Math.max(limit[0], box[0]),
    Math.max(limit[1], box[1]),
    Math.min(limit[2], box[2]),
    Math.min(limit[3], box[3]),
  ]
}

const EVERYWHERE: Sdf = {
  d: () => -1,
  box: [-Infinity, -Infinity, Infinity, Infinity],
}

/**
 * Gloss mask of layers: red is the clearcoat and green the roughness factor,
 * like glTF clearcoat and metallic-roughness textures.
 */
export function glossLayers(layers: Layer[]): Layer[] {
  return [
    { shape: EVERYWHERE, color: '#00ff00' },
    ...layers.filter((l) => l.gloss).map((l) => ({ ...l, color: '#ff4d00' })),
  ]
}

export function toTexture(raster: Raster, name: string): DataTexture {
  const t = new DataTexture(
    raster.data,
    raster.width,
    raster.height,
    RGBAFormat,
    UnsignedByteType
  )
  t.name = name
  t.colorSpace = SRGBColorSpace
  t.magFilter = LinearFilter
  t.minFilter = LinearMipmapLinearFilter
  t.generateMipmaps = true
  t.anisotropy = 8
  t.needsUpdate = true
  return t
}
