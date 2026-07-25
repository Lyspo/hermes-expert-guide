import { TRACKS, TRACK_LABELS, type Track } from '@/lib/site'

/**
 * Track-variant content.
 *
 * These render server-side for *every* track, tagged so CSS can hide what does
 * not apply once `data-track` is set on <html>. Three consequences, all of them
 * the point:
 *
 *   - No flash of wrong content, and no hydration mismatch: the server sends one
 *     document to everyone and React never re-renders on a track change.
 *   - Crawlers, and readers without JavaScript, get the union of all variants
 *     with each one labelled — complete, not degraded.
 *   - Switching track costs a single attribute write.
 */

const ORDER: Record<Track, number> = { newcomer: 0, operator: 1, architect: 2 }

export function ForTrack({
  track,
  children,
}: {
  track: Track | Track[]
  children: React.ReactNode
}) {
  const tracks = Array.isArray(track) ? track : [track]
  const hidden = TRACKS.filter((candidate) => !tracks.includes(candidate))

  return (
    <div className={hidden.map((candidate) => `tk-${candidate}`).join(' ')}>
      <p className="tk-label font-mono text-ink-soft text-xs">
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
      {TRACKS.filter((track) => props[track]).map((track) => {
        const hidden = TRACKS.filter((candidate) => candidate !== track)
        return (
          <aside
            key={track}
            className={`border-annotation my-6 border-l pl-4 ${hidden
              .map((candidate) => `tk-${candidate}`)
              .join(' ')}`}
          >
            <p className="tk-label font-mono text-ink-soft text-xs">
              For {TRACK_LABELS[track]} readers
            </p>
            <p>{props[track]}</p>
          </aside>
        )
      })}
    </>
  )
}
