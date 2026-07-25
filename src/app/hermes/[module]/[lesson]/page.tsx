import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXContent } from '@content-collections/mdx/react'
import { getLesson, lessons, neighbours, prerequisitesOf } from '@/lib/content'
import { mdxComponents } from '@/components/mdx'
import { Page } from '@/components/ui/page'

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

  // The page stamp counts the lesson's real position in the record rather than
  // printing a decorative number.
  const pageNumber =
    lessons.filter((candidate) => candidate.guideSlug === GUIDE).indexOf(lesson) + 1

  return (
    <Page
      number={pageNumber}
      aside={
        /* Provenance lives in the margin, where a corrector would have written
           it: what this was checked against, and when. */
        <div className="lg:sticky lg:top-[calc(var(--quad)*3)]">
          <dl className="font-mono text-ink-soft space-y-[calc(var(--quad)*0.5)] text-[0.7rem]">
            <div>
              <dt className="opacity-70">Verified against</dt>
              <dd className="mt-[calc(var(--quad)*0.25)]">
                <span className="stamp inline-block">
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

          {prerequisites.length > 0 && (
            <div className="border-rule mt-[var(--quad)] border-t pt-[calc(var(--quad)*0.6)]">
              <p className="font-mono text-ink-soft text-[0.7rem] opacity-70">Assumes</p>
              <ul className="mt-[calc(var(--quad)*0.3)] space-y-[calc(var(--quad)*0.2)] text-[0.8125rem]">
                {prerequisites.map((prerequisite) => (
                  <li key={prerequisite.id}>
                    <Link
                      href={prerequisite.url}
                      className="underline decoration-[var(--color-rule)]"
                    >
                      {prerequisite.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    >
      <article data-pagefind-body>
        <header>
          <p className="font-mono text-ink-soft text-[0.7rem] tracking-[0.06em] uppercase">
            <Link href={`/${lesson.guideSlug}/${lesson.moduleSlug}/`}>
              {String(lesson.moduleNumber).padStart(2, '0')} · {lesson.module.title}
            </Link>
          </p>

          <h1 className="font-display mt-[calc(var(--quad)*0.75)] text-[2.375rem] leading-[calc(var(--quad)*1.75)] tracking-[-0.02em]">
            {lesson.title}
          </h1>

          <p className="text-ink-soft mt-[calc(var(--quad)*0.75)] max-w-[62ch] text-[1.125rem] leading-[var(--quad)]">
            {lesson.description}
          </p>

          {/* On narrow screens the margin has nowhere to go, so provenance falls
              into the flow rather than disappearing. */}
          <p className="font-mono text-ink-soft mt-[var(--quad)] text-[0.7rem] lg:hidden">
            Verified against {lesson.guide.subject} {lesson.hermesVersion} ·{' '}
            <time dateTime={lesson.updated}>{lesson.updated}</time> · {lesson.duration} min
          </p>
        </header>

        <hr className="border-rule mt-[var(--quad)] mb-[calc(var(--quad)*1.5)]" />

        <MDXContent code={lesson.mdx} components={mdxComponents} />

        <nav className="border-rule mt-[calc(var(--quad)*2.5)] flex justify-between gap-[calc(var(--quad)*2)] border-t pt-[var(--quad)] text-[0.9375rem]">
          {previous ? (
            <Link href={previous.url} className="max-w-[45%]">
              <span className="font-mono text-ink-soft block text-[0.7rem]">Previous</span>
              {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={next.url} className="max-w-[45%] text-right">
              <span className="font-mono text-ink-soft block text-[0.7rem]">Next</span>
              {next.title}
            </Link>
          )}
        </nav>
      </article>
    </Page>
  )
}
