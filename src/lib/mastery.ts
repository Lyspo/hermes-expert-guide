/**
 * The mastery layer, and the reason it does not embarrass anyone.
 *
 * `decisions.md` 010 sets one constraint on this whole system: every game surface must
 * be a real artefact of the software, never a mechanic borrowed from elsewhere. A newcomer
 * still gets unlocks, a level and a streak; an engineer or a risk officer is never winked
 * at, because there is nothing here that is not also true about Hermes.
 *
 * | Mechanic | Rendered as |
 * |---|---|
 * | Level | The agent's version, climbing Hermes's real 22-release ladder |
 * | Mastery unit | A skill file in `~/.hermes/skills/<namespace>/<skill>/` |
 * | Streak | Uptime |
 * | Completion | A generated `SOUL.md` and capability manifest |
 *
 * Pure, so all of it is testable in Node and none of it depends on a clock it does not
 * receive as an argument.
 */

export interface Release {
  version: string
  /** ISO date, from the GitHub Releases API via `research/03-ecosystem.md`. */
  date: string
  /** The release's own name, where it was given one. Not every release has one. */
  name?: string
}

/**
 * All 22 tagged releases, oldest to newest — `[03]` §"Release history".
 *
 * The ladder is the point rather than the decoration: a reader who reaches v0.13.0 has
 * been told, by the act of reaching it, that this is where the Kanban board arrived —
 * which is also the correction the guide leads with, since the popular claim puts
 * multi-agent orchestration in v0.6.0 and v0.6.0 was Profiles.
 *
 * Patch releases are included. Dropping v0.15.1, v0.18.1 and v0.18.2 would make a
 * tidier ladder and a false one.
 */
export const RELEASES: Release[] = [
  { version: 'v0.2.0', date: '2026-03-12' },
  { version: 'v0.3.0', date: '2026-03-17' },
  { version: 'v0.4.0', date: '2026-03-23' },
  { version: 'v0.5.0', date: '2026-03-28' },
  { version: 'v0.6.0', date: '2026-03-30', name: 'the multi-instance release' },
  { version: 'v0.7.0', date: '2026-04-03' },
  { version: 'v0.8.0', date: '2026-04-08' },
  { version: 'v0.9.0', date: '2026-04-13' },
  { version: 'v0.10.0', date: '2026-04-16' },
  { version: 'v0.11.0', date: '2026-04-23' },
  { version: 'v0.12.0', date: '2026-04-30' },
  { version: 'v0.13.0', date: '2026-05-07', name: 'The Tenacity Release' },
  { version: 'v0.14.0', date: '2026-05-16' },
  { version: 'v0.15.0', date: '2026-05-28', name: 'The Velocity Release' },
  { version: 'v0.15.1', date: '2026-05-29', name: 'The Patch Release' },
  { version: 'v0.15.2', date: '2026-05-29' },
  { version: 'v0.16.0', date: '2026-06-05', name: 'The Surface Release' },
  { version: 'v0.17.0', date: '2026-06-19', name: 'The Reach Release' },
  { version: 'v0.18.0', date: '2026-07-01', name: 'The Judgment Release' },
  { version: 'v0.18.1', date: '2026-07-08' },
  { version: 'v0.18.2', date: '2026-07-08' },
  { version: 'v0.19.0', date: '2026-07-20', name: 'The Quicksilver Release' },
]

export interface Rank {
  release: Release
  /** Index into RELEASES. */
  step: number
  /** The next release, or null at the top of the ladder. */
  next: Release | null
  /** How many more mastered lessons reach `next`. Zero when there is no next. */
  toNext: number
}

/**
 * Where a reader's agent currently sits.
 *
 * Zero mastered is v0.2.0, not "no version" — the earliest release visible in the API
 * is where every install starts, and an agent that exists has a version. Everything
 * mastered is v0.19.0, the release the whole guide is verified against.
 */
export function rankFor(mastered: number, total: number): Rank {
  const last = RELEASES.length - 1
  if (total <= 0) return { release: RELEASES[0]!, step: 0, next: RELEASES[1] ?? null, toNext: 0 }

  const clamped = Math.max(0, Math.min(mastered, total))
  const step = Math.min(last, Math.floor((clamped / total) * RELEASES.length))
  const next = step >= last ? null : RELEASES[step + 1]!

  // The count of mastered lessons that would tip the ladder one rung further. Derived
  // from the same formula rather than approximated, so the number a reader is shown is
  // the number that actually advances them.
  let toNext = 0
  if (next) {
    const needed = Math.ceil(((step + 1) * total) / RELEASES.length)
    toNext = Math.max(1, needed - clamped)
  }

  return { release: RELEASES[step]!, step, next, toNext }
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A mastered lesson, as the file the agent would have written for itself.
 *
 * The layout is `[09]` §13's, which is namespaced — `~/.hermes/skills/<namespace>/<skill>/`
 * — and not the un-namespaced path `[02]` §2 publishes. Getting this shape right is the
 * difference between a progress list dressed up as a filesystem and a progress list that
 * teaches the filesystem.
 */
export interface Skill {
  namespace: string
  name: string
  path: string
  lessonId: string
}

export function skillFor(lessonId: string): Skill {
  // Lesson ids are `<guide>/<NN-module>/<NN-lesson>`. The numeric prefixes are ordering
  // metadata, not part of a name, so they are dropped.
  const parts = lessonId.split('/')
  const strip = (value: string) => value.replace(/^\d+-/, '')
  const namespace = strip(parts[1] ?? 'hermes')
  const name = strip(parts[2] ?? parts[parts.length - 1] ?? 'skill')
  return { namespace, name, path: `~/.hermes/skills/${namespace}/${name}/`, lessonId }
}

/** Grouped for display, in the order a `tree` would print them. */
export function skillTree(lessonIds: string[]): { namespace: string; skills: Skill[] }[] {
  const groups = new Map<string, Skill[]>()
  for (const id of [...lessonIds].sort()) {
    const skill = skillFor(id)
    const bucket = groups.get(skill.namespace)
    if (bucket) bucket.push(skill)
    else groups.set(skill.namespace, [skill])
  }
  return [...groups.entries()].map(([namespace, skills]) => ({ namespace, skills }))
}

/* -------------------------------------------------------------------------- */
/* Uptime                                                                      */
/* -------------------------------------------------------------------------- */

export interface Streak {
  /** ISO date (YYYY-MM-DD) of the last day with activity. */
  lastDay: string | null
  days: number
  longest: number
}

export const emptyStreak: Streak = { lastDay: null, days: 0, longest: 0 }

/** Days between two ISO dates, both treated as UTC midnight. */
function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.NaN
  return Math.round((b - a) / 86_400_000)
}

/**
 * Records a day of activity.
 *
 * `today` is an argument rather than a call to `Date.now()` so this is deterministic and
 * so the caller owns the timezone question. The rule is the ordinary one: consecutive
 * days extend, the same day is a no-op, a gap resets to one. A date before the recorded
 * last day is ignored rather than treated as a gap — a clock that went backwards should
 * not cost a reader their streak.
 */
export function advanceStreak(streak: Streak, today: string): Streak {
  if (!streak.lastDay) return { lastDay: today, days: 1, longest: Math.max(1, streak.longest) }

  const gap = daysBetween(streak.lastDay, today)
  if (Number.isNaN(gap) || gap < 0) return streak
  if (gap === 0) return streak

  const days = gap === 1 ? streak.days + 1 : 1
  return { lastDay: today, days, longest: Math.max(days, streak.longest) }
}

/**
 * Whether a streak is still live as of `today`.
 *
 * A stored streak is a record of what happened, not a claim about now: three days
 * recorded a fortnight ago is a broken streak, and showing it as current would be the
 * one dishonest number in the whole system.
 */
export function isLive(streak: Streak, today: string): boolean {
  if (!streak.lastDay) return false
  const gap = daysBetween(streak.lastDay, today)
  return !Number.isNaN(gap) && gap >= 0 && gap <= 1
}

/** ISO day for a Date, in the reader's own timezone rather than UTC. */
export function isoDay(now: Date): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
