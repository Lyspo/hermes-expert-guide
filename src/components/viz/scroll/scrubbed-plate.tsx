'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * A plate whose mechanism advances at the reader's own pace.
 *
 * The static plate states a sequence and asks the reader to assemble it: a counter
 * reaches ten, an answer is delivered, only then does a fork spawn, and only after
 * four walls close does a write land. Read as one frame, that ordering is something
 * you have to reconstruct from arrows. Scrubbed, it is something you perform — you
 * drive the counter to ten yourself, and the fork does not appear until you have.
 * That is the whole reason this exists: the ordering *is* the lesson, and scroll is
 * the only input that lets a reader control an explanation without a play button.
 *
 * GSAP rather than Motion, per the split CLAUDE.md enforces with lint: this is a
 * scroll scene, not a component animation, and it lives in the one directory allowed
 * to import GSAP so the ~45 kB stays out of every content page that has no plate.
 * The import is dynamic on top of that, so even this page only pays for it when a
 * reader with motion enabled actually reaches the figure.
 *
 * Three properties keep it from being a liability:
 *
 *   - The resting state is the finished plate. Server-rendered complete, with no
 *     inline opacity anywhere. Every hidden-until-beat-N state is set by JavaScript
 *     after it has confirmed it can run, so no JavaScript means the whole diagram,
 *     and a failed chunk load means the whole diagram.
 *   - The scroll runway is added by JavaScript too. Without it the figure sits in
 *     normal flow at its natural height, so a reader without the scene does not
 *     scroll through two blank screens to get past a static picture.
 *   - Progress is driven by scroll position, not by a clock. A throttled or frozen
 *     animation clock cannot strand this half-drawn the way a timed reveal can —
 *     the position of the page is the position of the timeline.
 */
export function ScrubbedPlate({
  children,
  beats,
}: {
  children: ReactNode
  /** One label per beat, in order. Named steps, not decoration — they are read. */
  beats: string[]
}) {
  const runway = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const runwayElement = runway.current
    const stageElement = stage.current
    if (!runwayElement || !stageElement) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/DrawSVGPlugin'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

      const groups = beats.map((_, index) =>
        [...stageElement.querySelectorAll(`[data-beat="${index + 1}"]`)].filter(
          (node): node is SVGElement => node instanceof SVGElement,
        ),
      )
      /**
       * The strokes of each beat, so the plate inks itself rather than fading in.
       *
       * A diagram that fades up arrives as an image of a mechanism. A diagram whose
       * rules and arrows draw along their own length arrives as the mechanism being
       * described — the pen is following the same path the reader's eye does, and
       * the direction of the stroke is the direction of the claim. `02-type-motion-
       * motifs.md` specified this and nothing had used it.
       *
       * Text is deliberately excluded: a label that writes itself is a stunt, and it
       * makes a plate unreadable exactly while a reader is trying to read it.
       */
      const strokesFor = (group: SVGElement[]) =>
        group.flatMap((node) => [
          ...(node.matches('line, polyline, path, rect, circle') ? [node] : []),
          ...node.querySelectorAll<SVGElement>('line, polyline, path, rect, circle'),
        ])

      // Only now, once the scene is certain to run, is anything hidden.
      setActive(true)
      for (const group of groups) gsap.set(group, { opacity: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: runwayElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          onUpdate: ({ progress }) => {
            setStep(Math.min(beats.length - 1, Math.floor(progress * beats.length)))
          },
        },
      })

      // Exactly one unit of timeline per beat, placed at an absolute position rather
      // than sequenced. That makes timeline progress and beat index the same number,
      // which is what keeps the named step underneath in step with the drawing —
      // sequencing with overlaps drifts, and a label describing the wrong frame is
      // worse than no label.
      groups.forEach((group, index) => {
        if (group.length === 0) return

        const strokes = strokesFor(group)
        if (strokes.length > 0) {
          gsap.set(strokes, { drawSVG: '0%' })
          timeline.to(
            strokes,
            { drawSVG: '100%', duration: 0.7, ease: 'power2.out', stagger: 0.05 },
            index,
          )
        }

        timeline.to(
          group,
          // The stagger is load-bearing on the first beat: its ten elements are the
          // ten counter ticks, so revealing them in order *is* the counter climbing.
          // Nothing special-cases it — the plate says what it is and this obeys.
          { opacity: 1, duration: 0.85, ease: 'power1.out', stagger: 0.09 },
          index,
        )
      })

      // Hold the last beat on screen instead of ending the moment it draws.
      timeline.set({}, {}, beats.length)

      // `setActive` is a React state update, so the runway's height class is not on
      // the element yet when this runs. ScrollTrigger measured the *collapsed* box,
      // finished the whole sequence inside the first few pixels, and left the rest of
      // the runway as dead scroll — several screens where the page is pinned and
      // nothing whatsoever happens. Refresh once the browser has actually laid the
      // new height out.
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())

      cleanup = () => {
        cancelAnimationFrame(refresh)
        timeline.scrollTrigger?.kill()
        timeline.kill()
        // Leave the plate complete, whatever the scroll position was at unmount.
        for (const group of groups) {
          gsap.set(group, { clearProps: 'opacity' })
          gsap.set(strokesFor(group), { clearProps: 'strokeDasharray,strokeDashoffset' })
        }
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [beats])

  return (
    <div ref={runway} className={active ? 'relative h-[260vh]' : 'relative'}>
      <div
        className={
          active
            ? 'sticky top-0 flex min-h-dvh flex-col justify-center py-[var(--step)]'
            : ''
        }
      >
        <div ref={stage}>{children}</div>

        {/*
          The step labels. Present in the static HTML as an ordered list, because a
          reader without the scene still deserves the sequence in words — and because
          the plate's own description is a paragraph, not a numbered procedure.
        */}
        <ol
          className={
            active
              ? 'mt-[var(--step)] flex flex-wrap gap-x-[calc(var(--step)*0.8)] gap-y-[calc(var(--step)*0.3)] font-mono text-[0.65rem]'
              : 'mt-[calc(var(--step)*0.6)] flex flex-wrap gap-x-[calc(var(--step)*0.8)] gap-y-[calc(var(--step)*0.3)] font-mono text-[0.65rem]'
          }
        >
          {beats.map((label, index) => (
            <li
              key={label}
              aria-current={active && index === step ? 'step' : undefined}
              className={
                active && index !== step
                  ? 'text-ice-dim transition-colors duration-300'
                  : 'text-ice transition-colors duration-300'
              }
            >
              <span className="text-ice-dim">{String(index + 1).padStart(2, '0')} </span>
              {label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
