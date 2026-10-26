import { Vector3 } from 'three'

/**
 * Geometry helpers shared by every part of the model. 1 unit = 100 px of
 * `packages/docs/public/logo.svg`. The body is a surface of revolution of the
 * exact SVG outline, slightly flattened front to back.
 */

export const UNIT = 100
const SVG_CENTER_X = 184.473473
const SVG_BOTTOM_Y = 501

/** Front to back flattening of the body. */
export const BODY_DEPTH = 0.9

/** Converts logo.svg coordinates (inside its translate(-34 -24) group) to front view x/height. */
export function fromSvg(x: number, y: number): [x: number, h: number] {
  return [(x - SVG_CENTER_X) / UNIT, (SVG_BOTTOM_Y - y) / UNIT]
}

type Point = [number, number]
type Cubic = [Point, Point, Point, Point]

// right half of the body path, from the bottom center to the top center
const BODY_OUTLINE: Cubic[] = [
  [
    [184.473473, 501],
    [267.592327, 501],
    [335, 476.854852],
    [335, 367.354852],
  ],
  [
    [335, 367.354852],
    [335, 257.854852],
    [267.592327, 168],
    [184.473473, 168],
  ],
]

function cubicAt([p0, p1, p2, p3]: Cubic, t: number): Point {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ]
}

export interface ProfileSample {
  /** radius */
  r: number
  /** height */
  h: number
  /** unit tangent going up the profile */
  tr: number
  th: number
}

const DENSE: { r: number; h: number }[] = []
for (const seg of BODY_OUTLINE) {
  for (let i = DENSE.length ? 1 : 0; i <= 600; i++) {
    const [x, y] = fromSvg(...cubicAt(seg, i / 600))
    DENSE.push({ r: Math.max(0, x), h: y })
  }
}

export const BODY_HEIGHT = DENSE[DENSE.length - 1]!.h

/** Profile resampled at constant arc length, bottom pole to top pole. */
export function sampleProfile(count: number): ProfileSample[] {
  const lengths = [0]
  for (let i = 1; i < DENSE.length; i++) {
    const a = DENSE[i - 1]!
    const b = DENSE[i]!
    lengths.push(lengths[i - 1]! + Math.hypot(b.r - a.r, b.h - a.h))
  }
  const total = lengths[lengths.length - 1]!
  const samples: ProfileSample[] = []
  let k = 1
  for (let i = 0; i <= count; i++) {
    const target = (i / count) * total
    while (k < DENSE.length - 1 && lengths[k]! < target) k++
    const a = DENSE[k - 1]!
    const b = DENSE[k]!
    const f = (target - lengths[k - 1]!) / (lengths[k]! - lengths[k - 1]! || 1)
    const len = Math.hypot(b.r - a.r, b.h - a.h) || 1
    samples.push({
      r: i === 0 || i === count ? 0 : a.r + (b.r - a.r) * f,
      h: a.h + (b.h - a.h) * f,
      tr: (b.r - a.r) / len,
      th: (b.h - a.h) / len,
    })
  }
  return samples
}

/** Body radius at a given height. */
export function radiusAt(h: number): number {
  if (h <= 0 || h >= BODY_HEIGHT) return 0
  let lo = 0
  let hi = DENSE.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (DENSE[mid]!.h < h) lo = mid
    else hi = mid
  }
  const a = DENSE[lo]!
  const b = DENSE[hi]!
  return a.r + ((b.r - a.r) * (h - a.h)) / (b.h - a.h || 1)
}

function tangentAt(h: number): [tr: number, th: number] {
  const e = 0.002
  const dr = radiusAt(h + e) - radiusAt(h - e)
  const len = Math.hypot(dr, 2 * e)
  return [dr / len, (2 * e) / len]
}

/** Point on the body. θ = 0 faces the viewer (+z). */
export function surfacePoint(
  theta: number,
  h: number,
  target = new Vector3()
): Vector3 {
  const r = radiusAt(h)
  return target.set(r * Math.sin(theta), h, BODY_DEPTH * r * Math.cos(theta))
}

/** Outward normal from the profile tangent. */
export function normalFromTangent(
  theta: number,
  tr: number,
  th: number,
  target = new Vector3()
): Vector3 {
  return target
    .set(
      BODY_DEPTH * th * Math.sin(theta),
      -BODY_DEPTH * tr,
      th * Math.cos(theta)
    )
    .normalize()
}

export interface SurfaceFrame {
  position: Vector3
  /** around the body, to the right in front view */
  tangent: Vector3
  /** up along the body */
  bitangent: Vector3
  normal: Vector3
}

export function surfaceFrame(
  theta: number,
  h: number,
  offset = 0
): SurfaceFrame {
  const [tr, th] = tangentAt(h)
  const normal = normalFromTangent(theta, tr, th)
  const tangent = new Vector3(
    Math.cos(theta),
    0,
    -BODY_DEPTH * Math.sin(theta)
  ).normalize()
  const bitangent = new Vector3().crossVectors(normal, tangent).normalize()
  const position = surfacePoint(theta, h).addScaledVector(normal, offset)
  return { position, tangent, bitangent, normal }
}

/** Angle around the body hit by a front-view orthographic ray at x. */
export function thetaFromFront(x: number, h: number): number {
  const r = radiusAt(h)
  return r > 0 ? Math.asin(Math.max(-1, Math.min(1, x / r))) : 0
}

/** Moves a point along the surface by an arc offset (u around, v up). */
export function arcOffset(
  theta: number,
  h: number,
  u: number,
  v: number
): [theta: number, h: number] {
  const [, th] = tangentAt(h)
  const nh = h + v * th
  const r = radiusAt(nh) || 1e-3
  return [theta + u / r, nh]
}
