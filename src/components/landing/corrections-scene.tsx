'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/**
 * The guide's thesis, performed once per claim, at the reader's own pace.
 *
 * This is the landing page's scroll narrative — named in the plan, and until now
 * unbuilt. The choice it makes is to narrate *content* rather than to decorate: the
 * four claims are the ones the research actually contradicts, and descending through
 * the scene strikes them one at a time and resolves what is true in their place. A
 * visitor who scrolls this has watched the product's method four times before
 * reading a word about it.
 *
 * The strike is drawn rather than styled. `text-decoration` cannot be animated, so
 * the static state uses the `.struck` rule and the scene swaps it for a bar with a
 * left origin that scales across the line — the same 2px signal stroke, arriving
 * instead of being present. Nothing else earns motion here: the replacement resolves
 * in opacity only, and the largest type on the page is never animated at all, which
 * is a rule this project learned the hard way.
 *
 * Degrades to what it already was. With no JavaScript, no runway is added and no
 * item is hidden: the section is the plain list of four corrections, each struck and
 * replaced, complete in the HTML. The scene is a way of reading it, not the only one.
 */
export interface Correction {
  was: string
  now: string
  where: string
}

export function CorrectionsScene({ corrections }: { corrections: readonly Correction[] }) {
  const runway = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const runwayElement = runway.current
    const stackElement = stack.current
    if (!runwayElement || !stackElement) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Stacking four full-height items and scrubbing them is a desktop gesture; on a
    // phone it costs four screens of scroll to read four sentences. The list is the
    // better reading there, and it is already correct.
    if (!window.matchMedia('(min-width: 64rem)').matches) return

    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const items = [...stackElement.querySelectorAll<HTMLElement>('[data-correction]')]
      const strikes = items.map((item) => item.querySelector<HTMLElement>('[data-strike]'))
      const replacements = items.map((item) => item.querySelector<HTMLElement>('[data-now]'))
      if (items.length === 0) return

      setActive(true)

      gsap.set(items, { opacity: 0 })
      gsap.set(items[0]!, { opacity: 1 })
      gsap.set(strikes, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(replacements, { opacity: 0.16 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: runwayElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: ({ progress }) => {
            setStep(Math.min(items.length - 1, Math.floor(progress * items.length)))
          },
        },
      })

      // One unit of timeline per claim, placed absolutely, so scroll position and
      // claim index are the same number and the counter can never disagree with the
      // page. Within a unit: the strike draws, then the correction resolves.
      items.forEach((item, index) => {
        timeline
          .to(strikes[index]!, { scaleX: 1, duration: 0.32, ease: 'power2.inOut' }, index)
          .to(replacements[index]!, { opacity: 1, duration: 0.34, ease: 'power1.out' }, index + 0.3)

        const following = items[index + 1]
        if (following) {
          timeline
            .to(item, { opacity: 0, duration: 0.26, ease: 'power1.in' }, index + 0.74)
            .to(following, { opacity: 1, duration: 0.26, ease: 'power1.out' }, index + 0.74)
        }
      })

      timeline.set({}, {}, items.length)

      cleanup = () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
        // Whatever the scroll position was, leave every claim struck and replaced.
        gsap.set(items, { clearProps: 'opacity' })
        gsap.set(strikes.filter(Boolean), { clearProps: 'transform' })
        gsap.set(replacements.filter(Boolean), { clearProps: 'opacity' })
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [corrections])

  return (
    <div ref={runway} className={active ? 'relative h-[420vh]' : ''}>
      <div
        className={
          active ? 'sticky top-0 flex min-h-dvh flex-col justify-center' : ''
        }
      >
        {active && (
          <p
            aria-hidden="true"
            className="mb-[var(--step)] font-mono text-[0.7rem] text-ice-dim"
          >
            {String(step + 1).padStart(2, '0')} / {String(corrections.length).padStart(2, '0')}
          </p>
        )}

        <ol ref={stack} data-corrections className={active ? 'relative min-h-[20rem]' : ''}>
          {corrections.map((correction) => (
            <li
              key={correction.was}
              data-correction
              className={
                active
                  ? 'absolute inset-x-0 top-0'
                  : 'border-t border-ice-faint py-[calc(var(--step)*1)] first:border-t-0 first:pt-0'
              }
            >
              {/* `<del>`/`<ins>` in both presentations. The semantics are not a
                  detail of the static fallback — a correction announced as a
                  deletion and an insertion is the same information the strike
                  carries visually, and the scene must not cost a screen reader
                  that. Every claim stays in the accessibility tree while the scene
                  runs, stacked visually but read in order. */}
              <del className="relative inline-block [text-decoration:none]">
                <span
                  className={
                    active
                      ? 'block text-[clamp(1.1rem,2.1vw,1.6rem)] leading-[1.5] text-ice-dim'
                      : 'struck block text-[0.95rem] leading-[1.7]'
                  }
                >
                  {correction.was}
                </span>
                {active && (
                  <span
                    data-strike
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-[2px] w-full bg-signal"
                  />
                )}
              </del>

              <ins
                data-now
                className={
                  active
                    ? 'mt-[calc(var(--step)*0.5)] block font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15] tracking-[-0.025em] text-ice no-underline'
                    : 'mt-[calc(var(--step)*0.3)] block text-[1.0625rem] leading-[1.7] no-underline'
                }
              >
                {correction.now}
              </ins>

              <Link
                href={correction.where}
                className={`inline-block font-mono text-[0.7rem] text-ice-dim underline ${
                  active ? 'mt-[var(--step)]' : 'mt-[calc(var(--step)*0.4)]'
                }`}
              >
                the lesson that carries the source
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
