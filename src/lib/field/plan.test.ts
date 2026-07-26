import { describe, expect, it } from 'vitest'
import { curriculumGraph } from '@/lib/curriculum-graph'
import { plannedLessons } from '@/lib/content'
import { ancestorsOf } from '@/lib/graph'
import { planLessonField } from './plan'

/**
 * Geometry assertions for the lesson masthead.
 *
 * The failure mode this guards is specific and this project has already shipped it once
 * on a different surface: a drawing whose elements are computed outside the box that
 * contains them renders as nothing at all, and every other gate stays green while it
 * does. `05-direction-exploration.md` records an `<svg>` whose leader lines had never
 * once been visible across every version of a prototype, because a replaced element does
 * not take its size from `inset: 0`.
 *
 * So: assert that things land inside the viewBox, that the chain is the real prerequisite
 * chain rather than a plausible-looking set, and that near things are drawn after far
 * ones.
 */

const deep = curriculumGraph.nodes.reduce(
  (best, node, index) => (node.depth > curriculumGraph.nodes[best]!.depth ? index : best),
  0,
)

describe('the lesson masthead plan', () => {
  it('draws the focused lesson and its whole prerequisite chain', () => {
    const plan = planLessonField(curriculumGraph, deep)
    const chain = ancestorsOf(curriculumGraph, deep)

    expect(plan.ancestorCount).toBe(chain.size)
    expect(plan.nodes.filter((node) => node.role === 'focus')).toHaveLength(1)

    // Every edge drawn is a real prerequisite edge between two nodes on the chain.
    expect(plan.edges.length).toBeGreaterThan(0)
    for (const edge of plan.edges) expect(edge.onChain).toBe(true)
  })

  it('keeps what it draws inside the viewBox', () => {
    for (const index of [0, deep, Math.floor(curriculumGraph.nodes.length / 2)]) {
      const plan = planLessonField(curriculumGraph, index)

      for (const node of plan.nodes) {
        expect(Number.isFinite(node.x)).toBe(true)
        expect(Number.isFinite(node.y)).toBe(true)
        expect(node.r).toBeGreaterThan(0)
        // Generous on Y — nodes may sit above or below the band and get clipped by the
        // frame — but a node projected thousands of units away is a broken camera.
        expect(Math.abs(node.y)).toBeLessThan(plan.height * 6)
        expect(node.x).toBeGreaterThan(-100)
        expect(node.x).toBeLessThan(plan.width + 100)
      }

      for (const tick of plan.ticks) {
        // The rule itself may run off the frame — the near depth planes are wider than
        // the band on purpose, so the field reads as continuing past its crop. What it
        // may not do is sit entirely outside, which would mean drawing nothing.
        expect(tick.x2).toBeGreaterThan(0)
        expect(tick.x).toBeLessThan(plan.width)

        // The number, however, is always readable. This is the assertion that would
        // have caught the labels overprinting each other into a smudge at the
        // vanishing point, and the one that keeps the clamp honest.
        expect(tick.labelX).toBeGreaterThanOrEqual(0)
        expect(tick.labelX).toBeLessThanOrEqual(plan.width)
      }

      // Labels never collide: every drawn number has clear vertical space.
      const labelled = plan.ticks.filter((tick) => tick.label !== '')
      for (let i = 1; i < labelled.length; i++) {
        expect(Math.abs(labelled[i - 1]!.y - labelled[i]!.y)).toBeGreaterThan(12)
      }
    }
  })

  it('paints far before near, so nearer solids occlude', () => {
    const plan = planLessonField(curriculumGraph, deep)
    const order = plan.nodes.map((node) => node.sort)
    expect([...order].sort((a, b) => a - b)).toEqual(order)
  })

  it('gives a root lesson an empty chain rather than inventing one', () => {
    const root = curriculumGraph.nodes.findIndex((node) => node.depth === 0)
    const plan = planLessonField(curriculumGraph, root)

    expect(plan.ancestorCount).toBe(0)
    expect(plan.edges).toHaveLength(0)
    expect(plan.depth).toBe(0)
    // It still draws: a lesson with no prerequisites is a real state, not an error.
    expect(plan.nodes.filter((node) => node.role === 'focus')).toHaveLength(1)
  })

  it('never claims a deeper chain than the curriculum has', () => {
    for (let index = 0; index < curriculumGraph.nodes.length; index++) {
      const plan = planLessonField(curriculumGraph, index)
      expect(plan.depth).toBeLessThanOrEqual(plan.maxDepth)
      expect(plan.ancestorCount).toBeLessThan(plannedLessons.length)
    }
  })
})
