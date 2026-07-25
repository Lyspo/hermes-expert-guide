import dynamic from 'next/dynamic'
import { getSimulation } from '@content/simulations'
import { buildTimeline } from '@/lib/sim/timeline'
import { EventRow } from './transcript-body'

// The player is the enhancement, so it loads on its own. The transcript below is
// server-rendered and complete either way.
const Player = dynamic(() => import('./player').then((mod) => mod.Player))

/**
 * A recorded Hermes session, embedded in a lesson.
 *
 * The complete transcript is server-rendered as semantic HTML inside a `<details>`,
 * which makes it the artifact for a reader without JavaScript, a screen reader, a
 * crawler, or a printout — not a fallback but the same content the player reveals
 * progressively.
 *
 * Provenance is printed, always. Every replay states whether its strings are
 * verbatim or reconstructed and where the formats came from, because no public
 * recording of a real Hermes session exists and a replay that hid that would be the
 * one dishonest thing on the site.
 */
export function Simulation({ id }: { id: string }) {
  const script = getSimulation(id)

  if (!script) {
    // A missing id is an authoring mistake; say so in place rather than rendering
    // nothing and letting it ship unnoticed.
    return (
      <p className="my-[var(--step)] border-l-2 border-signal pl-3 font-mono text-[0.8rem] text-signal">
        No replay registered as “{id}”.
      </p>
    )
  }

  const timeline = buildTimeline(script)
  const seconds = Math.round(timeline.total / 1000)

  return (
    <figure className="my-[calc(var(--step)*1.6)]">
      <figcaption>
        <p className="font-mono text-[0.65rem] tracking-[0.1em] text-ice-faint uppercase">
          Recorded session · {seconds}s
        </p>
        <p className="font-display mt-1 text-[1.125rem] tracking-[-0.02em]">
          {script.title}
        </p>
        <p className="mt-1 max-w-[62ch] text-[0.9375rem] text-ice-dim">{script.premise}</p>
      </figcaption>

      <Player script={script} />

      <details className="mt-[calc(var(--step)*0.5)] border-t border-ice-faint pt-[calc(var(--step)*0.4)]">
        <summary className="cursor-pointer font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase">
          Full transcript
        </summary>
        <ol className="mt-[calc(var(--step)*0.5)]" role="log">
          {script.events.map((event, index) => (
            <EventRow key={index} event={event} />
          ))}
        </ol>
      </details>

      <p className="mt-[calc(var(--step)*0.4)] max-w-[68ch] font-mono text-[0.65rem] leading-[1.7] text-ice-dim">
        {script.fidelity === 'verbatim' ? 'Verbatim strings' : 'Reconstructed'} ·{' '}
        {script.hermesVersion} · {script.source}
      </p>
    </figure>
  )
}
