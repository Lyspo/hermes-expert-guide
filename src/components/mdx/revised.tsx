'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz-/_.0123456789'

/**
 * Superseded text, kept visible with its replacement resolving above it.
 *
 * This is the site's signature gesture and the product's central meaning in one
 * component: the agent rewrites its own procedures and the history stays legible.
 * The replacement resolves character by character, which is the one motion this
 * design owns — the subject performed rather than described.
 *
 * It maps exactly onto `<del>` and `<ins>`, which is the tell that the device is
 * honest: screen readers announce the deletion and the insertion, `cite` records
 * why, `datetime` records when. The visual idea and the correct semantics are the
 * same thing.
 *
 * The resting state is the finished text. Reduced motion, a blocked script, or a
 * throttled animation clock all land there — never on a blank line.
 */
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

    let frame = 0
    let raf = 0
    let started = false

    const step = () => {
      const settled = Math.floor(frame / 1.7)
      if (settled > now.length) {
        setShown(now)
        return
      }
      let out = ''
      for (let i = 0; i < now.length; i++) {
        const character = now[i]!
        out +=
          i < settled || character === ' '
            ? character
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setShown(out)
      frame++
      raf = requestAnimationFrame(step)
    }

    // Resolve once, when the reader actually reaches it.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue
          started = true
          frame = 0
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
    <div className="my-[calc(var(--step)*1.4)] border-l border-ice-faint pl-[calc(var(--step)*0.75)]">
      <del className="struck block" {...(when ? { dateTime: when } : {})}>
        {was}
      </del>

      <ins
        ref={node}
        className="mt-[calc(var(--step)*0.35)] block no-underline"
        {...(when ? { dateTime: when } : {})}
      >
        {shown}
      </ins>

      {why && (
        <p className="mt-[calc(var(--step)*0.4)] font-mono text-[0.7rem] leading-relaxed text-ice-dim">
          <span className="text-signal" aria-hidden="true">
            &#8627;{' '}
          </span>
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
