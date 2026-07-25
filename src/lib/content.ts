import { allGlossaries, allLessons } from 'content-collections'
import type { Track } from './site'

export type Lesson = (typeof allLessons)[number]
export type Relevance = 'core' | 'skim' | 'skip'

function byOrder(a: Lesson, b: Lesson) {
  return a.moduleNumber - b.moduleNumber || a.order - b.order
}

/**
 * Every lesson the curriculum plans, written or not, in reading order.
 *
 * Used for structural views — the guide index, module pages, progress totals —
 * because a reader deciding whether to start deserves to see the real shape
 * rather than only the finished fraction of it.
 */
export const plannedLessons: Lesson[] = [...allLessons].sort(byOrder)

/**
 * Only lessons with real prose. These are what get pages, links, and search
 * entries: an unwritten lesson is announced, never served as a thin page.
 */
export const lessons: Lesson[] = plannedLessons.filter((lesson) => !lesson.draft)

export function isWritten(lesson: Lesson): boolean {
  return !lesson.draft
}

export interface CurriculumModule {
  guideSlug: string
  slug: string
  number: number
  title: string
  summary: string
  outcome?: string | undefined
  arc?: string | undefined
  /** Every planned lesson, in order. Check `isWritten` before linking. */
  lessons: Lesson[]
  written: number
  minutes: number
  url: string
}

export const modules: CurriculumModule[] = (() => {
  const grouped = new Map<string, Lesson[]>()
  for (const lesson of plannedLessons) {
    // Keyed by guide too: two guides may legitimately both have "01-first-contact".
    const key = `${lesson.guideSlug}/${lesson.moduleSlug}`
    const existing = grouped.get(key)
    if (existing) existing.push(lesson)
    else grouped.set(key, [lesson])
  }

  return [...grouped.values()]
    .map((moduleLessons) => {
      // Safe: an entry only exists because at least one lesson created it.
      const first = moduleLessons[0]!
      return {
        guideSlug: first.guideSlug,
        slug: first.moduleSlug,
        number: first.moduleNumber,
        title: first.module.title,
        summary: first.module.summary,
        outcome: first.module.outcome,
        arc: first.module.arc,
        lessons: moduleLessons,
        written: moduleLessons.filter(isWritten).length,
        minutes: moduleLessons.reduce((total, lesson) => total + lesson.duration, 0),
        url: `/${first.guideSlug}/${first.moduleSlug}/`,
      }
    })
    .sort((a, b) => a.number - b.number)
})()

export function getModule(guideSlug: string, moduleSlug: string) {
  return modules.find((mod) => mod.guideSlug === guideSlug && mod.slug === moduleSlug)
}

/** Written lessons only — this backs the routes, so drafts must not resolve. */
export function getLesson(
  guideSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Lesson | undefined {
  return lessons.find(
    (lesson) =>
      lesson.guideSlug === guideSlug &&
      lesson.moduleSlug === moduleSlug &&
      lesson.slug === lessonSlug,
  )
}

export const guides = [
  ...new Map(plannedLessons.map((lesson) => [lesson.guideSlug, lesson.guide])).entries(),
].map(([slug, meta]) => ({ slug, ...meta, url: `/${slug}/` }))

export function relevanceFor(lesson: Lesson, track: Track): Relevance {
  return lesson.tracks[track]
}

/**
 * The ordered path a track is asked to follow: its core and skim lessons, with
 * skips left out. Skipped lessons stay reachable — a track is a route through the
 * material, not a wall around it.
 */
export function pathFor(track: Track): Lesson[] {
  return plannedLessons.filter((lesson) => lesson.tracks[track] !== 'skip')
}

/**
 * The core path: minutes of lessons a track is actually asked to complete.
 *
 * Core only. Skim lessons are deliberately excluded rather than discounted — a
 * reader planning their time wants to know what the commitment is, not a weighted
 * average of it, and skim material is genuinely optional. This is the figure the
 * curriculum map calls "the number that actually matters".
 */
export function durationFor(track: Track): number {
  return plannedLessons.reduce(
    (total, lesson) => (lesson.tracks[track] === 'core' ? total + lesson.duration : total),
    0,
  )
}

/** Everything on a track including skim material, for the completeness-minded. */
export function durationWithSkim(track: Track): number {
  return Math.round(
    plannedLessons.reduce((total, lesson) => {
      const relevance = lesson.tracks[track]
      if (relevance === 'core') return total + lesson.duration
      if (relevance === 'skim') return total + lesson.duration * 0.4
      return total
    }, 0),
  )
}

/** How many lessons a track must read, for stating the commitment plainly. */
export function coreCountFor(track: Track): number {
  return plannedLessons.filter((lesson) => lesson.tracks[track] === 'core').length
}

/** Previous and next among written lessons — you cannot navigate to a stub. */
export function neighbours(lesson: Lesson): {
  previous: Lesson | undefined
  next: Lesson | undefined
} {
  const index = lessons.findIndex((candidate) => candidate.id === lesson.id)
  return { previous: lessons[index - 1], next: lessons[index + 1] }
}

export function prerequisitesOf(lesson: Lesson): Lesson[] {
  return lesson.prerequisites
    .map((id) => plannedLessons.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Lesson => candidate !== undefined)
}

/**
 * Glossary terms, alphabetical, with a leading punctuation-insensitive sort so that
 * `/learn` and `.usage.json` file where a reader would look for them rather than in
 * a clump at the top.
 */
export const glossary = [...allGlossaries].sort((a, b) =>
  a.term.replace(/^\W+/, '').localeCompare(b.term.replace(/^\W+/, ''), 'en', {
    sensitivity: 'base',
  }),
)
