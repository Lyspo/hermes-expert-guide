import type { Metadata } from 'next'
import Link from 'next/link'
import { Page } from '@/components/ui/page'
import { Search } from '@/components/nav/search'
import { modules } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Full-text search across every written lesson in the Hermes guide.',
  // The index is a build artefact and this page is a shell around it; there is
  // nothing here for a crawler that the curriculum index does not already carry.
  robots: { index: false, follow: true },
}

/**
 * The search page.
 *
 * Server-rendered content beneath the input is not a fallback bolted on afterwards —
 * it is the page with JavaScript blocked. A search box that fails closed to nothing
 * would break the third non-negotiable, so the complete curriculum sits below it.
 */
export default function SearchPage() {
  return (
    <Page>
      <main className="max-w-[62rem]">
        <Search />

        <section className="mt-[calc(var(--step)*3)] border-t border-ice-faint pt-[calc(var(--step)*1.25)]">
          <h2 className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-faint uppercase">
            Or go straight to a module
          </h2>
          <ol className="mt-[calc(var(--step)*1)]">
            {modules.map((entry) => (
              <li
                key={entry.url}
                className="flex items-baseline gap-[calc(var(--step)*0.75)] border-t border-ice-faint py-[calc(var(--step)*0.55)] first:border-t-0"
              >
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-faint">
                  {String(entry.number).padStart(2, '0')}
                </span>
                <Link href={entry.url} className="flex-1">
                  {entry.title}
                </Link>
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-faint">
                  {entry.written}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </Page>
  )
}
