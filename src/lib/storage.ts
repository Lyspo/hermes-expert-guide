/**
 * The only place in the app that touches localStorage. Enforced by lint.
 *
 * Everything the reader accumulates — their track, their progress, their motion
 * preference — lives in one versioned key in their own browser and never leaves
 * it. There is no backend to sync with, which makes the schema's evolution the
 * only migration problem, and this file owns it.
 */
import { TRACKS, type Track } from './site'

const KEY = 'hermes-guide'

/** Bump when the shape changes, and add the matching entry to MIGRATIONS. */
export const CURRENT_VERSION = 1

export interface GuideState {
  v: 1
  track: Track | null
  assessment: {
    answers: Record<string, string>
    completedAt: string | null
  }
  progress: {
    completedLessons: string[]
    lastVisited: string | null
  }
  prefs: {
    motion?: 'system' | 'reduced'
  }
}

/**
 * Validation is hand-written rather than schema-derived, and that is a deliberate
 * trade rather than an omission.
 *
 * This ran on Zod, which cost 64 kB gzipped on every page — half a lesson's entire
 * JavaScript budget — to check one small object read from one key. The properties
 * that matter here are that a corrupt or foreign value never reaches the app and that
 * an unreadable one falls back to a fresh state, and those are cheap to guarantee
 * directly. `storage.test.ts` is what holds this honest; it was written against the
 * schema version and passes unchanged.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isStringMap = (value: unknown): value is Record<string, string> =>
  isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string')

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string'

function parse(value: unknown): GuideState | null {
  if (!isRecord(value)) return null
  if (value['v'] !== 1) return null

  const track = value['track']
  if (track !== null && !TRACKS.includes(track as Track)) return null

  const assessment = value['assessment']
  if (!isRecord(assessment)) return null
  if (!isStringMap(assessment['answers'])) return null
  if (!isNullableString(assessment['completedAt'])) return null

  const progress = value['progress']
  if (!isRecord(progress)) return null
  const completed = progress['completedLessons']
  if (!Array.isArray(completed) || !completed.every((id) => typeof id === 'string')) return null
  if (!isNullableString(progress['lastVisited'])) return null

  const prefs = value['prefs']
  if (!isRecord(prefs)) return null
  const motion = prefs['motion']
  if (motion !== undefined && motion !== 'system' && motion !== 'reduced') return null

  return {
    v: 1,
    track: track as Track | null,
    assessment: {
      answers: assessment['answers'],
      completedAt: assessment['completedAt'],
    },
    progress: { completedLessons: completed, lastVisited: progress['lastVisited'] },
    prefs: motion === undefined ? {} : { motion },
  }
}

export const initialState: GuideState = {
  v: 1,
  track: null,
  assessment: { answers: {}, completedAt: null },
  progress: { completedLessons: [], lastVisited: null },
  prefs: {},
}

/**
 * One entry per version step: MIGRATIONS[n] upgrades a version-n value to
 * version n+1. Applied in sequence before validation, so a reader who last
 * visited three schema versions ago is carried forward rather than reset.
 */
const MIGRATIONS: Record<number, (state: Record<string, unknown>) => Record<string, unknown>> =
  {
    // 1 → 2 goes here when the shape next changes.
  }

/** Exported for tests: the pure part, with no storage or environment involved. */
export function migrate(raw: unknown): GuideState | null {
  if (typeof raw !== 'object' || raw === null) return null

  let state = raw as Record<string, unknown>
  let guard = 0

  while (typeof state.v === 'number' && state.v < CURRENT_VERSION) {
    const step = MIGRATIONS[state.v]
    // A stored version with no migration path is unreadable; a fresh start is
    // better than guessing at its shape.
    if (!step) return null
    state = step(state)
    // Defends against a migration that fails to advance the version.
    if (++guard > 32) return null
  }

  return parse(state)
}

function available(): Storage | null {
  try {
    // Safari's private mode throws on access, not just on write.
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/** Falls back to a fresh state on anything unreadable, corrupt, or unmigratable. */
export function read(): GuideState {
  const store = available()
  if (!store) return initialState

  try {
    const raw = store.getItem(KEY)
    if (!raw) return initialState
    return migrate(JSON.parse(raw) as unknown) ?? initialState
  } catch {
    return initialState
  }
}

/** Silently a no-op when storage is unavailable — never breaks the page. */
export function write(state: GuideState): void {
  const store = available()
  if (!store) return
  try {
    store.setItem(KEY, JSON.stringify(state))
  } catch {
    /* quota exceeded or private mode; the session simply doesn't persist */
  }
}

export function update(fn: (state: GuideState) => GuideState): GuideState {
  const next = fn(read())
  write(next)
  return next
}

export function clear(): void {
  const store = available()
  if (!store) return
  try {
    store.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}

/** Notifies other tabs' listeners; the storage event does not fire in its own tab. */
export function subscribe(fn: (state: GuideState) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (event: StorageEvent) => {
    if (event.key === KEY) fn(read())
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
