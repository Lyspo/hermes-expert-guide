import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { SIMULATIONS } from '@content/simulations'
import { buildTimeline, markerTime } from './timeline'

/**
 * Guards on the replay registry.
 *
 * The `Simulation` component renders an in-place error for an unregistered id rather
 * than nothing, which is the right runtime behaviour and a poor gate: the page still
 * builds, the link check still passes, and the mistake ships as a small red line in
 * the middle of a lesson. Catching it here means it never gets that far.
 *
 * The provenance assertions are not ceremony either. Non-negotiable #1 is that every
 * claim traces to a source, and a replay is the densest concentration of quoted
 * strings on the site — an empty `source` on one of these is the exact shape of the
 * failure the rule exists to prevent.
 */

const CONTENT = new URL('../../../content', import.meta.url).pathname
const GUIDES = join(CONTENT, 'guides', 'hermes')

/** Every lesson body, with the path that produced it. */
function lessons(): { path: string; body: string }[] {
  return readdirSync(GUIDES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((moduleDir) => {
      const dir = join(GUIDES, moduleDir.name)
      return readdirSync(dir)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => ({
          path: `${moduleDir.name}/${name}`,
          body: readFileSync(join(dir, name), 'utf8'),
        }))
    })
}

describe('the replay registry', () => {
  it('resolves every id embedded in a lesson', () => {
    const embedded = lessons().flatMap(({ path, body }) =>
      [...body.matchAll(/<Simulation\s+id="([^"]+)"/g)].map((match) => ({
        path,
        id: match[1]!,
      })),
    )

    // A lesson embedding nothing is fine; a suite matching nothing is not, because it
    // would pass silently if the regex or the layout ever changed.
    expect(embedded.length).toBeGreaterThan(0)

    const unresolved = embedded.filter(({ id }) => !(id in SIMULATIONS))
    expect(unresolved).toEqual([])
  })

  it('keys every script under its own id', () => {
    for (const [key, script] of Object.entries(SIMULATIONS)) {
      expect(script.id).toBe(key)
    }
  })

  it('states provenance on every script', () => {
    for (const script of Object.values(SIMULATIONS)) {
      expect(script.source.trim().length, `${script.id} has no source`).toBeGreaterThan(0)
      expect(script.hermesVersion, `${script.id} has no version`).toMatch(/^v\d/)
      expect(['verbatim', 'reconstructed']).toContain(script.fidelity)
    }
  })

  it('builds a timeline that advances and ends', () => {
    for (const script of Object.values(SIMULATIONS)) {
      const timeline = buildTimeline(script)
      expect(timeline.slots.length, `${script.id} has no events`).toBe(script.events.length)
      expect(timeline.total, `${script.id} takes no time`).toBeGreaterThan(0)
    }
  })

  it('gives every marker a distinct id, so seeking lands where it says', () => {
    for (const script of Object.values(SIMULATIONS)) {
      const timeline = buildTimeline(script)
      const ids = timeline.markers.map((marker) => marker.id)
      expect(new Set(ids).size, `${script.id} repeats a marker id`).toBe(ids.length)

      // markerTime resolves by first match, so a duplicate would seek to the wrong
      // place rather than fail — assert the lookup agrees with the built position.
      for (const marker of timeline.markers) {
        expect(markerTime(timeline, marker.id)).toBe(marker.at)
      }
    }
  })
})
