import { ConsoleMount } from './console-mount'
import { StaticTranscript } from './static-transcript'

/**
 * The console, as a section of the lesson rather than a second column.
 *
 * This replaces an earlier `Workspace` that put the console in the margin at `xl`. The
 * margin turned out to be spoken for, and by better things: a section index that is a
 * real second route through the document, the lesson's position taken from the
 * prerequisite graph rather than a counter, and its provenance. A reader mid-lesson
 * reaches for those far more often than for a terminal.
 *
 * So the console lives in the flow, full width, where it has room to be legible — and
 * the three-zone wide layout stays an open design question instead of being settled by
 * whichever component was written last.
 *
 * It announces itself, because a terminal that appears with no heading reads as
 * decoration; that lesson was learned on the curriculum map and is the same lesson.
 */
export function LessonConsole({
  lessonId,
  objectiveId,
}: {
  lessonId: string
  objectiveId?: string
}) {
  return (
    <section
      aria-labelledby="lesson-console"
      // `h-full` and a flex column so the pane fills the docked cell when there is one
      // and collapses to its own content when there is not. The docked top margin is
      // cleared in globals.css rather than with a nested arbitrary variant here.
      className="lesson-console flex h-full flex-col border-t border-ice-faint pt-[var(--step)] mt-[calc(var(--step)*2.5)]"
    >
      <h2
        id="lesson-console"
        className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase"
      >
        Console
      </h2>
      <p className="mt-[calc(var(--step)*0.4)] max-w-[62ch] text-[0.9rem] leading-[1.7] text-ice-dim">
        A simulated Hermes, deterministic and offline. Every frame carries the capture it
        came from; anything never captured is refused rather than invented.
      </p>

      <div className="mt-[calc(var(--step)*0.75)] min-h-[24rem] flex-1">
        <ConsoleMount
          lessonId={lessonId}
          {...(objectiveId === undefined ? {} : { objectiveId })}
          fallback={<StaticTranscript />}
        />
      </div>
    </section>
  )
}
