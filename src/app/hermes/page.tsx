import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { coreCountFor, durationFor, guides, modules } from '@/lib/content'
import { Page } from '@/components/ui/page'
import { courseSchema, jsonLd } from '@/lib/schema'
import { TRACKS, TRACK_LABELS } from '@/lib/site'

const GUIDE = 'hermes'

const guide = guides.find((candidate) => candidate.slug === GUIDE)

export const metadata: Metadata = guide
  ? {
      title: guide.title,
      description: guide.summary,
      openGraph: {
        title: guide.title,
        description: guide.summary,
        images: [{ url: `/og/guide-${guide.slug}.png`, width: 1200, height: 630 }],
      },
    }
  : {}

export default function GuidePage() {
  if (!guide) notFound()

  const guideModules = modules.filter((mod) => mod.guideSlug === GUIDE)
  const planned = guideModules.reduce((total, mod) => total + mod.lessons.length, 0)
  const written = guideModules.reduce((total, mod) => total + mod.written, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseSchema(guide))} />
    <Page
      aside={
        <div className="lg:sticky lg:top-[calc(var(--step)*3)]">
          <p className="font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
            The core path
          </p>
          <dl className="mt-[calc(var(--step)*0.6)] space-y-[calc(var(--step)*0.4)]">
            {TRACKS.map((track) => (
              <div key={track} className="flex justify-between gap-4 text-[0.9rem]">
                <dt className="text-ice-dim">
                  {TRACK_LABELS[track]}
                  <span className="ml-2 font-mono text-[0.7rem] text-ice-faint">
                    {coreCountFor(track)} lessons
                  </span>
                </dt>
                <dd className="font-mono tabular-nums">
                  {Math.floor(durationFor(track) / 60)}h{' '}
                  {String(durationFor(track) % 60).padStart(2, '0')}m
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-[var(--step)] border-t border-ice-faint pt-[calc(var(--step)*0.6)] text-[0.85rem] text-ice-dim">
            Core lessons only — what each track is asked to complete. Skim material is
            genuinely optional. Tracks are three perspectives on the same material, not
            three difficulty levels, and nothing is hidden from anyone.
          </p>
        </div>
      }
    >
      <main data-pagefind-body>
        <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.03em]">
          {guide.title}
        </h1>

        <p className="mt-[calc(var(--step)*0.8)] max-w-[64ch] text-[1.125rem] text-ice-dim">
          {guide.summary}
        </p>

        <p className="mt-[var(--step)] font-mono text-[0.7rem] text-ice-dim">
          {guideModules.length} modules · {planned} lessons · {written} written · verified
          against {guide.subject} {guide.verifiedAgainst}
        </p>

        <ol className="mt-[calc(var(--step)*2)] border-t border-ice-faint">
          {guideModules.map((mod) => (
            <li key={mod.slug} className="border-b border-ice-faint/60 py-[var(--step)]">
              <h2 className="font-display text-[1.375rem] tracking-[-0.02em]">
                <Link href={mod.url} className="no-underline">
                  <span className="mr-3 align-middle font-mono text-[0.7rem] text-ice-faint">
                    {String(mod.number).padStart(2, '0')}
                  </span>
                  {mod.title}
                </Link>
              </h2>
              <p className="mt-[calc(var(--step)*0.4)] max-w-[64ch] text-[0.95rem] text-ice-dim">
                {mod.summary}
              </p>
              <p className="mt-[calc(var(--step)*0.4)] font-mono text-[0.7rem] text-ice-faint">
                {mod.lessons.length} lessons · {mod.minutes} min
                {mod.written > 0 ? ` · ${mod.written} written` : ' · not yet written'}
              </p>
            </li>
          ))}
        </ol>
      </main>
    </Page>
    </>
  )
}
