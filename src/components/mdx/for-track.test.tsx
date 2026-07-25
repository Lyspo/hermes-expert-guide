import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Depth, ForTrack, TrackCallout } from './for-track'
import { TRACKS, type Track } from '@/lib/site'

/**
 * The class contract behind track adaptivity.
 *
 * This exists because the contract was once inverted — blocks were tagged with the
 * tracks that should *hide* them, which cancelled out against the CSS and produced
 * a page where newcomers saw architect material and architects saw none of their
 * own. Nothing caught it: the build passed, the types passed, and a check that
 * merely counted hidden elements passed too.
 *
 * So these tests assert membership directly, and then assert the CSS rule's
 * outcome by simulating it: a block is visible on track T exactly when it claims
 * T. That is the property the feature actually depends on.
 */

/** The classes of every variant container in a rendered fragment. */
function blocks(html: string): string[][] {
  return [...html.matchAll(/class="([^"]*\btk-block\b[^"]*)"/g)].map((match) =>
    match[1]!.split(/\s+/),
  )
}

/** Mirrors `.tk-block:not(.tk-<track>) { display: none }`. */
const visibleOn = (classes: string[], track: Track) => classes.includes(`tk-${track}`)

describe('track variant class contract', () => {
  it('tags a single-track block with the track it belongs to', () => {
    const [classes] = blocks(
      renderToStaticMarkup(<ForTrack track="architect">body</ForTrack>),
    )
    expect(classes).toContain('tk-block')
    expect(classes).toContain('tk-architect')
    expect(classes).not.toContain('tk-newcomer')
    expect(classes).not.toContain('tk-operator')
  })

  it('shows a single-track block only on its own track', () => {
    const [classes] = blocks(
      renderToStaticMarkup(<ForTrack track="architect">body</ForTrack>),
    )
    expect(TRACKS.filter((track) => visibleOn(classes!, track))).toEqual(['architect'])
  })

  it('shows a multi-track block on every track it claims — the case that broke', () => {
    const [classes] = blocks(
      renderToStaticMarkup(<Depth min="operator">body</Depth>),
    )
    expect(TRACKS.filter((track) => visibleOn(classes!, track))).toEqual([
      'operator',
      'architect',
    ])
  })

  it('gives Depth min=newcomer every track', () => {
    const [classes] = blocks(renderToStaticMarkup(<Depth min="newcomer">body</Depth>))
    expect(TRACKS.filter((track) => visibleOn(classes!, track))).toEqual([...TRACKS])
  })

  it('renders one callout per supplied track, each visible only on its own', () => {
    const html = renderToStaticMarkup(
      <TrackCallout newcomer="simple" operator="mechanical" architect="control" />,
    )
    const found = blocks(html)
    expect(found).toHaveLength(3)
    for (const track of TRACKS) {
      expect(found.filter((classes) => visibleOn(classes, track))).toHaveLength(1)
    }
  })

  it('omits callouts for tracks with nothing to say', () => {
    const html = renderToStaticMarkup(<TrackCallout architect="control" />)
    expect(blocks(html)).toHaveLength(1)
    expect(html).not.toContain('tk-newcomer')
  })

  it('renders every variant with a label, which is the no-track default', () => {
    // A crawler and a reader without JavaScript both see this: the union of all
    // variants, each one labelled. It is the reason this is CSS and not branching.
    const html = renderToStaticMarkup(
      <TrackCallout newcomer="simple" operator="mechanical" architect="control" />,
    )
    expect(html).toContain('simple')
    expect(html).toContain('mechanical')
    expect(html).toContain('control')
    expect([...html.matchAll(/tk-label/g)]).toHaveLength(3)
  })
})
