import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Indexing is wanted, so this is short on purpose.
 *
 * The one exclusion is `/pagefind/`: the search index is a build artefact whose
 * fragments duplicate every page's text. Letting a crawler index it would put the
 * same prose in the results twice, once as a page and once as a chunk of JSON.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/pagefind/' }],
    sitemap: new URL('/sitemap.xml', site.url).href,
  }
}
