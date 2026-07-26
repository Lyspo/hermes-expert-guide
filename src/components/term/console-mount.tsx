'use client'

import dynamic from 'next/dynamic'

/**
 * Keeps the console out of every lesson's initial JavaScript.
 *
 * `ssr: false` means the interactive component is never server-rendered, so it is not in
 * the first chunk and does not cost a reader who scrolls past it. What *is* server-
 * rendered is `fallback` — a server component passed in as a slot — so the exported HTML
 * still contains the captured transcript in full.
 *
 * That split is the whole no-JavaScript commitment in one file: the document is complete
 * without this, and better with it.
 */
const Console = dynamic(() => import('./console').then((mod) => mod.Console), {
  ssr: false,
})

export function ConsoleMount({
  prompt,
  fallback,
}: {
  prompt?: string
  fallback: React.ReactNode
}) {
  // Spread rather than pass through: `exactOptionalPropertyTypes` is on, so an explicit
  // `prompt={undefined}` is not the same thing as an absent prop.
  return <Console {...(prompt === undefined ? {} : { prompt })} fallback={fallback} />
}
