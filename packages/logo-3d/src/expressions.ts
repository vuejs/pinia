import { Shape } from 'three'
import {
  below,
  circle,
  ellipse,
  intersect,
  type Layer,
  line,
  polygon,
  ring,
  type Sdf,
} from './paint.ts'

/**
 * Expressions are 2D drawings for three sockets: both eyes and the mouth,
 * painted into textures. `side` is 1 for the left eye and -1 for the right
 * one. Eye shapes are written for the left eye, with the nose towards -x.
 */

export interface FaceParams {
  /** pupil direction, x and y in [-1, 1] */
  look: [number, number]
  /** pupil size multiplier */
  pupil: number
}

export const DEFAULT_FACE_PARAMS: FaceParams = { look: [0, 0], pupil: 1 }

export interface ExpressionDef {
  eye: (side: 1 | -1, params: FaceParams) => Layer[]
  mouth: () => Layer[]
  /** blush opacity */
  blush: number
  /** eyes can blink */
  blink: boolean
  /** pupils can follow a target */
  look: boolean
}

const INK = '#151515'
const WHITE = '#ffffff'
const MOUTH = '#5a1b26'
const TONGUE = '#ff8094'
const TONGUE_LINE = '#e25d76'
const HEART = '#ff4f7b'
const TEAR = '#8fdcff'
const LINE = 0.03

type P = [number, number]

function parabola(halfWidth: number, y0: number, y1: number, n = 17): P[] {
  return Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1) - 0.5) * 2 * halfWidth
    return [x, y0 + (y1 - y0) * (x / halfWidth) ** 2] as P
  })
}

function mirror(points: P[], side: 1 | -1): P[] {
  return points.map(([x, y]) => [x * side, y])
}

interface RoundEyeOptions {
  radius?: number
  pupil?: number
  /** resting pupil offset, in units */
  offset?: P
  /** clips the top of the eye */
  lid?: Sdf
}

function roundEye(params: FaceParams, opts: RoundEyeOptions = {}): Layer[] {
  const R = opts.radius ?? 0.26
  const r = Math.min(R - 0.05, (opts.pupil ?? 0.17) * params.pupil)
  // the pupil always keeps a rim of white around it
  const range = Math.max(0, R - r - 0.03)
  let [px, py] = opts.offset ?? [0, 0]
  px += params.look[0] * range
  py += params.look[1] * range
  const len = Math.hypot(px, py)
  if (len > range) {
    px *= range / len
    py *= range / len
  }
  const clip = (s: Sdf) => (opts.lid ? intersect(s, opts.lid) : s)
  const pupil = clip(intersect(circle(px, py, r), circle(0, 0, R - 0.012)))
  return [
    { shape: clip(circle(0, 0, R)), color: WHITE, gloss: true },
    { shape: pupil, color: INK, gloss: true },
    {
      shape: intersect(circle(px - r * 0.39, py + r * 0.22, r * 0.42), pupil),
      color: WHITE,
      gloss: true,
    },
    {
      shape: intersect(circle(px + r * 0.36, py - r * 0.36, r * 0.13), pupil),
      color: WHITE,
      opacity: 0.8,
      gloss: true,
    },
  ]
}

function brow(side: 1 | -1, points: P[]): Layer {
  return { shape: line(mirror(points, side), LINE * 0.9), color: INK }
}

function smile(halfWidth = 0.21, depth = 0.085): Layer {
  return {
    shape: line(parabola(halfWidth, -depth / 2, depth / 2), LINE),
    color: INK,
  }
}

function openMouth(scale = 1): Layer[] {
  const w = 0.2 * scale
  const s = new Shape()
  s.moveTo(-w, 0.06 * scale)
  s.quadraticCurveTo(0, 0.005 * scale, w, 0.06 * scale)
  s.bezierCurveTo(w, -0.18 * scale, -w, -0.18 * scale, -w, 0.06 * scale)
  const inside = polygon(s.getPoints(48))
  return [
    { shape: inside, color: MOUTH },
    {
      shape: intersect(
        ellipse(0, -0.095 * scale, 0.1 * scale, 0.055 * scale),
        inside
      ),
      color: TONGUE,
    },
  ]
}

function roundMouth(rx: number, ry: number): Layer[] {
  return [
    { shape: ellipse(0, 0, rx, ry), color: MOUTH },
    { shape: ring(ellipse(0, 0, rx, ry), LINE * 0.7), color: INK },
  ]
}

function heart(size: number, cy: number): Sdf {
  return polygon(
    Array.from({ length: 96 }, (_, i) => {
      const t = (i / 96) * Math.PI * 2
      const x = 16 * Math.sin(t) ** 3
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      return [(x / 17) * size, cy + (y / 17) * size] as P
    })
  )
}

function tear(x: number, y: number): Layer[] {
  const s = new Shape()
  s.moveTo(x, y + 0.07)
  s.bezierCurveTo(x + 0.025, y + 0.02, x + 0.05, y - 0.01, x + 0.05, y - 0.035)
  s.absarc(x, y - 0.035, 0.05, 0, Math.PI, true)
  s.bezierCurveTo(x - 0.05, y - 0.01, x - 0.025, y + 0.02, x, y + 0.07)
  return [
    { shape: polygon(s.getPoints(16)), color: TEAR, opacity: 0.9, gloss: true },
    { shape: circle(x - 0.018, y - 0.035, 0.014), color: WHITE, opacity: 0.9 },
  ]
}

export const EXPRESSIONS = {
  happy: {
    eye: (_side, p) => roundEye(p),
    mouth: () => [smile()],
    blush: 0.9,
    blink: true,
    look: true,
  },
  wink: {
    eye: (side, p) =>
      side === 1
        ? [
            {
              shape: line(
                [
                  [0.15, 0.11],
                  [-0.12, 0],
                  [0.15, -0.11],
                ],
                LINE * 1.15
              ),
              color: INK,
            },
          ]
        : roundEye(p, { offset: [0.02, 0.01] }),
    mouth: () => [
      { shape: ellipse(0.07, -0.095, 0.055, 0.06), color: TONGUE },
      {
        shape: line(
          [
            [0.07, -0.06],
            [0.07, -0.12],
          ],
          0.006
        ),
        color: TONGUE_LINE,
      },
      smile(0.2, 0.09),
    ],
    blush: 1,
    blink: false,
    look: true,
  },
  laugh: {
    eye: () => [
      { shape: line(parabola(0.18, 0.1, -0.06), LINE * 1.15), color: INK },
    ],
    mouth: () => openMouth(),
    blush: 1.1,
    blink: false,
    look: false,
  },
  surprised: {
    eye: (side, p) => [
      ...roundEye(p, { radius: 0.29, pupil: 0.12 }),
      brow(side, parabola(0.17, 0.5, 0.42, 9)),
    ],
    mouth: () => roundMouth(0.07, 0.09),
    blush: 0.5,
    blink: true,
    look: true,
  },
  sad: {
    eye: (side, p) => [
      ...roundEye(p, { offset: [0, -0.04] }),
      brow(side, [
        [-0.2, 0.43],
        [0, 0.38],
        [0.2, 0.31],
      ]),
      ...(side === 1 ? tear(0.2, -0.33) : []),
    ],
    mouth: () => [smile(0.16, -0.07)],
    blush: 0.45,
    blink: true,
    look: true,
  },
  angry: {
    eye: (side, p) => [
      ...roundEye(p, {
        radius: 0.25,
        pupil: 0.16,
        offset: [-0.03 * side, -0.05],
        // slanted lid, lower towards the nose
        lid: below([-0.3 * side, 0.1], [0.3 * side, 0.27]),
      }),
      brow(side, [
        [-0.25, 0.22],
        [0, 0.32],
        [0.24, 0.42],
      ]),
    ],
    mouth: () => [smile(0.13, -0.09)],
    blush: 0.25,
    blink: true,
    look: true,
  },
  love: {
    eye: () => [
      { shape: heart(0.27, -0.02), color: HEART, gloss: true },
      { shape: ellipse(-0.1, 0.08, 0.045, 0.035), color: WHITE, opacity: 0.95 },
    ],
    mouth: () => openMouth(0.78),
    blush: 1.3,
    blink: false,
    look: false,
  },
  sleepy: {
    eye: () => [
      { shape: line(parabola(0.17, -0.03, 0.05), LINE * 1.1), color: INK },
    ],
    mouth: () => roundMouth(0.045, 0.05),
    blush: 0.75,
    blink: false,
    look: false,
  },
} satisfies Record<string, ExpressionDef>

export type ExpressionName = keyof typeof EXPRESSIONS
export const DEFAULT_EXPRESSION: ExpressionName = 'happy'

export const BLUSH: Layer[] = [
  { shape: ellipse(0, 0, 0.2, 0.085), color: '#eaadcc', feather: 0.09 },
]
