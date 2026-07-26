import type { Metadata } from 'next'
import Link from 'next/link'
import { MapCanvas } from '@/components/map/map-canvas'
import { lessons, modules } from '@/lib/content'
import { buildMap } from '@/lib/map-layout'

/**
 * The desktop: the curriculum as the graph it actually is.
 *
 * The canvas is the enhancement. The outline underneath it is the map — server-rendered,
 * complete, crawlable, and the thing a keyboard or screen-reader user navigates. That
 * ordering is not a concession; `design.md` requires that every structure the field
 * depicts also exist as real text, and building the text first is the only way to be
 * sure it does.
 */

export const metadata: Metadata = {
  title: 'The map',
  description:
    'The whole curriculum as a graph: ten modules, fifty-one lessons, and the prerequisites that cross between them.',
}

export default function MapPage() {
  const guideModules = modules.filter((entry) => entry.guideSlug === 'hermes')

  const graph = buildMap(
    guideModules.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      url: entry.url,
      number: entry.number,
    })),
    lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      url: lesson.url,
      moduleNumber: lesson.moduleNumber,
      moduleSlug: lesson.moduleSlug,
      order: lesson.order,
      prerequisites: lesson.prerequisites,
    }))
  )

  const requires = graph.edges.filter((edge) => edge.kind === 'requires')
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]))

  return (
    <main className="map-route plane mx-auto max-w-[84rem] px-6 py-[calc(var(--step)*2)] lg:px-[calc(var(--step)*3)]">
      <header className="max-w-[62ch]">
        <h1 className="font-display text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
          The map
        </h1>
        <p className="mt-[calc(var(--step)*0.75)] text-[1.125rem] leading-[1.5] text-ice-dim">
          {guideModules.length} modules, {lessons.length} lessons, and the{' '}
          {requires.length} prerequisites that cross between them. Depth is sequence:
          module one is nearest, module {guideModules.length} furthest in. Lessons you
          have mastered are lit.
        </p>
      </header>

      <div className="mt-[var(--step)] border-y border-ice-faint">
        <MapCanvas graph={graph} />
      </div>

      <p className="mt-[calc(var(--step)*0.5)] font-mono text-[0.65rem] text-ice-dim">
        The field is decorative. Everything in it is below, as text.
      </p>

      {/* The map proper. */}
      <section className="mt-[calc(var(--step)*2)]">
        <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          Every module and lesson
        </h2>

        <ol className="mt-[var(--step)] grid gap-[calc(var(--step)*1.25)] md:grid-cols-2 xl:grid-cols-3">
          {guideModules.map((entry) => (
            <li key={entry.url} className="border-t border-ice-faint pt-[calc(var(--step)*0.5)]">
              <h3 className="text-[1.0625rem] leading-[1.35]">
                <span className="font-mono text-[0.7rem] text-ice-dim">
                  {String(entry.number).padStart(2, '0')}{' '}
                </span>
                <Link href={entry.url}>{entry.title}</Link>
              </h3>
              <ol className="mt-[calc(var(--step)*0.4)] space-y-[calc(var(--step)*0.2)]">
                {entry.lessons.map((lesson) => (
                  <li key={lesson.url} className="text-[0.875rem] leading-[1.5]">
                    <Link href={lesson.url} className="text-ice-dim hover:text-ice">
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      {/* The prerequisites, stated rather than only drawn. These are the edges that make
          the curriculum a graph instead of a list, so they are worth reading. */}
      <section className="mt-[calc(var(--step)*2.5)] border-t border-ice-faint pt-[var(--step)]">
        <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          What depends on what
        </h2>
        <ul className="mt-[var(--step)] space-y-[calc(var(--step)*0.35)]">
          {requires.map((edge) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null
            return (
              <li
                key={`${edge.from}->${edge.to}`}
                className="flex flex-wrap items-baseline gap-x-2 text-[0.875rem] leading-[1.6]"
              >
                <Link href={to.url}>{to.title}</Link>
                <span className="font-mono text-[0.7rem] text-ice-dim">assumes</span>
                <Link href={from.url} className="text-ice-dim hover:text-ice">
                  {from.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
