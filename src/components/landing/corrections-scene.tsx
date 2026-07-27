'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSceneCapable } from '@/components/ui/use-scene-capable'

/**
 * The guide's thesis, performed once per claim, at the reader's own pace.
 *
 * This is the landing page's scroll narrative — named in the plan, and until now
 * unbuilt. The choice it makes is to narrate *content* rather than to decorate: the
 * four claims are the ones the research actually contradicts, and descending through
 * the scene sets each one back in turn and brings what is true forward in its place. A
 * visitor who scrolls this has watched the product's method four times before
 * reading a word about it.
 *
 * The gesture is recession, not deletion. A 2px line-through in the signal colour used
 * to be drawn across each claim; it was removed on 2026-07-27 by the author's decision,
 * because it was the only motion the site owned and it fired in six places, in the only
 * colour on the site. What supersedes a claim now is distance: it scales back and dims
 * as the checked line comes forward into the space it leaves.
 *
 * Nothing else earns motion here. The replacement arrives in opacity and a hair of
 * scale, and the largest type on the page is never animated at all, which is a rule
 * this project learned the hard way.
 *
 * Degrades to what it already was. With no JavaScript, no runway is added and no
 * item is hidden: the section is the plain list of four corrections, each set back and
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
  const capable = useSceneCapable()
  const [step, setStep] = useState(0)

  /**
   * Deciding to run the scene, and running it, are two separate things.
   *
   * They were one effect, and it was broken in a way no gate could see.
   * `setActive(true)` is a state update, so on the very next line the runway still
   * had its collapsed height and the claim elements — which only exist while the scene
   * is active — had not rendered. Every `[data-was]` query returned null, GSAP
   * threw on the first null target, and the timeline was never built: the section
   * pinned for four screens showing claim one, frozen. The report was "scroll for
   * nothing, page not moving", which described it exactly.
   *
   * Capability is now read from the environment as a subscription, and the GSAP
   * effect runs only once that decision has been rendered — which is the first
   * moment the DOM it needs actually exists.
   */
  useEffect(() => {
    if (!capable) return
    const runwayElement = runway.current
    const stackElement = stack.current
    if (!runwayElement || !stackElement) return

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
      // Non-null now, because this effect only runs after the active render. Filtered
      // anyway: a null target is what GSAP throws on, and one throw here silently
      // costs the whole sequence.
      const claims = items
        .map((item) => item.querySelector<HTMLElement>('[data-was]'))
        .filter((node): node is HTMLElement => node !== null)
      const replacements = items
        .map((item) => item.querySelector<HTMLElement>('[data-now]'))
        .filter((node): node is HTMLElement => node !== null)
      if (items.length === 0 || claims.length !== items.length) return

      gsap.set(items, { opacity: 0 })
      gsap.set(items[0]!, { opacity: 1 })
      // The superseded claim starts forward and full, then recedes as the checked one
      // arrives. Transform and opacity only, and the resting state is the receded one.
      gsap.set(claims, { transformOrigin: 'left center' })
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
      // page. Within a unit: the repeated claim falls back, then what was checked
      // comes forward into the space it left.
      items.forEach((item, index) => {
        timeline
          .to(
            claims[index]!,
            { scale: 0.94, opacity: 0.34, duration: 0.32, ease: 'power2.inOut' },
            index,
          )
          .fromTo(
            replacements[index]!,
            { opacity: 0.16, scale: 0.985 },
            { opacity: 1, scale: 1, duration: 0.34, ease: 'power1.out', transformOrigin: 'left center' },
            index + 0.3,
          )

        const following = items[index + 1]
        if (following) {
          timeline
            // Starts where the replacement finishes rather than after a pause. The
            // gap between them was scroll during which nothing moved, which is the
            // whole complaint a pinned section earns when it earns one.
            .to(item, { opacity: 0, duration: 0.36, ease: 'power1.in' }, index + 0.64)
            .to(following, { opacity: 1, duration: 0.36, ease: 'power1.out' }, index + 0.64)
        }
      })

      timeline.set({}, {}, items.length)

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
        // Whatever the scroll position was, leave every claim superseded and replaced.
        gsap.set(items, { clearProps: 'opacity' })
        gsap.set(claims, { clearProps: 'opacity,transform' })
        gsap.set(replacements, { clearProps: 'opacity,transform' })
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [capable, corrections])

  return (
    <div ref={runway} className={capable ? 'relative h-[210vh]' : ''}>
      <div
        className={
          capable ? 'sticky top-0 flex min-h-dvh flex-col justify-center' : ''
        }
      >
        {capable && (
          <p
            aria-hidden="true"
            className="mb-[var(--step)] font-mono text-[0.7rem] text-ice-dim"
          >
            {String(step + 1).padStart(2, '0')} / {String(corrections.length).padStart(2, '0')}
          </p>
        )}

        <ol ref={stack} data-corrections className={capable ? 'relative min-h-[20rem]' : ''}>
          {corrections.map((correction) => (
            <li
              key={correction.was}
              data-correction
              className={
                capable
                  ? 'absolute inset-x-0 top-0'
                  : 'border-t border-ice-faint py-[calc(var(--step)*1)] first:border-t-0 first:pt-0'
              }
            >
              {/* `<del>`/`<ins>` in both presentations. The semantics are not a
                  detail of the static fallback — a correction announced as a
                  deletion and an insertion is the same information the visual
                  treatment carries, and the scene must not cost a screen reader
                  that. Every claim stays in the accessibility tree while the scene
                  runs, stacked visually but read in order. */}
              <p className="font-mono text-[0.62rem] tracking-[0.12em] text-ice-dim uppercase">
                Widely repeated
              </p>
              <del
                data-was
                className={
                  capable
                    ? 'superseded mt-[calc(var(--step)*0.2)] block text-[clamp(1.1rem,2.1vw,1.6rem)] leading-[1.5]'
                    : 'superseded mt-[calc(var(--step)*0.2)] block text-[0.95rem] leading-[1.7]'
                }
              >
                {correction.was}
              </del>

              <p className="mt-[calc(var(--step)*0.6)] font-mono text-[0.62rem] tracking-[0.12em] text-ice-dim uppercase">
                Checked
              </p>

              <ins
                data-now
                className={
                  capable
                    ? 'mt-[calc(var(--step)*0.2)] block font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15] tracking-[-0.025em] text-ice no-underline'
                    : 'mt-[calc(var(--step)*0.2)] block text-[1.0625rem] leading-[1.7] no-underline'
                }
              >
                {correction.now}
              </ins>

              <Link
                href={correction.where}
                className={`inline-block font-mono text-[0.7rem] text-ice-dim underline ${
                  capable ? 'mt-[var(--step)]' : 'mt-[calc(var(--step)*0.4)]'
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
