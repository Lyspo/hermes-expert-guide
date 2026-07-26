import { ancestorsOf, type CurriculumGraph } from '@/lib/graph'

/**
 * The lesson masthead, computed rather than drawn.
 *
 * `research/design/06-direction-calibration.md` records the direction and the verdict on
 * its first build: the lit curriculum field "still looks extremely basic / not designed",
 * and the diagnosis was that it had physics and no composition. It also records the
 * question that build did not answer — none of this had been tried next to two thousand
 * words of prose, and a lesson page is the real test.
 *
 * This is that test. It puts the same field at the top of a lesson, showing the one thing
 * a reader opening a lesson actually wants to know: what had to be understood before this
 * page, and how far back it goes.
 *
 * Three decisions make it viable there, and each is a constraint the map did not have.
 *
 * **It is computed here and emitted as SVG, not rendered by WebGL.** A reader's position
 * does not change while they read, so there is nothing to drive per frame. Precomputing
 * costs no JavaScript on a page whose first-party budget is nearly spent, survives with
 * no bundle at all, and is the same arithmetic either way.
 *
 * **The lighting is the map's lighting, exactly.** Same direction, same lambert, same
 * specular exponent, same distance falloff, same three materials. Sharing a look between
 * two surfaces is what makes them one system rather than two treatments, and that
 * coherence is a large part of what "composed" means.
 *
 * **The composition is the point, not the shading.** A shaded sphere is a material. What
 * this adds on top is a receding depth graticule carrying real numbers, drop lines anchoring
 * ticks, and type set *into* the field at depth — the five things `06` named as missing.
 *
 * Pure and DOM-free, so it is testable and runs identically during the static export.
 */

/** Matches `field-renderer.ts`. Every value here is shared on purpose. */
const LIGHT: Vec3 = normalise([-0.35, 0.55, 0.76])
const SPECULAR_EXPONENT = 28
const AMBIENT = 0.38
const DIFFUSE = 0.72

const ICE: Vec3 = [0.894, 0.937, 0.953]
const ICE_DIM: Vec3 = [0.553, 0.639, 0.675]
const ICE_FAINT: Vec3 = [0.29, 0.361, 0.396]

/** How far one step of prerequisite depth pushes a lesson back, in world units. */
const DEPTH_SCALE = 1.5

export type Vec3 = [number, number, number]

export interface PlannedNode {
  /** Screen position inside the viewBox. */
  x: number
  y: number
  /** Screen radius, already divided by distance. */
  r: number
  /** The lit surface colour, as `#rrggbb`. */
  fill: string
  /** Opacity from distance falloff and material. */
  opacity: number
  /** Where the light lands, for the analytic sphere highlight. */
  highlight: { x: number; y: number; r: number; fill: string }
  role: 'focus' | 'chain' | 'context'
  depth: number
  /**
   * Where this node's drop line meets the ground rule for its own depth.
   *
   * Only the focus and its chain carry one. Without it the spheres float over the
   * graticule with nothing tying them to it, and the two systems read as two unrelated
   * drawings sharing a box rather than as objects standing in a space. Fifty-one drop
   * lines would be a thicket; nine are an anchor.
   */
  groundY: number | null
  /** Painter's-algorithm key: larger is nearer. */
  sort: number
}

export interface PlannedEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
  onChain: boolean
  /** Path length, so a stroke can draw itself over a distance-proportional time. */
  length: number
  /**
   * Reveal order, shallowest prerequisite first.
   *
   * The chain should arrive *at* this lesson rather than spraying outward from it, so
   * the drawing starts where the reader's knowledge starts.
   */
  order: number
}

export interface PlannedTick {
  /** Left end of the ground rule for this depth plane. May sit outside the frame. */
  x: number
  /** Right end. The two converge as the plane recedes. */
  x2: number
  y: number
  label: string
  /**
   * Where the number goes, already clamped into the frame.
   *
   * The near planes run off the left edge by design, and a depth number drawn out
   * there is a number nobody reads. Clamped here rather than in the component so the
   * geometry stays in one place and a test can assert it.
   */
  labelX: number
  labelAnchor: 'start' | 'end'
  /** True for the depth the focused lesson sits at. */
  current: boolean
}

export interface FieldPlan {
  width: number
  height: number
  nodes: PlannedNode[]
  edges: PlannedEdge[]
  ticks: PlannedTick[]
  /** How many lessons sit behind this one, transitively. */
  ancestorCount: number
  /** Prerequisite depth of the focused lesson. */
  depth: number
  maxDepth: number
  /** The focused node, pulled out so the drawing can bracket it as the subject. */
  focus: PlannedNode | null
}

function normalise(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / length, v[1] / length, v[2] / length]
}

function hex(colour: Vec3): string {
  const channel = (value: number) =>
    Math.round(Math.min(1, Math.max(0, value)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(colour[0])}${channel(colour[1])}${channel(colour[2])}`
}

/**
 * The map's fragment shader, evaluated once per sphere instead of once per pixel.
 *
 * At the centre of a sphere facing the camera the normal is (0,0,1), so the body colour
 * is the ambient-plus-lambert term against that normal. The specular lobe is not folded
 * in here: it is a small bright disc offset along the light direction, which is where it
 * physically falls, and it is drawn as a second circle rather than faked with a gradient
 * over the whole node. That keeps every bright pixel attributable to the light.
 */
function shade(base: Vec3): { body: Vec3; highlight: Vec3 } {
  const lambert = Math.max(LIGHT[2], 0)
  const body: Vec3 = [
    base[0] * (AMBIENT + DIFFUSE * lambert),
    base[1] * (AMBIENT + DIFFUSE * lambert),
    base[2] * (AMBIENT + DIFFUSE * lambert),
  ]

  // The highlight sits where the reflection vector points back at the viewer, so its
  // strength follows the same pow(...) the shader uses.
  const spec = Math.pow(Math.max(LIGHT[2], 0), SPECULAR_EXPONENT / 8) * 0.65
  const highlight: Vec3 = [
    Math.min(1, body[0] + spec),
    Math.min(1, body[1] + spec),
    Math.min(1, body[2] + spec),
  ]
  return { body, highlight }
}

/** Perspective divide against a camera on +Z looking down -Z, with a lifted eye. */
function project(
  point: Vec3,
  eye: Vec3,
  focalLength: number,
  width: number,
  height: number,
): { x: number; y: number; distance: number } {
  const dx = point[0] - eye[0]
  const dy = point[1] - eye[1]
  const dz = point[2] - eye[2]

  // Distance along the view axis. Clamped so a node level with the eye cannot divide
  // by zero and fling itself across the viewBox.
  const distance = Math.max(-dz, 0.35)
  const scale = focalLength / distance

  return {
    x: width / 2 + dx * scale,
    y: height / 2 - dy * scale,
    distance,
  }
}

/**
 * Plan the masthead for one lesson.
 *
 * The camera looks along the prerequisite axis rather than across the field, because the
 * question this answers is "how far back does this go" and depth is the answer. The
 * focused lesson sits nearest and to the right; everything it depends on recedes to the
 * left and away.
 */
export function planLessonField(
  graph: CurriculumGraph,
  focusIndex: number,
  width = 1200,
  height = 420,
): FieldPlan {
  const focus = graph.nodes[focusIndex]
  if (!focus) {
    return {
      width,
      height,
      nodes: [],
      edges: [],
      ticks: [],
      ancestorCount: 0,
      depth: 0,
      maxDepth: graph.maxDepth,
      focus: null,
    }
  }

  const chain = ancestorsOf(graph, focusIndex)
  const focalLength = height * 1.55
  const eye: Vec3 = [0, 0.15, 2.5]

  /**
   * The whole curriculum as a corridor, receding by prerequisite depth.
   *
   * The first attempt drew only this lesson's own chain, laid flat across the band. It
   * was four dots in an empty rectangle — the same "physics, no composition" verdict
   * `06` gave the map, reproduced at a smaller size. Density is not decoration here:
   * a field needs enough in it to *be* a place, and the curriculum already has
   * fifty-one real things to put there.
   *
   * So depth becomes the view axis. Every lesson is drawn, at the depth its own
   * prerequisites put it, and perspective does the rest: the opening lessons sit near
   * and large, the eleventh-level material converges toward a vanishing point, and the
   * reader's own chain is the lit thread through it. That is Igloo's arrangement —
   * terrain with a constellation over it — built out of data that means something
   * rather than out of noise.
   */
  const zOf = (depth: number) => -1.15 - depth * DEPTH_SCALE * 0.92
  /** Where the ground plane sits, chosen so the nearest rule lands inside the band. */
  const GROUND = -1.0
  /** Half-width of the ground rules, matched to the node spread they carry. */
  const GROUND_HALF = 6.5

  /**
   * Spread, measured rather than guessed.
   *
   * `layout()` returns a compact cluster — x runs about ±0.39 and y about ±0.28, not
   * the unit range it looks like it should. Scaling by eye produced a 187×29 pixel
   * smudge in a 1200×420 box and forty-five of the fifty-one nodes at seven percent
   * opacity, which read as an empty band with a few dots in it.
   *
   * These factors are large enough that the nearest depth planes run off the frame.
   * That is the intent rather than an overflow: a field cropped by its frame reads as
   * continuing past it, where one that fits neatly inside reads as a diagram of a
   * field. The far planes converge on their own.
   */
  const SPREAD_X = 14
  const SPREAD_Y = 6

  const place = (index: number): Vec3 => {
    const node = graph.nodes[index]!
    return [node.x * SPREAD_X, node.y * SPREAD_Y, zOf(node.depth)]
  }

  const nodes: PlannedNode[] = []

  graph.nodes.forEach((node, index) => {
    const isFocus = index === focusIndex
    const onChain = chain.has(index)

    const world = place(index)
    const { x, y, distance } = project(world, eye, focalLength, width, height)

    // Cull only what cannot touch the frame. The near planes deliberately run wide, and
    // a node half in shot is part of the crop rather than a mistake — dropping it would
    // leave a suspiciously clean edge exactly where the field should look continuous.
    if (x < -140 || x > width + 140) return

    const base = isFocus ? ICE : onChain ? ICE_DIM : ICE_FAINT
    const { body, highlight } = shade(base)

    // Three materials, not three sizes — `06` asked for hierarchy beyond radius. Size
    // here is honest perspective: it is the same world radius divided by distance.
    // Capped, and the cap is the point. Perspective alone made a depth-0 context node
    // larger than the lesson the page is about, so the brightest thing and the biggest
    // thing were different objects and the eye went to the wrong one.
    const raw =
      (((isFocus ? 0.2 : onChain ? 0.15 : 0.105) + node.weight * 0.05) * focalLength) /
      distance
    const radius = isFocus ? raw : Math.min(raw, isFocus || onChain ? 26 : 17)
    // The floor matters more than the curve: a context node at the vanishing point still
    // has to be a mark on the page rather than a rumour of one.
    const fade = Math.max(0.34, Math.min(1, 1 - (distance - 2.6) / 22))
    const opacity = isFocus ? 1 : onChain ? fade * 0.95 : fade * 0.55

    nodes.push({
      x,
      y,
      r: radius,
      fill: hex(body),
      opacity,
      // Offset toward the light, at the radius a real specular lobe would occupy.
      highlight: {
        x: x + LIGHT[0] * radius * 0.42,
        y: y - LIGHT[1] * radius * 0.42,
        r: Math.max(0.6, radius * 0.3),
        fill: hex(highlight),
      },
      role: isFocus ? 'focus' : onChain ? 'chain' : 'context',
      depth: node.depth,
      groundY:
        isFocus || onChain
          ? project([world[0], GROUND, world[2]], eye, focalLength, width, height).y
          : null,
      sort: -distance,
    })
  })

  // Painter's algorithm: far first, so nearer solids occlude rather than interleave.
  nodes.sort((a, b) => a.sort - b.sort)

  const screenOf = new Map<number, { x: number; y: number; distance: number }>()
  graph.nodes.forEach((_, index) => {
    const world = place(index)
    screenOf.set(index, project(world, eye, focalLength, width, height))
  })

  const edges: PlannedEdge[] = []
  for (const [from, to] of graph.edges) {
    const onChain =
      (chain.has(from) || from === focusIndex) && (chain.has(to) || to === focusIndex)
    if (!onChain) continue

    const a = screenOf.get(from)!
    const b = screenOf.get(to)!
    if (a.x < -60 && b.x < -60) continue

    // Uniform opacity from the segment's mean distance, deliberately rather than a
    // gradient along the stroke. The falloff is the same distance term the nodes use, so
    // it is atmosphere rather than chrome — and one flat value per line keeps every
    // bright pixel traceable to the light rather than to a paint effect.
    const distance = (a.distance + b.distance) / 2
    const fade = Math.max(0.16, Math.min(0.62, 0.62 - (distance - 3.4) / 14))

    edges.push({
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      opacity: fade,
      onChain: true,
      length: Math.hypot(b.x - a.x, b.y - a.y),
      // Filled in below, once every edge on the chain is known.
      order: Math.min(graph.nodes[from]!.depth, graph.nodes[to]!.depth),
    })
  }

  // Rank the depths present so the stagger is one step per rank rather than one per
  // depth number — a chain that skips depths should not sit through empty beats.
  const ranks = [...new Set(edges.map((edge) => edge.order))].sort((a, b) => a - b)
  for (const edge of edges) edge.order = ranks.indexOf(edge.order)

  /**
   * The structural overlay: one ground rule per depth plane, receding.
   *
   * This is the second system `06` asked for — Igloo's constellation wireframe is drawn
   * *over* its terrain rather than being made of the terrain's own edges, and here the
   * prerequisite lines were previously doing double duty as both content and texture.
   * These rules are pure structure: they carry the depth axis and its numbers, and they
   * converge because the space is real.
   */
  const GUTTER = 26
  /** Minimum vertical clearance between two depth numbers, in viewBox units. */
  const LABEL_CLEARANCE = 16

  const planes = Array.from({ length: graph.maxDepth + 1 }, (_, depth) => {
    const z = zOf(depth)
    return {
      depth,
      left: project([-GROUND_HALF, GROUND, z], eye, focalLength, width, height),
      right: project([GROUND_HALF, GROUND, z], eye, focalLength, width, height),
    }
  })

  /**
   * Which planes get a number.
   *
   * Every plane is drawn — converging rules are the texture. Only the numbers are
   * thinned, because past about the fourth plane the spacing collapses to a few pixels
   * and eleven digits overprint into a grey smudge.
   *
   * Two passes rather than one running check, and the reason is a bug this had: a
   * single pass that also force-labelled the focused depth would place that number
   * hard against whichever neighbour had already claimed the space. The focus claims
   * its slot first; everything else fills in around it.
   */
  const chosen: number[] = []
  const focusPlane = planes[focus.depth]
  if (focusPlane) chosen.push(focusPlane.left.y)

  for (const plane of planes) {
    if (plane.depth === focus.depth) continue
    if (chosen.every((y) => Math.abs(y - plane.left.y) > LABEL_CLEARANCE)) {
      chosen.push(plane.left.y)
    }
  }

  const labelled = new Set(chosen)

  const ticks: PlannedTick[] = planes.map((plane) => ({
    x: plane.left.x,
    x2: plane.right.x,
    y: plane.left.y,
    label: labelled.has(plane.left.y) ? String(plane.depth) : '',
    labelX: Math.min(width - GUTTER, Math.max(GUTTER, plane.left.x - 12)),
    labelAnchor: plane.left.x - 12 < GUTTER ? ('start' as const) : ('end' as const),
    current: plane.depth === focus.depth,
  }))

  return {
    width,
    height,
    nodes,
    edges,
    ticks,
    ancestorCount: chain.size,
    depth: focus.depth,
    maxDepth: graph.maxDepth,
    focus: nodes.find((node) => node.role === 'focus') ?? null,
  }
}
