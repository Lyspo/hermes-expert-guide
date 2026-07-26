import { readFile, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

/**
 * JavaScript budgets, measured from the exported site — and measured *relative to the
 * framework floor*, which is the change that makes them mean anything.
 *
 * The old budgets were absolute: 130 kB for a lesson page. That number was never
 * reachable and was never going to be. `/about` and `/cheatsheets` carry no
 * page-specific client code at all and still cost **189.3 kB**, because that is what
 * React 19 plus the Next 16 App Router client runtime plus this site's persistent chrome
 * weighs. The budget was fifty-nine kilobytes below the floor, so it reported failure
 * for work that had nothing to do with the failure, and `pnpm budgets` had to be marked
 * `continue-on-error` in CI to stop it blocking every unrelated change. A gate nobody
 * can pass is a gate nobody reads.
 *
 * So the floor is now measured on every run from a page that has essentially no
 * first-party client code, and every other budget is expressed as an allowance *on top
 * of it*. That makes the number answer the question anyone actually has — "how much
 * JavaScript did we write for this page" — and it self-corrects: if a framework upgrade
 * moves the floor, the allowances stay honest instead of every page silently failing.
 *
 * Lowering the floor is a stack decision, not a code decision. Do not attack it here.
 *
 * Measured gzipped, because that is what a reader downloads. And only *initial* scripts:
 * lazily-imported chunks are fetched later, by name, and are deliberately not counted —
 * see the map's entry for what that does and does not prove.
 */

/** The page the floor is read from: server-rendered, no page-specific client code. */
const FLOOR_PAGE = { name: 'framework floor', file: 'out/about/index.html' }

const BUDGETS = [
  {
    name: 'landing',
    file: 'out/index.html',
    // The boot sequence is a server component and GSAP is imported inside an effect,
    // so the scene contributes nothing here. This allowance is the persistent chrome.
    allowanceKb: 4,
  },
  {
    // The guide index, which carries the curriculum map's canvas. 2D rather than
    // WebGL — the map is a dependency graph, not a field, so it needs no renderer and
    // no graphics dependency at all.
    name: 'guide index (map)',
    file: 'out/hermes/index.html',
    allowanceKb: 4,
  },
  {
    name: 'lesson',
    file: 'out/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/index.html',
    // Track chrome, progress, the mastery gate, and the console's mount point. The
    // console itself, and the whole term/ engine behind it, load on demand.
    allowanceKb: 8,
  },
  {
    name: 'lesson with a simulation',
    file: 'out/hermes/03-running-a-session/01-the-status-bar-and-the-context-budget/index.html',
    allowanceKb: 8,
  },
]

/** Every script the document loads up front. Lazy chunks are fetched later, by name. */
function initialScripts(html) {
  const sources = new Set()
  for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) sources.add(src)
  // Next preloads its initial chunks; those are part of what a first visit pays for.
  for (const [, href] of html.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.js)"/g)) {
    sources.add(href)
  }
  return [...sources].filter((src) => src.startsWith('/'))
}

async function weigh(file) {
  let html
  try {
    html = await readFile(file, 'utf8')
  } catch {
    console.error(`Missing ${file}. Run \`pnpm build\` first.`)
    process.exit(1)
  }

  let bytes = 0
  const missing = []
  for (const src of initialScripts(html)) {
    const path = `out${src}`
    try {
      await stat(path)
      bytes += gzipSync(await readFile(path)).length
    } catch {
      missing.push(src)
    }
  }
  return { kb: bytes / 1024, missing }
}

const floor = await weigh(FLOOR_PAGE.file)
console.log(
  `     ${FLOOR_PAGE.name.padEnd(26)} ${floor.kb.toFixed(1).padStart(6)} kB gzipped  ` +
    `(React + Next runtime and site chrome; not attributable to any page)`
)

const results = []
for (const { name, file, allowanceKb } of BUDGETS) {
  const { kb, missing } = await weigh(file)
  const own = kb - floor.kb
  const verdict = own <= allowanceKb ? 'ok' : 'OVER'
  console.log(
    `${verdict.padEnd(4)} ${name.padEnd(26)} ${kb.toFixed(1).padStart(6)} kB gzipped  ` +
      `(${own >= 0 ? '+' : ''}${own.toFixed(1)} kB first-party, allowance ${allowanceKb} kB)`
  )
  if (missing.length) console.log(`     unresolved: ${missing.join(', ')}`)
  results.push(own <= allowanceKb)
}

if (results.includes(false)) {
  console.error(
    '\nA page is over its first-party JavaScript allowance. Raise the code, not the allowance —' +
      '\nand note that the framework floor above is not the thing to attack here.'
  )
  process.exit(1)
}
