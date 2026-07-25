import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PLATES } from './index'

/**
 * Plate geometry, checked rather than eyeballed.
 *
 * SVG has no text flow and no overflow: a label that runs past the viewBox is
 * silently cut, and two labels that land on the same spot silently overprint.
 * Building the first plate produced both — the right-hand notes lost their last
 * word to an optimistic advance-width estimate, and it was invisible until the
 * boxes were measured.
 *
 * So this measures every text run in every registered plate against the viewBox,
 * and against every other run. It is deliberately pessimistic about width: the
 * wrapper in `stage.tsx` lays out at 6.1px per character at font-size 10, and this
 * checks at 6.2, so a plate that passes here has a little room left over.
 */

/** Monospace advance width as a fraction of the em. Above what the layout assumes. */
const ADVANCE = 0.62

type Run = {
  plate: string
  text: string
  x1: number
  x2: number
  y1: number
  y2: number
}

const ATTR = /([\w-]+)="([^"]*)"/g

function attrs(source: string): Record<string, string> {
  const found: Record<string, string> = {}
  for (const [, name, value] of source.matchAll(ATTR)) found[name!] = value!
  return found
}

/** React escapes markup characters; `<namespace>` must count as 11, not 21. */
function decode(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
}

/** Every text run in a plate, as a box. */
function runs(plate: string, html: string): Run[] {
  const found: Run[] = []

  for (const [, rawAttrs, inner] of html.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const outer = attrs(rawAttrs!)
    const size = Number(outer['font-size'] ?? 10)
    const anchor = outer['text-anchor'] ?? 'start'
    const baseX = Number(outer['x'] ?? 0)
    let y = Number(outer['y'] ?? 0)

    const spans = [...inner!.matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g)]
    const lines = spans.length
      ? spans.map(([, spanAttrs, body]) => {
          const span = attrs(spanAttrs!)
          y += Number(span['dy'] ?? 0)
          return { x: Number(span['x'] ?? baseX), y, body: body! }
        })
      : [{ x: baseX, y, body: inner! }]

    for (const line of lines) {
      const text = decode(line.body).trim()
      if (!text) continue
      const width = text.length * size * ADVANCE
      const left =
        anchor === 'middle' ? line.x - width / 2 : anchor === 'end' ? line.x - width : line.x

      found.push({
        plate,
        text,
        x1: left,
        x2: left + width,
        // Cap height above the baseline, descender below.
        y1: line.y - size * 0.8,
        y2: line.y + size * 0.25,
      })
    }
  }

  return found
}

const overlap = (a: Run, b: Run) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2

const plates = Object.entries(PLATES).map(([id, Plate]) => {
  const html = renderToStaticMarkup(<Plate />)
  const viewBox = /viewBox="0 0 (\d+) (\d+)"/.exec(html)
  if (!viewBox) throw new Error(`plate "${id}" has no viewBox`)

  return {
    id,
    html,
    width: Number(viewBox[1]),
    height: Number(viewBox[2]),
    runs: runs(id, html),
  }
})

describe.each(plates)('plate: $id', (plate) => {
  it('renders text at all', () => {
    expect(plate.runs.length).toBeGreaterThan(4)
  })

  it('keeps every label inside the viewBox', () => {
    const clipped = plate.runs.filter(
      (run) => run.x1 < 0 || run.x2 > plate.width || run.y1 < 0 || run.y2 > plate.height,
    )
    expect(clipped.map((run) => `${run.text} → ${Math.round(run.x2)},${Math.round(run.y2)}`)).toEqual(
      [],
    )
  })

  it('never overprints one label on another', () => {
    const collisions: string[] = []
    for (let i = 0; i < plate.runs.length; i++) {
      for (let j = i + 1; j < plate.runs.length; j++) {
        const a = plate.runs[i]!
        const b = plate.runs[j]!
        if (overlap(a, b)) collisions.push(`“${a.text}” over “${b.text}”`)
      }
    }
    expect(collisions).toEqual([])
  })

  it('carries a title and a description a screen reader can use instead of the image', () => {
    // A plate is informational. The description is an alternative, not a caption,
    // so it has to state the plate's claims rather than name its parts.
    const description = /<desc[^>]*>([\s\S]*?)<\/desc>/.exec(plate.html)?.[1] ?? ''
    expect(/<title[^>]*>[^<]{8,}<\/title>/.test(plate.html)).toBe(true)
    expect(description.length).toBeGreaterThan(200)
    expect(plate.html).toContain('role="img"')
  })
})
