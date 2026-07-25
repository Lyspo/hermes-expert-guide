import { describe, expect, it } from 'vitest'
import {
  ancestorsOf,
  descendantsOf,
  jitter,
  layout,
  prerequisiteDepths,
  readinessOf,
  type GraphNode,
  type LessonInput,
} from './graph'

/**
 * The field draws this graph, so these are tests of a claim rather than of a helper.
 *
 * The field previously scattered points at random and clustered them by `index % 5`,
 * which looked like a graph of the agent's interior and was a graph of nothing. The
 * fix is only worth anything if the arrangement stays meaningful, so the properties
 * asserted here are the ones the design actually promises: depth means prerequisite
 * depth, a module is a region, and the same input lays out identically on the server
 * and in the browser.
 */

const lesson = (
  id: string,
  moduleNumber: number,
  order: number,
  prerequisites: string[] = [],
  extra: Partial<LessonInput> = {},
): LessonInput => ({ id, moduleNumber, order, duration: 10, prerequisites, ...extra })

/** A → B → C chain in module 1, plus an unblocked lesson in module 2. */
const fixture: LessonInput[] = [
  lesson('a', 1, 1),
  lesson('b', 1, 2, ['a']),
  lesson('c', 1, 3, ['b']),
  lesson('d', 2, 1),
  lesson('e', 2, 2, ['a', 'c']),
]

describe('prerequisite depth', () => {
  it('puts an unblocked lesson at zero', () => {
    const depths = prerequisiteDepths(fixture)
    expect(depths.get('a')).toBe(0)
    expect(depths.get('d')).toBe(0)
  })

  it('counts the chain', () => {
    const depths = prerequisiteDepths(fixture)
    expect(depths.get('b')).toBe(1)
    expect(depths.get('c')).toBe(2)
  })

  it('takes the longest chain, not the shortest', () => {
    // `e` depends on both `a` (depth 0) and `c` (depth 2). A lesson is as deep as
    // the most demanding thing it asks you to already know, so this is 3, not 1.
    expect(prerequisiteDepths(fixture).get('e')).toBe(3)
  })

  it('ignores a prerequisite that is not in the set', () => {
    const depths = prerequisiteDepths([lesson('only', 1, 1, ['missing'])])
    expect(depths.get('only')).toBe(0)
  })

  it('survives a cycle rather than blowing the stack', () => {
    // The build rejects dangling prerequisites but not circular ones, and this runs
    // inside that same build — so it degrades instead of taking the export down.
    const cyclic = [lesson('x', 1, 1, ['y']), lesson('y', 1, 2, ['x'])]
    expect(() => prerequisiteDepths(cyclic)).not.toThrow()
  })
})

describe('layout', () => {
  const graph = layout(fixture)
  const at = (id: string): GraphNode => graph.nodes.find((node) => node.id === id)!

  it('emits one node per lesson and one edge per resolvable prerequisite', () => {
    expect(graph.nodes).toHaveLength(5)
    // a←b, b←c, a←e, c←e. Four claims, four lines.
    expect(graph.edges).toHaveLength(4)
  })

  it('drops edges to prerequisites outside the set instead of emitting a dangler', () => {
    const partial = layout([lesson('solo', 1, 1, ['nowhere'])])
    expect(partial.edges).toEqual([])
  })

  it('places deeper lessons further back', () => {
    // The load-bearing property: z is derived from the prerequisite graph, so
    // descending through the field really is going further into the curriculum.
    expect(at('a').z).toBeLessThan(at('b').z)
    expect(at('b').z).toBeLessThan(at('c').z)
  })

  it('keeps a module together as a region', () => {
    const moduleOne = ['a', 'b', 'c'].map((id) => Math.atan2(at(id).y / 0.72, at(id).x))
    const spread = Math.max(...moduleOne) - Math.min(...moduleOne)
    // Well inside the 2π/2 sector two modules would each occupy.
    expect(spread).toBeLessThan(Math.PI / 2)
  })

  it('is deterministic, so the server and the browser agree', () => {
    expect(layout(fixture)).toEqual(layout(fixture))
  })

  it('never divides by zero on a single-lesson module', () => {
    const single = layout([lesson('one', 1, 1)])
    for (const value of [single.nodes[0]!.x, single.nodes[0]!.y, single.nodes[0]!.z]) {
      expect(Number.isFinite(value)).toBe(true)
    }
  })

  it('marks drafts as unwritten', () => {
    const mixed = layout([lesson('written', 1, 1), lesson('stub', 1, 2, [], { draft: true })])
    expect(mixed.nodes.map((node) => node.written)).toEqual([true, false])
  })
})

describe('ancestors', () => {
  const graph = layout(fixture)
  const index = (id: string) => graph.nodes.findIndex((node) => node.id === id)
  const ids = (start: string) =>
    [...ancestorsOf(graph, index(start))].map((at) => graph.nodes[at]!.id).sort()

  it('is empty for a lesson with no prerequisites', () => {
    expect(ids('a')).toEqual([])
  })

  it('walks the whole chain, not just the direct parents', () => {
    // This is the point of the map's hover: `c` names only `b`, but you cannot
    // start `c` without `a` either, and that is what the reader needs to see.
    expect(ids('c')).toEqual(['a', 'b'])
  })

  it('merges converging branches without repeating them', () => {
    // `e` reaches `a` twice — directly, and again through `c` → `b` → `a`.
    expect(ids('e')).toEqual(['a', 'b', 'c'])
  })

  it('terminates on a cycle', () => {
    const cyclic = layout([lesson('x', 1, 1, ['y']), lesson('y', 1, 2, ['x'])])
    expect(() => ancestorsOf(cyclic, 0)).not.toThrow()
    expect(ancestorsOf(cyclic, 0).size).toBe(2)
  })
})

describe('descendants', () => {
  const graph = layout(fixture)
  const index = (id: string) => graph.nodes.findIndex((node) => node.id === id)
  const ids = (start: string) =>
    [...descendantsOf(graph, index(start))].map((at) => graph.nodes[at]!.id).sort()

  it('is empty for a leaf', () => {
    expect(ids('e')).toEqual([])
  })

  it('reaches everything downstream, not just direct children', () => {
    // `a` is the root of the chain; `d` is in another module and depends on nothing.
    expect(ids('a')).toEqual(['b', 'c', 'e'])
  })

  it('mirrors ancestors', () => {
    // If x is an ancestor of y, y is a descendant of x. Cheap property, and it is
    // the one that would break first if either walk followed the wrong edge end.
    for (const node of graph.nodes) {
      for (const up of ancestorsOf(graph, index(node.id))) {
        expect(descendantsOf(graph, up)).toContain(index(node.id))
      }
    }
  })

  it('terminates on a cycle', () => {
    const cyclic = layout([lesson('x', 1, 1, ['y']), lesson('y', 1, 2, ['x'])])
    expect(() => descendantsOf(cyclic, 0)).not.toThrow()
  })
})

describe('jitter', () => {
  it('is stable for an id and varies with the salt', () => {
    expect(jitter('lesson')).toBe(jitter('lesson'))
    expect(jitter('lesson', 'r')).not.toBe(jitter('lesson', 'z'))
  })

  it('stays in range', () => {
    for (const id of ['a', 'b', 'c', 'hermes/01/02', '']) {
      expect(jitter(id)).toBeGreaterThanOrEqual(0)
      expect(jitter(id)).toBeLessThan(1)
    }
  })
})

describe('readiness', () => {
  const graph = layout(fixture)
  const at = (id: string): GraphNode => graph.nodes.find((node) => node.id === id)!

  it('calls an unblocked lesson ready with nothing completed', () => {
    // The empty state is not a special case: a reader who has read nothing still
    // sees the real entry points in front of them.
    const none = new Set<string>()
    expect(readinessOf(at('a'), none)).toBe('ready')
    expect(readinessOf(at('d'), none)).toBe('ready')
  })

  it('holds a lesson back until every prerequisite is done', () => {
    expect(readinessOf(at('e'), new Set(['a']))).toBe('far')
    expect(readinessOf(at('e'), new Set(['a', 'c']))).toBe('ready')
  })

  it('prefers known over ready for a completed lesson', () => {
    expect(readinessOf(at('a'), new Set(['a']))).toBe('known')
  })
})
