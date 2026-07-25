import { describe, expect, it } from 'vitest'
import type { SimScript } from './script'
import {
  buildTimeline,
  markerTime,
  progressOf,
  revealed,
  stepBoundaries,
  visibleAt,
} from './timeline'

const script: SimScript = {
  id: 'test',
  title: 'Test',
  premise: 'A fixture.',
  fidelity: 'reconstructed',
  source: 'fixture',
  hermesVersion: 'v0.19.0',
  events: [
    { t: 'user', text: 'abcdefghij', cps: 10 }, // 1000ms
    { t: 'marker', id: 'start', label: 'Start' }, // 0ms
    { t: 'wait', ms: 500 },
    { t: 'say', text: 'hello', cps: 5 }, // 1000ms
    { t: 'marker', id: 'done', label: 'Done' }, // 0ms
  ],
}

describe('buildTimeline', () => {
  it('lays events end to end and totals their durations', () => {
    const timeline = buildTimeline(script)
    expect(timeline.slots.map((slot) => slot.start)).toEqual([0, 1000, 1000, 1500, 2500])
    expect(timeline.total).toBe(2500)
  })

  it('records markers at their absolute positions', () => {
    const timeline = buildTimeline(script)
    expect(timeline.markers).toEqual([
      { id: 'start', label: 'Start', at: 1000 },
      { id: 'done', label: 'Done', at: 2500 },
    ])
    expect(markerTime(timeline, 'done')).toBe(2500)
    expect(markerTime(timeline, 'absent')).toBeUndefined()
  })

  it('handles an empty script without special-casing downstream', () => {
    const empty = buildTimeline({ ...script, events: [] })
    expect(empty.total).toBe(0)
    expect(visibleAt(empty, 500)).toEqual([])
  })
})

describe('progressOf', () => {
  const timeline = buildTimeline(script)
  const typed = timeline.slots[0]!

  it('runs from zero to one across the event and clamps at both ends', () => {
    expect(progressOf(typed, -100)).toBe(0)
    expect(progressOf(typed, 0)).toBe(0)
    expect(progressOf(typed, 500)).toBeCloseTo(0.5)
    expect(progressOf(typed, 1000)).toBe(1)
    expect(progressOf(typed, 99999)).toBe(1)
  })

  it('treats a zero-duration event as complete the instant it starts', () => {
    const marker = timeline.slots[1]!
    expect(progressOf(marker, 999)).toBe(0)
    expect(progressOf(marker, 1000)).toBe(0)
    expect(progressOf(marker, 1001)).toBe(1)
  })
})

describe('visibleAt', () => {
  const timeline = buildTimeline(script)

  it('reveals events as their start times pass', () => {
    expect(visibleAt(timeline, 0)).toHaveLength(1)
    expect(visibleAt(timeline, 999)).toHaveLength(1)
    expect(visibleAt(timeline, 1000)).toHaveLength(3)
    expect(visibleAt(timeline, timeline.total)).toHaveLength(5)
  })

  it('shows everything at or past the end', () => {
    expect(visibleAt(timeline, timeline.total + 10_000)).toHaveLength(5)
  })

  it('is identical whether reached by seeking or by playing — the whole point', () => {
    // Scrubbing is exact only because state is a pure function of one number. If
    // this ever diverges, the engine has grown hidden state.
    for (const time of [0, 137, 999, 1000, 1499, 1500, 2100, 2500]) {
      const a = visibleAt(timeline, time)
      const b = visibleAt(timeline, time)
      expect(a.map((slot) => [slot.index, slot.progress])).toEqual(
        b.map((slot) => [slot.index, slot.progress]),
      )
    }
  })

  it('never returns an event whose start has not passed', () => {
    for (const time of [0, 250, 750, 1200, 1900, 2499]) {
      for (const slot of visibleAt(timeline, time)) {
        expect(slot.start).toBeLessThanOrEqual(time)
      }
    }
  })
})

describe('revealed', () => {
  it('reveals a prefix proportional to progress', () => {
    expect(revealed('abcdefghij', 0)).toBe('')
    expect(revealed('abcdefghij', 0.5)).toBe('abcde')
    expect(revealed('abcdefghij', 1)).toBe('abcdefghij')
  })

  it('splits by code point, so a character is never cut in half', () => {
    // Naive slicing would produce a lone surrogate here and render a replacement
    // glyph mid-reveal.
    const text = 'a🜛b'
    expect([...revealed(text, 0.67)]).toEqual(['a', '🜛'])
    expect(revealed(text, 1)).toBe(text)
  })
})

describe('stepBoundaries', () => {
  const timeline = buildTimeline(script)

  it('finds the next and previous event boundaries', () => {
    expect(stepBoundaries(timeline, 0).next).toBe(1000)
    expect(stepBoundaries(timeline, 1200).next).toBe(1500)
    expect(stepBoundaries(timeline, 1200).previous).toBe(1000)
  })

  it('clamps at the ends rather than running off them', () => {
    expect(stepBoundaries(timeline, timeline.total).next).toBe(timeline.total)
    expect(stepBoundaries(timeline, 0).previous).toBe(0)
  })
})
