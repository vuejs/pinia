import {
  DirectionalLight,
  Group,
  HemisphereLight,
  type Material,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Raycaster,
  Scene,
  ShadowMaterial,
  SkeletonHelper,
  SkinnedMesh,
  SphereGeometry,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DEFAULT_LEAF_THICKNESS } from './leaves.ts'
import { bindPineapple, createPineapple, type Pineapple } from './pineapple.ts'

const canvas = document.querySelector<HTMLCanvasElement>('#scene')!
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.toneMapping = NeutralToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFShadowMap

const scene = new Scene()
const pmrem = new PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

const camera = new PerspectiveCamera(30, 1, 0.1, 100)
const HOME = {
  position: new Vector3(0, 2.9, 13.5),
  target: new Vector3(0, 2.25, 0),
}
camera.position.copy(HOME.position)
const controls = new OrbitControls(camera, canvas)
controls.target.copy(HOME.target)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 6
controls.maxDistance = 24
controls.maxPolarAngle = Math.PI * 0.56
controls.autoRotateSpeed = 1.5

scene.add(new HemisphereLight('#fff8e1', '#9fc79a', 1))
const key = new DirectionalLight('#fff3dc', 2.3)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
Object.assign(key.shadow.camera, { left: -4, right: 4, top: 6, bottom: -2 })
key.shadow.bias = -0.0004
key.shadow.normalBias = 0.02
key.shadow.radius = 4
scene.add(key)
const rim = new DirectionalLight('#d9ffe2', 1.1)
rim.position.set(-6, 5, -7)
scene.add(rim)

const ground = new Mesh(
  new PlaneGeometry(40, 40),
  new ShadowMaterial({ opacity: 0.16 })
)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

async function load(): Promise<Pineapple> {
  // the exported GLB proves the round trip, the procedural model is the fallback
  if (!new URLSearchParams(location.search).has('procedural')) {
    try {
      const gltf = await new GLTFLoader().loadAsync('./pinia.glb')
      return bindPineapple(gltf.scene.getObjectByName('Pineapple')!)
    } catch (e) {
      console.warn('Could not load pinia.glb, building the model instead', e)
    }
  }
  return createPineapple()
}

const pineapple = await load()
scene.add(pineapple.root)
pineapple.root.traverse((o) => {
  if ((o as Mesh).isMesh) {
    o.castShadow = !(o as Mesh).userData.decal
    o.receiveShadow = true
  }
})
pineapple.springs.reset()
document.querySelector('#loading')?.remove()

// debug helpers
const bones = new SkeletonHelper(pineapple.crown)
bones.visible = false
scene.add(bones)
const colliders = new Group()
colliders.visible = false
for (const c of pineapple.springs.colliders) {
  const sphere = new Mesh(
    new SphereGeometry(c.radius, 24, 16),
    new MeshBasicMaterial({
      color: '#ff5a7a',
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
  )
  sphere.position.copy(c.center)
  colliders.add(sphere)
}
pineapple.body.add(colliders)

// wireframe: quad edges only, the shaded surfaces only write depth to hide the back lines
const WIRE_COLORS = { body: '#ffc63a', leaf: '#52ce63', decal: '#ffffff' }
const wires: Mesh[] = []
const surfaces = new Set<Material>()

/** Same attributes, index made of degenerate triangles (a, b, b) so `wireframe` draws one edge each. */
function quadWire(mesh: Mesh, color: string): Mesh {
  const g = mesh.geometry
  const pos = g.getAttribute('position')
  const index = g.index!.array
  const edges = new Map<
    string,
    { a: number; b: number; count: number; longest: number }
  >()
  const p = [new Vector3(), new Vector3(), new Vector3()]
  for (let i = 0; i < index.length; i += 3) {
    const tri = [index[i]!, index[i + 1]!, index[i + 2]!]
    tri.forEach((v, k) => p[k]!.fromBufferAttribute(pos, v))
    const lengths = [0, 1, 2].map((k) => p[k]!.distanceTo(p[(k + 1) % 3]!))
    const longest = lengths.indexOf(Math.max(...lengths))
    for (let k = 0; k < 3; k++) {
      const a = Math.min(tri[k]!, tri[(k + 1) % 3]!)
      const b = Math.max(tri[k]!, tri[(k + 1) % 3]!)
      const key = `${a}:${b}`
      const e = edges.get(key) ?? { a, b, count: 0, longest: 0 }
      e.count++
      if (k === longest) e.longest++
      edges.set(key, e)
    }
  }
  const lines: number[] = []
  for (const e of edges.values()) {
    // the diagonal of a quad is the longest edge of both of its triangles
    if (e.a !== e.b && !(e.count === 2 && e.longest === 2))
      lines.push(e.a, e.b, e.b)
  }
  const wire = new BufferGeometry()
  for (const [name, attribute] of Object.entries(g.attributes))
    wire.setAttribute(name, attribute)
  wire.setIndex(lines)
  const material = new MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  })
  let out: Mesh
  if ((mesh as SkinnedMesh).isSkinnedMesh) {
    const skinned = new SkinnedMesh(wire, material)
    skinned.bind(
      (mesh as SkinnedMesh).skeleton,
      (mesh as SkinnedMesh).bindMatrix
    )
    out = skinned
  } else {
    out = new Mesh(wire, material)
  }
  out.name = `${mesh.name}_Wire`
  out.visible = false
  out.renderOrder = 5
  return out
}

const wired: Mesh[] = []
pineapple.root.traverse((o) => {
  const mesh = o as Mesh
  if (!mesh.isMesh || mesh.parent === colliders || !mesh.geometry.index) return
  wired.push(mesh)
  const kind = mesh.userData.decal
    ? 'decal'
    : (mesh as SkinnedMesh).isSkinnedMesh
      ? 'leaf'
      : 'body'
  const wire = quadWire(mesh, WIRE_COLORS[kind])
  wires.push(wire)
  for (const m of Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material])
    surfaces.add(m)
})
// attach after the traversal, the wire follows its mesh and its visibility
wired.forEach((mesh, i) => mesh.add(wires[i]!))

function setWireframe(on: boolean) {
  for (const m of surfaces) {
    m.colorWrite = !on
    m.polygonOffset = on
    m.polygonOffsetFactor = 1
    m.polygonOffsetUnits = 1
  }
  for (const w of wires) w.visible = on
}

// state driven by the settings panel
const settings = {
  wireframe: false,
  bones: false,
  colliders: false,
  autoRotate: false,
  thickness: DEFAULT_LEAF_THICKNESS,
  stiffness: 1,
  damping: 1,
  gravity: 1,
  wind: 0,
  collisions: true,
  follow: true,
  blink: true,
  pupil: 1,
  blush: 1,
  hop: 1,
  breathing: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  relief: 1,
  exposure: 1.05,
  reflections: 0.5,
  sun: 30,
  shadows: true,
}
type Settings = typeof settings
const DEFAULTS: Settings = { ...settings }
const STORAGE_KEY = 'pinia-3d-settings'
try {
  Object.assign(settings, JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'))
} catch {}

function apply() {
  const s = settings
  setWireframe(s.wireframe)
  bones.visible = s.bones
  colliders.visible = s.colliders
  controls.autoRotate = s.autoRotate
  if (Math.abs(pineapple.leafThickness - s.thickness) > 1e-4)
    pineapple.setLeafThickness(s.thickness)
  Object.assign(pineapple.springs.settings, {
    stiffness: s.stiffness,
    drag: s.damping,
    gravity: s.gravity,
    collisions: s.collisions,
  })
  if (!s.follow) pineapple.look(0, 0)
  pineapple.setPupilSize(s.pupil)
  pineapple.setBlush(s.blush)
  pineapple.setRelief(s.relief)
  renderer.toneMappingExposure = s.exposure
  scene.environmentIntensity = s.reflections
  const a = (s.sun * Math.PI) / 180
  key.position.set(Math.sin(a) * 8.5, 9, Math.cos(a) * 8.5)
  key.castShadow = s.shadows
  ground.visible = s.shadows
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {}
}

type Control =
  | { section: string }
  | {
      key: keyof Settings
      label: string
      min: number
      max: number
      step: number
      format?: (v: number) => string
    }
  | { key: keyof Settings; label: string; toggle: true }

const times = (v: number) => `${v.toFixed(2)}×`
const CONTROLS: Control[] = [
  { section: 'View' },
  { key: 'wireframe', label: 'Wireframe', toggle: true },
  { key: 'bones', label: 'Show leaf bones', toggle: true },
  { key: 'colliders', label: 'Show colliders', toggle: true },
  { key: 'autoRotate', label: 'Auto-rotate', toggle: true },
  { section: 'Leaves' },
  {
    key: 'thickness',
    label: 'Thickness',
    min: 0.005,
    max: 0.16,
    step: 0.005,
    format: (v) => v.toFixed(3),
  },
  {
    key: 'stiffness',
    label: 'Stiffness',
    min: 0.05,
    max: 3,
    step: 0.05,
    format: times,
  },
  {
    key: 'damping',
    label: 'Damping',
    min: 0.1,
    max: 2.5,
    step: 0.05,
    format: times,
  },
  {
    key: 'gravity',
    label: 'Gravity',
    min: 0,
    max: 5,
    step: 0.1,
    format: times,
  },
  {
    key: 'wind',
    label: 'Wind',
    min: 0,
    max: 3,
    step: 0.1,
    format: (v) => v.toFixed(1),
  },
  { key: 'collisions', label: 'Collide with body', toggle: true },
  { section: 'Face' },
  { key: 'follow', label: 'Eyes follow pointer', toggle: true },
  { key: 'blink', label: 'Blink', toggle: true },
  {
    key: 'pupil',
    label: 'Pupil size',
    min: 0.6,
    max: 1.4,
    step: 0.02,
    format: times,
  },
  { key: 'blush', label: 'Blush', min: 0, max: 2, step: 0.05, format: times },
  { section: 'Body' },
  {
    key: 'hop',
    label: 'Hop height',
    min: 0.3,
    max: 2.5,
    step: 0.05,
    format: times,
  },
  { key: 'breathing', label: 'Idle breathing', toggle: true },
  {
    key: 'relief',
    label: 'Pattern relief',
    min: 0,
    max: 4,
    step: 0.1,
    format: times,
  },
  { section: 'Light' },
  {
    key: 'exposure',
    label: 'Exposure',
    min: 0.4,
    max: 2,
    step: 0.05,
    format: (v) => v.toFixed(2),
  },
  {
    key: 'reflections',
    label: 'Reflections',
    min: 0,
    max: 1.5,
    step: 0.05,
    format: (v) => v.toFixed(2),
  },
  {
    key: 'sun',
    label: 'Sun direction',
    min: -180,
    max: 180,
    step: 1,
    format: (v) => `${v}°`,
  },
  { key: 'shadows', label: 'Shadows', toggle: true },
]

const panel = document.querySelector<HTMLElement>('#panel')!
const inputs = new Map<
  keyof Settings,
  {
    input: HTMLInputElement
    output?: HTMLOutputElement
    format?: (v: number) => string
  }
>()
for (const c of CONTROLS) {
  if ('section' in c) {
    const h = document.createElement('h2')
    h.textContent = c.section
    panel.append(h)
    continue
  }
  const row = document.createElement('div')
  row.className = 'row'
  const id = `setting-${c.key}`
  const label = document.createElement('label')
  label.htmlFor = id
  label.textContent = c.label
  const input = document.createElement('input')
  input.id = id
  row.append(label)
  if ('toggle' in c) {
    input.type = 'checkbox'
    input.className = 'switch'
    input.addEventListener('change', () => {
      ;(settings[c.key] as boolean) = input.checked
      apply()
    })
    row.append(input)
    inputs.set(c.key, { input })
  } else {
    input.type = 'range'
    Object.assign(input, { min: c.min, max: c.max, step: c.step })
    const output = document.createElement('output')
    output.htmlFor = id
    const format = c.format ?? String
    input.addEventListener('input', () => {
      ;(settings[c.key] as number) = Number(input.value)
      output.textContent = format(Number(input.value))
      apply()
    })
    row.append(output, input)
    inputs.set(c.key, { input, output, format })
  }
  panel.append(row)
}
const resetSettings = document.createElement('button')
resetSettings.type = 'button'
resetSettings.className = 'reset'
resetSettings.textContent = 'Reset settings'
resetSettings.addEventListener('click', () => {
  Object.assign(settings, DEFAULTS)
  syncInputs()
  apply()
})
panel.append(resetSettings)

function syncInputs() {
  for (const [k, { input, output, format }] of inputs) {
    const v = settings[k]
    if (typeof v === 'boolean') input.checked = v
    else {
      input.value = String(v)
      if (output) output.textContent = format ? format(v) : String(v)
    }
  }
}

const settingsButton = document.querySelector<HTMLButtonElement>('#settings')!
function setPanel(open: boolean) {
  panel.hidden = !open
  settingsButton.setAttribute('aria-pressed', String(open))
}
settingsButton.addEventListener('click', () => setPanel(panel.hidden))
setPanel(innerWidth > 900)

// expression picker
const faces = document.querySelector<HTMLElement>('#faces')!
const buttons = pineapple.expressions.map((e, i) => {
  const b = document.createElement('button')
  b.type = 'button'
  b.innerHTML = `${e.name[0]!.toUpperCase()}${e.name.slice(1)} <kbd>${i + 1}</kbd>`
  b.addEventListener('click', () => setExpression(e.name))
  faces.append(b)
  return b
})

function setExpression(name: string) {
  pineapple.setExpression(name)
  buttons.forEach((b, i) =>
    b.setAttribute(
      'aria-pressed',
      String(pineapple.expressions[i]!.name === name)
    )
  )
  squash.vel -= 1.6
}

// body motion, all springs so the leaves have something to react to
const squash = { value: 1, vel: 0, target: 1 }
const hop = { y: 0, vy: 0, crouch: 0, airborne: false }
const spin = { angle: 0, vel: 0 }
let blinkIn = 2
let blinkT = -1
const pointer = new Vector2()
let pointerSeen = -Infinity
let cameraTween: { t: number; from: Vector3; fromTarget: Vector3 } | null = null

function startHop() {
  if (hop.airborne || hop.crouch > 0) return
  hop.crouch = 0.13
}

function resetView() {
  controls.autoRotate = false
  cameraTween = {
    t: 0,
    from: camera.position.clone(),
    fromTarget: controls.target.clone(),
  }
}

document.querySelector('#hop')!.addEventListener('click', startHop)
document
  .querySelector('#spin')!
  .addEventListener('click', () => (spin.vel += 15))
document.querySelector('#reset-view')!.addEventListener('click', resetView)

addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  const i = Number(e.key) - 1
  if (pineapple.expressions[i]) setExpression(pineapple.expressions[i]!.name)
  if (e.key === ' ') {
    e.preventDefault()
    startHop()
  }
  if (e.key === 'r') resetView()
  if (e.key === 'w') {
    settings.wireframe = !settings.wireframe
    syncInputs()
    apply()
  }
})

// a tap (not a drag) on the pineapple makes it hop
const raycaster = new Raycaster()
let down: { x: number; y: number } | null = null
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY }
  cameraTween = null
})
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return
  const r = canvas.getBoundingClientRect()
  raycaster.setFromCamera(
    new Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1
    ),
    camera
  )
  if (raycaster.intersectObject(pineapple.root, true).length) startHop()
})
addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect()
  pointer.set(
    ((e.clientX - r.left) / r.width) * 2 - 1,
    -((e.clientY - r.top) / r.height) * 2 + 1
  )
  pointerSeen = performance.now()
})

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  // on tall screens, fit the width of the crown instead of the height
  const halfWidth = 2.4 / HOME.position.distanceTo(HOME.target)
  const fit = Math.max(
    Math.tan((15 * Math.PI) / 180),
    halfWidth / camera.aspect
  )
  camera.fov = (2 * Math.atan(fit) * 180) / Math.PI
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

const timer = new Timer()
const gaze = new Vector3()
const gazeTarget = new Vector3()

renderer.setAnimationLoop((now) => {
  timer.update(now)
  const dt = Math.min(timer.getDelta(), 1 / 20)
  const t = timer.getElapsed()

  // hop: crouch, jump, land
  if (hop.crouch > 0) {
    hop.crouch -= dt
    squash.target = 0.8
    if (hop.crouch <= 0) {
      hop.airborne = true
      hop.vy = 6.2 * Math.sqrt(settings.hop)
      squash.vel += 3.5
    }
  } else if (hop.airborne) {
    hop.vy -= 22 * dt
    hop.y += hop.vy * dt
    squash.target = 1 + Math.max(-0.04, Math.min(0.1, hop.vy * 0.02))
    if (hop.y <= 0) {
      hop.y = 0
      hop.airborne = false
      squash.vel -= 0.25 * Math.abs(hop.vy)
    }
  } else {
    squash.target = settings.breathing ? 1 + 0.012 * Math.sin(t * 1.7) : 1
  }
  squash.vel += ((squash.target - squash.value) * 260 - squash.vel * 11) * dt
  squash.value += squash.vel * dt
  pineapple.setSquash(squash.value)
  pineapple.root.position.y = hop.y

  // spin with friction, then settle facing the front
  spin.vel *= Math.exp(-1.6 * dt)
  if (Math.abs(spin.vel) < 2) {
    const front = Math.round(spin.angle / (Math.PI * 2)) * Math.PI * 2
    spin.vel += ((front - spin.angle) * 40 - spin.vel * 6) * dt
  }
  spin.angle += spin.vel * dt
  pineapple.root.rotation.y = spin.angle

  // wind gusts
  const gust = 0.6 + 0.4 * Math.sin(t * 0.7) * Math.sin(t * 1.9 + 1)
  pineapple.springs.wind
    .set(
      1.6 * gust + 0.4 * Math.sin(t * 5.3),
      0.2 * Math.sin(t * 3.1),
      -0.5 * gust + 0.3 * Math.sin(t * 4.1)
    )
    .multiplyScalar(settings.wind)

  // both eyes look at the pointer, or at the camera when it rests
  if (settings.follow) {
    if (now - pointerSeen < 2500) {
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.at(
        camera.position.distanceTo(controls.target) - 1.2,
        gazeTarget
      )
    } else {
      gazeTarget.copy(camera.position)
    }
    gaze.lerp(gazeTarget, 1 - Math.exp(-10 * dt))
    pineapple.lookAt(gaze)
  }

  if (settings.blink) {
    blinkIn -= dt
    if (blinkIn <= 0 && blinkT < 0) blinkT = 0
  }
  if (blinkT >= 0) {
    blinkT += dt
    pineapple.setBlink(Math.sin(Math.min(1, blinkT / 0.16) * Math.PI))
    if (blinkT >= 0.16) {
      blinkT = -1
      blinkIn = 1.5 + Math.random() * 3.5
      pineapple.setBlink(0)
    }
  }

  if (cameraTween) {
    cameraTween.t = Math.min(1, cameraTween.t + dt / 0.7)
    const e = 1 - (1 - cameraTween.t) ** 3
    camera.position.lerpVectors(cameraTween.from, HOME.position, e)
    controls.target.lerpVectors(cameraTween.fromTarget, HOME.target, e)
    if (cameraTween.t >= 1) {
      cameraTween = null
      controls.autoRotate = settings.autoRotate
    }
  }

  pineapple.update(dt)
  controls.update(dt)
  renderer.render(scene, camera)
})

syncInputs()
apply()
gaze.copy(camera.position)
setExpression(pineapple.expression)
Object.assign(window, { pineapple, camera, controls, settings, apply })
