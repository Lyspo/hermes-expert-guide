import { DEFAULT_CPS, DEFAULT_MS, type SimEvent, type SimScript } from './script'

/**
 * The playback engine, and it holds no DOM knowledge at all.
 *
 * One idea makes the whole thing work: the timeline is precomputed once, and
 * everything the player renders is a *pure function of a single number* — the
 * virtual time in milliseconds. There is no per-frame mutation, no accumulated
 * drift, and no separate "current index" to keep in sync.
 *
 * That is what makes scrubbing exact rather than approximate. Seeking to 12,480 ms
 * produces precisely the state that playing for 12,480 ms produces, because they
 * are the same computation. Speed changes and marker jumps are free for the same
 * reason.
 *
 * It is also why this file is testable without a browser.
 */

export interface Slot {
  event: SimEvent
  index: number
  /** Absolute start, in milliseconds from the beginning of the replay. */
  start: number
  /** How long this event takes to play out. Zero for instantaneous events. */
  duration: number
}

export interface Timeline {
  slots: Slot[]
  /** Total replay length in milliseconds. */
  total: number
  /** Named positions, in order, for scrubber ticks and deep links. */
  markers: { id: string; label: string; at: number }[]
}

/** How long an event occupies, before any per-event override. */
function durationOf(event: SimEvent): number {
  switch (event.t) {
    case 'user':
      return (event.text.length / (event.cps ?? DEFAULT_CPS.user)) * 1000
    case 'say':
      return (event.text.length / (event.cps ?? DEFAULT_CPS.say)) * 1000
    case 'wait':
      return event.ms
    case 'result':
      return event.ms ?? DEFAULT_MS.result
    default:
      return DEFAULT_MS[event.t]
  }
}

export function buildTimeline(script: SimScript): Timeline {
  const slots: Slot[] = []
  const markers: Timeline['markers'] = []
  let cursor = 0

  script.events.forEach((event, index) => {
    const duration = durationOf(event)
    slots.push({ event, index, start: cursor, duration })
    if (event.t === 'marker') markers.push({ id: event.id, label: event.label, at: cursor })
    cursor += duration
  })

  return { slots, total: cursor, markers }
}

/**
 * How far through its own duration a slot is at a given time: 0 before it starts,
 * 1 once complete. Zero-duration events are complete the instant they begin.
 */
export function progressOf(slot: Slot, virtualTime: number): number {
  if (virtualTime <= slot.start) return 0
  if (slot.duration <= 0) return 1
  const ratio = (virtualTime - slot.start) / slot.duration
  return ratio >= 1 ? 1 : ratio
}

/**
 * The slots to render at a given time, each with its own progress.
 *
 * Binary search for the boundary rather than a linear scan, so a long replay costs
 * the same per frame as a short one.
 */
export function visibleAt(timeline: Timeline, virtualTime: number): (Slot & { progress: number })[] {
  const { slots } = timeline
  if (slots.length === 0) return []

  let low = 0
  let high = slots.length - 1
  let last = -1

  while (low <= high) {
    const mid = (low + high) >> 1
    if (slots[mid]!.start <= virtualTime) {
      last = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  const out: (Slot & { progress: number })[] = []
  for (let i = 0; i <= last; i++) {
    const slot = slots[i]!
    out.push({ ...slot, progress: progressOf(slot, virtualTime) })
  }
  return out
}

/**
 * The visible prefix of a typed event's text.
 *
 * Splitting by code point rather than by UTF-16 unit, so an emoji or accented
 * character is never cut in half mid-reveal.
 */
export function revealed(text: string, progress: number): string {
  if (progress >= 1) return text
  if (progress <= 0) return ''
  const characters = [...text]
  return characters.slice(0, Math.floor(characters.length * progress)).join('')
}

/** The time at which a marker sits, for seeking. */
export function markerTime(timeline: Timeline, id: string): number | undefined {
  return timeline.markers.find((marker) => marker.id === id)?.at
}

/**
 * The next and previous slot boundaries around a time, for step-through — which is
 * how a reader with reduced motion advances the replay one event at a time.
 */
export function stepBoundaries(timeline: Timeline, virtualTime: number) {
  const starts = timeline.slots.map((slot) => slot.start)
  const next = starts.find((start) => start > virtualTime + 1)
  const previous = [...starts].reverse().find((start) => start < virtualTime - 1)
  return { next: next ?? timeline.total, previous: previous ?? 0 }
}
