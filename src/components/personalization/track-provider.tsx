'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  getServerSnapshot,
  getSnapshot,
  mutate,
  subscribe,
} from '@/lib/guide-store'
import { initialState, type GuideState } from '@/lib/storage'
import type { Track } from '@/lib/site'

interface TrackContext {
  state: GuideState
  /** False until the client has read storage. Chrome must reserve space. */
  ready: boolean
  setTrack: (track: Track | null) => void
  completeAssessment: (answers: Record<string, string>, track: Track) => void
  toggleLesson: (id: string) => void
  reset: () => void
}

const Context = createContext<TrackContext | null>(null)

/** Keeps the attribute PrefaceScript set before paint in step with later changes. */
function stamp(track: Track | null) {
  if (typeof document === 'undefined') return
  if (track) document.documentElement.dataset.track = track
  else delete document.documentElement.dataset.track
}

/**
 * Client-side personalization for *chrome* only.
 *
 * Content adapts through CSS against `data-track`, stamped before first paint, so
 * nothing here is required to read a lesson correctly. This provider exists for the
 * parts that genuinely cannot be CSS: progress marks, the track switcher, and
 * "continue where you left off".
 */
export function TrackProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setTrack = useCallback((track: Track | null) => {
    mutate((current) => ({ ...current, track }))
    stamp(track)
  }, [])

  const completeAssessment = useCallback(
    (answers: Record<string, string>, track: Track) => {
      mutate((current) => ({
        ...current,
        track,
        assessment: { answers, completedAt: new Date().toISOString() },
      }))
      stamp(track)
    },
    [],
  )

  const toggleLesson = useCallback((id: string) => {
    mutate((current) => {
      const done = new Set(current.progress.completedLessons)
      if (done.has(id)) done.delete(id)
      else done.add(id)
      return { ...current, progress: { ...current.progress, completedLessons: [...done] } }
    })
  }, [])

  const reset = useCallback(() => {
    mutate(() => initialState)
    stamp(null)
  }, [])

  const value = useMemo(
    () => ({
      state: snapshot.state,
      ready: snapshot.hydrated,
      setTrack,
      completeAssessment,
      toggleLesson,
      reset,
    }),
    [snapshot, setTrack, completeAssessment, toggleLesson, reset],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useGuide(): TrackContext {
  const context = useContext(Context)
  if (!context) throw new Error('useGuide must be used inside TrackProvider')
  return context
}
