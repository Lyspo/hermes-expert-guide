import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'How this was built',
  description:
    'The colophon: the sourced research every claim traces to, the seven places this guide contradicts the popular summaries, the multi-agent process behind it, and what it still gets wrong.',
}

/**
 * The colophon.
 *
 * `PRODUCT.md` promised this would be "written at the end, once there is a finished
 * process to describe honestly rather than a plan to describe optimistically." The
 * placeholder that stood here said the same thing in the future tense for months.
 *
 * The rule it is written under: every number on this page is one that can be checked
 * against the repository, and the parts that went badly are named rather than smoothed.
 * A colophon for a guide whose entire claim is "we cite our sources" cannot itself be
 * marketing copy.
 */

/** Figures a reader could verify from the repository. */
const CORPUS = [
  { label: 'Lessons', value: '51', note: 'across ten modules' },
  { label: 'Research', value: '7,981 lines', note: 'ten documents, every claim cited' },
  { label: 'Glossary', value: '59 terms', note: 'each carrying a distinction' },
  { label: 'Cheatsheets', value: '9', note: 'load-bearing, not supplementary' },
  { label: 'Replays', value: '5', note: 'each stating its own fidelity' },
  { label: 'Diagrams', value: '6', note: 'drawn from the arrangement, not decorated' },
]

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-[calc(var(--step)*2)] border-t border-ice-faint pt-[calc(var(--step)*0.9)]">
      <h2 className="font-display text-[1.5rem] leading-[1.15] tracking-[-0.015em]">
        {title}
      </h2>
      <div className="mt-[calc(var(--step)*0.6)] space-y-[calc(var(--step)*0.6)] max-w-[68ch]">
        {children}
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.02em]">
        How this was built
      </h1>

      <p className="mt-6 max-w-[68ch] text-lg">
        This guide makes one claim that matters: everything in it traces to a source, and
        where the sources disagree you are shown the disagreement rather than the
        author&rsquo;s pick. That claim is only worth anything if the process behind it is
        inspectable, so here it is, including the parts that did not go well.
      </p>

      <dl className="mt-[calc(var(--step)*1.4)] grid grid-cols-2 gap-x-8 gap-y-[calc(var(--step)*0.7)] sm:grid-cols-3">
        {CORPUS.map((item) => (
          <div key={item.label}>
            <dt className="font-mono text-[0.65rem] tracking-[0.1em] text-ice-dim uppercase">
              {item.label}
            </dt>
            <dd className="font-display mt-1 text-[1.375rem] tracking-[-0.02em]">
              {item.value}
            </dd>
            <dd className="mt-0.5 text-[0.8125rem] text-ice-dim">{item.note}</dd>
          </div>
        ))}
      </dl>

      <Section title="Where the facts come from">
        <p>
          The research came first and the curriculum was derived from it, not the other
          way round. Ten documents in <code className="font-mono text-[0.9em]">research/</code>{' '}
          capture the official documentation surface page by page with URLs, the
          ecosystem, community accounts, and the extension and operations material —
          then two primary sources that outrank all of it: a read-only introspection of
          a real installed v0.19.0 binary, and a captured session from a running install.
        </p>
        <p>
          Repository facts were taken from the GitHub API rather than from search
          summaries: <strong>220,015 stars</strong>, MIT licence, and{' '}
          <strong>22 tagged releases</strong> between v0.2.0 in March 2026 and v0.19.0 in
          July 2026. That release cadence — roughly one every one to two weeks — is the
          constraint the whole architecture is arranged around. Every lesson carries the
          version it was verified against and the date it was last checked, because a
          guide to software moving this fast is going to be wrong eventually and the
          useful question is whether its wrongness is visible and localised.
        </p>
        <p>
          Where a source could not be found, the sentence did not ship. Several
          deliberate gaps remain and are named in the lessons that would have used them
          — a skill-revision diff and the compression badge in situ have never been
          captured, so nothing pretends to show them.
        </p>
      </Section>

      <Section title="Seven places this contradicts what is widely repeated">
        <p>
          The most-repeated claim about Hermes is that it has a{' '}
          <em>three-layer memory system</em>. It does not. It keeps two capped markdown
          files and a searchable index of past sessions, and the caps are measured in
          characters. That claim appears in secondary sources, not in the documentation
          and not in the software.
        </p>
        <p>
          The installed binary and the captured session disagree with the official
          documentation on seven further points, and in each case this guide follows the
          software. The status bar has no cost field. The approval prompt is a numbered
          arrow-key menu, not the letter keys the docs publish. That prompt carries an
          undocumented 300-second countdown which fails closed. Under the default
          approvals mode a model — not you — decides whether a recursive delete needs
          asking about, and on a real install it did not ask. Agent-authored skills live
          at a namespaced path.
        </p>
        <p>
          A separate category, and worth naming because it is the one most likely to
          waste your afternoon: things no documentation ever said, which third-party
          guides publish anyway. There is no{' '}
          <code className="font-mono text-[0.9em]">hermes daemon</code> subcommand in the
          shipped binary. Guides telling you to run{' '}
          <code className="font-mono text-[0.9em]">hermes daemon start</code> are not out
          of date — they are wrong against the software.
        </p>
        <p>
          Each of those is presented in place as a correction with its source and date,
          rather than silently written the right way round. Watching a documented claim
          get struck is the fastest way to learn that documentation is a source and not
          an authority.
        </p>
      </Section>

      <Section title="How it was made">
        <p>
          Written with heavy use of multiple AI agents, working in parallel across more
          than one machine, under a set of conventions checked into the repository. That
          is worth stating plainly rather than hiding: the interesting part is not that
          agents were used but what had to be built around them to make the output
          trustworthy.
        </p>
        <p>
          Mainly, gates. A build fails on a dangling prerequisite or a duplicate lesson
          ordering. Typechecking, linting, unit tests, an accessibility sweep at WCAG 2.1
          AA, a JavaScript budget and a link check all run in CI. The end-to-end suite
          runs against the exported site rather than a development server, including a
          pass with JavaScript disabled that asserts the content is all there.
        </p>
        <p>
          The gates found real problems, which is the point of having them. An
          accessibility check caught a colour being used for text at 2.85:1 — in
          twenty-nine places, and it was the project&rsquo;s own palette misuse rather
          than anything inherited. A geometry test caught a diagram whose labels
          overprinted each other. And the failures that no gate caught are recorded in
          the conventions file so the next session does not rediscover them: an animation
          driven by frame count instead of elapsed time, which left text as scrambled
          gibberish on a throttled clock; a scroll scene that queried DOM it had not yet
          rendered and silently pinned four screens showing nothing.
        </p>
      </Section>

      <Section title="What it does not do">
        <p>
          There is no backend, no database, no accounts and no telemetry. Nothing you do
          here is recorded anywhere but your own browser: the track you pick and the
          lessons you mark as read live in local storage and never leave the machine.
          The site is a static export, which is why it can make that promise cheaply.
        </p>
        <p>
          It also will not run Hermes for you. There is no browser playground and nothing
          asks for an API key. The console you can type into is a deterministic
          reconstruction whose every printable string carries a citation — it refuses to
          invent output it has no source for, and a test enforces that.
        </p>
      </Section>

      <Section title="The visual direction, which is not settled">
        <p>
          The honest state of the design is that it is unresolved. An early exploration
          produced thirteen prototypes across two sessions and converged on none of them;
          they are preserved in the repository rather than deleted, along with a record of
          what each was and why it was rejected.
        </p>
        <p>
          What unblocked it was not more generation. It was showing the author ten real
          sites and recording their specific reaction to each, which surfaced a mistake:
          a rule in this project&rsquo;s own design notes had been read as banning the
          look they wanted. It bans decorative glow and gradient chrome — effects painted
          onto a dark surface — and not luminance that comes out of real geometry and
          real lighting. Those are different things, and thirteen prototypes died on the
          confusion.
        </p>
        <p>
          The direction that came out of that is being built now, and this page will be
          wrong about it soon. That is preferable to a colophon describing a plan.
        </p>
      </Section>

      <Section title="Credits and licence">
        <p>
          Built by{' '}
          <a href={site.author.website} className="underline decoration-[var(--color-rule)]">
            {site.author.name}
          </a>
          {' · '}
          <a href={site.author.github} className="underline decoration-[var(--color-rule)]">
            GitHub
          </a>
          {' · '}
          <a href={site.author.linkedin} className="underline decoration-[var(--color-rule)]">
            LinkedIn
          </a>
          .
        </p>
        <p>
          The code is MIT. The written content is CC BY 4.0 — take it, teach with it,
          credit it. Hermes Agent is{' '}
          <a href={site.upstream.repo} className="underline decoration-[var(--color-rule)]">
            an MIT-licensed project of Nous Research
          </a>
          , and its{' '}
          <a href={site.upstream.docs} className="underline decoration-[var(--color-rule)]">
            documentation
          </a>{' '}
          is the source most of this traces back to.
        </p>
        <p>
          If you find something here that is wrong, it is worth reporting — the whole
          design assumes that will happen. The{' '}
          <Link href="/glossary/" className="underline decoration-[var(--color-rule)]">
            glossary
          </Link>{' '}
          and the{' '}
          <Link href="/cheatsheets/" className="underline decoration-[var(--color-rule)]">
            cheatsheets
          </Link>{' '}
          are the fastest places to check a specific fact.
        </p>
        <p className="text-ice-dim">{site.disclaimer}</p>
      </Section>
    </main>
  )
}
