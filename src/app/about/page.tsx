import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'How this was built',
  description:
    'The process behind this guide: where its claims come from, how the visual direction was chosen, and what it deliberately does not do.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16" data-pagefind-body>
      <h1 className="font-display text-4xl leading-[1.1] tracking-[-0.02em]">
        How this was built
      </h1>
      <p className="mt-6 max-w-[68ch] text-lg">
        Placeholder. The colophon is written at the end, once there is a finished
        process to describe honestly rather than a plan to describe optimistically.
      </p>
      <p className="text-ink-soft mt-6 max-w-[68ch]">
        What it will cover: the sourced research corpus every factual claim traces back
        to, including the two places where it contradicts the widely-repeated summaries
        of how Hermes works; how the visual direction was derived and why the obvious
        one was rejected; and the multi-agent process used to build it.
      </p>
      <p className="text-ink-soft mt-6">{site.disclaimer}</p>
    </main>
  )
}
