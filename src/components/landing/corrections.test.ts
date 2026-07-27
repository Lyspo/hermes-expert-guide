import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { CORRECTIONS } from './corrections'
import { RELEASES } from '@/lib/mastery'

/**
 * Provenance for the landing page's receipts.
 *
 * The same discipline `evidence-field.test.ts` applies to the arrival wall, applied
 * here for a sharper reason: these lines are not texture, they are the *proof* offered
 * for four sentences that call the documentation wrong. A guide whose landing page
 * invents its own evidence has no argument left at all.
 *
 * The bar is verbatim substring presence in `research/`, **preserving interior
 * whitespace**. That qualifier is the whole test. `fidelity.test.ts` once collapsed
 * runs of spaces and thereby certified a ragged 81-character banner as an 80-character
 * capture; a status bar or a tool-feed line with its columns squeezed is likewise no
 * longer a capture of anything. Only leading and trailing whitespace is trimmed, since
 * a fenced block's own indentation is not part of the line.
 */

const ROOT = new URL('../../../', import.meta.url).pathname

function corpus(): string {
  const research = join(ROOT, 'research')
  return readdirSync(research)
    .filter((name) => name.endsWith('.md'))
    .map((name) => readFileSync(join(research, name), 'utf8'))
    .join('\n')
}

/** Every string a receipt puts on the page, whatever shape the receipt takes. */
function claimedLines(): string[] {
  return CORRECTIONS.flatMap((correction) =>
    correction.receipt.mode === 'ladder'
      ? correction.receipt.rows.map((row) => row.gloss)
      : [...(correction.receipt.published ?? []), ...correction.receipt.lines],
  )
}

describe('the landing corrections', () => {
  const text = corpus()

  it('offers only evidence that is in the corpus, interior whitespace intact', () => {
    const invented = claimedLines().filter((line) => !text.includes(line.trim()))
    expect(invented).toEqual([])
  })

  it('would catch a receipt whose columns had been tidied up', () => {
    // The guard on the guard. `rm -rf /tmp/hermes-scratch` is padded in the capture,
    // and a well-meaning reformat that collapsed it would leave a line that still
    // reads correctly and is no longer what the terminal printed.
    const squeezed = '  ┊ 💻 $ rm -rf /tmp/hermes-scratch  5.0s'
    expect(text.includes(squeezed.trim())).toBe(false)
  })

  it('shows the cost field in the published bar and in no captured one', () => {
    const [status] = CORRECTIONS
    expect(status?.receipt.mode).toBe('pre')
    if (status?.receipt.mode !== 'pre') return

    // The documentation's bar carries `$0.06`; not one of the three captured states
    // carries a `$` field at all. That contrast is the receipt's entire job.
    expect(status.receipt.published?.join('\n')).toMatch(/\$0\.06/)
    expect(status.receipt.lines.join('\n')).not.toMatch(/\$/)
    expect(status.receipt.lines.length).toBeGreaterThan(1)
  })

  it('dates every release from the ladder rather than from a retyped literal', () => {
    const ladder = CORRECTIONS.find((correction) => correction.receipt.mode === 'ladder')
    expect(ladder).toBeDefined()
    if (ladder?.receipt.mode !== 'ladder') return

    for (const row of ladder.receipt.rows) {
      expect(RELEASES.some((release) => release.version === row.version)).toBe(true)
    }
    // The point of the row set: the release everyone cites is below the ones that
    // actually did the work.
    expect(ladder.receipt.rows[0]?.version).toBe('v0.6.0')
    expect(ladder.receipt.rows.map((row) => row.version)).toContain('v0.13.0')
  })

  it('sends every correction to a lesson, and never to the same one twice', () => {
    const destinations = CORRECTIONS.map((correction) => correction.where)
    expect(new Set(destinations).size).toBe(CORRECTIONS.length)
    for (const destination of destinations) {
      expect(destination.startsWith('/hermes/')).toBe(true)
      expect(destination.endsWith('/')).toBe(true)
    }
  })

  it('gives each receipt its own provenance line', () => {
    const sources = CORRECTIONS.map((correction) => correction.receipt.source)
    // A fixed phrase repeated on every row is the device-that-needs-a-caption failure
    // this project removed a set of chips for. Each of these names what was checked.
    expect(new Set(sources).size).toBe(CORRECTIONS.length)
    for (const source of sources) expect(source.length).toBeGreaterThan(24)
  })
})
