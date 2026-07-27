import { describe, expect, it } from 'vitest'
import { spans } from './curriculum-arc'
import { curriculumGraph } from '@/lib/curriculum-graph'
import { modules, plannedLessons } from '@/lib/content'

/**
 * The arc is a drawing of a claim, so the claim is what gets tested.
 *
 * Its copy says two things a reader is entitled to hold it to: that every mark is a
 * lesson at its real prerequisite depth, and that reading order and prerequisite order
 * are not the same thing. The second is the reason the section exists rather than a
 * turn of phrase — if the modules turned out to be a clean staircase with no overlap,
 * the drawing would be an ordered list with extra steps and the sentence would be
 * false. Nothing in the build would notice.
 */

describe('the curriculum arc', () => {
  const byModule = spans()

  it('places every module, so no row can render as an empty track', () => {
    for (const entry of modules) {
      const span = byModule.get(entry.number)
      expect(span, `module ${entry.number} has no lessons in the graph`).toBeDefined()
      expect(span?.depths.length).toBe(entry.lessons.length)
    }
  })

  it('keeps every mark inside the axis it is drawn on', () => {
    for (const [moduleNumber, span] of byModule) {
      expect(span.min, `module ${moduleNumber}`).toBeLessThanOrEqual(span.max)
      expect(span.min).toBeGreaterThanOrEqual(0)
      // A depth past `maxDepth` interpolates past the end of the track, where it is
      // silently clipped rather than drawn wrong — the worst of the two failures.
      expect(span.max).toBeLessThanOrEqual(curriculumGraph.maxDepth)
    }
  })

  it('accounts for every planned lesson exactly once', () => {
    const marks = [...byModule.values()].reduce((total, span) => total + span.depths.length, 0)
    expect(marks).toBe(plannedLessons.length)
    expect(marks).toBe(curriculumGraph.nodes.length)
  })

  it('is worth drawing: reading order and prerequisite order genuinely differ', () => {
    const ordered = [...byModule].sort((a, b) => a[0] - b[0]).map(([, span]) => span)

    // A later module that opens shallower than an earlier one's deepest lesson. If no
    // pair like this existed, the drawing would say nothing the numbering did not.
    const overlaps = ordered.some((span, index) =>
      ordered.slice(0, index).some((earlier) => span.min < earlier.max),
    )
    expect(overlaps).toBe(true)

    // And the specific case the copy is about: at least one module you can reach
    // earlier than the one before it.
    const reachesBack = ordered.some(
      (span, index) => index > 0 && span.min < (ordered[index - 1]?.min ?? 0),
    )
    expect(reachesBack).toBe(true)
  })
})
