/**
 * The curriculum as a graph with real coordinates.
 *
 * design.md commits to "sequence is spatial": module and lesson order map to depth
 * and position in the field, so the field is a view of the structure rather than a
 * decorative cloud behind one. That promise was not kept — the field drew points at
 * random positions clustered by `index % 5`, which is a picture of a graph rather
 * than a graph. This module is the structure it should have been drawing.
 *
 * Three properties make it honest:
 *
 *   - A node is a lesson. The planned curriculum, not a count chosen to look good.
 *   - An edge is a prerequisite. Every line is a claim that one lesson depends on
 *     another, and the claims come from the lessons' own frontmatter.
 *   - Depth is prerequisite depth. How far back a node sits is how many lessons
 *     you must understand before it, computed from the graph rather than assigned.
 *
 * Pure and layout-only: no DOM, no canvas, no React, and deliberately no import of
 * the content collection. It takes the shape it needs as a plain structural type,
 * which keeps it unit-testable against fixtures and — the load-bearing part — keeps
 * it importable from a client component without dragging 51 compiled MDX bodies
 * into the browser bundle. The computed instance lives in `curriculum-graph.ts`.
 */

/** The minimum a lesson must expose to be laid out. */
export interface LessonInput {
  id: string
  moduleNumber: number
  order: number
  duration: number
  draft?: boolean | undefined
  prerequisites: readonly string[]
}

export interface GraphNode {
  id: string
  /** Normalised field coordinates, roughly [-1, 1]. */
  x: number
  y: number
  /** Depth. Lower is nearer the reader; derived from prerequisite depth. */
  z: number
  /** Prerequisite depth in the DAG: how many lessons deep this one sits. */
  depth: number
  moduleNumber: number
  /** Drawn weight. Longer lessons are bigger, because they are more of the course. */
  weight: number
  written: boolean
  /** Carried so readiness can be resolved in the browser without the collection. */
  prerequisites: string[]
}

/** A prerequisite, as indices into the node array. */
export type GraphEdge = [from: number, to: number]

export interface CurriculumGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  maxDepth: number
}

/**
 * Deterministic per-id jitter in [0, 1).
 *
 * Not `Math.random`: this runs during a static export and again in the browser, and
 * a layout that differs between the two is a hydration mismatch dressed up as a
 * design choice. FNV-1a, because it is four lines and the distribution only has to
 * be good enough to break up a lattice.
 */
export function jitter(id: string, salt = ''): number {
  let hash = 0x811c9dc5
  const input = `${id}#${salt}`
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return ((hash >>> 0) % 100000) / 100000
}

/**
 * Longest prerequisite chain ending at each lesson.
 *
 * Longest rather than shortest: a lesson is as deep as the most demanding thing it
 * asks you to already know. Memoised, with an in-progress marker so a cycle in the
 * frontmatter degrades to depth 0 instead of blowing the stack. The build already
 * rejects dangling prerequisites, but it does not reject a cycle, and this runs
 * during that same build.
 */
export function prerequisiteDepths(lessons: readonly LessonInput[]): Map<string, number> {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]))
  const depths = new Map<string, number>()
  const visiting = new Set<string>()

  const depthOf = (id: string): number => {
    const cached = depths.get(id)
    if (cached !== undefined) return cached
    if (visiting.has(id)) return 0

    const lesson = byId.get(id)
    if (!lesson) return 0

    visiting.add(id)
    let deepest = 0
    for (const prerequisite of lesson.prerequisites) {
      if (!byId.has(prerequisite)) continue
      deepest = Math.max(deepest, depthOf(prerequisite) + 1)
    }
    visiting.delete(id)

    depths.set(id, deepest)
    return deepest
  }

  for (const lesson of lessons) depthOf(lesson.id)
  return depths
}

/**
 * Lay the curriculum out as a helix descending into the field.
 *
 * Modules take angular sectors, so a module reads as a coherent region rather than
 * a scatter; lessons fan outward along their module's arc in reading order; and
 * depth comes from the prerequisite graph, so the first lessons sit nearest and the
 * material that depends on everything sits furthest back. Descending really is
 * going further in.
 *
 * `y` is squashed against `x` because the field fills a wide viewport, and a circle
 * in a 16:9 box reads as an ellipse anyway — better to intend it than to discover it.
 */
export function layout(lessons: readonly LessonInput[]): CurriculumGraph {
  const depths = prerequisiteDepths(lessons)
  const maxDepth = Math.max(1, ...depths.values())

  const modules = [...new Set(lessons.map((lesson) => lesson.moduleNumber))].sort(
    (a, b) => a - b,
  )
  const sizes = new Map<number, number>()
  for (const lesson of lessons) {
    sizes.set(lesson.moduleNumber, (sizes.get(lesson.moduleNumber) ?? 0) + 1)
  }

  const index = new Map(lessons.map((lesson, at) => [lesson.id, at]))

  const nodes: GraphNode[] = lessons.map((lesson) => {
    const sector = modules.indexOf(lesson.moduleNumber) / modules.length
    const span = Math.max(1, (sizes.get(lesson.moduleNumber) ?? 1) - 1)
    const withinModule = Math.min(1, (lesson.order - 1) / span)

    // A sector per module, plus a sixth of a sector of travel across the module's
    // own lessons, so consecutive lessons are adjacent without modules colliding.
    const angle = (sector + withinModule / (modules.length * 6)) * Math.PI * 2 + 0.4
    const radius = 0.2 + withinModule * 0.16 + jitter(lesson.id, 'r') * 0.06
    const depth = depths.get(lesson.id) ?? 0

    return {
      id: lesson.id,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.72,
      z: -0.9 + (depth / maxDepth) * 1.7 + (jitter(lesson.id, 'z') - 0.5) * 0.12,
      depth,
      moduleNumber: lesson.moduleNumber,
      weight: 0.7 + Math.min(1, lesson.duration / 20) * 0.9,
      written: !lesson.draft,
      prerequisites: [...lesson.prerequisites],
    }
  })

  const edges: GraphEdge[] = []
  for (const lesson of lessons) {
    const to = index.get(lesson.id)
    if (to === undefined) continue
    for (const prerequisite of lesson.prerequisites) {
      const from = index.get(prerequisite)
      if (from !== undefined) edges.push([from, to])
    }
  }

  return { nodes, edges, maxDepth }
}

/**
 * Every lesson you must understand before this one, transitively.
 *
 * The curriculum map's whole interaction rests on this: point at a lesson and its
 * entire chain back to the root lights up, so "what do I need first" is answered by
 * looking rather than by clicking through prerequisite links one at a time. A direct
 * prerequisite list would under-answer it — the interesting part of `06/05` is not
 * its two parents, it is the eleven-deep spine underneath them.
 *
 * Breadth-first over the reversed edge list, with a visited set that doubles as the
 * result, so a diamond in the graph is walked once and a cycle terminates.
 */
export function ancestorsOf(graph: CurriculumGraph, start: number): Set<number> {
  const parents = new Map<number, number[]>()
  for (const [from, to] of graph.edges) {
    const existing = parents.get(to)
    if (existing) existing.push(from)
    else parents.set(to, [from])
  }

  const found = new Set<number>()
  const queue = [start]
  while (queue.length > 0) {
    for (const parent of parents.get(queue.shift()!) ?? []) {
      if (found.has(parent)) continue
      found.add(parent)
      queue.push(parent)
    }
  }
  return found
}

export type Readiness = 'known' | 'ready' | 'far'

/**
 * What a node is to this particular reader.
 *
 * `known` — they have completed it.
 * `ready` — every prerequisite is completed, so it is available now.
 * `far`   — something it depends on is still unread.
 *
 * This is what the field renders as focus: readiness is drawn as depth, so the part
 * of the curriculum a reader can actually start is the part that is in front of
 * them. With nothing completed the entry points are the ready ones, which is a true
 * and useful first frame rather than an empty-state special case.
 */
export function readinessOf(node: GraphNode, completed: ReadonlySet<string>): Readiness {
  if (completed.has(node.id)) return 'known'
  return node.prerequisites.every((id) => completed.has(id)) ? 'ready' : 'far'
}
