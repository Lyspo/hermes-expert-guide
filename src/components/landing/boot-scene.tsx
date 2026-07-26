'use client'

import { useEffect, useRef } from 'react'

/**
 * The scroll scene, layered over content that is already finished.
 *
 * This is the one place in the project GSAP is allowed, and it earns the exception by
 * doing something Motion is bad at: scrubbing a timeline against scroll position across
 * a whole section. It is imported *inside the effect*, so it is not in any bundle until
 * this component mounts — the landing page's initial JavaScript is unchanged by its
 * existence.
 *
 * **What it animates, and what it refuses to.** The captions brighten as their step
 * becomes the one you are reading, and each step's frame lifts a few pixels. That is
 * all. Nothing fades in from zero, nothing is gated on an animation completing, and no
 * element starts hidden — because the resting state of this scene is the finished
 * sequence, fully legible, which is exactly what a reader gets with no JavaScript, with
 * reduced motion, or with an animation clock that has been throttled to a stop.
 *
 * That constraint is not caution for its own sake. This project has shipped the opposite
 * bug four times: a status board that rendered permanently blank, a headline that stayed
 * scrambled for tens of seconds, twice more besides. The rule earned itself.
 */
export function BootScene({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = root.current
    if (!host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const steps = Array.from(host.querySelectorAll<HTMLElement>('[data-boot-step]'))
      const context = gsap.context(() => {
        for (const step of steps) {
          const caption = step.querySelector<HTMLElement>('[data-boot-caption]')
          const frame = step.querySelector<HTMLElement>('.transcript')

          // Brightening a caption from its resting colour to full. The `from` value is
          // the colour it already has in the stylesheet, so a scene that never runs
          // leaves it exactly where CSS put it.
          if (caption) {
            gsap.fromTo(
              caption,
              { color: 'var(--color-ice-dim)' },
              {
                color: 'var(--color-ice)',
                ease: 'none',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 78%',
                  end: 'top 42%',
                  scrub: true,
                },
              }
            )
          }

          // Transform only, and only a few pixels. `y` returns to 0, which is where the
          // element sits with no scene at all.
          if (frame) {
            gsap.fromTo(
              frame,
              { y: 14 },
              {
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 88%',
                  end: 'top 55%',
                  scrub: true,
                },
              }
            )
          }
        }
      }, host)

      cleanup = () => context.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
