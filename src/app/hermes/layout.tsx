import type { Metadata } from 'next'
import { guides } from '@/lib/content'

const guide = guides.find((candidate) => candidate.slug === 'hermes')

/**
 * A per-guide title template, so every page inside this guide carries the words a
 * reader would actually search for. "Skills that improve themselves" alone says
 * nothing to a search engine; followed by the guide's name it does.
 */
export const metadata: Metadata = guide ? { title: { template: `%s · ${guide.title}`, default: guide.title } } : {}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
