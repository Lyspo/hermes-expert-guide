import { access } from 'node:fs/promises'
import * as pagefind from 'pagefind'

/**
 * Builds the Pagefind index over the exported site.
 *
 * It runs against `out/` rather than against the content collection on purpose. The
 * thing a reader searches is the rendered page — including every track variant, which
 * is present in the HTML because track adaptivity is CSS rather than branching. An
 * index built from source MDX would miss the JSX components entirely and would index
 * frontmatter nobody reads.
 *
 * Lesson pages mark their body with `data-pagefind-body`, so navigation, the margin
 * and the footer disclaimer stay out of the index and out of every excerpt.
 *
 * Uses Pagefind's Node API rather than its CLI. Spawning the CLI meant spawning a
 * `.cmd` shim on Windows, which `execFile` refuses with EINVAL unless a shell is
 * involved — and reaching for a shell to run a build step is how a build step becomes
 * platform-specific. The Node API is the same indexer without the process boundary.
 */

const SITE = 'out'

async function main() {
  try {
    await access(SITE)
  } catch {
    console.error(`No ${SITE}/ directory. Run \`pnpm build\` first.`)
    process.exit(1)
  }

  const { index, errors: createErrors } = await pagefind.createIndex({})
  if (createErrors?.length || !index) {
    console.error(createErrors?.join('\n') ?? 'Pagefind could not create an index.')
    process.exit(1)
  }

  const added = await index.addDirectory({ path: SITE })
  if (added.errors.length) {
    console.error(added.errors.join('\n'))
    process.exit(1)
  }

  // A silent zero-page index is the failure worth catching: everything downstream
  // succeeds, and the site ships a search box that never matches anything.
  if (added.page_count < 1) {
    console.error('Pagefind indexed no pages. Check that lesson pages carry data-pagefind-body.')
    process.exit(1)
  }

  const written = await index.writeFiles({ outputPath: `${SITE}/pagefind` })
  if (written.errors.length) {
    console.error(written.errors.join('\n'))
    process.exit(1)
  }

  await pagefind.close()
  console.log(`Search index: ${added.page_count} pages indexed into ${SITE}/pagefind/.`)
}

await main()
