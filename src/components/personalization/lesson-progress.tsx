'use client'

import { useGuide } from './track-provider'

/**
 * Marks a lesson read.
 *
 * Occupies a fixed height whether or not stored state has arrived, so the swap
 * from placeholder to control costs no layout shift. The label states what will
 * happen rather than what the state is, and it says plainly where the record
 * lives — a reader who has just been told the site stores nothing server-side
 * deserves to see that claim honoured in the interface.
 */
export function LessonProgress({ id }: { id: string }) {
  const { state, ready, toggleLesson } = useGuide()

  if (!ready) {
    return <div className="h-[1.75rem]" aria-hidden="true" />
  }

  const done = state.progress.completedLessons.includes(id)

  return (
    <button
      type="button"
      onClick={() => toggleLesson(id)}
      aria-pressed={done}
      className="inline-flex h-[1.75rem] cursor-pointer items-center gap-2 bg-transparent font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase transition-colors duration-200 hover:text-ice"
    >
      <span
        aria-hidden="true"
        className={`inline-block size-[9px] border ${
          done ? 'border-ice bg-ice' : 'border-ice-faint'
        }`}
      />
      {done ? 'Read' : 'Mark as read'}
    </button>
  )
}
