import { ConsoleMount } from './console-mount'
import { StaticTranscript } from './static-transcript'

/**
 * The operator's workspace: the lesson on the left, the instrument on the right.
 *
 * This replaces `Page`'s document-with-a-margin for lesson routes, and the reasoning is
 * in `decisions.md` 010. A guide that teaches a terminal tool inside a single reading
 * column asks the reader to hold two windows in their head; a guide shaped like the tool
 * puts the command and the thing it runs on in one view, which is the largest available
 * win in learning UX and the reason `06/05` can show a loop closing rather than describe
 * one.
 *
 * Layout, and the breakpoints are load-bearing rather than tidy:
 *
 * - Below `xl`, one column. The console follows the article at a fixed height, still
 *   fully usable, and the provenance block sits inline where it always did on narrow.
 * - At `xl` and above, two columns. The lesson keeps its 44rem measure — it does not
 *   stretch, because a 90-character line is worse than a short one — and the console
 *   takes the rest, sticky and full-height, so it stays put while the lesson scrolls
 *   past it.
 *
 * The console pane carries the lesson's provenance in its header. That is not a
 * compromise for the lost margin: what a frame was verified against belongs on the
 * instrument showing the frame.
 */
export function Workspace({
  children,
  provenance,
  prompt,
  objectiveId,
  lessonId,
}: {
  children: React.ReactNode
  /** Verified-against, last-checked, duration. Rendered in the console pane's header. */
  provenance: React.ReactNode
  /** Optional opening input, so a lesson can land on the frame it teaches. */
  prompt?: string
  /** A console objective this lesson is mastered by satisfying. */
  objectiveId?: string
  lessonId?: string
}) {
  return (
    <div className="plane mx-auto grid max-w-[104rem] grid-cols-1 gap-x-[calc(var(--step)*1.5)] px-6 py-[calc(var(--step)*3)] xl:grid-cols-[minmax(0,44rem)_minmax(30rem,1fr)] xl:px-[calc(var(--step)*2)]">
      <div className="min-w-0">{children}</div>

      <aside
        className="mt-[calc(var(--step)*2)] min-w-0 xl:mt-0"
        aria-label="Hermes console"
      >
        {/* The height subtracts the site header's 4rem as well as the sticky offset.
            Without the header term the pane runs exactly one header past the fold, which
            puts the status bar — the thing the whole lesson is about — below it. */}
        <div className="xl:sticky xl:top-[calc(var(--step)*1.5)] xl:h-[calc(100vh-4rem-var(--step)*3)]">
          <div className="flex h-[26rem] flex-col xl:h-full">
            <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ice-faint pb-[calc(var(--step)*0.4)]">
              <h2 className="font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase">
                Console
              </h2>
              {provenance}
            </div>

            <div className="mt-[calc(var(--step)*0.5)] min-h-0 flex-1">
              <ConsoleMount
                {...(prompt === undefined ? {} : { prompt })}
                {...(objectiveId === undefined ? {} : { objectiveId })}
                {...(lessonId === undefined ? {} : { lessonId })}
                fallback={<StaticTranscript />}
              />
            </div>

            {/* --ice-faint is 2.85:1 on --void and fails AA at any size. It is a
                hairline colour; text is never set in it. See CLAUDE.md. */}
            <p className="mt-[calc(var(--step)*0.4)] shrink-0 font-mono text-[0.65rem] leading-[1.5] text-ice-dim">
              Simulated, deterministic, and offline. Every frame carries the capture it
              came from; anything never captured is refused rather than invented.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
