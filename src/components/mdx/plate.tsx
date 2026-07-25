import type { ReactNode } from 'react'

/**
 * A terminal transcript, rendered as a dark plate pasted into the light page.
 *
 * This is how the world earns a dark surface: not a theme, but the one element
 * that is genuinely dark in life, tipped in like a photographic plate in a
 * printed book. Everything about it is deliberate — the caption carries
 * provenance (which release the output came from, and whether it is verbatim),
 * because a transcript with no provenance is a claim with no source.
 */
export function Plate({
  label,
  source,
  fidelity,
  children,
}: {
  /** What this is: a command, a session, a file. */
  label?: string | undefined
  /** Where it came from — a docs URL, a release, or "reconstructed". */
  source?: string | undefined
  /**
   * How much of this is literally what Hermes prints. Stated because some of it
   * is reconstructed from documented formats, and pretending otherwise would be
   * the one thing this project cannot afford.
   */
  fidelity?: 'verbatim' | 'reconstructed' | undefined
  children: ReactNode
}) {
  return (
    <figure className="tipped-in my-[calc(var(--quad)*1.5)]">
      <div className="plate overflow-x-auto px-[calc(var(--quad)*0.75)] py-[calc(var(--quad)*0.75)]">
        {label && (
          <p className="font-mono mb-[calc(var(--quad)*0.5)] text-[0.65rem] tracking-[0.08em] uppercase opacity-55">
            {label}
          </p>
        )}
        <div className="font-mono text-[0.8125rem] leading-[1.65] whitespace-pre-wrap">
          {children}
        </div>
      </div>

      {(source ?? fidelity) && (
        <figcaption className="font-mono text-ink-soft mt-[calc(var(--quad)*0.4)] text-[0.65rem]">
          {fidelity === 'reconstructed'
            ? 'Reconstructed from the documented output format'
            : fidelity === 'verbatim'
              ? 'Verbatim output'
              : null}
          {source && fidelity ? ' · ' : null}
          {source}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * A real command the reader is meant to run, carrying the release it was checked
 * against. Separate from prose code spans on purpose: this is a claim about the
 * world, and it is stamped like one.
 */
export function Command({
  children,
  verified,
  note,
}: {
  children: ReactNode
  /** The Hermes release this command was verified against. */
  verified: string
  note?: string | undefined
}) {
  return (
    <div className="my-[calc(var(--quad)*1.25)]">
      <div className="plate flex items-baseline gap-[calc(var(--quad)*0.6)] overflow-x-auto px-[calc(var(--quad)*0.75)] py-[calc(var(--quad)*0.6)]">
        <span className="font-mono shrink-0 text-[0.8125rem] opacity-45" aria-hidden="true">
          $
        </span>
        <code className="font-mono text-[0.8125rem] leading-[1.65]">{children}</code>
      </div>
      <p className="font-mono text-ink-soft mt-[calc(var(--quad)*0.35)] text-[0.65rem]">
        <span className="stamp mr-2 inline-block align-middle not-italic">
          {verified}
        </span>
        {note ?? 'Verified against this release'}
      </p>
    </div>
  )
}
