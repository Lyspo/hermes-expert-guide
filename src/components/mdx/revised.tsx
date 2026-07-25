import type { ReactNode } from 'react'

/**
 * Superseded text, kept visible with its replacement above it.
 *
 * This is the world's signature device and the product's central meaning in one
 * component: the agent revises its own procedures, and the history stays legible
 * rather than being quietly overwritten. It is also the device the design
 * research found nobody owns on the web — the only widespread implementations
 * are git and wiki diffs, which are forensic tools rather than something meant
 * to be read as prose.
 *
 * It maps exactly onto `<del>` and `<ins>`, which is a genuine gift: screen
 * readers announce the deletion and the insertion, `cite` records why, and
 * `datetime` records when. The visual device and the correct semantics are the
 * same thing here, which is how you can tell the device is honest.
 */
export function Revised({
  was,
  now,
  why,
  when,
}: {
  /** The superseded version. Struck, never removed. */
  was: ReactNode
  /** What replaced it. */
  now: ReactNode
  /** Why it changed — the margin note a corrector would actually write. */
  why?: string | undefined
  /** ISO date of the revision. */
  when?: string | undefined
}) {
  return (
    <div className="border-rule my-[calc(var(--quad)*1.25)] border-l pl-[calc(var(--quad)*0.75)]">
      <del
        className="text-ink-soft block decoration-[var(--color-annotation)] decoration-[1.5px]"
        {...(when ? { dateTime: when } : {})}
      >
        {was}
      </del>

      <ins className="mt-[calc(var(--quad)*0.35)] block no-underline" {...(when ? { dateTime: when } : {})}>
        {now}
      </ins>

      {why && (
        <p className="font-mono text-ink-soft mt-[calc(var(--quad)*0.4)] text-[0.65rem]">
          <span className="text-[var(--color-annotation)]" aria-hidden="true">
            ↳{' '}
          </span>
          {why}
          {when && ` · ${when}`}
        </p>
      )}
    </div>
  )
}

/**
 * A note in the margin.
 *
 * On wide screens it sits in the page's real margin column, offset to the line
 * it annotates. Below that breakpoint it falls into the flow directly under its
 * referent — which is the honest degradation: a margin note with nowhere to go
 * belongs next to the sentence it is about, not hidden behind a toggle.
 */
export function MarginNote({ children }: { children: ReactNode }) {
  return (
    <aside className="border-rule text-ink-soft my-[calc(var(--quad)*0.75)] border-l pl-[calc(var(--quad)*0.6)] text-[0.8125rem] lg:float-right lg:-mr-[19rem] lg:my-0 lg:w-[17rem] lg:clear-right">
      {children}
    </aside>
  )
}
