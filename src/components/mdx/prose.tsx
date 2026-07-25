import type { ReactNode } from 'react'

/**
 * Typography for lesson prose.
 *
 * Written as an explicit component map rather than a `prose` utility class,
 * because the vertical rhythm has to be a multiple of the quadrille module —
 * that is what makes the visible ruling proof of alignment rather than
 * decoration. A generic typography plugin would set its own rhythm and quietly
 * break the grid.
 *
 * More space above a heading than below it, everywhere.
 */
export const prose = {
  h2: ({ children, ...rest }: { children?: ReactNode; id?: string }) => (
    <h2
      className="font-display mt-[calc(var(--quad)*2)] mb-[calc(var(--quad)*0.75)] text-[1.625rem] leading-[calc(var(--quad)*1.5)] tracking-[-0.015em]"
      {...rest}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...rest }: { children?: ReactNode; id?: string }) => (
    <h3
      className="font-display mt-[calc(var(--quad)*1.5)] mb-[calc(var(--quad)*0.5)] text-[1.25rem] leading-[var(--quad)]"
      {...rest}
    >
      {children}
    </h3>
  ),

  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-[var(--quad)] max-w-[70ch] leading-[var(--quad)]">
      {children}
    </p>
  ),

  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-[var(--quad)] max-w-[70ch] list-disc space-y-[calc(var(--quad)*0.35)] pl-[var(--quad)]">
      {children}
    </ul>
  ),

  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-[var(--quad)] max-w-[70ch] list-decimal space-y-[calc(var(--quad)*0.35)] pl-[var(--quad)]">
      {children}
    </ol>
  ),

  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-[var(--quad)]">{children}</li>
  ),

  /** Inline code. Mono here is earned: it is a literal identifier or path. */
  code: ({ children }: { children?: ReactNode }) => (
    <code className="font-mono bg-paper-deep rounded-[3px] px-[0.3em] py-[0.1em] text-[0.875em]">
      {children}
    </code>
  ),

  /**
   * A fenced block that is *not* a plate. Plates are for terminal transcripts
   * and real commands; this is for file contents and configuration, which belong
   * on the page as printed matter rather than pasted in as a specimen.
   */
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="border-rule bg-paper-deep mb-[var(--quad)] overflow-x-auto border-l-2 px-[calc(var(--quad)*0.75)] py-[calc(var(--quad)*0.6)] text-[0.8125rem] leading-[1.6]">
      {children}
    </pre>
  ),

  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-rule text-ink-soft mb-[var(--quad)] max-w-[70ch] border-l pl-[calc(var(--quad)*0.75)] italic">
      {children}
    </blockquote>
  ),

  /**
   * Links carry an underline — except the self-links rehype-autolink-headings
   * wraps around headings, which would otherwise be underlined display type. The
   * incoming className is what distinguishes them, so it has to be honoured
   * rather than replaced.
   */
  a: ({ children, href, className }: { children?: ReactNode; href?: string; className?: string }) => {
    const isHeadingAnchor = className?.includes('heading-anchor')
    return (
      <a
        href={href}
        className={
          isHeadingAnchor
            ? className
            : 'underline decoration-[var(--color-rule)] hover:decoration-[var(--color-ink)]'
        }
      >
        {children}
      </a>
    )
  },

  hr: () => <hr className="border-rule my-[calc(var(--quad)*2)]" />,

  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-[var(--quad)] overflow-x-auto">
      <table className="font-ui w-full border-collapse text-[0.875rem]">{children}</table>
    </div>
  ),

  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-rule border-b px-[calc(var(--quad)*0.4)] py-[calc(var(--quad)*0.3)] text-left font-semibold">
      {children}
    </th>
  ),

  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-rule border-b px-[calc(var(--quad)*0.4)] py-[calc(var(--quad)*0.3)] align-top">
      {children}
    </td>
  ),
}
