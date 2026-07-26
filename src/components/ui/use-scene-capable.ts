'use client'

import { useSyncExternalStore } from 'react'

/**
 * Whether a scroll scene should run at all.
 *
 * Two conditions, both of which can change while the page is open: the reader has
 * not asked for reduced motion, and the viewport is wide enough that pinning a
 * section is a reasonable thing to do to them. On a phone, scrubbing a stack of
 * full-height panels costs several screens of scrolling to read a few sentences,
 * and the plain list underneath is simply the better reading.
 *
 * `useSyncExternalStore` rather than a media-query check inside an effect. Reading
 * the environment and calling `setState` in an effect body cascades a render, is
 * rejected by React 19's lint, and — the part that actually matters here — gives a
 * first paint that disagrees with the second. This subscribes properly, so flipping
 * the OS motion preference or dragging the window narrow takes effect immediately
 * instead of at the next navigation.
 *
 * The server snapshot is `false`, which is the honest answer: a scene is an
 * enhancement, and the markup that ships is the version without it.
 */
const QUERIES = ['(min-width: 64rem)', '(prefers-reduced-motion: reduce)'] as const

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const lists = QUERIES.map((query) => window.matchMedia(query))
  for (const list of lists) list.addEventListener('change', onChange)
  return () => {
    for (const list of lists) list.removeEventListener('change', onChange)
  }
}

function getSnapshot(): boolean {
  const [wide, reduced] = QUERIES.map((query) => window.matchMedia(query).matches)
  return Boolean(wide) && !reduced
}

const getServerSnapshot = () => false

export function useSceneCapable(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
