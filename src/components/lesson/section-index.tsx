'use client'

import { useEffect, useState } from 'react'

/**
 * The lesson's own sections, in the margin, with the one you are reading marked.
 *
 * Two things at once, which is why it earns the space the margin was wasting: it
 * is a second route through the document — every heading is a real anchor, present
 * in the HTML and usable with no JavaScript — and it is the only thing on the page
 * that answers "how far in am I, and how much is left." A lesson is read in ten to
 * thirty minutes, often interrupted; knowing where you are in it is not decoration.
 *
 * The active mark is the enhancement. Without JavaScript this is a plain ordered
 * list of links to the sections below, which is complete and useful on its own.
 *
 * Tracked with an IntersectionObserver against a band near the top of the viewport
 * rather than by measuring scroll offsets: the heading that most recently crossed
 * into the reading zone is the section you are in, and that stays true through
 * anchor jumps, zoom, and a reflow at any width.
 */
export function SectionIndex({
  headings,
}: {
  headings: ReadonlyArray<{ text: string; slug: string }>
}) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const targets = headings
      .map(({ slug }) => document.getElementById(slug))
      .filter((node): node is HTMLElement => node !== null)
    if (targets.length === 0) return

    // Seen headings, in document order, so the active one is the last that has
    // passed the reading line rather than whichever fired most recently.
    const passed = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.boundingClientRect.top < 0 || entry.isIntersecting) {
            passed.add(entry.target.id)
          } else {
            passed.delete(entry.target.id)
          }
        }
        const current = headings.filter(({ slug }) => passed.has(slug)).at(-1)
        setActive(current?.slug ?? null)
      },
      // A band from the top of the viewport down to a third of it: a heading is
      // "current" from the moment it reaches the top area until the next one does.
      { rootMargin: '0px 0px -67% 0px', threshold: 0 },
    )

    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Sections in this lesson">
      <p className="font-mono text-[0.7rem] text-ice-dim">In this lesson</p>
      <ol className="mt-[calc(var(--step)*0.4)]">
        {headings.map(({ text, slug }, index) => {
          const current = slug === active
          return (
            <li key={slug} className="flex gap-[calc(var(--step)*0.4)]">
              {/* A hairline that thickens to the signal on the current section.
                  The rule is the indicator, so nothing new is introduced to carry
                  it — no dot, no ring, no bar chart of a reading position. */}
              <span
                aria-hidden="true"
                className={`mt-[0.6em] h-px w-[calc(var(--step)*0.5)] shrink-0 transition-colors duration-300 ${
                  current ? 'bg-signal' : 'bg-ice-faint'
                }`}
              />
              <a
                href={`#${slug}`}
                aria-current={current ? 'true' : undefined}
                // Padded to clear WCAG 2.2's 24px minimum target. It was 0.15rem, which
                // made a rail of links about seventeen pixels tall — fine with a mouse
                // and genuinely awkward with a thumb, on a site whose own product notes
                // call phone readers a meaningful minority.
                className={`block py-[0.3rem] text-[0.8125rem] leading-snug no-underline transition-colors duration-300 ${
                  current ? 'text-ice' : 'text-ice-dim hover:text-ice'
                }`}
              >
                <span className="font-mono text-[0.65rem] text-ice-dim">
                  {String(index + 1).padStart(2, '0')}{' '}
                </span>
                {text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
