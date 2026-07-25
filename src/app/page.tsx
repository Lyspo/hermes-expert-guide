import { site } from '@/lib/site'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-ink-soft text-xs">
        Verified against Hermes {site.verifiedAgainst}
      </p>
      <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-[-0.02em]">
        The agent that writes its own procedure.
      </h1>
      <p className="mt-6 max-w-[68ch] text-lg">
        Scaffold placeholder. The landing page is built last, once the curriculum and the
        session replays it is supposed to introduce actually exist.
      </p>
      <p className="text-ink-soft mt-12 text-sm">{site.disclaimer}</p>
    </main>
  )
}
