import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { EVIDENCE_LINES } from './evidence-field'

/**
 * Provenance for the arrival field.
 *
 * The field is texture, and texture is exactly where invented "technical-looking"
 * strings normally live — a wall of plausible terminal output is the single easiest
 * piece of slop to produce and the hardest to notice. Non-negotiable #1 does not have
 * an exemption for decoration, so this asserts every line is real.
 *
 * The bar is verbatim substring presence in the sources the guide already trusts:
 * `research/` for captured material and `sources.ts` for the console's cited table,
 * which `fidelity.test.ts` in turn diffs against the corpus character for character.
 * A line that cannot be found in either does not ship, which is the same rule the
 * lessons run on.
 */

const ROOT = new URL('../../../', import.meta.url).pathname

/** Every research document plus the console's cited string table, concatenated. */
function corpus(): string {
  const research = join(ROOT, 'research')
  const documents = readdirSync(research)
    .filter((name) => name.endsWith('.md'))
    .map((name) => readFileSync(join(research, name), 'utf8'))

  documents.push(readFileSync(join(ROOT, 'src/lib/term/sources.ts'), 'utf8'))
  return documents.join('\n')
}

describe('the arrival field', () => {
  const text = corpus()

  it('draws only from captured output', () => {
    const invented = EVIDENCE_LINES.filter((line) => !text.includes(line.trim()))
    expect(invented).toEqual([])
  })

  it('carries the corrections that make the page an argument', () => {
    const joined = EVIDENCE_LINES.join('\n')

    // A status bar with no cost field, where the documentation publishes one.
    expect(joined).toMatch(/⚕ <model> │ 21\.1K\/1M/)
    expect(joined).not.toMatch(/\$0\.\d\d/)

    // A numbered approval menu, where the documentation publishes letter keys.
    expect(joined).toContain('1. Allow once')
    expect(joined).not.toMatch(/\[o\]nce/)
  })

  it('is long enough to read as a wall and short enough to stay cheap', () => {
    expect(EVIDENCE_LINES.length).toBeGreaterThan(12)
    expect(EVIDENCE_LINES.length).toBeLessThan(40)
  })
})
