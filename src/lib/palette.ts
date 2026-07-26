/**
 * The command palette's matcher, and it holds no DOM knowledge.
 *
 * Same reason as `sim/timeline.ts` and `term/machine.ts`: ranking is the part that is
 * easy to get subtly wrong and impossible to eyeball, so it lives here where it can be
 * tested in Node against real expectations.
 *
 * Deliberately not fuzzy in the subsequence sense. Matching "cfg" to "Configuration"
 * feels clever and ranks noise above the thing you asked for; a reader who types three
 * letters wants the item whose name starts with them. Every term must appear as a real
 * substring, and where it appears is what decides the order.
 */

export type Kind = 'lesson' | 'module' | 'term' | 'sheet'

export interface Entry {
  /** Title. */
  t: string
  /** Subtitle: the module for a lesson, the distinction for a glossary term. */
  s?: string
  /** URL. */
  u: string
  k: Kind
  /** Aliases — searchable, never displayed. */
  a?: string[]
}

/** Lower is better. */
const RANK = { titlePrefix: 0, titleWordStart: 1, titleAnywhere: 2, elsewhere: 3 } as const

function scoreTerm(entry: Entry, term: string): number | null {
  const title = entry.t.toLowerCase()

  if (title.startsWith(term)) return RANK.titlePrefix
  // A word start inside the title: "gate" should find "The gate, and the four ways
  // past it" well above something that merely mentions gates in its subtitle.
  if (new RegExp(`\\b${escape(term)}`).test(title)) return RANK.titleWordStart
  if (title.includes(term)) return RANK.titleAnywhere

  const rest = [entry.s ?? '', ...(entry.a ?? [])].join(' ').toLowerCase()
  return rest.includes(term) ? RANK.elsewhere : null
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Kinds are ordered when scores tie, because a reader typing a word that is both a
 * lesson title and a glossary term almost always wants the lesson.
 */
const KIND_ORDER: Record<Kind, number> = { lesson: 0, module: 1, sheet: 2, term: 3 }

export function search(entries: Entry[], query: string, limit = 12): Entry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)

  // An empty query is not "no results" — it is the palette's resting state, and showing
  // the first lessons is more useful than showing a void with a caret in it.
  if (terms.length === 0) {
    return [...entries]
      .sort((a, b) => KIND_ORDER[a.k] - KIND_ORDER[b.k])
      .slice(0, limit)
  }

  const scored: { entry: Entry; score: number }[] = []

  for (const entry of entries) {
    let total = 0
    let matchedAll = true

    for (const term of terms) {
      const score = scoreTerm(entry, term)
      if (score === null) {
        matchedAll = false
        break
      }
      total += score
    }

    if (matchedAll) scored.push({ entry, score: total })
  }

  return scored
    .sort(
      (a, b) =>
        a.score - b.score ||
        KIND_ORDER[a.entry.k] - KIND_ORDER[b.entry.k] ||
        // Shorter titles first on a genuine tie: the more specific match is the one
        // with less unmatched text around it.
        a.entry.t.length - b.entry.t.length ||
        a.entry.t.localeCompare(b.entry.t)
    )
    .slice(0, limit)
    .map((hit) => hit.entry)
}

/** Validates a fetched index without pulling in a schema library. */
export function parseIndex(value: unknown): Entry[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is Entry => {
    if (typeof entry !== 'object' || entry === null) return false
    const candidate = entry as Record<string, unknown>
    return (
      typeof candidate['t'] === 'string' &&
      typeof candidate['u'] === 'string' &&
      typeof candidate['k'] === 'string' &&
      candidate['k'] in KIND_ORDER
    )
  })
}
