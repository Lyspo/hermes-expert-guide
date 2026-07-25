import type { CurriculumModule, Lesson } from './content'
import { site } from './site'

/**
 * JSON-LD builders.
 *
 * Two constraints shape everything here, and both come from `CLAUDE.md`'s tone and
 * legal section rather than from schema.org.
 *
 * This is an unofficial project, so nothing may imply endorsement. The publisher is
 * the author, never Nous Research; Hermes Agent appears only as the subject a course
 * is `about`, which is the nominative use the disclaimer permits. `isAccessibleForFree`
 * is true because it is, and stating it is the honest counterpart to marking the work
 * up as a course at all.
 *
 * And every value here is derived from the same content collection the pages render,
 * so structured data cannot drift from what a reader sees. Hand-written duplicates of
 * page content are how JSON-LD ends up describing a site that no longer exists.
 */

const url = (path: string) => new URL(path, site.url).href

const author = {
  '@type': 'Person',
  name: site.author.name,
  url: site.author.website,
} as const

/** The publisher is a person, deliberately. There is no organisation behind this. */
const publisher = author

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: 'en',
    author,
    publisher,
    // The disclaimer travels with the structured data as well as with the footer,
    // so a consumer that only ever reads the markup still receives it.
    disambiguatingDescription: site.disclaimer,
  }
}

export function courseSchema(guide: {
  title: string
  summary: string
  url: string
  subject: string
  verifiedAgainst: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: guide.title,
    description: guide.summary,
    url: url(guide.url),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author,
    provider: publisher,
    about: { '@type': 'SoftwareApplication', name: guide.subject },
    disambiguatingDescription: site.disclaimer,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT0H',
    },
  }
}

export function lessonSchema(lesson: Lesson, module: CurriculumModule | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.description,
    url: url(lesson.url),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author,
    publisher,
    // ISO 8601 duration. `duration` is stored in minutes.
    timeRequired: `PT${lesson.duration}M`,
    dateModified: lesson.updated,
    learningResourceType: 'Lesson',
    ...(module ? { isPartOf: { '@type': 'Course', name: module.title, url: url(module.url) } } : {}),
    about: { '@type': 'SoftwareApplication', name: 'Hermes Agent' },
    // The version a claim was checked against is the most useful thing this site
    // knows about a lesson, so it is exposed rather than left in the margin.
    version: lesson.hermesVersion,
    disambiguatingDescription: site.disclaimer,
  }
}

/** Renders a block as a `<script>` payload. */
export function jsonLd(schema: object) {
  return { __html: JSON.stringify(schema) }
}
