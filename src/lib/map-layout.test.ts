import { describe, expect, it } from 'vitest'
import { bounds, buildMap, type LessonInput, type ModuleInput } from './map-layout'
import { lessons as realLessons, modules as realModules } from './content'

/**
 * A graph of sixty-one nodes cannot be checked by looking at it, which is the whole
 * reason the layout is pure. These run against the real curriculum, not a fixture, so
 * a content change that puts two lessons in the same place fails here.
 */

const INPUT_MODULES: ModuleInput[] = realModules.map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  url: entry.url,
  number: entry.number,
}))

const INPUT_LESSONS: LessonInput[] = realLessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  url: lesson.url,
  moduleNumber: lesson.moduleNumber,
  moduleSlug: lesson.moduleSlug,
  order: lesson.order,
  prerequisites: lesson.prerequisites,
}))

const graph = buildMap(INPUT_MODULES, INPUT_LESSONS)

describe('the graph is the curriculum', () => {
  it('has a node for every module and every lesson', () => {
    expect(graph.nodes.filter((node) => node.kind === 'module')).toHaveLength(
      INPUT_MODULES.length
    )
    expect(graph.nodes.filter((node) => node.kind === 'lesson')).toHaveLength(
      INPUT_LESSONS.length
    )
  })

  it('every edge joins two nodes that exist', () => {
    const ids = new Set(graph.nodes.map((node) => node.id))
    for (const edge of graph.edges) {
      expect(ids.has(edge.from), `dangling from: ${edge.from}`).toBe(true)
      expect(ids.has(edge.to), `dangling to: ${edge.to}`).toBe(true)
    }
  })

  it('carries the real prerequisites, which are what make it a graph', () => {
    const requires = graph.edges.filter((edge) => edge.kind === 'requires')
    expect(requires.length).toBeGreaterThan(0)

    // At least one prerequisite crosses a module boundary. If none did, the map would
    // be a tree drawn to look like a graph.
    const moduleOf = new Map(graph.nodes.map((node) => [node.id, node.moduleNumber]))
    const crossing = requires.filter(
      (edge) => moduleOf.get(edge.from) !== moduleOf.get(edge.to)
    )
    expect(crossing.length).toBeGreaterThan(0)
  })
})

describe('the layout', () => {
  it('is deterministic', () => {
    const again = buildMap(INPUT_MODULES, INPUT_LESSONS)
    expect(again).toEqual(graph)
  })

  it('never places two nodes at the same point', () => {
    const seen = new Set<string>()
    for (const node of graph.nodes) {
      const key = `${node.x.toFixed(3)},${node.y.toFixed(3)},${node.z.toFixed(3)}`
      expect(seen.has(key), `collision at ${key}: ${node.id}`).toBe(false)
      seen.add(key)
    }
  })

  it('descends into depth in curriculum order', () => {
    const moduleNodes = graph.nodes
      .filter((node) => node.kind === 'module')
      .sort((a, b) => a.moduleNumber - b.moduleNumber)

    for (let index = 1; index < moduleNodes.length; index++) {
      expect(
        moduleNodes[index]!.z,
        `module ${moduleNodes[index]!.moduleNumber} is not deeper than the one before`
      ).toBeLessThan(moduleNodes[index - 1]!.z)
    }
  })

  it('keeps every lesson near its own module', () => {
    const centres = new Map(
      graph.nodes
        .filter((node) => node.kind === 'module')
        .map((node) => [node.moduleNumber, node])
    )
    for (const node of graph.nodes) {
      if (node.kind !== 'lesson') continue
      const centre = centres.get(node.moduleNumber)!
      const distance = Math.hypot(node.x - centre.x, node.y - centre.y)
      // The orbit radius, with room for the depth fan and nothing more.
      expect(distance, `${node.id} is adrift from its module`).toBeLessThan(3)
    }
  })

  it('produces finite coordinates for everything', () => {
    for (const node of graph.nodes) {
      expect(Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z)).toBe(
        true
      )
    }
  })
})

describe('robustness', () => {
  it('survives an empty curriculum', () => {
    const empty = buildMap([], [])
    expect(empty.nodes).toEqual([])
    expect(empty.edges).toEqual([])
    expect(() => bounds(empty)).not.toThrow()
  })

  it('skips a lesson whose module is missing rather than dropping it on the camera', () => {
    const orphaned = buildMap(
      [],
      [
        {
          id: 'x/y/z',
          title: 'Orphan',
          url: '/x/',
          moduleNumber: 1,
          moduleSlug: 'nope',
          order: 1,
          prerequisites: [],
        },
      ]
    )
    expect(orphaned.nodes).toEqual([])
  })

  it('ignores a prerequisite that does not exist', () => {
    const withGhost = buildMap(INPUT_MODULES, [
      ...INPUT_LESSONS,
      {
        id: 'hermes/01-first-contact/99-ghost',
        title: 'Ghost',
        url: '/g/',
        moduleNumber: 1,
        moduleSlug: '01-first-contact',
        order: 99,
        prerequisites: ['hermes/does-not/exist'],
      },
    ])
    const ids = new Set(withGhost.nodes.map((node) => node.id))
    for (const edge of withGhost.edges) expect(ids.has(edge.from)).toBe(true)
  })
})

describe('bounds', () => {
  it('contains every node', () => {
    const box = bounds(graph)
    for (const node of graph.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(box.minX)
      expect(node.x).toBeLessThanOrEqual(box.maxX)
      expect(node.z).toBeGreaterThanOrEqual(box.minZ)
      expect(node.z).toBeLessThanOrEqual(box.maxZ)
    }
  })
})
