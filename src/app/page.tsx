import Link from 'next/link'
import { CorrectionsScene } from '@/components/landing/corrections-scene'
import { coreCountFor, durationFor, guides, lessons, modules } from '@/lib/content'
import { jsonLd, websiteSchema } from '@/lib/schema'
import { TRACKS, TRACK_LABELS, site } from '@/lib/site'

/**
 * The landing page.
 *
 * Built last, deliberately, and arranged around the one thing that distinguishes this
 * guide from the documentation it is about: it checked. So the hero is the signature
 * gesture doing real work — a claim everyone repeats, struck, with what is actually
 * true resolving above it — and the section beneath it is four more of the same,
 * because the corrections *are* the product.
 *
 * No card grid, no metric hero, no eyebrow above every section. Hairlines, real
 * numbers computed from the content rather than written by hand, and every claim on
 * the page traceable to a lesson that carries its source.
 */

/** Corrections the guide makes. Each one is drawn from the lesson that owns it. */
const CORRECTIONS = [
  {
    was: 'The status bar shows a running cost estimate.',
    now: 'There is no cost field. Across three hundred captured status bars it never appeared.',
    where: '/hermes/03-running-a-session/01-the-status-bar-and-the-context-budget/',
  },
  {
    was: 'Dangerous commands trigger an approval prompt.',
    now: 'They trigger an assessment. On a default install, rm -rf on a host path ran with no prompt at all.',
    where: '/hermes/04-tools-and-isolation/04-approvals-in-depth/',
  },
  {
    was: 'The review fires about every ten agent turns.',
    now: 'Every ten tool-calling iterations. One request can advance the counter by five.',
    where: '/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/',
  },
  {
    was: 'Multi-agent orchestration shipped in v0.6.0.',
    now: 'v0.6.0 was Profiles. Orchestration is v0.11.0 through v0.15.0.',
    where: '/hermes/08-more-than-one-agent/01-two-orchestration-models/',
  },
]

export default function HomePage() {
  const guide = guides[0]
  const written = lessons.length
  const moduleCount = modules.filter((entry) => entry.guideSlug === guide?.slug).length

  return (
    <main className="mx-auto max-w-[52rem] px-6 py-[calc(var(--step)*4)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />

      <p className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-dim uppercase">
        {site.name} · {guide?.subject} · verified against {guide?.verifiedAgainst}
      </p>

      {/* The signature gesture, and deliberately without the character-resolve that
          `Revised` performs inside lessons. This is the largest text on the site and
          the LCP element; an animation that scrambles it is one throttled animation
          clock away from rendering the argument as gibberish. The strike is the half
          of the gesture that is pure CSS and cannot fail. */}
      <h1 className="mt-[calc(var(--step)*2)]">
        <del className="struck block text-[clamp(1.4rem,4vw,2.4rem)] leading-[1.15] tracking-[-0.02em]">
          Hermes has a three-layer memory system.
        </del>
        <ins className="font-display mt-[calc(var(--step)*0.5)] block text-[clamp(1.8rem,5.4vw,3.3rem)] leading-[1.05] tracking-[-0.025em] no-underline">
          It has two capped files and an index.
        </ins>
      </h1>

      <p className="mt-[calc(var(--step)*1.5)] max-w-[62ch] text-[1.0625rem] leading-[1.75] text-ice-dim">
        That claim is the single most repeated thing written about this software, and it is
        wrong — not simplified, wrong in a way that will make you expect the wrong things.
        This guide is {written} lessons that check every claim of that kind against the
        documentation, the source, and a running install.
      </p>

      <div className="mt-[calc(var(--step)*2)] flex flex-wrap items-baseline gap-x-[calc(var(--step)*1.5)] gap-y-[calc(var(--step)*0.5)]">
        <Link
          href="/begin/"
          className="font-mono text-[0.95rem] underline decoration-[var(--color-signal)] underline-offset-[6px]"
        >
          Find your track
        </Link>
        <Link href={guide?.url ?? '/hermes/'} className="font-mono text-[0.95rem] underline">
          Or read it straight through
        </Link>
      </div>

      {/* Real numbers, computed. A track's commitment is the thing a reader most
          wants and is least often told. */}
      <section className="mt-[calc(var(--step)*4)] border-t border-ice-faint pt-[calc(var(--step)*1.25)]">
        <h2 className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-dim uppercase">
          Three routes through the same material
        </h2>
        <dl className="mt-[calc(var(--step)*1.25)] grid gap-[calc(var(--step)*1.25)] sm:grid-cols-3">
          {TRACKS.map((track) => (
            <div key={track}>
              <dt className="font-display text-[1.35rem] tracking-[-0.01em]">
                {TRACK_LABELS[track]}
              </dt>
              <dd className="mt-[calc(var(--step)*0.35)] text-[0.9rem] leading-[1.7] text-ice-dim">
                {coreCountFor(track)} core lessons ·{' '}
                {Math.round((durationFor(track) / 60) * 10) / 10} hours
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-[calc(var(--step)*1)] max-w-[62ch] text-[0.9rem] leading-[1.75] text-ice-dim">
          The track changes which passages you see, not which pages exist. Everything stays
          reachable, nothing is hidden behind a toggle, and you can switch at any point
          without losing your place.
        </p>
      </section>

      {/* The corrections. This is the product, so it gets the most space. */}
      <section className="mt-[calc(var(--step)*4)] border-t border-ice-faint pt-[calc(var(--step)*1.25)]">
        <h2 className="font-display text-[1.6rem] leading-[1.15] tracking-[-0.015em]">
          Four more the documentation gets wrong
        </h2>
        <p className="mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[0.95rem] leading-[1.75] text-ice-dim">
          Each of these was checked against a v0.19.0 install rather than against another
          article. Where a claim survives, the lesson says so; where it does not, the
          superseded version stays on the page beside its replacement.
        </p>

        <div className="mt-[calc(var(--step)*1.5)]">
          <CorrectionsScene corrections={CORRECTIONS} />
        </div>
      </section>

      {/* What the guide is, stated as constraints rather than as benefits. */}
      <section className="mt-[calc(var(--step)*4)] border-t border-ice-faint pt-[calc(var(--step)*1.25)]">
        <h2 className="font-display text-[1.6rem] leading-[1.15] tracking-[-0.015em]">
          How it was written
        </h2>
        <div className="mt-[calc(var(--step)*1.25)] space-y-[calc(var(--step)*1)] text-[0.95rem] leading-[1.75] text-ice-dim">
          <p className="max-w-[62ch]">
            <strong className="font-normal text-ice">No unsourced claim ships.</strong> Every
            command, config key and behavioural claim traces to a source. Where the sources
            disagree — and they frequently do — the lesson presents the conflict instead of
            quietly picking a side.
          </p>
          <p className="max-w-[62ch]">
            <strong className="font-normal text-ice">
              Two primary captures outrank the documentation.
            </strong>{' '}
            An installed binary and a recorded session, both v0.19.0. They corrected the docs
            on seven points, and every one of those corrections is marked where it appears.
          </p>
          <p className="max-w-[62ch]">
            <strong className="font-normal text-ice">The gaps are stated.</strong> Where
            nothing could be verified, the guide says so rather than reconstructing something
            plausible. A reconstruction is always labelled as one.
          </p>
        </div>
      </section>

      {/* The curriculum. A real table of contents, not a decorative one. */}
      <section className="mt-[calc(var(--step)*4)] border-t border-ice-faint pt-[calc(var(--step)*1.25)]">
        <h2 className="font-display text-[1.6rem] leading-[1.15] tracking-[-0.015em]">
          <Link href={guide?.url ?? '/hermes/'}>{guide?.title}</Link>
        </h2>
        <p className="mt-[calc(var(--step)*0.5)] font-mono text-[0.7rem] text-ice-dim">
          {moduleCount} modules · {written} lessons · {guide?.subject} {guide?.verifiedAgainst}
        </p>

        <ol data-modules className="mt-[calc(var(--step)*1.25)]">
          {modules
            .filter((entry) => entry.guideSlug === guide?.slug)
            .map((entry) => (
              <li
                key={entry.url}
                className="flex items-baseline gap-[calc(var(--step)*0.75)] border-t border-ice-faint py-[calc(var(--step)*0.6)]"
              >
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-dim">
                  {String(entry.number).padStart(2, '0')}
                </span>
                <Link href={entry.url} className="flex-1">
                  {entry.title}
                </Link>
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-dim">
                  {entry.lessons.length}
                </span>
              </li>
            ))}
        </ol>
      </section>
    </main>
  )
}
