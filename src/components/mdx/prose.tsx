import type { ReactNode } from 'react'

/**
 * Typography for lesson prose.
 *
 * An explicit component map rather than a typography plugin, so the vertical
 * rhythm stays a multiple of one step and the display face is used only where it
 * is meant to be. More space above a heading than below it, everywhere.
 */
export const prose = {
  h2: ({ children, ...rest }: { children?: ReactNode; id?: string }) => (
    <h2
      className="font-display mt-[calc(var(--step)*2.2)] mb-[calc(var(--step)*0.7)] text-[1.75rem] leading-[1.15] tracking-[-0.025em]"
      {...rest}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...rest }: { children?: ReactNode; id?: string }) => (
    <h3
      className="font-display mt-[calc(var(--step)*1.6)] mb-[calc(var(--step)*0.45)] text-[1.25rem] leading-[1.25] tracking-[-0.015em]"
      {...rest}
    >
      {children}
    </h3>
  ),

  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-[var(--step)] max-w-[68ch]">{children}</p>
  ),

  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-[var(--step)] max-w-[68ch] list-disc space-y-[calc(var(--step)*0.3)] pl-[var(--step)] marker:text-ice-dim">
      {children}
    </ul>
  ),

  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-[var(--step)] max-w-[68ch] list-decimal space-y-[calc(var(--step)*0.3)] pl-[var(--step)] marker:font-mono marker:text-ice-dim">
      {children}
    </ol>
  ),

  li: ({ children }: { children?: ReactNode }) => <li>{children}</li>,

  /** Inline code. Mono is earned here: it is a literal identifier or path. */
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded-[3px] bg-deep px-[0.34em] py-[0.12em] font-mono text-[0.875em] text-ice">
      {children}
    </code>
  ),

  /**
   * A fenced block that is not a transcript. Transcripts and commands are their
   * own components; this is for file contents and configuration.
   */
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="transcript mb-[var(--step)] overflow-x-auto px-[calc(var(--step)*0.75)] py-[calc(var(--step)*0.6)] text-[0.8125rem] leading-[1.7]">
      {children}
    </pre>
  ),

  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mb-[var(--step)] max-w-[68ch] border-l border-ice-faint pl-[calc(var(--step)*0.75)] text-ice-dim">
      {children}
    </blockquote>
  ),

  a: ({
    children,
    href,
    className,
  }: {
    children?: ReactNode
    href?: string
    className?: string
  }) => {
    // Heading self-links come through here too; they keep their own styling
    // rather than being underlined as display type.
    if (className?.includes('heading-anchor')) {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      )
    }
    return (
      <a
        href={href}
        className="underline decoration-ice-faint transition-colors duration-200 hover:decoration-ice"
      >
        {children}
      </a>
    )
  },

  hr: () => <hr className="my-[calc(var(--step)*2)] border-ice-faint" />,

  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-[var(--step)] overflow-x-auto">
      <table className="w-full border-collapse text-[0.9rem]">{children}</table>
    </div>
  ),

  th: ({ children }: { children?: ReactNode }) => (
    <th className="border-b border-ice-faint px-[calc(var(--step)*0.4)] py-[calc(var(--step)*0.3)] text-left font-mono text-[0.68rem] tracking-[0.08em] text-ice-dim uppercase">
      {children}
    </th>
  ),

  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-b border-ice-faint/40 px-[calc(var(--step)*0.4)] py-[calc(var(--step)*0.35)] align-top">
      {children}
    </td>
  ),
}
