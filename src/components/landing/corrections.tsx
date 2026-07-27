import Link from 'next/link'
import { RELEASES } from '@/lib/mastery'

/**
 * The corrections, each one holding up its own receipt.
 *
 * This section is the product — the landing page's whole claim is that this guide
 * checked, and these are four places where checking changed the answer. Until now it
 * was a pinned GSAP slideshow: 210vh of scroll that showed **one** claim at a time in
 * an otherwise empty viewport, with the other three at `opacity: 0`, and a `03 / 04`
 * counter that `design.md` lists by name in its refusals. Four sentences, four screens,
 * no evidence, and a reader who scrolled at any speed saw almost none of it.
 *
 * What replaces it is composition rather than sequence. All four are present at once,
 * and each is paired with the material that settles it, in the space to the right of
 * the reading column that was previously empty. That follows the four rules the arrival
 * surface established (`research/design/06-direction-calibration.md`):
 *
 * 1. **Luminance out of the material.** The superseded claim is small and dim, the
 *    checked one is large and lit, the receipt sits on the nearer transcript plane.
 *    Nothing is painted on.
 * 2. **Made of something true.** Every line below is verbatim from `research/`, and
 *    `corrections.test.ts` asserts it — interior whitespace included, because a status
 *    bar with its columns collapsed is no longer a capture of anything.
 * 3. **The reading column is never underneath the rendering.** The prose keeps the
 *    page's left edge and its measure; the evidence extends right, into the void the
 *    52rem column left behind, out to the header's own right edge.
 * 4. **One moment per surface, and it ends.** Arrival has the page's moment. This
 *    section has none at all: no GSAP, no client component, no JavaScript. It is
 *    denser and shorter than the slideshow it replaces, which is the actual fix for
 *    "looks basic" — that verdict was about composition, not about motion.
 *
 * The receipts are deliberately four *different kinds* of proof, and that is the
 * section's second argument: a captured status bar, a captured transcript, the source
 * that implements the behaviour, and the release record. A guide that only ever cites
 * one kind of source has only ever checked one way.
 */

/** What a receipt is made of, and how it wants to be set. */
type Receipt =
  | {
      /** Captured output or source: monospace, interior whitespace preserved. */
      mode: 'pre'
      /**
       * What the documentation prints, where it prints something different. Only the
       * status bar has this, and it is the strongest of the four: the published bar
       * and the observed one differ by a field that simply is not there.
       */
      published?: readonly string[]
      lines: readonly string[]
      source: string
    }
  | {
      /** The release record: prose that wraps, not terminal output pretending to be. */
      mode: 'ladder'
      rows: readonly { version: string; gloss: string }[]
      source: string
    }

export interface Correction {
  was: string
  now: string
  /** The lesson that carries the source. */
  where: string
  receipt: Receipt
}

/**
 * Four corrections and their evidence.
 *
 * Ordered so the first is the one a reader can verify in five seconds by looking at
 * their own terminal, and the last is the one that takes a version history to settle.
 */
export const CORRECTIONS: readonly Correction[] = [
  {
    was: 'The status bar shows a running cost estimate.',
    now: 'There is no cost field. Across three hundred captured status bars it never appeared.',
    where: '/hermes/03-running-a-session/01-the-status-bar-and-the-context-budget/',
    receipt: {
      mode: 'pre',
      published: ['⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░] 6% │ $0.06 │ 15m'],
      lines: [
        '⚕ <model> │ ctx -- │ [░░░░░░░░░░] -- │ 1s │ ⏲ 0s',
        '⚕ <model> │ 21.1K/1M │ [░░░░░░░░░░] 2% │ 42s │ ⏱ 7s',
        '⚕ <model> │ 76.9K/1M │ [█░░░░░░░░░] 7% │ 4m │ ⏲ 3m 52s │ ✓ 0s',
      ],
      source: 'Captured v0.19.0 · the docs promise “n/a” here; the field is absent',
    },
  },
  {
    was: 'Dangerous commands trigger an approval prompt.',
    now: 'They trigger an assessment. On a default install, rm -rf on a host path ran with no prompt at all.',
    where: '/hermes/04-tools-and-isolation/04-approvals-in-depth/',
    receipt: {
      mode: 'pre',
      lines: [
        '  ┊ 💻 preparing terminal…',
        '  ┊ 💻 $         rm -rf /tmp/hermes-scratch  5.0s',
        '   Done. /tmp/hermes-scratch has been deleted.',
      ],
      source: 'Captured under the default approvals.mode: smart · nothing elided',
    },
  },
  {
    was: 'The review fires about every ten agent turns.',
    now: 'Every ten tool-calling iterations. One request can advance the counter by five.',
    where: '/hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork/',
    receipt: {
      mode: 'pre',
      lines: [
        '# Track tool-calling iterations for skill nudge.',
        'if (agent._skill_nudge_interval > 0',
        '        and "skill_manage" in agent.valid_tool_names):',
        '    agent._iters_since_skill += 1',
      ],
      source: 'agent/conversation_loop.py · inside the tool-calling loop, not the turn boundary',
    },
  },
  {
    was: 'Multi-agent orchestration shipped in v0.6.0.',
    now: 'v0.6.0 was Profiles. Orchestration is v0.11.0 through v0.15.0.',
    where: '/hermes/08-more-than-one-agent/01-two-orchestration-models/',
    receipt: {
      mode: 'ladder',
      rows: [
        { version: 'v0.6.0', gloss: 'the multi-instance release' },
        { version: 'v0.11.0', gloss: 'core building block toward multi-agent orchestration' },
        { version: 'v0.13.0', gloss: 'Multi-agent Kanban ships as a durable board' },
        { version: 'v0.15.0', gloss: 'a real multi-agent platform' },
      ],
      source: 'Release notes via the GitHub Releases API · dates from the site’s own ladder',
    },
  },
]

/**
 * The release date for a version, from the one ladder the site already keeps.
 *
 * `RELEASES` is asserted against `[03]` elsewhere, so reading the dates from it rather
 * than retyping them here means this receipt cannot drift from the rest of the site.
 * A version that stops existing fails the build rather than rendering a blank cell.
 */
function dateFor(version: string): string {
  const release = RELEASES.find((entry) => entry.version === version)
  if (!release) throw new Error(`corrections: no release ${version} in the ladder`)
  return release.date
}

function ReceiptBody({ receipt }: { receipt: Receipt }) {
  if (receipt.mode === 'ladder') {
    return (
      <dl className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-[calc(var(--step)*0.6)] gap-y-[calc(var(--step)*0.4)]">
        {receipt.rows.map((row) => (
          <div key={row.version} className="col-span-3 grid grid-cols-subgrid items-baseline">
            <dt className="font-mono text-[0.75rem] text-ice">{row.version}</dt>
            <dd className="font-mono text-[0.7rem] text-ice-dim">{dateFor(row.version)}</dd>
            <dd className="text-[0.8125rem] leading-[1.55] text-ice-dim">{row.gloss}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* The published bar sits above its own hairline, dim and small, and the observed
          ones sit under it lit. The receipt speaks the same grammar as the prose beside
          it — what was believed is further away — so the pair reads without a caption
          explaining which is which. */}
      {receipt.published && (
        <div className="mb-[calc(var(--step)*0.55)] border-b border-ice-faint pb-[calc(var(--step)*0.55)]">
          {receipt.published.map((line) => (
            <pre
              key={line}
              className="superseded font-mono text-[0.7rem] leading-[1.9] whitespace-pre"
            >
              {line}
            </pre>
          ))}
        </div>
      )}
      {receipt.lines.map((line) => (
        <pre key={line} className="font-mono text-[0.7rem] leading-[1.9] whitespace-pre text-ice">
          {line}
        </pre>
      ))}
    </div>
  )
}

export function Corrections({
  corrections,
  titles,
}: {
  corrections: readonly Correction[]
  /** Lesson titles, resolved by the page from the content collection. */
  titles: Readonly<Record<string, string>>
}) {
  return (
    <ol data-corrections>
      {corrections.map((correction) => (
        <li
          key={correction.was}
          className="border-t border-ice-faint py-[calc(var(--step)*1.5)] first:border-t-0 first:pt-0"
        >
          {/* 24rem for the argument, the rest for the evidence. The evidence is the
              wider of the two and that is not an inversion of the hierarchy: the lit
              thing wins over the dim thing regardless of size, which is the first of
              the four rules doing its job instead of a size ramp doing it. */}
          <div className="grid items-start gap-[calc(var(--step)*1.25)] lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-[calc(var(--step)*2)]">
            <div>
              {/* `<del>`/`<ins>` because the semantics are real, not because of the
                  paint: a screen reader announces the supersession and a crawler
                  reads which of the two claims this page endorses. */}
              <del className="superseded block text-[0.95rem] leading-[1.6]">{correction.was}</del>
              <ins className="font-display mt-[calc(var(--step)*0.4)] block text-[clamp(1.2rem,1.75vw,1.5rem)] leading-[1.3] tracking-[-0.02em] no-underline">
                {correction.now}
              </ins>
              <Link
                href={correction.where}
                className="mt-[calc(var(--step)*0.6)] inline-block font-mono text-[0.7rem] text-ice-dim underline"
              >
                {titles[correction.where] ?? 'the lesson that carries the source'}
              </Link>
            </div>

            <figure className="min-w-0">
              {/* Terminal output sits on the nearer plane with a hairline edge, which
                  is `design.md`'s transcript rule. It is a real block of real text,
                  selectable and checkable — never a div-built picture of a terminal.

                  `w-fit` matters more than it looks. Stretched to the column, four of
                  these become four equal rectangles down the right-hand side, which is
                  a card grid — named in the refusals — and reads as chrome. Sized to
                  their contents they are four different pieces of material: a wide
                  status bar, a short tool feed, a block of Python, a ladder. The
                  evidence is as big as the evidence is. */}
              <div className="transcript w-fit max-w-full px-[calc(var(--step)*0.7)] py-[calc(var(--step)*0.6)]">
                <ReceiptBody receipt={correction.receipt} />
              </div>
              {/* Provenance rather than a label. It names what was checked and when,
                  and it differs for every row — which is the test a device has to pass
                  here after a set of identical chips was removed for failing it. */}
              <figcaption className="mt-[calc(var(--step)*0.4)] font-mono text-[0.65rem] leading-[1.6] text-ice-dim">
                {correction.receipt.source}
              </figcaption>
            </figure>
          </div>
        </li>
      ))}
    </ol>
  )
}
