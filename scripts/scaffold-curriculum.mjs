/**
 * Generates the curriculum skeleton from research/curriculum-map.md.
 *
 * The map is the single source of truth for module and lesson structure — titles,
 * durations, per-track relevance, prerequisites, and which research sections each
 * lesson draws from. Generating the tree from it rather than transcribing by hand
 * means the two cannot drift, and it means a change to the map is a re-run rather
 * than fifty-one edits.
 *
 * Existing lesson files are never overwritten: once a lesson has real prose, this
 * script leaves it alone. Run with --force-stubs to rewrite stubs anyway.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { join } from 'node:path'

const MAP = 'research/curriculum-map.md'
const ROOT = 'content/guides/hermes'
const VERSION = 'v0.19.0'
const TODAY = '2026-07-25'

const RELEVANCE = { C: 'core', S: 'skim', '—': 'skip', '-': 'skip' }

const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  )

/** Escape a string for a single-quoted YAML scalar. */
const yamlString = (value) => `'${value.replace(/'/g, "''")}'`

/** Fold a long description into a YAML block scalar so lines stay readable. */
function yamlBlock(text, indent = '  ') {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    if (line && (line + ' ' + word).length > 74) {
      lines.push(line)
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line) lines.push(line)
  return '>-\n' + lines.map((l) => indent + l).join('\n')
}

const source = await readFile(MAP, 'utf8')
const lines = source.split('\n')

const modules = []
let current = null

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  // ## 3. Module 1 — First contact
  const moduleHeading = line.match(/^## \d+\. Module (\d+) — (.+)$/)
  if (moduleHeading) {
    current = {
      order: Number(moduleHeading[1]),
      title: moduleHeading[2].trim(),
      slug: null,
      arc: null,
      summary: null,
      lessons: [],
    }
    modules.push(current)
    continue
  }

  // Stop collecting once the per-module sections end.
  if (/^## \d+\. The hard cases/.test(line)) current = null
  if (!current) continue

  // `content/guides/hermes/01-first-contact/` · arc: `orientation` · …
  const path = line.match(/^`content\/guides\/hermes\/([^/`]+)\/`.*?arc: `([^`]+)`/)
  if (path) {
    current.slug = path[1]
    current.arc = path[2]
    continue
  }

  // **After it, the reader can** … — the clearest statement of the module's point,
  // and it may run over several lines until a blank one.
  if (line.startsWith('**After it, the reader can**')) {
    const collected = [line.replace('**After it, the reader can**', 'After it you can').trim()]
    for (let j = i + 1; j < lines.length && lines[j].trim() !== ''; j++) {
      collected.push(lines[j].trim())
    }
    current.summary = collected
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\*\*/g, '')
      .trim()
    continue
  }

  // **`01-what-hermes-is.mdx` — What Hermes actually is** · 8 min · N `C` / O `C` / A `C`
  const lesson = line.match(
    /^\*\*`([^`]+)\.mdx` — (.+?)\*\* · (\d+) min · N `(.)` \/ O `(.)` \/ A `(.)`/,
  )
  if (lesson) {
    const [, slug, title, duration, n, o, a] = lesson

    // The next `> …` lines carry the description and the prerequisites.
    let description = ''
    let prerequisites = []
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j]
      if (!next.startsWith('>')) break
      const body = next.replace(/^>\s?/, '').trim()
      if (body.startsWith('**Prereqs**')) {
        const raw = body.replace('**Prereqs**', '').trim()
        prerequisites =
          raw === 'none'
            ? []
            : [...raw.matchAll(/`([^`]+)`/g)].map((match) => match[1]).filter(Boolean)
      } else if (body.startsWith('**Draws from**') || body.startsWith('**Note**')) {
        // Sourcing and editorial notes stay in the map, not in frontmatter.
      } else if (!description) {
        description = body
      }
      i = j
    }

    current.lessons.push({
      slug,
      title: title.trim(),
      order: current.lessons.length + 1,
      duration: Number(duration),
      tracks: { newcomer: RELEVANCE[n], operator: RELEVANCE[o], architect: RELEVANCE[a] },
      description,
      prerequisites,
    })
  }
}

// Validate before writing anything: a half-generated tree is worse than none.
const problems = []
const allIds = new Set(
  modules.flatMap((m) => m.lessons.map((l) => `hermes/${m.slug}/${l.slug}`)),
)

for (const entry of modules) {
  if (!entry.slug) problems.push(`Module ${entry.order} "${entry.title}" has no path line`)
  if (!entry.summary) problems.push(`Module ${entry.order} "${entry.title}" has no summary`)
  for (const lesson of entry.lessons) {
    if (!lesson.description) problems.push(`${entry.slug}/${lesson.slug} has no description`)
    if (Object.values(lesson.tracks).some((value) => !value)) {
      problems.push(`${entry.slug}/${lesson.slug} has an unreadable track relevance`)
    }
    for (const prerequisite of lesson.prerequisites) {
      if (!allIds.has(prerequisite)) {
        problems.push(`${entry.slug}/${lesson.slug}: prerequisite "${prerequisite}" not in map`)
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`Refusing to write. The map did not parse cleanly:\n  - ${problems.join('\n  - ')}`)
  process.exit(1)
}

const force = process.argv.includes('--force-stubs')
const missingDescriptors = []
let written = 0
let kept = 0

for (const entry of modules) {
  const directory = join(ROOT, entry.slug)
  await mkdir(directory, { recursive: true })

  // _module.yaml is authored by hand: a module descriptor is shop-window prose,
  // and the map's learning-outcome sentences read as boilerplate when stacked ten
  // deep. The script only insists the file exists.
  if (!(await exists(join(directory, '_module.yaml')))) {
    missingDescriptors.push(`${entry.slug} (${entry.title}) — outcome: ${entry.summary}`)
  }

  for (const lesson of entry.lessons) {
    const file = join(directory, `${lesson.slug}.mdx`)

    // Never clobber written prose. A stub is recognisable by its own marker.
    if (await exists(file)) {
      const existing = await readFile(file, 'utf8')
      const isStub = existing.includes('stub:generated')
      if (!isStub || (isStub && !force)) {
        kept++
        continue
      }
    }

    const tracks = Object.entries(lesson.tracks)
      .map(([track, value]) => `  ${track}: ${value}`)
      .join('\n')

    const prerequisites =
      lesson.prerequisites.length === 0
        ? 'prerequisites: []'
        : 'prerequisites:\n' + lesson.prerequisites.map((id) => `  - ${id}`).join('\n')

    await writeFile(
      file,
      `---\n` +
        `title: ${yamlString(lesson.title)}\n` +
        `description: ${yamlBlock(lesson.description)}\n` +
        `order: ${lesson.order}\n` +
        `duration: ${lesson.duration}\n` +
        `tracks:\n${tracks}\n` +
        `${prerequisites}\n` +
        `hermesVersion: ${VERSION}\n` +
        `updated: ${yamlString(TODAY)}\n` +
        `draft: true\n` +
        `---\n\n` +
        // MDX has no HTML comments; the expression form is the only one that parses.
        `{/* stub:generated — structure comes from research/curriculum-map.md */}\n\n` +
        `Not yet written. The map records this lesson's sources and the conflicts it\n` +
        `must present; see \`research/curriculum-map.md\`.\n`,
    )
    written++
  }
}

const lessonCount = modules.reduce((total, m) => total + m.lessons.length, 0)
const minutes = modules.reduce(
  (total, m) => total + m.lessons.reduce((sum, l) => sum + l.duration, 0),
  0,
)

console.log(
  `${modules.length} modules, ${lessonCount} lessons, ${minutes} min total.\n` +
    `${written} stub(s) written, ${kept} existing file(s) left alone.`,
)

if (missingDescriptors.length > 0) {
  console.error(
    `\n${missingDescriptors.length} module(s) need a hand-written _module.yaml:\n  - ` +
      missingDescriptors.join('\n  - '),
  )
  process.exit(1)
}
