'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl'
import type { MapGraph, MapNode } from '@/lib/map-layout'

/**
 * The field, finally made real.
 *
 * `decisions.md` 009 promised a dimensional field in which the agent's interior is
 * actually rendered, and then never delivered it: the 2D version had to be masked out of
 * the middle half of the viewport to keep prose legible, so the medium survived only as
 * periphery. Here it has a page of its own and can be what it was meant to be — the
 * curriculum as a graph you look into rather than a table of contents drawn to look
 * like one.
 *
 * Constraints it is built under, each one a rule this project has already paid for:
 *
 * **The canvas is decorative and `aria-hidden`.** Every structure it depicts exists as
 * real text in the list beside it, which is what a keyboard or screen-reader user
 * navigates. Nothing here is load-bearing information.
 *
 * **It is never sized from its own bounding box.** That trap produced a three-gigapixel
 * buffer once already. The observer watches the *parent*, and the canvas is told what
 * size to be.
 *
 * **No animation frame touches React state.** The loop mutates the camera and uniforms
 * directly. The one piece of state that does change — which node is under the pointer —
 * is set from a pointer event, not from the loop.
 *
 * **Reduced motion gets a complete resting state**, not a frozen half-drawn one: the
 * scene renders once, fully, and the loop never starts.
 */

/** Design tokens, as floats. Kept in sync with globals.css by `field-map.test.ts`. */
const ICE = [0.894, 0.937, 0.953]
const DIM = [0.553, 0.639, 0.675]
const SIGNAL = [0.769, 0.337, 0.431]

const POINT_VERTEX = `
  attribute vec3 position;
  attribute float aSize;
  attribute float aState;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScale;
  varying float vState;
  varying float vDepth;
  void main() {
    vState = aState;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale * (32.0 / max(vDepth, 2.0));
  }
`

const POINT_FRAGMENT = `
  precision highp float;
  varying float vState;
  varying float vDepth;
  uniform vec3 uIce;
  uniform vec3 uDim;
  uniform vec3 uSignal;
  void main() {
    vec2 offset = gl_PointCoord - 0.5;
    float d = length(offset);
    if (d > 0.5) discard;
    float disc = smoothstep(0.5, 0.34, d);
    // Depth is declared by luminance, exactly as it is everywhere else here: a thing
    // is nearer because it is brighter, never because it has a shadow.
    float fade = clamp(1.0 - (vDepth - 6.0) / 64.0, 0.22, 1.0);
    vec3 color = uDim;
    if (vState > 1.5) color = uSignal;
    else if (vState > 0.5) color = uIce;
    gl_FragColor = vec4(color, disc * fade);
  }
`

const LINE_VERTEX = `
  attribute vec3 position;
  attribute float aState;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying float vState;
  varying float vDepth;
  void main() {
    vState = aState;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const LINE_FRAGMENT = `
  precision highp float;
  varying float vState;
  varying float vDepth;
  uniform vec3 uIce;
  uniform vec3 uDim;
  void main() {
    float fade = clamp(1.0 - (vDepth - 6.0) / 64.0, 0.10, 1.0);
    vec3 color = mix(uDim, uIce, vState);
    gl_FragColor = vec4(color, fade * (0.18 + vState * 0.45));
  }
`

export function FieldMap({
  graph,
  mastered,
}: {
  graph: MapGraph
  /** Lesson ids the reader has mastered. Lit nodes are earned, never decorative. */
  mastered: string[]
}) {
  const router = useRouter()
  const holder = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState<MapNode | null>(null)

  // Read by the render loop and the pointer handler without re-running the effect.
  const pointer = useRef({ x: 0, y: 0 })
  const screen = useRef<{ node: MapNode; x: number; y: number }[]>([])
  const hoveredRef = useRef<MapNode | null>(null)

  useEffect(() => {
    const host = holder.current
    const surface = canvas.current
    if (!host || !surface) return

    const earned = new Set(mastered)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new Renderer({
      canvas: surface,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // Additive-free, depth-test-free: these are luminous points on a dark ground and
    // sorting them would cost more than it buys.
    gl.disable(gl.DEPTH_TEST)

    const camera = new Camera(gl, { fov: 42, near: 0.1, far: 400 })
    const scene = new Transform()

    const nodes = graph.nodes
    const index = new Map(nodes.map((node, i) => [node.id, i]))

    const positions = new Float32Array(nodes.length * 3)
    const sizes = new Float32Array(nodes.length)
    const states = new Float32Array(nodes.length)

    nodes.forEach((node, i) => {
      positions[i * 3] = node.x
      positions[i * 3 + 1] = node.y
      positions[i * 3 + 2] = node.z
      sizes[i] = node.kind === 'module' ? 19 : 9
      states[i] = node.kind === 'module' ? 1 : earned.has(node.id) ? 1 : 0
    })

    const points = new Mesh(gl, {
      mode: gl.POINTS,
      geometry: new Geometry(gl, {
        position: { size: 3, data: positions },
        aSize: { size: 1, data: sizes },
        aState: { size: 1, data: states },
      }),
      program: new Program(gl, {
        vertex: POINT_VERTEX,
        fragment: POINT_FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: {
          uIce: { value: ICE },
          uDim: { value: DIM },
          uSignal: { value: SIGNAL },
          uScale: { value: 1 },
        },
      }),
    })
    points.setParent(scene)

    // Edges. A `requires` edge is brighter than a `contains` edge because the
    // prerequisite is the real relationship; containment is just where a lesson filed.
    const usable = graph.edges.filter(
      (edge) => index.has(edge.from) && index.has(edge.to)
    )
    const linePositions = new Float32Array(usable.length * 6)
    const lineStates = new Float32Array(usable.length * 2)
    usable.forEach((edge, i) => {
      const a = nodes[index.get(edge.from)!]!
      const b = nodes[index.get(edge.to)!]!
      linePositions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6)
      const lit = edge.kind === 'requires' ? 1 : 0
      lineStates[i * 2] = lit
      lineStates[i * 2 + 1] = lit
    })

    const lines = new Mesh(gl, {
      mode: gl.LINES,
      geometry: new Geometry(gl, {
        position: { size: 3, data: linePositions },
        aState: { size: 1, data: lineStates },
      }),
      program: new Program(gl, {
        vertex: LINE_VERTEX,
        fragment: LINE_FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: { uIce: { value: ICE }, uDim: { value: DIM } },
      }),
    })
    lines.setParent(scene)

    // Sized from the *parent*, never from the canvas. Measuring the canvas to set the
    // canvas is the feedback loop that produced a three-gigapixel buffer.
    let width = 0
    let height = 0
    const resize = () => {
      const box = host.getBoundingClientRect()
      width = Math.max(1, Math.round(box.width))
      height = Math.max(1, Math.round(box.height))
      renderer.setSize(width, height)
      camera.perspective({ aspect: width / height })
      points.program.uniforms['uScale']!.value = Math.min(2, Math.max(0.6, width / 900))
    }
    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()

    const onPointerMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()
      pointer.current = {
        x: ((event.clientX - box.left) / box.width) * 2 - 1,
        y: -(((event.clientY - box.top) / box.height) * 2 - 1),
      }

      // Picking is a nearest-neighbour search over 61 projected points, which is
      // cheaper than a raycast and exact enough for discs this size.
      const px = event.clientX - box.left
      const py = event.clientY - box.top
      let best: MapNode | null = null
      let bestDistance = 28
      for (const entry of screen.current) {
        const distance = Math.hypot(entry.x - px, entry.y - py)
        if (distance < bestDistance) {
          bestDistance = distance
          best = entry.node
        }
      }
      if (best !== hoveredRef.current) {
        hoveredRef.current = best
        setHovered(best)
      }
      surface.style.cursor = best ? 'pointer' : ''
    }

    const onClick = () => {
      const node = hoveredRef.current
      if (node) router.push(node.url)
    }

    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('click', onClick)

    let raf = 0
    let start = 0

    const project = () => {
      const m = camera.projectionViewMatrix as unknown as number[]
      const out: { node: MapNode; x: number; y: number }[] = []
      for (const node of nodes) {
        const w = m[3]! * node.x + m[7]! * node.y + m[11]! * node.z + m[15]!
        if (w <= 0) continue
        const cx = m[0]! * node.x + m[4]! * node.y + m[8]! * node.z + m[12]!
        const cy = m[1]! * node.x + m[5]! * node.y + m[9]! * node.z + m[13]!
        out.push({
          node,
          x: (cx / w * 0.5 + 0.5) * width,
          y: (0.5 - (cy / w) * 0.5) * height,
        })
      }
      screen.current = out
    }

    let driftX = 0
    let driftY = 0

    const draw = (time: number) => {
      if (!start) start = time
      const elapsed = (time - start) / 1000

      // Drift: continuous and slow, never idle and never fast. Damped parallax on top,
      // at design.md's stated 0.045 follow.
      driftX += (pointer.current.x * 2.6 - driftX) * 0.045
      driftY += (pointer.current.y * 1.8 - driftY) * 0.045

      const orbit = elapsed * 0.045
      camera.position.set(
        Math.sin(orbit) * 3.2 + driftX,
        Math.cos(orbit * 0.7) * 1.6 + driftY,
        16
      )
      camera.lookAt([0, 0, -13])

      renderer.render({ scene, camera })
      project()
      raf = requestAnimationFrame(draw)
    }

    if (reduced) {
      // A complete, legible resting state — the same scene, simply not moving.
      camera.position.set(0, 0, 11)
      camera.lookAt([0, 0, -13])
      renderer.render({ scene, camera })
      project()
    } else {
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('click', onClick)
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
  }, [graph, mastered, router])

  return (
    <div ref={holder} className="relative h-[62vh] min-h-[24rem] w-full">
      {/* Decorative by definition: everything it draws is in the list below as text. */}
      <canvas ref={canvas} aria-hidden="true" className="block h-full w-full" />

      {hovered && (
        <p className="pointer-events-none absolute bottom-3 left-3 max-w-[80%] font-mono text-[0.72rem] text-ice">
          <span className="text-ice-dim">
            {String(hovered.moduleNumber).padStart(2, '0')} ·{' '}
            {hovered.kind === 'module' ? 'module' : 'lesson'}{' '}
          </span>
          {hovered.label}
        </p>
      )}
    </div>
  )
}
