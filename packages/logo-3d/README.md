# Pinia logo in 3D

A procedural, rigged 3D model of [`logo.svg`](../docs/public/logo.svg), built with three.js. There are no hand-made meshes or images: the code computes every shape and texture from the SVG paths.

- **Body**: a surface of revolution of the exact Bézier outline of the logo, slightly flattened front to back. Its color texture holds the gradient of the logo and the X marks; a normal map gives the marks their relief. The three front marks are the logo strokes, projected onto the body.
- **Leaves**: 7 skinned meshes with a round, adjustable thickness, one 5-bone chain each. A VRM-style spring bone solver with sphere colliders for the body drives them. The three front leaves use the base, tip and width of the logo leaves.
- **Face**: sockets for both eyes and the mouth, oriented on the skin. Every expression is a decal (a small patch that follows the skin) with a painted texture. Only the eyes are glossy, through a mask.

Textures are painted with a small signed distance painter (`src/paint.ts`). The same code bakes them in Node for the GLB and redraws the eyes live when the pupils move.

```sh
pnpm -C packages/logo-3d dev      # viewer, exports public/pinia.glb first
pnpm -C packages/logo-3d export   # writes public/pinia.glb
pnpm -C packages/logo-3d test
```

Add `?procedural` to the viewer URL to build the model in the browser instead of loading the GLB. In the viewer, the keys 1–8 change the expression, space makes the pineapple hop, `r` resets the camera and `w` toggles the wireframe.

## Using the model

```ts
import { createPineapple, bindPineapple } from './src/index.ts'

// build it…
const pineapple = createPineapple()
// …or load the GLB with GLTFLoader and wire it
const pineapple = bindPineapple(gltf.scene.getObjectByName('Pineapple')!)

scene.add(pineapple.root)
pineapple.setExpression('laugh') // happy, wink, laugh, surprised, sad, angry, love, sleepy
pineapple.setSquash(0.85) // squash and stretch, the crown stays on top
pineapple.lookAt(camera.position) // each eye looks at a point
pineapple.setPupilSize(1.2)
pineapple.setBlink(1)
pineapple.setBlush(1.5)
pineapple.setRelief(2) // X marks relief
pineapple.setLeafThickness(0.08)
pineapple.setLeafCount(3) // the 3 leaves of the logo, up to 7 (LEAF_ORDER)
pineapple.setLeafScale(1.2)
pineapple.springs.settings.stiffness = 0.5 // also drag, gravity, collisions
pineapple.springs.settings.follow = 0.5 // how much of the body motion the leaves inherit
pineapple.springs.wind.set(1.5, 0, -0.5)

// every frame, after you move pineapple.root
pineapple.update(dt)
```

## Node layout

```
Pineapple                 userData: expressions, colliders, crownHeight
├─ Body                   squash here, pivot on the ground
│  ├─ Body_Mesh           color + normal map
│  └─ Face
│     ├─ Socket_Eye_L     +x, the character's left
│     ├─ Socket_Eye_R
│     ├─ Socket_Mouth     children: Eye_L_happy, …  userData.expression, userData.rect
│     └─ Socket_Cheek_L / Socket_Cheek_R
└─ Crown
   ├─ Leaf_*_0 … Leaf_*_4 bone chains, userData.spring on joints 0–3
   └─ Leaf_*_Mesh          skinned meshes, `_thickness` vertex attribute
```

In the GLB, node `extras` hold the spring parameters (`stiffness`, `drag`, `gravity`, `hitRadius`) the colliders and the spring multipliers of the defaults (`springs`: `stiffness`, `drag`, `follow`). Other engines can rebuild the same physics from them. The `_thickness` attribute is the offset of each leaf vertex for a thickness of 1.

## Custom expressions

Add an entry to `EXPRESSIONS` in `src/expressions.ts`. An expression is a list of 2D layers for each eye and for the mouth, in socket space: x right, y up, in body units (1 = 100 px of the SVG). Shapes come from `src/paint.ts` (`circle`, `ellipse`, `line`, `polygon`, `intersect`, …). Set `gloss: true` on the layers that must shine.

To add a decal to a loaded model, give it `userData.expression` and add it to a socket. `decal()` wraps a patch on the skin, so it works on a loaded GLB too:

```ts
import {
  bounds,
  createRaster,
  decal,
  ellipse,
  paint,
  PIXELS_PER_UNIT,
  toTexture,
} from './src/index.ts'

const layers = [{ shape: ellipse(0, 0, 0.3, 0.3), color: '#222' }]
const rect = bounds(layers, [-1, -1, 1, 1])
const map = toTexture(
  paint(createRaster(rect, PIXELS_PER_UNIT), layers),
  'Monocle'
)
const monocle = decal('Monocle', pineapple.sockets.eyeL, rect, map, 'eye')
monocle.userData.expression = 'happy'
pineapple.sockets.eyeL.add(monocle)
```

`setExpression(name)` shows the children of the sockets that match `name`, so the monocle shows with the happy face.
