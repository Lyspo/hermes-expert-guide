import type { ReactNode } from 'react'

/**
 * Terminal output, on the nearer plane.
 *
 * Code is the one content type that is genuinely dark in life, so on a dark
 * ground it needs no special pleading — it simply sits closer, on a flatter
 * surface with a hairline edge. Depth is declared once, by luminance.
 *
 * The caption carries provenance, because a transcript without a source is a
 * claim without one. Fidelity is stated explicitly: some of this is reconstructed
 * from documented output formats, and no recording of a real Hermes session is
 * known to exist, so pretending otherwise is the one thing this project cannot
 * afford.
 */
export function Transcript({
  label,
  source,
  fidelity,
  children,
}: {
  label?: string | undefined
  source?: string | undefined
  fidelity?: 'verbatim' | 'reconstructed' | undefined
  children: ReactNode
}) {
  return (
    <figure className="my-[calc(var(--step)*1.5)]">
      <div className="transcript overflow-x-auto px-[calc(var(--step)*0.75)] py-[calc(var(--step)*0.7)]">
        {label && (
          <p className="mb-[calc(var(--step)*0.5)] font-mono text-[0.65rem] tracking-[0.09em] text-ice-dim uppercase">
            {label}
          </p>
        )}
        <div className="font-mono text-[0.8125rem] leading-[1.7] whitespace-pre-wrap text-ice">
          {children}
        </div>
      </div>

      {(source ?? fidelity) && (
        <figcaption className="mt-[calc(var(--step)*0.4)] font-mono text-[0.65rem] leading-relaxed text-ice-dim">
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
 * A command the reader is meant to run, carrying the release it was checked
 * against. Separate from prose code spans on purpose: this is a claim about the
 * world, so it is labelled like one.
 */
export function Command({
  children,
  verified,
  note,
}: {
  children: ReactNode
  verified: string
  note?: string | undefined
}) {
  return (
    <div className="my-[calc(var(--step)*1.25)]">
      <div className="transcript flex items-baseline gap-[calc(var(--step)*0.6)] overflow-x-auto px-[calc(var(--step)*0.75)] py-[calc(var(--step)*0.6)]">
        <span className="shrink-0 font-mono text-[0.8125rem] text-ice-dim" aria-hidden="true">
          $
        </span>
        <code className="font-mono text-[0.8125rem] leading-[1.7] text-ice">{children}</code>
      </div>
      <p className="mt-[calc(var(--step)*0.35)] font-mono text-[0.65rem] text-ice-dim">
        <span className="text-ice-dim">{verified}</span>
        {' · '}
        {note ?? 'verified against this release'}
      </p>
    </div>
  )
}
