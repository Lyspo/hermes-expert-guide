import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXContent } from '@content-collections/mdx/react'
import { Page } from '@/components/ui/page'
import { mdxComponents } from '@/components/mdx'
import { cheatsheets, getCheatsheet } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return cheatsheets.map((sheet) => ({ sheet: sheet.slug }))
}

type Params = Promise<{ sheet: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { sheet: slug } = await params
  const sheet = getCheatsheet(slug)
  if (!sheet) return {}
  return {
    title: sheet.title,
    description: sheet.description,
    openGraph: { title: sheet.title, description: sheet.description },
  }
}

/**
 * One cheatsheet.
 *
 * Deliberately plainer than a lesson: no margin provenance, no track variants, no
 * progress control. A sheet is something you scan or print, and every piece of chrome
 * on it is something between the reader and a table.
 */
export default async function CheatsheetPage({ params }: { params: Params }) {
  const { sheet: slug } = await params
  const sheet = getCheatsheet(slug)
  if (!sheet) notFound()

  return (
    <Page>
      <main className="max-w-[68rem]">
        <p className="font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
          <Link href="/cheatsheets/">Cheatsheets</Link>
        </p>

        <h1 className="font-display mt-[calc(var(--step)*0.75)] text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
          {sheet.title}
        </h1>

        <p className="mt-[calc(var(--step)*0.75)] max-w-[64ch] text-[1.0625rem] leading-[1.7] text-ice-dim">
          {sheet.description}
        </p>

        <p className="mt-[calc(var(--step)*0.75)] font-mono text-[0.7rem] text-ice-dim">
          {sheet.hermesVersion} · checked {sheet.updated}
        </p>

        <div className="prose-sheet mt-[calc(var(--step)*2)]" data-pagefind-body>
          <MDXContent code={sheet.mdx} components={mdxComponents} />
        </div>
      </main>
    </Page>
  )
}
