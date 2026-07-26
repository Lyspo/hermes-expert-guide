/**
 * The curriculum's shape, computed rather than art-directed.
 *
 * `design.md` says sequence is spatial and that descending goes *into* the structure
 * rather than down a list. So the modules are laid out on a descending helix: each one
 * sits further from the viewer than the last, and its lessons orbit it. Depth is
 * literally progress through the curriculum, which makes the field a view of the
 * structure instead of a picture of one.
 *
 * Deterministic and pure, for two reasons that matter more than they sound. A
 * force-directed layout settles somewhere different on every load, so nothing about it
 * can be tested and a reader never builds a memory of where things are. And a layout
 * with no DOM and no randomness can be asserted against — that two nodes never occupy
 * the same point, that every edge joins nodes that exist — which is the only way to
 * know a graph of sixty-one nodes is right without squinting at it.
 */

export interface MapNode {
  id: string
  kind: 'module' | 'lesson'
  label: string
  url: string
  /** 1-based module number; lessons carry their parent's. */
  moduleNumber: number
  x: number
  y: number
  /** Negative goes away from the viewer. */
  z: number
}

export interface MapEdge {
  from: string
  to: string
  /** `contains` is a module to its lesson; `requires` is a real prerequisite. */
  kind: 'contains' | 'requires'
}

export interface MapGraph {
  nodes: MapNode[]
  edges: MapEdge[]
}

/** The minimum a caller must supply. Keeps this module free of content-collections. */
export interface LessonInput {
  id: string
  title: string
  url: string
  moduleNumber: number
  moduleSlug: string
  order: number
  prerequisites: string[]
}

export interface ModuleInput {
  slug: string
  title: string
  url: string
  number: number
}

/** Radius of the module helix, in world units. */
const HELIX_RADIUS = 5.5
/** How far each module sits behind the previous one. */
const DEPTH_STEP = 3.4
/** How far a lesson orbits its module. */
const ORBIT_RADIUS = 2

/**
 * The golden angle, so consecutive modules never line up behind one another however
 * many there turn out to be. A fixed fraction of a turn collides the moment the module
 * count divides into it.
 */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

export function buildMap(modules: ModuleInput[], lessons: LessonInput[]): MapGraph {
  const nodes: MapNode[] = []
  const edges: MapEdge[] = []

  const ordered = [...modules].sort((a, b) => a.number - b.number)
  const centres = new Map<string, { x: number; y: number; z: number }>()

  ordered.forEach((entry, index) => {
    const angle = index * GOLDEN_ANGLE
    const centre = {
      x: Math.cos(angle) * HELIX_RADIUS,
      y: Math.sin(angle) * HELIX_RADIUS * 0.6,
      z: -index * DEPTH_STEP,
    }
    centres.set(entry.slug, centre)
    nodes.push({
      id: `module:${entry.slug}`,
      kind: 'module',
      label: entry.title,
      url: entry.url,
      moduleNumber: entry.number,
      ...centre,
    })
  })

  const byModule = new Map<string, LessonInput[]>()
  for (const lesson of lessons) {
    const bucket = byModule.get(lesson.moduleSlug)
    if (bucket) bucket.push(lesson)
    else byModule.set(lesson.moduleSlug, [lesson])
  }

  for (const [slug, group] of byModule) {
    const centre = centres.get(slug)
    // A lesson whose module was not supplied is skipped rather than dropped at the
    // origin, where it would render as a node sitting inside the camera.
    if (!centre) continue

    const sorted = [...group].sort((a, b) => a.order - b.order)
    sorted.forEach((lesson, index) => {
      const angle = (index / sorted.length) * Math.PI * 2
      nodes.push({
        id: lesson.id,
        kind: 'lesson',
        label: lesson.title,
        url: lesson.url,
        moduleNumber: lesson.moduleNumber,
        x: centre.x + Math.cos(angle) * ORBIT_RADIUS,
        y: centre.y + Math.sin(angle) * ORBIT_RADIUS,
        // Fanned slightly in depth so a ring never renders as a flat disc edge-on.
        z: centre.z + Math.sin(angle * 2) * 0.8,
      })
      edges.push({ from: `module:${slug}`, to: lesson.id, kind: 'contains' })
    })
  }

  // Prerequisites are the graph's real content: they are why the curriculum has an
  // order at all, and they cross modules, which is what makes this a graph rather
  // than a tree.
  const ids = new Set(nodes.map((node) => node.id))
  for (const lesson of lessons) {
    for (const prerequisite of lesson.prerequisites) {
      if (!ids.has(prerequisite) || !ids.has(lesson.id)) continue
      edges.push({ from: prerequisite, to: lesson.id, kind: 'requires' })
    }
  }

  return { nodes, edges }
}

/** The graph's extent, for framing a camera without measuring the DOM. */
export function bounds(graph: MapGraph) {
  if (graph.nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 }
  }
  const xs = graph.nodes.map((node) => node.x)
  const ys = graph.nodes.map((node) => node.y)
  const zs = graph.nodes.map((node) => node.z)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  }
}
