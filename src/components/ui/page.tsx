/**
 * The content plane.
 *
 * Sits above the field on its own layer. Two columns above 1024px: the text at a
 * 65–75 character measure, and a real margin for provenance and annotations.
 * Below that breakpoint the margin's contents have already been rendered inline
 * next to what they refer to, so the column simply is not there.
 */
export function Page({
  children,
  aside,
}: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="plane mx-auto grid max-w-[84rem] grid-cols-1 gap-x-[var(--step)] px-6 py-[calc(var(--step)*3)] lg:grid-cols-[minmax(0,44rem)_minmax(0,17rem)] lg:px-[calc(var(--step)*3)]">
      <div className="min-w-0">{children}</div>
      <div className="hidden lg:block">{aside}</div>
    </div>
  )
}
