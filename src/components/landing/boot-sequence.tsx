import * as S from '@/lib/term/sources'
import { feedLine, preparingLine } from '@/lib/term/format'

/**
 * The argument, performed rather than described.
 *
 * Six frames from one captured session, in the order they actually happened: a request,
 * a tool call, an answer, then — unprompted, after the answer was already on screen —
 * the agent reviewing itself and writing down a procedure it did not have before. The
 * last frame is the one that matters, and it is the corpus's best find: every pitfall
 * the agent wrote is a mistake it made earlier in that same transcript.
 *
 * A server component. Every string is inlined into the exported HTML at build time, so
 * this whole section costs nothing on the client and is complete without JavaScript —
 * which is also what makes it a safe thing to animate, because its resting state is the
 * finished article rather than a blank waiting to be filled.
 */

interface Step {
  caption: string
  detail: string
  source: string
  lines: string[]
}

const STEPS: Step[] = [
  {
    caption: 'You ask for something',
    detail: 'An ordinary request, typed at an ordinary prompt.',
    source: '[09] §11',
    lines: ['● recursively delete /tmp/hermes-scratch', `  ${S.INITIALIZING}`],
  },
  {
    caption: 'It runs a command',
    detail:
      'Two phases: the call is announced, then replaced by its result. Five seconds for an rm of one small file — that is a model deciding whether to allow it.',
    source: '[09] §5',
    lines: [
      `  ${preparingLine('💻', 'terminal')}`,
      `  ${feedLine('💻', '$', 'rm -rf /tmp/hermes-scratch', 5000)}`,
    ],
  },
  {
    caption: 'It answers',
    detail: 'No approval prompt appeared. On a default install, none does.',
    source: '[09] §11',
    lines: [S.reasoningPanel(), `   ${S.SILENT_DELETE_REPLY.lines[0]}`],
  },
  {
    caption: 'Then it reviews itself',
    detail:
      'Unprompted, after the answer was already on screen. The documentation calls this “Skill patched”. The software says something else.',
    source: '[09] §8',
    lines: [S.skillNotice('github-repo-discovery')],
  },
  {
    caption: 'And writes down what it learned',
    detail:
      'A file it did not have before, in a namespace it chose. Two frontmatter keys — no version, whatever the spec says.',
    source: '[09] §13',
    lines: S.SKILL_FILE.lines.slice(0, 4),
  },
  {
    caption: 'Made of its own mistakes',
    detail:
      'Each of these is a failure from that same session, converted into an instruction for next time. Three failures, three lines, traceable to the frames that produced them. This is what “self-improving” means, once you watch it happen.',
    source: '[09] §13',
    lines: S.SKILL_PITFALLS.lines,
  },
]

export function BootSequence() {
  return (
    <ol data-boot-steps className="mt-[calc(var(--step)*1.5)]">
      {STEPS.map((step, index) => (
        <li
          key={step.caption}
          data-boot-step={index}
          className="grid gap-[calc(var(--step)*0.75)] border-t border-ice-faint py-[calc(var(--step)*1.25)] lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-x-[calc(var(--step)*1.5)]"
        >
          <div>
            <h3
              data-boot-caption
              className="font-display text-[1.25rem] leading-[1.2] tracking-[-0.015em] text-ice-dim"
            >
              <span className="font-mono text-[0.7rem] text-ice-dim">
                {String(index + 1).padStart(2, '0')}{' '}
              </span>
              {step.caption}
            </h3>
            <p className="mt-[calc(var(--step)*0.4)] text-[0.875rem] leading-[1.65] text-ice-dim">
              {step.detail}
            </p>
          </div>

          <div className="transcript min-w-0 p-3">
            {/* Scrollable, therefore focusable. A terminal frame is wider than a phone,
                and a reader who cannot drag must still reach the right-hand side. Third
                time this has come up: any `overflow-*-auto` here needs a tabIndex. */}
            <pre
              tabIndex={0}
              className="overflow-x-auto font-mono text-[0.7rem] leading-[1.7] text-ice"
            >
              {step.lines.join('\n')}
            </pre>
            <p className="mt-2 font-mono text-[0.6rem] tracking-[0.06em] text-ice-dim">
              {step.source}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
