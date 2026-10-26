import { Bone, Object3D, Quaternion, Vector3 } from 'three'
import type { SpringParams } from './leaves.ts'

export interface SphereCollider {
  /** the collider follows this object */
  object: Object3D
  /** in object space */
  center: Vector3
  radius: number
}

interface Joint {
  bone: Bone
  params: SpringParams
  /** child direction in bone space at rest */
  axis: Vector3
  length: number
  rest: Quaternion
  tail: Vector3
  prevTail: Vector3
  collide: boolean
}

const _parentQ = new Quaternion()
const _q = new Quaternion()
const _head = new Vector3()
const _v = new Vector3()
const _next = new Vector3()
const _c = new Vector3()
const _s = new Vector3()

/**
 * Verlet spring bones, same model as VRM spring bones: each joint keeps the
 * world position of its tail, pulled back to its rest direction and pushed out
 * of sphere colliders. Joints are simulated root first.
 */
export class SpringBoneSystem {
  joints: Joint[] = []
  colliders: SphereCollider[]
  gravity = new Vector3(0, -1, 0)
  /** extra force, in units per second */
  wind = new Vector3()
  /** multipliers applied on top of the parameters of every joint */
  settings = { stiffness: 1, drag: 1, gravity: 1, collisions: true }
  step = 1 / 120
  private acc = 0

  constructor(chains: Bone[][], colliders: SphereCollider[] = []) {
    this.colliders = colliders
    for (const chain of chains) {
      for (const bone of chain) {
        const child = bone.children.find((c): c is Bone => (c as Bone).isBone)
        const params = bone.userData.spring as SpringParams | undefined
        if (!child || !params) continue
        this.joints.push({
          bone,
          params,
          axis: child.position.clone().normalize(),
          length: child.position.length(),
          rest: bone.quaternion.clone(),
          tail: new Vector3(),
          prevTail: new Vector3(),
          collide: true,
        })
      }
    }
    this.reset()
  }

  /** Puts every joint back to its rest pose, without velocity. */
  reset() {
    for (const j of this.joints) j.bone.quaternion.copy(j.rest)
    for (const j of this.joints) {
      j.bone.updateWorldMatrix(true, false)
      j.bone.getWorldPosition(_head)
      j.bone.getWorldQuaternion(_q)
      j.tail
        .copy(j.axis)
        .applyQuaternion(_q)
        .multiplyScalar(j.length * this.worldScale(j.bone))
        .add(_head)
      j.prevTail.copy(j.tail)
      // tails resting inside a collider (embedded base) must not be pushed out
      j.collide = !this.colliders.some(
        (c) => this.penetration(c, j.tail, j.params.hitRadius) > 0
      )
    }
  }

  /** Adds a velocity to every tail, in world units per step. */
  impulse(v: Vector3) {
    for (const j of this.joints) j.prevTail.sub(v)
  }

  update(dt: number) {
    this.acc = Math.min(this.acc + dt, this.step * 8)
    while (this.acc >= this.step) {
      this.acc -= this.step
      this.solve(this.step)
    }
  }

  private worldScale(o: Object3D): number {
    o.getWorldScale(_s)
    return (_s.x + _s.y + _s.z) / 3
  }

  private penetration(
    c: SphereCollider,
    p: Vector3,
    hitRadius: number
  ): number {
    c.object.localToWorld(_c.copy(c.center))
    const r = c.radius * this.worldScale(c.object) + hitRadius
    return r - p.distanceTo(_c)
  }

  private solve(dt: number) {
    for (const j of this.joints) {
      const { bone, params } = j
      const parent = bone.parent!
      parent.updateWorldMatrix(true, false)
      parent.getWorldQuaternion(_parentQ)
      bone.updateWorldMatrix(false, false)
      bone.getWorldPosition(_head)
      const length = j.length * this.worldScale(bone)

      // rest direction of the tail in world space
      _q.copy(_parentQ).multiply(j.rest)
      _v.copy(j.axis).applyQuaternion(_q)

      _next
        .copy(j.tail)
        .addScaledVector(
          _c.subVectors(j.tail, j.prevTail),
          1 - Math.min(1, params.drag * this.settings.drag)
        )
        .addScaledVector(_v, params.stiffness * this.settings.stiffness * dt)
        .addScaledVector(
          this.gravity,
          params.gravity * this.settings.gravity * dt
        )
        .addScaledVector(this.wind, dt)
      _next.sub(_head).setLength(length).add(_head)

      if (j.collide && this.settings.collisions) {
        for (const c of this.colliders) {
          const depth = this.penetration(c, _next, params.hitRadius)
          if (depth > 0) {
            _next.addScaledVector(_s.subVectors(_next, _c).normalize(), depth)
            _next.sub(_head).setLength(length).add(_head)
          }
        }
      }

      j.prevTail.copy(j.tail)
      j.tail.copy(_next)

      // rotate the bone so its child points at the new tail
      _v.subVectors(_next, _head).applyQuaternion(_q.invert()).normalize()
      bone.quaternion
        .copy(j.rest)
        .multiply(new Quaternion().setFromUnitVectors(j.axis, _v))
      bone.updateWorldMatrix(false, false)
    }
  }
}
