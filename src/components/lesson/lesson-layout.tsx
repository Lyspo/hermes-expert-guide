'use client'

import { useSyncExternalStore } from 'react'
import { getServerSnapshot, getSnapshot, setConsoleDock, subscribe } from '@/lib/guide-store'

/**
 * The lesson template, and the three-zone question `decisions.md` 010 deferred.
 *
 * The answer is that the console **docks rather than squats**. The margin is used
 * continuously — where am I in this lesson, what comes before it, what was it checked
 * against — and the console occasionally, when a lesson actually asks the reader to
 * drive something. Two surfaces with very different duty cycles should not both hold
 * permanent territory on the widest screen a reader has.
 *
 * So the third zone is earned. A lesson carrying a console objective opens docked,
 * because there the console *is* the lesson. Every other lesson opens with the console
 * below the prose, full width and roomy, and a reader who wants it beside them says so
 * once and is remembered.
 *
 * **The mechanism is grid placement, not DOM movement.** The console is rendered in one
 * place and stays there; docking changes which cell it occupies. Undocked it spans the
 * full width on its own row, docked it takes a third column. That means the toggle is a
 * single attribute write with no remount, so the console keeps its scrollback, its
 * session and any pending approval when a reader changes their mind mid-lesson.
 *
 * The control only exists at `2xl`. Below that there is genuinely not room for
 * 44rem of prose, a 17rem margin and a terminal wide enough to read, and offering a
 * control that produces a bad layout is worse than not offering it.
 */
export function LessonLayout({
  children,
  aside,
  console: consolePane,
  defaultDocked,
}: {
  children: React.ReactNode
  aside: React.ReactNode
  console: React.ReactNode
  /** True when the lesson has a console objective. */
  defaultDocked: boolean
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // An absent preference means "never chose", which is why it is not simply `false`:
  // the lesson's own default gets to win until the reader overrides it.
  const stored = snapshot.state.prefs.consoleDock
  const docked = stored ?? defaultDocked

  return (
    <div
      data-console-dock={docked ? 'on' : 'off'}
      // Width and columns live in globals.css, not here. Tailwind v4 puts utilities in
      // a later cascade layer than `@layer components`, so a `max-w-[84rem]` utility
      // silently beat the docked rule's `max-width` — the third column still appeared,
      // but as an implicit track inside an 84rem box. Owning the whole grid in one place
      // is the fix; splitting it across a utility and a layer is the bug.
      className="lesson-layout plane mx-auto px-6 py-[calc(var(--step)*3)] lg:px-[calc(var(--step)*3)]"
    >
      <div className="min-w-0">{children}</div>

      <div className="hidden lg:block">
        {aside}

        {/* The control lives in the margin, with the other things that say where you
            are and what you can do from here. Hidden until there is room to honour it. */}
        <div className="mt-[var(--step)] hidden border-t border-ice-faint pt-[calc(var(--step)*0.6)] 2xl:block">
          <button
            type="button"
            onClick={() => setConsoleDock(!docked)}
            aria-pressed={docked}
            className="font-mono text-[0.7rem] text-ice-dim underline decoration-ice-faint underline-offset-[3px] transition-colors duration-200 hover:text-ice"
          >
            {docked ? 'Undock the console' : 'Dock the console beside the lesson'}
          </button>
        </div>
      </div>

      <div className="lesson-console-cell min-w-0">{consolePane}</div>
    </div>
  )
}
