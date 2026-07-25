import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getModule, modules } from '@/lib/content'

// This route tree serves one guide. A second guide gets its own directory, which
// keeps its URLs short and its static params independent.
const GUIDE = 'hermes'

export const dynamicParams = false

export function generateStaticParams() {
  return modules
    .filter((mod) => mod.guideSlug === GUIDE)
    .map((mod) => ({ module: mod.slug }))
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
    <main className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <p className="font-mono text-ink-soft text-xs">
        Module {String(mod.number).padStart(2, '0')}
      </p>
      <h1 className="font-display mt-4 text-4xl leading-[1.1] tracking-[-0.02em]">
        {mod.title}
      </h1>
      <p className="mt-4 max-w-[68ch] text-lg">{mod.summary}</p>

      <ol className="border-rule mt-12 border-t">
        {mod.lessons.map((lesson) => (
          <li key={lesson.id} className="border-rule border-b">
            <Link href={lesson.url} className="flex items-baseline gap-4 py-4">
              <span className="font-mono text-ink-soft text-xs">
                {String(lesson.order).padStart(2, '0')}
              </span>
              <span className="flex-1">
                <span className="block">{lesson.title}</span>
                <span className="text-ink-soft block text-sm">{lesson.description}</span>
              </span>
              <span className="font-mono text-ink-soft text-xs">{lesson.duration} min</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
