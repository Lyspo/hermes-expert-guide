/**
 * Checks internal links across the exported site.
 *
 * External links are deliberately skipped here: they fail for reasons that have
 * nothing to do with the change under review (rate limits, transient outages,
 * bot walls), and a check that cries wolf gets ignored. They are checked on a
 * schedule instead — which also catches the real risk, which is upstream docs
 * moving after we shipped.
 */
import { LinkChecker } from 'linkinator'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const OUT = 'out'
const PORT = 4319

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidates = clean.endsWith('/')
    ? [join(OUT, clean, 'index.html')]
    : [join(OUT, clean), join(OUT, `${clean}.html`), join(OUT, clean, 'index.html')]

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate
    } catch {
      /* try the next candidate */
    }
  }
  return null
}

const server = createServer(async (req, res) => {
  const file = await resolve(req.url ?? '/')
  if (!file) {
    res.writeHead(404).end('not found')
    return
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  res.end(await readFile(file))
})

await new Promise((resolve) => server.listen(PORT, resolve))

const checker = new LinkChecker()
const broken = []
checker.on('link', (link) => {
  if (link.state === 'BROKEN') broken.push(link)
})

const result = await checker.check({
  path: `http://localhost:${PORT}/`,
  recurse: true,
  linksToSkip: [/^https?:\/\/(?!localhost)/],
})

server.close()

console.log(`Checked ${result.links.length} links.`)

if (broken.length > 0) {
  console.error(`\n${broken.length} broken internal link(s):\n`)
  for (const link of broken) {
    console.error(`  ${link.url}\n    on ${link.parent} (${link.status})`)
  }
  process.exit(1)
}

console.log('No broken internal links.')
