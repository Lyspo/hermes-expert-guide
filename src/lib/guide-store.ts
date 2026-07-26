import { advanceStreak } from './mastery'
import { initialState, read, subscribe as subscribeToOtherTabs, update, type GuideState } from './storage'

/**
 * A tiny external store over localStorage, shaped for `useSyncExternalStore`.
 *
 * Reading stored state inside an effect and calling setState is the obvious
 * approach and the wrong one: it renders once with the wrong value, and React 19's
 * lint rules reject it. `useSyncExternalStore` exists for precisely this — an
 * external mutable source with a distinct server snapshot — so the store lives
 * here and the provider becomes a thin wrapper.
 *
 * Snapshots must be referentially stable or the hook re-renders forever, so the
 * current value is cached and only replaced when something actually writes.
 */

export interface Snapshot {
  state: GuideState
  /**
   * False in the server snapshot, true once the client has read storage. Chrome
   * that depends on stored state reserves space while this is false, which is what
   * keeps hydration free of layout shift.
   */
  hydrated: boolean
}

const serverSnapshot: Snapshot = { state: initialState, hydrated: false }

let cache: Snapshot | null = null
const listeners = new Set<() => void>()

function emit() {
  cache = null
  for (const listener of listeners) listener()
}

export function getSnapshot(): Snapshot {
  cache ??= { state: read(), hydrated: true }
  return cache
}

export function getServerSnapshot(): Snapshot {
  return serverSnapshot
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  // Another tab writing the same key must also invalidate our cache.
  const stop = subscribeToOtherTabs(() => emit())
  return () => {
    listeners.delete(listener)
    stop()
  }
}

/** Every mutation goes through here, so nothing can write without notifying. */
export function mutate(fn: (state: GuideState) => GuideState): void {
  update(fn)
  emit()
}

/** Remembers whether the reader keeps the console docked beside the prose. */
export function setConsoleDock(on: boolean): void {
  mutate((state) => ({ ...state, prefs: { ...state.prefs, consoleDock: on } }))
}

/**
 * Records a lesson as mastered, and advances the streak on the same day.
 *
 * Idempotent: mastering a lesson twice neither duplicates the skill nor extends the
 * streak twice, because both are the same day's single act. `today` is passed in rather
 * than read from a clock here so the caller owns the timezone and this stays testable.
 */
export function grantMastery(lessonId: string, today: string): void {
  mutate((state) => {
    if (state.mastery.mastered.includes(lessonId)) return state
    return {
      ...state,
      mastery: {
        mastered: [...state.mastery.mastered, lessonId],
        streak: advanceStreak(state.mastery.streak, today),
      },
    }
  })
}
