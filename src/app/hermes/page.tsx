import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guides, modules } from '@/lib/content'

const GUIDE = 'hermes'

const guide = guides.find((candidate) => candidate.slug === GUIDE)

export const metadata: Metadata = guide
  ? { title: guide.title, description: guide.summary }
  : {}

export default function GuidePage() {
  if (!guide) notFound()

  const guideModules = modules.filter((mod) => mod.guideSlug === GUIDE)
  const lessonCount = guideModules.reduce((total, mod) => total + mod.lessons.length, 0)
  const minutes = guideModules.reduce(
    (total, mod) => total + mod.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0,
  )

  return (
    <main className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.02em]">
        {guide.title}
      </h1>
      <p className="mt-6 max-w-[68ch] text-lg">{guide.summary}</p>

      <p className="font-mono text-ice-dim mt-6 text-xs">
        {guideModules.length} modules · {lessonCount} lessons · {minutes} min · verified
        against {guide.subject} {guide.verifiedAgainst}
      </p>

      <ol className="border-ice-faint mt-12 border-t">
        {guideModules.map((mod) => (
          <li key={mod.slug} className="border-ice-faint border-b py-6">
            <h2 className="font-display text-2xl">
              <Link href={mod.url}>
                <span className="font-mono text-ice-dim mr-3 text-xs align-middle">
                  {String(mod.number).padStart(2, '0')}
                </span>
                {mod.title}
              </Link>
            </h2>
            <p className="mt-2 max-w-[68ch]">{mod.summary}</p>
            <p className="font-mono text-ice-dim mt-2 text-xs">
              {mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
            </p>
          </li>
        ))}
      </ol>
    </main>
  )
}
