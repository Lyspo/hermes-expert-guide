import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl'
import type { CurriculumGraph, Readiness } from '@/lib/graph'

/**
 * The curriculum drawn as a lit field rather than a flat diagram.
 *
 * This replaces the 2D painting, and the reason is recorded in
 * `research/design/06-direction-calibration.md`: shown ten real sites, the author's two
 * favourites were igloo.inc and activetheory.net, both of which build their surface out
 * of **real geometry and real light** rather than effects painted onto a dark ground.
 * The same file corrects a mistake worth not repeating — the ruleset never banned that
 * look. It bans `box-shadow` glow and gradient chrome, which are the shortcut to it.
 *
 * So: nothing here is a glow. Every bright pixel is a lambert-plus-specular term
 * evaluated against a real surface normal, and every dim one is distance. The nodes are
 * point sprites shaded as spheres — the normal is reconstructed from `gl_PointCoord`, so
 * sixty-one lit solids cost one draw call and no geometry at all.
 *
 * The component keeps everything else. Hit-testing, the prerequisite-chain reveal, the
 * keyboard parity through the index links and the `aria-hidden` canvas are unchanged;
 * `draw` returns projected screen positions exactly as the 2D version did, because
 * `e2e/curriculum-map.spec.ts` drives a real mouse across this canvas and that contract
 * is what it tests.
 */

const ICE: [number, number, number] = [0.894, 0.937, 0.953]
const ICE_DIM: [number, number, number] = [0.553, 0.639, 0.675]
const ICE_FAINT: [number, number, number] = [0.29, 0.361, 0.396]

/** How far prerequisite depth pushes a lesson away from the reader, in world units. */
const DEPTH_SCALE = 1.5
/** Half-extent of the field on the widest axis. */
const SPREAD = 6.2

const NODE_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute float aWeight;
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
    gl_PointSize = aWeight * uScale / max(vDepth, 1.5);
  }
`

/**
 * A shaded sphere per point.
 *
 * `gl_PointCoord` gives a unit square; treating it as the projection of a sphere lets
 * the normal be reconstructed exactly — `z = sqrt(1 - x² - y²)` — which is why these
 * read as solids lit from one direction rather than as discs with a gradient on them.
 * That distinction is the whole difference between the sanctioned look and the banned
 * one.
 */
const NODE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying float vState;
  varying float vDepth;
  uniform vec3 uIce;
  uniform vec3 uDim;
  uniform vec3 uFaint;
  uniform float uMuted;

  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(p, p);
    if (r2 > 1.0) discard;

    vec3 normal = vec3(p.x, -p.y, sqrt(max(0.0, 1.0 - r2)));
    vec3 light = normalize(vec3(-0.35, 0.55, 0.76));
    float lambert = max(dot(normal, light), 0.0);
    float spec = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);

    // Readiness picks the material, not a filter over one material.
    vec3 base = mix(uFaint, uDim, 0.55);
    if (vState > 2.5) base = uIce;
    else if (vState > 1.5) base = uDim;

    // Ambient is deliberately low. A field lit almost entirely by one source is what
    // makes depth legible without a single shadow being drawn.
    vec3 colour = base * (0.38 + 0.72 * lambert) + vec3(spec * 0.65 * lambert);

    float fade = clamp(1.0 - (vDepth - 6.0) / 34.0, 0.34, 1.0);
    float edge = smoothstep(1.0, 0.72, r2);
    float dim = vState > 2.5 ? 1.0 : uMuted;

    gl_FragColor = vec4(colour, edge * fade * dim);
  }
`

const EDGE_VERTEX = /* glsl */ `
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

const EDGE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying float vState;
  varying float vDepth;
  uniform vec3 uIce;
  uniform vec3 uDim;
  uniform vec3 uFaint;
  uniform float uMuted;
  void main() {
    vec3 colour = mix(uFaint, uDim, 0.5);
    float weight = 0.55;
    if (vState > 2.5) { colour = uIce; weight = 0.85; }
    else if (vState > 1.5) { colour = uDim; weight = 0.42; }
    float fade = clamp(1.0 - (vDepth - 6.0) / 34.0, 0.20, 1.0);
    float dim = vState > 2.5 ? 1.0 : uMuted;
    gl_FragColor = vec4(colour, fade * weight * dim);
  }
`

export interface FieldFrame {
  time: number
  hovered: number | null
  chain: Set<number> | null
  readiness: readonly Readiness[]
}

export interface Projected {
  x: number
  y: number
}

export interface Field {
  resize(width: number, height: number): void
  draw(frame: FieldFrame): Projected[]
  dispose(): void
}

/** State codes shared by both shaders: 1 far, 2 known-or-ready, 3 on the chain. */
function stateOf(
  index: number,
  frame: FieldFrame,
  fallback: Readiness | undefined
): number {
  if (frame.chain !== null && (index === frame.hovered || frame.chain.has(index))) return 3
  if (fallback === 'known') return 2.6
  if (fallback === 'ready') return 2
  return 1
}

export function createField(
  canvas: HTMLCanvasElement,
  graph: CurriculumGraph,
  extent: { x: number; y: number }
): Field | null {
  let renderer: Renderer
  try {
    renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
  } catch {
    // No WebGL. The caller falls back rather than rendering nothing.
    return null
  }

  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  // Depth testing off: these are transparent sprites, and sorting sixty-one of them
  // every frame would cost more than the artefact it removes on a field this sparse.
  gl.disable(gl.DEPTH_TEST)

  const camera = new Camera(gl, { fov: 40, near: 0.1, far: 200 })
  const scene = new Transform()

  const count = graph.nodes.length
  const positions = new Float32Array(count * 3)
  const weights = new Float32Array(count)
  const nodeState = new Float32Array(count)

  graph.nodes.forEach((node, i) => {
    positions[i * 3] = (node.x / extent.x) * SPREAD
    positions[i * 3 + 1] = (node.y / extent.y) * SPREAD * 0.62
    // Prerequisite depth *is* the third axis. A lesson eleven deep sits eleven steps
    // further from the reader, so "what do I need before this" is a distance.
    positions[i * 3 + 2] = -node.z * DEPTH_SCALE
    weights[i] = 24 + node.weight * 30
    nodeState[i] = 1
  })

  const nodeGeometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    aWeight: { size: 1, data: weights },
    aState: { size: 1, data: nodeState },
  })

  const nodes = new Mesh(gl, {
    mode: gl.POINTS,
    geometry: nodeGeometry,
    program: new Program(gl, {
      vertex: NODE_VERTEX,
      fragment: NODE_FRAGMENT,
      transparent: true,
      depthTest: false,
      uniforms: {
        uIce: { value: ICE },
        uDim: { value: ICE_DIM },
        uFaint: { value: ICE_FAINT },
        uScale: { value: 4.6 },
        uMuted: { value: 1 },
      },
    }),
  })
  nodes.setParent(scene)

  const edgePositions = new Float32Array(graph.edges.length * 6)
  const edgeState = new Float32Array(graph.edges.length * 2)
  graph.edges.forEach(([from, to], i) => {
    edgePositions.set(
      [
        positions[from * 3]!, positions[from * 3 + 1]!, positions[from * 3 + 2]!,
        positions[to * 3]!, positions[to * 3 + 1]!, positions[to * 3 + 2]!,
      ],
      i * 6
    )
  })

  const edgeGeometry = new Geometry(gl, {
    position: { size: 3, data: edgePositions },
    aState: { size: 1, data: edgeState },
  })

  const edges = new Mesh(gl, {
    mode: gl.LINES,
    geometry: edgeGeometry,
    program: new Program(gl, {
      vertex: EDGE_VERTEX,
      fragment: EDGE_FRAGMENT,
      transparent: true,
      depthTest: false,
      uniforms: {
        uIce: { value: ICE },
        uDim: { value: ICE_DIM },
        uFaint: { value: ICE_FAINT },
        uMuted: { value: 1 },
      },
    }),
  })
  edges.setParent(scene)

  let width = 1
  let height = 1

  return {
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth)
      height = Math.max(1, nextHeight)
      renderer.setSize(width, height)
      camera.perspective({ aspect: width / height })
      // Point size is in device pixels, so it must track the surface rather than the
      // CSS box or the field thins out on a retina screen.
      nodes.program.uniforms['uScale']!.value = 4.6 * Math.min(window.devicePixelRatio || 1, 2)
    },

    draw(frame) {
      for (let i = 0; i < count; i++) nodeState[i] = stateOf(i, frame, frame.readiness[i])
      graph.edges.forEach(([from, to], i) => {
        const onChain = nodeState[from]! > 2.5 && nodeState[to]! > 2.5
        const walked = frame.readiness[from] === 'known' && frame.readiness[to] === 'known'
        const value = onChain ? 3 : walked ? 2 : 1
        edgeState[i * 2] = value
        edgeState[i * 2 + 1] = value
      })
      nodeGeometry.attributes['aState']!.needsUpdate = true
      edgeGeometry.attributes['aState']!.needsUpdate = true

      // Outside a chain the rest of the curriculum is pushed down rather than hidden —
      // it stays visible as the structure the chain is embedded in, which is the entire
      // reason to show all fifty-one in one frame.
      const muted = frame.chain === null ? 1 : 0.62
      nodes.program.uniforms['uMuted']!.value = muted
      edges.program.uniforms['uMuted']!.value = muted

      // A slow orbit, so the field reads as a solid arrangement in space rather than a
      // picture of one. Never fast enough to be motion a reader has to wait out.
      const orbit = frame.time * 0.08
      camera.position.set(Math.sin(orbit) * 2.2, Math.cos(orbit * 0.8) * 1.2 + 0.5, 12)
      camera.lookAt([0, 0, -graph.maxDepth * DEPTH_SCALE * 0.42])

      renderer.render({ scene, camera })

      const m = camera.projectionViewMatrix as unknown as number[]
      const projected: Projected[] = []
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3]!
        const y = positions[i * 3 + 1]!
        const z = positions[i * 3 + 2]!
        const w = m[3]! * x + m[7]! * y + m[11]! * z + m[15]!
        const cx = m[0]! * x + m[4]! * y + m[8]! * z + m[12]!
        const cy = m[1]! * x + m[5]! * y + m[9]! * z + m[13]!
        // Behind the camera has no screen position; parking it far outside the box
        // keeps the array index-aligned with the node list, which every caller assumes.
        if (w <= 0) {
          projected.push({ x: -1e6, y: -1e6 })
          continue
        }
        projected.push({
          x: ((cx / w) * 0.5 + 0.5) * width,
          y: (0.5 - (cy / w) * 0.5) * height,
        })
      }
      return projected
    },

    /**
     * Frees the programs and buffers, and deliberately does **not** call
     * `WEBGL_lose_context.loseContext()`.
     *
     * It used to. Forcing the context lost kills the canvas permanently, and React
     * hands back the same `<canvas>` element on the next mount — so the following
     * `createField` linked its programs against a dead context, every link failed, and
     * `Program.use` threw on a `uniformLocations` that was never assigned. The visible
     * symptom was a map that rendered once and then died the instant the pointer
     * touched it, which is a much stranger bug than its cause.
     */
    dispose() {
      nodes.program.remove()
      edges.program.remove()
      nodeGeometry.remove()
      edgeGeometry.remove()
    },
  }
}
