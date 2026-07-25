import { Depth, ForTrack, TrackCallout } from './for-track'

/**
 * The MDX component map.
 *
 * Track-variant components render *every* variant into the static HTML tagged
 * with a `tk-*` class; CSS hides the ones that do not apply. Authors write
 * variants, not branches — see design.md and globals.css.
 */
export const mdxComponents = {
  ForTrack,
  Depth,
  TrackCallout,
}
