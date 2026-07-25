import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getModule, isWritten, modules } from '@/lib/content'
import { Page } from '@/components/ui/page'

const GUIDE = 'hermes'

export const dynamicParams = false

export function generateStaticParams() {
  return modules.filter((mod) => mod.guideSlug === GUIDE).map((mod) => ({ module: mod.slug }))
}

type Params = Promise<{ module: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module: slug } = await params
  const mod = getModule(GUIDE, slug)
  if (!mod) return {}
  return { title: mod.title, description: mod.summary }
}

export default async function ModulePage({ params }: { params: Params }) {
  const { module: slug } = await params
  const mod = getModule(GUIDE, slug)
  if (!mod) notFound()

  return (
    <Page>
      <main data-pagefind-body>
        <p className="font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
          Module {String(mod.number).padStart(2, '0')}
          {mod.arc ? ` · ${mod.arc}` : null}
        </p>

        <h1 className="font-display mt-[calc(var(--step)*0.7)] text-[2.375rem] leading-[1.05] tracking-[-0.03em]">
          {mod.title}
        </h1>

        <p className="mt-[calc(var(--step)*0.75)] max-w-[64ch] text-[1.125rem] text-ice-dim">
          {mod.summary}
        </p>

        <p className="mt-[var(--step)] font-mono text-[0.7rem] text-ice-dim">
          {mod.lessons.length} lessons · {mod.minutes} min ·{' '}
          {mod.written > 0 ? `${mod.written} written` : 'not yet written'}
        </p>

        {mod.outcome && (
          <p className="mt-[calc(var(--step)*1.2)] max-w-[62ch] border-l border-ice-faint pl-[calc(var(--step)*0.75)] text-[0.95rem]">
            <span className="block font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase">
              After this module you can
            </span>
            <span className="mt-1 block">{mod.outcome}</span>
          </p>
        )}

        <ol className="mt-[calc(var(--step)*2)] border-t border-ice-faint">
          {mod.lessons.map((lesson) => {
            const written = isWritten(lesson)
            const body = (
              <>
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-dim">
                  {String(lesson.order).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <span className="block">{lesson.title}</span>
                  <span className="mt-1 block text-[0.9rem] text-ice-dim">
                    {lesson.description}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[0.7rem] text-ice-dim">
                  {written ? `${lesson.duration} min` : 'planned'}
                </span>
              </>
            )

            return (
              <li key={lesson.id} className="border-b border-ice-faint/60">
                {written ? (
                  <Link
                    href={lesson.url}
                    className="flex items-baseline gap-[var(--step)] py-[calc(var(--step)*0.8)] no-underline transition-colors duration-200 hover:text-ice"
                  >
                    {body}
                  </Link>
                ) : (
                  /* Announced, not served. An unwritten lesson gets no page and no
                     link — the shape is honest, the promise is not overstated. */
                  <div
                    className="flex items-baseline gap-[var(--step)] py-[calc(var(--step)*0.8)] opacity-60"
                    aria-disabled="true"
                  >
                    {body}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </main>
    </Page>
  )
}
