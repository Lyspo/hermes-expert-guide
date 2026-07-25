import Link from 'next/link'
import { guides } from '@/lib/content'
import { site } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-5xl leading-[1.05] tracking-[-0.02em]">
        {site.tagline}
      </h1>
      <p className="mt-6 max-w-[68ch] text-lg">
        Scaffold placeholder. The landing page is built last, once the curriculum and the
        session replays it exists to introduce are real.
      </p>

      <ul className="border-ice-faint mt-16 border-t">
        {guides.map((guide) => (
          <li key={guide.slug} className="border-ice-faint border-b py-6">
            <h2 className="font-display text-2xl">
              <Link href={guide.url}>{guide.title}</Link>
            </h2>
            <p className="mt-2 max-w-[68ch]">{guide.summary}</p>
            <p className="font-mono text-ice-dim mt-2 text-xs">
              {guide.subject} · verified against {guide.verifiedAgainst}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
