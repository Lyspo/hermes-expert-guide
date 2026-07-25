/**
 * The content plane.
 *
 * Sits above the field on its own layer. With an aside, two columns above 1024px: the
 * text at a 65–75 character measure, and a real margin for provenance and annotations.
 * Below that breakpoint the margin's contents have already been rendered inline next to
 * what they refer to, so the column simply is not there.
 *
 * Without an aside, one column — and that distinction is load-bearing rather than tidy.
 * Reserving the margin unconditionally left the glossary, the cheatsheets and the search
 * results at a 44rem measure with a 17rem void beside them, which is how a reference
 * table ends up cramped on a wide screen for no reason. A page earns the second column
 * by having something to put in it.
 */
export function Page({
  children,
  aside,
}: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div
      className={`plane mx-auto grid max-w-[84rem] grid-cols-1 gap-x-[var(--step)] px-6 py-[calc(var(--step)*3)] lg:px-[calc(var(--step)*3)] ${
        aside ? 'lg:grid-cols-[minmax(0,44rem)_minmax(0,17rem)]' : 'lg:grid-cols-1'
      }`}
    >
      <div className="min-w-0">{children}</div>
      {aside && <div className="hidden lg:block">{aside}</div>}
    </div>
  )
}
