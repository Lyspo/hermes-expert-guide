import { plannedLessons } from './content'
import { layout, type CurriculumGraph } from './graph'

/**
 * The laid-out curriculum, computed once at build time.
 *
 * Kept apart from `graph.ts` on purpose. This module touches the content collection,
 * so importing it from a client component would pull every compiled lesson body into
 * the browser bundle. Server components import this and hand the result down as
 * props; client components import only the pure functions and types next door.
 */
export const curriculumGraph: CurriculumGraph = layout(plannedLessons)

/**
 * What a node needs to say for itself when a reader points at it.
 *
 * Parallel to `curriculumGraph.nodes` by index rather than joined by id, because the
 * canvas hit-tests into an array and re-looking-up by string per frame is work for
 * nothing. Deliberately the smallest set of fields that answers "what is this, how
 * long, can I read it yet" — the lesson bodies stay on the server.
 */
export interface MapEntry {
  title: string
  moduleTitle: string
  moduleNumber: number
  duration: number
  url: string
  written: boolean
}

export const curriculumMap: MapEntry[] = plannedLessons.map((lesson) => ({
  title: lesson.title,
  moduleTitle: lesson.module.title,
  moduleNumber: lesson.moduleNumber,
  duration: lesson.duration,
  url: lesson.url,
  written: !lesson.draft,
}))
