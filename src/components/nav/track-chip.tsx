'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGuide } from '@/components/personalization/track-provider'
import { TRACKS, TRACK_LABELS, type Track } from '@/lib/site'

/**
 * The reader's track, and how they change it.
 *
 * Occupies a fixed width whether or not a track is set, so the swap from
 * placeholder to real content on hydration costs no layout shift. Switching is
 * one attribute write — the content variants are already in the HTML — so this
 * genuinely is instant rather than merely fast.
 */
export function TrackChip() {
  const { state, ready, setTrack } = useGuide()
  const [open, setOpen] = useState(false)

  // Reserved space. Matches the widest real state so nothing moves later.
  if (!ready) {
    return <div className="h-[1.75rem] w-[7.5rem]" aria-hidden="true" />
  }

  if (!state.track) {
    return (
      <Link
        href="/begin/"
        className="inline-flex h-[1.75rem] w-[7.5rem] items-center justify-center border border-ice-faint font-mono text-[0.65rem] tracking-[0.08em] uppercase no-underline transition-colors duration-200 hover:border-ice"
      >
        Pick a track
      </Link>
    )
  }

  return (
    <div className="relative h-[1.75rem] w-[7.5rem]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-[1.75rem] w-full cursor-pointer items-center justify-center gap-1.5 border border-ice-faint bg-transparent font-mono text-[0.65rem] tracking-[0.08em] text-ice uppercase transition-colors duration-200 hover:border-ice"
      >
        {TRACK_LABELS[state.track]}
        <span aria-hidden="true" className="text-ice-dim">
          {open ? '–' : '⌄'}
        </span>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute top-[calc(100%+2px)] right-0 z-10 w-[11rem] border border-ice-faint bg-raise"
        >
          {TRACKS.map((track: Track) => (
            <li key={track} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setTrack(track)
                  setOpen(false)
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left font-mono text-[0.65rem] tracking-[0.08em] uppercase transition-colors duration-200 hover:bg-deep ${
                  track === state.track ? 'text-ice' : 'text-ice-dim'
                }`}
              >
                {TRACK_LABELS[track]}
              </button>
            </li>
          ))}
          <li role="none" className="border-t border-ice-faint">
            <Link
              href="/begin/"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:bg-deep"
            >
              Retake placement
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}
