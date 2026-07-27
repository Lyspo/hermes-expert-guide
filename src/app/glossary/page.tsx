import type { Metadata } from 'next'
import { MDXContent } from '@content-collections/mdx/react'
import { Page } from '@/components/ui/page'
import { mdxComponents } from '@/components/mdx'
import { glossary } from '@/lib/content'

/** First letter, punctuation ignored, so `/learn` files under L. */
const initial = (term: string) => term.replace(/^\W+/, '').charAt(0).toUpperCase()

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'The terms this guide uses precisely, each with the distinction it exists to resolve and a link to where it is taught.',
}

/**
 * The glossary.
 *
 * Its selection rule is the map's and it is worth stating on the page, because a
 * glossary that pads itself stops being consulted: a term earns an entry only if it is
 * load-bearing in a lesson *and* either misused in the wild or easy to confuse with a
 * neighbour. Self-explanatory terms are deliberately absent.
 *
 * Every entry leads with one sentence, then says what it is usually confused with.
 * That second part is the whole value — a definition a reader could have guessed is
 * not worth their scroll.
 *
 * Entirely server-rendered, with an anchor per term so a lesson can link straight at
 * one and so a reader can send someone a definition rather than a page.
 */
export default function GlossaryPage() {
  const letters = [...new Set(glossary.map((entry) => initial(entry.term)))]

  return (
    <Page>
      <main className="max-w-[64rem]">
        <p className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-dim uppercase">
          {glossary.length} terms
        </p>

        <h1 className="font-display mt-[calc(var(--step)*0.75)] text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
          Glossary
        </h1>

        <p className="mt-[calc(var(--step)*1)] max-w-[62ch] text-[1.0625rem] leading-[1.75] text-ice-dim">
          A term earns an entry here if it is load-bearing in a lesson and either misused
          in the wild or easy to confuse with a neighbouring term. Anything obvious from
          its own name is left out — padding a glossary is how it stops being consulted.
        </p>

        {/* An index rather than a filter box: 59 entries need navigating, and a
            jump list works with no script, prints, and can be linked into. */}
        <nav
          aria-label="Jump to a letter"
          className="mt-[calc(var(--step)*1.5)] flex flex-wrap gap-x-[calc(var(--step)*0.6)] gap-y-[calc(var(--step)*0.3)] border-t border-ice-faint pt-[calc(var(--step)*0.75)]"
        >
          {/* A single letter is a tiny tap target, so each gets real padding rather
              than relying on the glyph's own box — WCAG 2.2 asks for 24px. */}
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="inline-flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center font-mono text-[0.8rem]"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/*
          One section per letter, each with its own <dl>.

          This used to be a single <dl> with the letter headings inside it. A <div> in a
          <dl> may hold only <dt> and <dd>, so an <h2> in there is invalid — Lighthouse's
          `definition-list` audit caught it on its first run, and the axe sweep did not
          because that rule is not in the WCAG 2.1 AA tag set the sweep asks for.

          Sectioning is also the better document anyway: a screen reader navigating by
          heading now walks a list of letters, where before the headings were buried
          inside a definition list.
        */}
        {letters.map((letter) => (
          <section key={letter} className="mt-[calc(var(--step)*2)]">
            <h2
              id={`letter-${letter}`}
              className="scroll-mt-[calc(var(--step)*4)] font-mono text-[0.7rem] tracking-[0.12em] text-ice-dim uppercase"
            >
              {letter}
            </h2>

            <dl>
              {glossary
                .filter((entry) => initial(entry.term) === letter)
                .map((entry) => (
                  <div
                    key={entry.slug}
                    id={entry.slug}
                    className="scroll-mt-[calc(var(--step)*4)] border-t border-ice-faint py-[calc(var(--step)*1.25)]"
                  >
                    <dt className="flex flex-wrap items-baseline gap-x-[calc(var(--step)*0.6)]">
                      <span className="font-display text-[1.35rem] tracking-[-0.01em]">
                        {entry.term}
                      </span>
                      {entry.aliases.length > 0 && (
                        <span className="font-mono text-[0.7rem] text-ice-dim">
                          also {entry.aliases.join(', ')}
                        </span>
                      )}
                    </dt>

                    <dd className="mt-[calc(var(--step)*0.5)]">
                      <p className="max-w-[68ch] text-[1.0625rem] leading-[1.7]">
                        {entry.short}
                      </p>
                      <div className="glossary-body mt-[calc(var(--step)*0.5)] max-w-[68ch] text-[0.95rem] leading-[1.75] text-ice-dim">
                        <MDXContent code={entry.mdx} components={mdxComponents} />
                      </div>
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </main>
    </Page>
  )
}
