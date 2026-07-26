import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseIndex, search, type Entry } from './palette'

/**
 * Ranking is tested against the real generated index, not a fixture, so a change to the
 * curriculum that makes the palette worse fails here rather than being discovered by
 * someone typing three letters and getting a glossary term.
 */
const INDEX: Entry[] = parseIndex(
  JSON.parse(
    readFileSync(fileURLToPath(new URL('../../public/palette.json', import.meta.url)), 'utf8')
  )
)

const titles = (query: string) => search(INDEX, query).map((entry) => entry.t)

describe('the generated index', () => {
  it('parsed, and carries every kind', () => {
    expect(INDEX.length).toBeGreaterThan(100)
    const kinds = new Set(INDEX.map((entry) => entry.k))
    expect([...kinds].sort()).toEqual(['lesson', 'module', 'sheet', 'term'])
  })

  it('links nothing that was never generated', () => {
    for (const entry of INDEX) {
      expect(entry.u.startsWith('/'), entry.u).toBe(true)
    }
  })
})

describe('ranking', () => {
  it('puts a title prefix above a mention anywhere else', () => {
    const results = search(INDEX, 'approvals')
    expect(results.length).toBeGreaterThan(0)
    // Whatever is first, it must match in its own title rather than its subtitle.
    expect(results[0]!.t.toLowerCase()).toContain('approval')
  })

  it('requires every term to match, not just one', () => {
    const both = search(INDEX, 'skill loop')
    for (const entry of both) {
      const haystack = `${entry.t} ${entry.s ?? ''} ${(entry.a ?? []).join(' ')}`.toLowerCase()
      expect(haystack).toContain('skill')
      expect(haystack).toContain('loop')
    }
  })

  it('finds a glossary term by an alias it never displays', () => {
    const withAliases = INDEX.filter((entry) => (entry.a ?? []).length > 0)
    expect(withAliases.length).toBeGreaterThan(0)

    const sample = withAliases[0]!
    const alias = sample.a![0]!
    expect(search(INDEX, alias).map((entry) => entry.t)).toContain(sample.t)
  })

  it('prefers a lesson over a glossary term when both match equally', () => {
    // Constructed rather than drawn from the index, so the tie is genuinely a tie.
    const tie: Entry[] = [
      { t: 'Memory', u: '/glossary/#memory', k: 'term' },
      { t: 'Memory', u: '/hermes/05/01/', k: 'lesson' },
    ]
    expect(search(tie, 'memory')[0]!.k).toBe('lesson')
  })

  it('returns something useful for an empty query', () => {
    const resting = search(INDEX, '')
    expect(resting.length).toBeGreaterThan(0)
    expect(resting[0]!.k).toBe('lesson')
  })

  it('returns nothing for a query that matches nothing', () => {
    expect(titles('zzzzqqqq')).toEqual([])
  })

  it('treats regex metacharacters as literal text', () => {
    // A reader pasting a path or a flag must not blow up the matcher.
    expect(() => search(INDEX, 'a(b')).not.toThrow()
    expect(() => search(INDEX, '~/.hermes/*')).not.toThrow()
  })

  it('honours the limit', () => {
    expect(search(INDEX, 'the', 5).length).toBeLessThanOrEqual(5)
  })
})

describe('parseIndex', () => {
  it('drops anything malformed rather than trusting the fetch', () => {
    expect(parseIndex('not an array')).toEqual([])
    expect(parseIndex([{ t: 'no url', k: 'lesson' }])).toEqual([])
    expect(parseIndex([{ t: 'bad kind', u: '/x/', k: 'nonsense' }])).toEqual([])
    expect(parseIndex([{ t: 'fine', u: '/x/', k: 'lesson' }])).toHaveLength(1)
  })
})
