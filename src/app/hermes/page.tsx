import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { coreCountFor, durationFor, guides, modules } from '@/lib/content'
import { CurriculumMap } from '@/components/curriculum/curriculum-map'
import { curriculumGraph, curriculumMap } from '@/lib/curriculum-graph'
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

/**
 * The guide index — the curriculum map, not a table of contents.
 *
 * design.md: "module and lesson order maps to depth and position in the field, so the
 * curriculum map is a view of the structure rather than a table of contents drawn to
 * look like one." This page is where that stops being a promise.
 *
 * Deliberately not built on `Page`. That is the reading layout — a 44rem measure with
 * a margin column for provenance — which is right for a lesson and too narrow for a
 * prerequisite graph to be legible in. The header keeps the same two-column shape by
 * hand so nothing about the page's proportions changes; only the index below it does,
 * and it gains the graph plus a link per lesson while keeping every module summary and
 * count the previous list carried.
 */
export default function GuidePage() {
  if (!guide) notFound()

  const guideModules = modules.filter((mod) => mod.guideSlug === GUIDE)
  const planned = guideModules.reduce((total, mod) => total + mod.lessons.length, 0)
  const written = guideModules.reduce((total, mod) => total + mod.written, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseSchema(guide))} />

      <main
        data-pagefind-body
        className="plane mx-auto max-w-[84rem] px-6 py-[calc(var(--step)*3)] lg:px-[calc(var(--step)*3)]"
      >
        <div className="grid gap-x-[var(--step)] gap-y-[calc(var(--step)*1.5)] lg:grid-cols-[minmax(0,44rem)_minmax(0,17rem)]">
          <div className="min-w-0">
            <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.03em]">
              {guide.title}
            </h1>

            <p className="mt-[calc(var(--step)*0.8)] max-w-[64ch] text-[1.125rem] text-ice-dim">
              {guide.summary}
            </p>

            <p className="mt-[var(--step)] font-mono text-[0.7rem] text-ice-dim">
              {guideModules.length} modules · {planned} lessons · {written} written ·
              verified against {guide.subject} {guide.verifiedAgainst}
            </p>
          </div>

          <div>
            <p className="font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
              The core path
            </p>
            <dl className="mt-[calc(var(--step)*0.6)] space-y-[calc(var(--step)*0.4)]">
              {TRACKS.map((track) => (
                <div key={track} className="flex justify-between gap-4 text-[0.9rem]">
                  <dt className="text-ice-dim">
                    {TRACK_LABELS[track]}
                    <span className="ml-2 font-mono text-[0.7rem] text-ice-dim">
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
        </div>

        <div className="mt-[var(--step)]">
          <CurriculumMap
            graph={curriculumGraph}
            entries={curriculumMap}
            modules={guideModules.map((mod) => ({
              number: mod.number,
              title: mod.title,
              summary: mod.summary,
              url: mod.url,
              written: mod.written,
              total: mod.lessons.length,
              minutes: mod.minutes,
            }))}
          />
        </div>
      </main>
    </>
  )
}
