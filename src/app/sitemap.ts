import type { MetadataRoute } from 'next'
import { guides, lessons, modules } from '@/lib/content'
import { site } from '@/lib/site'

/**
 * The sitemap, generated from the content rather than maintained by hand.
 *
 * Under `output: 'export'` this is a build-time metadata route: Next writes
 * `out/sitemap.xml` once and nothing regenerates it at runtime. That is the
 * correct shape for this site, whose entire content set is known at build time.
 *
 * Only written lessons appear. A stub has no page, so listing it would be
 * advertising a 404 — the same rule `generateStaticParams` and the prerequisite
 * links already follow.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).href

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/begin/'), changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/about/'), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: url(guide.url),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const modulePages: MetadataRoute.Sitemap = modules.map((entry) => ({
    url: url(entry.url),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // `updated` is the date the lesson was last checked against a release, which is
  // exactly what lastModified should mean for material whose value is its currency.
  const lessonPages: MetadataRoute.Sitemap = lessons.map((lesson) => ({
    url: url(lesson.url),
    lastModified: new Date(lesson.updated),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...guidePages, ...modulePages, ...lessonPages]
}
