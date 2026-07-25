import { TRACKS, TRACK_LABELS, type Track } from '@/lib/site'

/**
 * Track-variant content.
 *
 * These render server-side for *every* track, tagged so CSS can hide what does not
 * apply once `data-track` is set on <html>. Three consequences, all of them the
 * point:
 *
 *   - No flash of wrong content, and no hydration mismatch: the server sends one
 *     document to everyone and React never re-renders on a track change.
 *   - Crawlers, and readers without JavaScript, get the union of all variants with
 *     each one labelled — complete, not degraded.
 *   - Switching track costs a single attribute write.
 *
 * The class contract, which is load-bearing and was once wrong in a way that
 * silently inverted the whole feature: `tk-block` marks a variant container, and
 * each `tk-<track>` declares a track the block **belongs to**. The CSS then hides
 * any block that does not claim the current track. Membership, never exclusion —
 * tagging by exclusion appears to work for single-track blocks and breaks for
 * blocks belonging to two.
 */

const ORDER: Record<Track, number> = { newcomer: 0, operator: 1, architect: 2 }

function classesFor(tracks: Track[], extra = ''): string {
  return ['tk-block', ...tracks.map((track) => `tk-${track}`), extra]
    .filter(Boolean)
    .join(' ')
}

export function ForTrack({
  track,
  children,
}: {
  track: Track | Track[]
  children: React.ReactNode
}) {
  const tracks = Array.isArray(track) ? track : [track]

  return (
    <div className={classesFor(tracks)}>
      <p className="tk-label font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
        For {tracks.map((candidate) => TRACK_LABELS[candidate]).join(' and ')} readers
      </p>
      {children}
    </div>
  )
}

/**
 * Content for readers at or above a given track — the depth ladder, for material
 * that is additive rather than alternative.
 */
export function Depth({ min, children }: { min: Track; children: React.ReactNode }) {
  const included = TRACKS.filter((candidate) => ORDER[candidate] >= ORDER[min])
  return <ForTrack track={included}>{children}</ForTrack>
}

/**
 * A one-line aside written differently per track. Any track left unspecified
 * simply gets no callout.
 */
export function TrackCallout(props: Partial<Record<Track, string>>) {
  return (
    <>
      {TRACKS.filter((track) => props[track]).map((track) => (
        <aside
          key={track}
          // No coloured side stripe: three stacked signal-ruled asides would be the
          // banned side-stripe pattern, and the signal colour may only appear where
          // it means change. The label carries the distinction instead.
          className={classesFor([track], 'my-6 border-l border-ice-faint pl-4')}
        >
          <p className="tk-label font-mono text-[0.7rem] tracking-[0.06em] text-ice-dim uppercase">
            For {TRACK_LABELS[track]} readers
          </p>
          <p>{props[track]}</p>
        </aside>
      ))}
    </>
  )
}
