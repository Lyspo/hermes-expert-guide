'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz-/_.0123456789'

/**
 * Superseded text, kept visible with its replacement resolving above it.
 *
 * The product's central meaning in one component: the agent rewrites its own
 * procedures and the history stays legible.
 *
 * Supersession is drawn as **distance**, not as deletion. The repeated claim is
 * labelled, set back and dimmed; the checked one stands in front of it and resolves
 * character by character. A 2px line-through in `--signal` used to do this job and
 * was removed on 2026-07-27 by the author's decision — it was the only gesture the
 * site owned, it fired in six places including the largest type on the page, and it
 * was the only place any colour appeared. See `design.md`'s amended motion table.
 *
 * It maps exactly onto `<del>` and `<ins>`, which is the tell that the device is
 * honest: screen readers announce the deletion and the insertion, `cite` records
 * why, `datetime` records when. The visual idea and the correct semantics are the
 * same thing.
 *
 * The resting state is the finished text. Reduced motion, a blocked script, or a
 * throttled animation clock all land there — never on a blank line.
 *
 * The resolve is driven by elapsed time rather than by a frame count, and that is
 * load-bearing rather than tidy. Counting frames means a throttled clock — a
 * background tab, a busy machine, a reduced refresh rate — stretches the scramble
 * out indefinitely and strands the line as gibberish, which is the same failure as
 * a blank reveal wearing a different coat. Timing it means the first frame after a
 * stall arrives with a large delta and lands directly on the finished text.
 */

/** design.md's `supersede`: ~1.2s for the checked line to resolve. */
const RESOLVE_MS = 1200
export function Revised({
  was,
  now,
  why,
  when,
}: {
  was: string
  now: string
  why?: string | undefined
  when?: string | undefined
}) {
  const [shown, setShown] = useState(now)
  const node = useRef<HTMLModElement>(null)

  useEffect(() => {
    const element = node.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let begun = 0
    let raf = 0
    let started = false

    const step = (timestamp: number) => {
      if (!begun) begun = timestamp
      const progress = Math.min(1, (timestamp - begun) / RESOLVE_MS)
      if (progress >= 1) {
        setShown(now)
        return
      }
      const settled = Math.floor(progress * now.length)
      let out = ''
      for (let i = 0; i < now.length; i++) {
        const character = now[i]!
        out +=
          i < settled || character === ' '
            ? character
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setShown(out)
      raf = requestAnimationFrame(step)
    }

    // Resolve once, when the reader actually reaches it.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue
          started = true
          begun = 0
          raf = requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(element)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [now])

  return (
    <div className="correction my-[calc(var(--step)*1.4)]">
      {/*
        No "Widely repeated" / "Checked" labels. They were added when the strike came
        out and removed the same day: two fixed words, rendered twenty-five times
        across the site, are a worse repetition than the line they replaced, because a
        reader reads a word and only sees a rule. They were also scaffolding — the
        component explaining its own device instead of letting the device work.

        What tells the reader which line is which is size and order, and then the
        specific provenance underneath. "Checked against the memory documentation and
        a running v0.19.0 · 2026-07-25" says what a generic chip cannot: what it was
        checked against, and when.
      */}
      <del
        className="superseded block text-[0.9375rem] leading-[1.6]"
        {...(when ? { dateTime: when } : {})}
      >
        {was}
      </del>

      <ins
        ref={node}
        className="mt-[calc(var(--step)*0.35)] block text-[1.0625rem] leading-[1.65] no-underline"
        {...(when ? { dateTime: when } : {})}
      >
        {shown}
      </ins>

      {why && (
        <p className="mt-[calc(var(--step)*0.5)] font-mono text-[0.7rem] leading-relaxed text-ice-dim">
          {why}
          {when && ` · ${when}`}
        </p>
      )}
    </div>
  )
}

/**
 * A note in the margin.
 *
 * In the real margin column above 1024px; in the flow directly beside its
 * referent below that. A margin note with nowhere to go belongs next to the
 * sentence it is about, not behind a toggle.
 */
export function MarginNote({ children }: { children: ReactNode }) {
  return (
    <aside className="my-[calc(var(--step)*0.75)] border-l border-ice-faint pl-[calc(var(--step)*0.6)] text-[0.85rem] leading-relaxed text-ice-dim lg:float-right lg:clear-right lg:-mr-[18.5rem] lg:my-0 lg:w-[16rem]">
      {children}
    </aside>
  )
}
