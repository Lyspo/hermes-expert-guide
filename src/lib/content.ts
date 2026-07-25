import { allLessons } from 'content-collections'
import type { Track } from './site'

export type Lesson = (typeof allLessons)[number]
export type Relevance = 'core' | 'skim' | 'skip'

const published = allLessons.filter((lesson) => !lesson.draft)

function byOrder(a: Lesson, b: Lesson) {
  return a.moduleNumber - b.moduleNumber || a.order - b.order
}

/** Every published lesson in curriculum order. */
export const lessons: Lesson[] = [...published].sort(byOrder)

export interface CurriculumModule {
  slug: string
  number: number
  title: string
  summary: string
  arc?: string | undefined
  lessons: Lesson[]
  url: string
}

export const modules: CurriculumModule[] = (() => {
  const grouped = new Map<string, Lesson[]>()
  for (const lesson of lessons) {
    const existing = grouped.get(lesson.moduleSlug)
    if (existing) existing.push(lesson)
    else grouped.set(lesson.moduleSlug, [lesson])
  }

  return [...grouped.entries()]
    .map(([slug, moduleLessons]) => {
      // Safe: a map entry only exists because at least one lesson created it.
      const first = moduleLessons[0]!
      return {
        slug,
        number: first.moduleNumber,
        title: first.module.title,
        summary: first.module.summary,
        arc: first.module.arc,
        lessons: moduleLessons,
        url: `/learn/${slug}/`,
      }
    })
    .sort((a, b) => a.number - b.number)
})()

export function getModule(slug: string): CurriculumModule | undefined {
  return modules.find((mod) => mod.slug === slug)
}

export function getLesson(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return lessons.find(
    (lesson) => lesson.moduleSlug === moduleSlug && lesson.slug === lessonSlug,
  )
}

export function relevanceFor(lesson: Lesson, track: Track): Relevance {
  return lesson.tracks[track]
}

/**
 * The ordered path a track is asked to follow: its core and skim lessons, with
 * skips left out. Skipped lessons stay reachable — the track is a route through
 * the material, not a wall around it.
 */
export function pathFor(track: Track): Lesson[] {
  return lessons.filter((lesson) => lesson.tracks[track] !== 'skip')
}

/** Honest total reading time, in minutes, for a track's path. */
export function durationFor(track: Track): number {
  return pathFor(track).reduce((total, lesson) => total + lesson.duration, 0)
}

/** Previous and next in flat curriculum order — the reading order, not a track's. */
export function neighbours(lesson: Lesson): {
  previous: Lesson | undefined
  next: Lesson | undefined
} {
  const index = lessons.findIndex((candidate) => candidate.id === lesson.id)
  return { previous: lessons[index - 1], next: lessons[index + 1] }
}

export function prerequisitesOf(lesson: Lesson): Lesson[] {
  return lesson.prerequisites
    .map((id) => lessons.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Lesson => candidate !== undefined)
}
