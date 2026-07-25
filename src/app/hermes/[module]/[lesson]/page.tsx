import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXContent } from '@content-collections/mdx/react'
import { getLesson, isWritten, lessons, neighbours, prerequisitesOf } from '@/lib/content'
import { mdxComponents } from '@/components/mdx'
import { Page } from '@/components/ui/page'
import { getModule } from '@/lib/content'
import { jsonLd, lessonSchema } from '@/lib/schema'
import { LessonProgress } from '@/components/personalization/lesson-progress'

// This route tree serves one guide. A second guide gets its own directory, which
// keeps its URLs short and its static params independent. Every lesson URL is
// known at build time; anything else 404s at build rather than at runtime.
const GUIDE = 'hermes'

export const dynamicParams = false

export function generateStaticParams() {
  return lessons
    .filter((lesson) => lesson.guideSlug === GUIDE)
    .map((lesson) => ({ module: lesson.moduleSlug, lesson: lesson.slug }))
}

type Params = Promise<{ module: string; lesson: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module: moduleSlug, lesson: lessonSlug } = await params
  const lesson = getLesson(GUIDE, moduleSlug, lessonSlug)
  if (!lesson) return {}

  return {
    title: lesson.title,
    description: lesson.description,
    openGraph: { title: lesson.title, description: lesson.description, type: 'article' },
  }
}

export default async function LessonPage({ params }: { params: Params }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params
  const lesson = getLesson(GUIDE, moduleSlug, lessonSlug)
  if (!lesson) notFound()

  const { previous, next } = neighbours(lesson)
  const prerequisites = prerequisitesOf(lesson)
  const parentModule = getModule(GUIDE, moduleSlug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(lessonSchema(lesson, parentModule))}
      />
    <Page
      aside={
        /* Provenance lives in the margin, where a corrector would have written
           it: what this was checked against, and when. */
        <div className="lg:sticky lg:top-[calc(var(--step)*3)]">
          <dl className="font-mono text-ice-dim space-y-[calc(var(--step)*0.5)] text-[0.7rem]">
            <div>
              <dt className="opacity-70">Verified against</dt>
              <dd className="mt-[calc(var(--step)*0.25)]">
                <span className="inline-block font-mono text-ice">
                  {lesson.guide.subject} {lesson.hermesVersion}
                </span>
              </dd>
            </div>
            <div>
              <dt className="opacity-70">Last checked</dt>
              <dd>
                <time dateTime={lesson.updated}>{lesson.updated}</time>
              </dd>
            </div>
            <div>
              <dt className="opacity-70">Reading</dt>
              <dd>{lesson.duration} min</dd>
            </div>
          </dl>

          <div className="mt-[var(--step)] border-t border-ice-faint pt-[calc(var(--step)*0.5)]">
            <LessonProgress id={lesson.id} />
          </div>

          {prerequisites.length > 0 && (
            <div className="border-ice-faint mt-[var(--step)] border-t pt-[calc(var(--step)*0.6)]">
              <p className="font-mono text-ice-dim text-[0.7rem] opacity-70">Assumes</p>
              <ul className="mt-[calc(var(--step)*0.3)] space-y-[calc(var(--step)*0.2)] text-[0.8125rem]">
                {/* A prerequisite that is still a stub is named but not linked —
                    the dependency is real and worth stating, and a link to a page
                    that does not exist is worse than no link. Same treatment, and
                    the same word, as the module index. */}
                {prerequisites.map((prerequisite) =>
                  isWritten(prerequisite) ? (
                    <li key={prerequisite.id}>
                      <Link
                        href={prerequisite.url}
                        className="underline decoration-[var(--color-rule)]"
                      >
                        {prerequisite.title}
                      </Link>
                    </li>
                  ) : (
                    <li key={prerequisite.id} className="text-ice-dim">
                      {prerequisite.title}{' '}
                      <span className="font-mono text-[0.7rem] text-ice-faint">planned</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      }
    >
      <article data-pagefind-body>
        <header>
          <p className="font-mono text-ice-dim text-[0.7rem] tracking-[0.06em] uppercase">
            <Link href={`/${lesson.guideSlug}/${lesson.moduleSlug}/`}>
              {String(lesson.moduleNumber).padStart(2, '0')} · {lesson.module.title}
            </Link>
          </p>

          <h1 className="font-display mt-[calc(var(--step)*0.75)] text-[2.375rem] leading-[1.05] tracking-[-0.02em]">
            {lesson.title}
          </h1>

          <p className="text-ice-dim mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[1.125rem] leading-[1.5]">
            {lesson.description}
          </p>

          {/* On narrow screens the margin has nowhere to go, so provenance falls
              into the flow rather than disappearing. */}
          <p className="font-mono text-ice-dim mt-[var(--step)] text-[0.7rem] lg:hidden">
            Verified against {lesson.guide.subject} {lesson.hermesVersion} ·{' '}
            <time dateTime={lesson.updated}>{lesson.updated}</time> · {lesson.duration} min
          </p>
        </header>

        <div className="mt-[calc(var(--step)*0.75)] lg:hidden">
          <LessonProgress id={lesson.id} />
        </div>

        <hr className="border-ice-faint mt-[var(--step)] mb-[calc(var(--step)*1.5)]" />

        <MDXContent code={lesson.mdx} components={mdxComponents} />

        <nav className="border-ice-faint mt-[calc(var(--step)*2.5)] flex justify-between gap-[calc(var(--step)*2)] border-t pt-[var(--step)] text-[0.9375rem]">
          {previous ? (
            <Link href={previous.url} className="max-w-[45%]">
              <span className="font-mono text-ice-dim block text-[0.7rem]">Previous</span>
              {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={next.url} className="max-w-[45%] text-right">
              <span className="font-mono text-ice-dim block text-[0.7rem]">Next</span>
              {next.title}
            </Link>
          )}
        </nav>
      </article>
    </Page>
    </>
  )
}
