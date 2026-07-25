import type { Metadata } from 'next'
import Link from 'next/link'
import { Page } from '@/components/ui/page'
import { cheatsheets } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Cheatsheets',
  description:
    'Printable reference: the command surface, the configuration keys that matter, the map of ~/.hermes/, the isolation matrix, and the rest.',
}

/**
 * The cheatsheet index.
 *
 * These are load-bearing rather than supplementary, and the page says so: the lessons
 * are short *because* the reference lives here. `03/04` is a twelve-minute lesson
 * instead of a thirty-minute one precisely because the 150-field configuration surface
 * is on a sheet rather than in its prose.
 */
export default function CheatsheetsPage() {
  return (
    <Page>
      <main className="max-w-[62rem]">
        <p className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-dim uppercase">
          {cheatsheets.length} sheets
        </p>

        <h1 className="font-display mt-[calc(var(--step)*0.75)] text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
          Cheatsheets
        </h1>

        <p className="mt-[calc(var(--step)*1)] max-w-[62ch] text-[1.0625rem] leading-[1.75] text-ice-dim">
          These exist so the lessons do not have to be reference material. Everything here
          is something you look up rather than something you learn, which is why it is
          tabular, printable, and kept out of the prose.
        </p>

        <ol className="mt-[calc(var(--step)*2)]">
          {cheatsheets.map((sheet) => (
            <li
              key={sheet.slug}
              className="border-t border-ice-faint py-[calc(var(--step)*1)]"
            >
              <h2 className="font-display text-[1.35rem] tracking-[-0.01em]">
                <Link href={sheet.url}>{sheet.title}</Link>
              </h2>
              <p className="mt-[calc(var(--step)*0.35)] max-w-[64ch] text-[0.95rem] leading-[1.7] text-ice-dim">
                {sheet.description}
              </p>
            </li>
          ))}
        </ol>
      </main>
    </Page>
  )
}
