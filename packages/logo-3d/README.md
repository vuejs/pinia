# Pinia logo in 3D

A procedural, rigged 3D model of [`logo.svg`](../docs/public/logo.svg), built with three.js. There are no hand-made meshes: the code computes every shape from the SVG paths.

- **Body**: a surface of revolution of the exact Bézier outline of the logo, slightly flattened front to back. It has vertex-color gradients from the SVG and embossed X marks. The three front marks are the logo strokes, projected onto the body.
- **Leaves**: 7 skinned meshes, one 5-bone chain each, driven by a VRM-style spring bone solver. The solver has sphere colliders for the body. The three front leaves use the base, tip, and width of the logo leaves.
- **Face**: sockets for both eyes and the mouth, oriented on the skin. Every expression is a child group of the sockets. Features are drawn flat and wrapped onto the curved body with `conform()`.

```sh
pnpm -C packages/logo-3d dev      # viewer, loads public/pinia.glb
pnpm -C packages/logo-3d export   # writes public/pinia.glb
pnpm -C packages/logo-3d test
```

Add `?procedural` to the viewer URL to build the model in the browser instead of loading the GLB.

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
pineapple.look(0.5, 0) // pupils, for round eyes
pineapple.setBlink(1)
pineapple.springs.wind.set(1.5, 0, -0.5)

// every frame, after you move pineapple.root
pineapple.update(dt)
```

## Node layout

```
Pineapple                 userData: expressions, colliders, crownHeight
├─ Body                   squash here, pivot on the ground
│  ├─ Body_Mesh, Body_Pattern
│  └─ Face
│     ├─ Socket_Eye_L     +x, the character's left
│     ├─ Socket_Eye_R
│     ├─ Socket_Mouth     children: Eye_L_happy, …  userData.expression
│     └─ Socket_Cheek_L / Socket_Cheek_R
└─ Crown
   ├─ Leaf_*_0 … Leaf_*_4 bone chains, userData.spring on joints 0–3
   └─ Leaf_*_Mesh          skinned meshes
```

In the GLB, node `extras` hold the spring parameters (`stiffness`, `drag`, `gravity`, `hitRadius`) and the colliders. Other engines can rebuild the same physics from them.

## Custom expressions

Socket space is x right, y up, and z out of the skin, in body units (1 = 100 px of the SVG). To add a feature, give it `userData.expression` and add it to a socket. Use `conform()` to wrap a flat geometry onto the body:

```ts
import { conform, disc, materials } from './src/index.ts'
import { Mesh } from 'three'

const socket = pineapple.sockets.eyeL
const monocle = new Mesh(
  conform(
    disc(0.3, 0.3, () => 0.05),
    socket
  ),
  materials.ink
)
monocle.userData.expression = 'fancy'
socket.add(monocle)
```

`setExpression(name)` shows the children of the sockets that match `name`. A new expression name must also be in `root.userData.expressions`. The easiest way is to add it to `EXPRESSIONS` in `src/expressions.ts`.
