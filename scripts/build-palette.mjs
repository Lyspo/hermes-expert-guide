import { mkdir, writeFile } from 'node:fs/promises'
import {
  allCheatsheets,
  allGlossaries,
  allLessons,
} from '../.content-collections/generated/index.js'

/**
 * Builds the command palette's index into `public/palette.json`.
 *
 * A file rather than props, deliberately. Inlining ~120 entries into every page's HTML
 * would put the whole table of contents on the wire for every reader whether they press
 * ⌘K or not; a file is fetched once, on first open, and cached by the browser
 * thereafter. The palette therefore costs nothing at all until someone uses it, which is
 * the only honest way to add a global feature to a site whose lesson pages are already
 * over budget.
 *
 * Keys are single characters because this file is downloaded, not read: `t` title,
 * `s` subtitle, `u` url, `k` kind.
 */

const entries = []

for (const lesson of allLessons) {
  // A draft has no generated page, so linking to it would produce exactly the dangling
  // link the build's own check exists to catch.
  if (lesson.draft) continue
  entries.push({
    t: lesson.title,
    s: `${String(lesson.moduleNumber).padStart(2, '0')} · ${lesson.module.title}`,
    u: lesson.url,
    k: 'lesson',
  })
}

// Modules, derived from their lessons rather than listed twice.
const seen = new Set()
for (const lesson of allLessons) {
  if (lesson.draft || seen.has(lesson.moduleSlug)) continue
  seen.add(lesson.moduleSlug)
  entries.push({
    t: lesson.module.title,
    s: `Module ${String(lesson.moduleNumber).padStart(2, '0')}`,
    u: `/${lesson.guideSlug}/${lesson.moduleSlug}/`,
    k: 'module',
  })
}

for (const term of allGlossaries) {
  entries.push({
    t: term.term,
    // The distinction a term exists to resolve is the useful part, so it is the
    // subtitle rather than being dropped.
    s: term.short,
    u: `/glossary/#${term.slug}`,
    k: 'term',
    // Aliases are searchable but never displayed; a reader who types the other name
    // for something should still find it.
    a: term.aliases ?? [],
  })
}

for (const sheet of allCheatsheets) {
  entries.push({ t: sheet.title, s: sheet.description, u: sheet.url, k: 'sheet' })
}

await mkdir(new URL('../public/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../public/palette.json', import.meta.url),
  JSON.stringify(entries),
  'utf8'
)

const counts = entries.reduce((tally, entry) => {
  tally[entry.k] = (tally[entry.k] ?? 0) + 1
  return tally
}, {})

console.log(
  `Palette index: ${entries.length} entries ` +
    `(${Object.entries(counts)
      .map(([kind, n]) => `${n} ${kind}`)
      .join(', ')}) into public/palette.json.`
)
