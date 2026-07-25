import { readFile, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

/**
 * Performance budgets, measured from the exported site.
 *
 * `design.md` states these as assertions rather than aspirations, so they need to be
 * enforced by something. Lighthouse is the right tool for LCP and CLS, which are
 * runtime measurements; the JavaScript budget is not — it is a property of the files
 * a page references, and reading it off the export is deterministic, fast, and cannot
 * be flaky in CI.
 *
 * Measured gzipped, because that is what a reader actually downloads and what the
 * budget is about. Reporting raw bytes would make the numbers look worse than the
 * experience and would invite the budget being quietly raised to fit them.
 */

const BUDGETS = [
  { name: 'landing', file: 'out/index.html', limitKb: 200 },
  {
    name: 'lesson',
    file: 'out/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/index.html',
    limitKb: 130,
  },
  {
    name: 'lesson with a simulation',
    file: 'out/hermes/03-running-a-session/01-the-status-bar-and-the-context-budget/index.html',
    limitKb: 130,
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

async function measure({ name, file, limitKb }) {
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

  const kb = bytes / 1024
  const verdict = kb <= limitKb ? 'ok' : 'OVER'
  console.log(
    `${verdict.padEnd(4)} ${name.padEnd(26)} ${kb.toFixed(1).padStart(6)} kB gzipped  (budget ${limitKb} kB)`,
  )
  if (missing.length) console.log(`     unresolved: ${missing.join(', ')}`)

  return kb <= limitKb
}

const results = []
for (const budget of BUDGETS) results.push(await measure(budget))

if (results.includes(false)) {
  console.error('\nA page is over its JavaScript budget. Raise the code, not the budget.')
  process.exit(1)
}
