import Link from 'next/link'
import { TrackChip } from './track-chip'
import { site } from '@/lib/site'

/**
 * The site's only persistent chrome.
 *
 * Deliberately one line and under 64px: the plan's own budget forbids the tall
 * agency header that eats a fifth of a reader's viewport. The platform name
 * stays quiet so each guide's own title can carry the page.
 */
export function SiteHeader() {
  return (
    <header className="vt-header plane border-b border-ice-faint">
      <nav
        aria-label="Site"
        className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 px-6 lg:px-[calc(var(--step)*3)]"
      >
        <div className="flex items-baseline gap-5">
          <Link
            href="/"
            className="font-display text-[1.0625rem] tracking-[-0.02em] no-underline"
          >
            {site.name}
          </Link>
          <Link
            href="/hermes/"
            className="font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice"
          >
            The Hermes Guide
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/cheatsheets/"
            className="hidden font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice md:inline"
          >
            Sheets
          </Link>
          <Link
            href="/glossary/"
            className="hidden font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice sm:inline"
          >
            Glossary
          </Link>
          <Link
            href="/search/"
            className="font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice"
          >
            Search
          </Link>
          <Link
            href="/about/"
            className="hidden font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice sm:inline"
          >
            About
          </Link>
          <TrackChip />
        </div>
      </nav>
    </header>
  )
}
