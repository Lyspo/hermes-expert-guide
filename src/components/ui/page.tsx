/**
 * The page shell: the bound record every content page sits inside.
 *
 * Two columns, and the second one matters. The wide column is the text at a
 * 65–75 character measure; the narrow one is a real margin, where annotations,
 * per-track asides, and provenance actually live rather than being crammed into
 * tooltips. Below the margin's breakpoint the notes fall back into the flow,
 * directly under the line they belong to.
 */
export function Page({
  number,
  children,
  aside,
}: {
  /** Printed in the page stamp. Real position in the record, not decoration. */
  number?: number | undefined
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="page-substrate relative">
      <div className="bound-edge" aria-hidden="true" />

      <div className="mx-auto grid max-w-[86rem] grid-cols-1 gap-x-[var(--quad)] px-[calc(var(--quad)*2.5)] py-[calc(var(--quad)*3)] lg:grid-cols-[minmax(0,42rem)_minmax(0,18rem)] lg:px-[calc(var(--quad)*4)]">
        <div className="min-w-0">{children}</div>

        {/* The margin column. Empty on narrow screens by design — its contents
            have already been rendered inline next to their referent. */}
        <div className="hidden lg:block">{aside}</div>
      </div>

      {number !== undefined && (
        <p
          className="font-mono text-ink-soft absolute bottom-[calc(var(--quad)*1.5)] left-0 w-[calc(var(--quad)*2)] text-center text-[0.65rem]"
          aria-hidden="true"
        >
          {String(number).padStart(3, '0')}
        </p>
      )}
    </div>
  )
}
