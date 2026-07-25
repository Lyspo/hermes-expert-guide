import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXContent } from '@content-collections/mdx/react'
import { getLesson, lessons, neighbours, prerequisitesOf } from '@/lib/content'
import { mdxComponents } from '@/components/mdx'

// Every lesson URL is known at build time; anything else is a 404 at build
// rather than a surprise at runtime.
// This route tree serves one guide. A second guide gets its own directory, which
// keeps its URLs short and its static params independent.
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

  return (
    <article className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <header className="border-rule border-b pb-8">
        <p className="font-mono text-ink-soft text-xs">
          <Link href={`/${lesson.guideSlug}/${lesson.moduleSlug}/`}>
            {String(lesson.moduleNumber).padStart(2, '0')} · {lesson.module.title}
          </Link>
        </p>

        <h1 className="font-display mt-4 text-4xl leading-[1.1] tracking-[-0.02em]">
          {lesson.title}
        </h1>

        <p className="text-ink-soft mt-4 text-lg">{lesson.description}</p>

        {/* Provenance, stated on every lesson: what this was checked against and
            when. It is the reader's basis for trusting a command. */}
        <dl className="font-mono text-ink-soft mt-6 flex flex-wrap gap-x-6 gap-y-1 text-xs">
          <div>
            <dt className="inline">Verified against </dt>
            <dd className="inline">Hermes {lesson.hermesVersion}</dd>
          </div>
          <div>
            <dt className="inline">Updated </dt>
            <dd className="inline">
              <time dateTime={lesson.updated}>{lesson.updated}</time>
            </dd>
          </div>
          <div>
            <dt className="inline">Reading </dt>
            <dd className="inline">{lesson.duration} min</dd>
          </div>
        </dl>

        {prerequisites.length > 0 && (
          <p className="text-ink-soft mt-6 text-sm">
            Assumes you have read{' '}
            {prerequisites.map((prerequisite, index) => (
              <span key={prerequisite.id}>
                {index > 0 && ', '}
                <Link href={prerequisite.url}>{prerequisite.title}</Link>
              </span>
            ))}
            .
          </p>
        )}
      </header>

      <div className="mt-10">
        <MDXContent code={lesson.mdx} components={mdxComponents} />
      </div>

      <nav className="border-rule mt-16 flex justify-between gap-8 border-t pt-8 text-sm">
        {previous ? (
          <Link href={previous.url} className="max-w-[45%]">
            <span className="font-mono text-ink-soft block text-xs">Previous</span>
            {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={next.url} className="max-w-[45%] text-right">
            <span className="font-mono text-ink-soft block text-xs">Next</span>
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  )
}
