'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/guide-store'
import type { MapGraph } from '@/lib/map-layout'

/**
 * The client boundary for the field.
 *
 * OGL and the renderer load only here, and only on this route — the map is the one page
 * that wants a GPU, and a lesson page should not pay for it. `ssr: false` keeps the
 * whole thing out of the server render, where a canvas would be an empty element
 * anyway.
 *
 * Which nodes are lit comes from stored mastery, so the graph a reader sees is theirs.
 * Before storage has been read, nothing is lit rather than everything — an unlit node
 * that turns out to be earned is a pleasant correction; a lit one that turns out not to
 * be is a lie.
 */
const FieldMap = dynamic(() => import('./field-map').then((mod) => mod.FieldMap), {
  ssr: false,
  loading: () => <div className="h-[62vh] min-h-[24rem] w-full" aria-hidden="true" />,
})

export function MapCanvas({ graph }: { graph: MapGraph }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return <FieldMap graph={graph} mastered={snapshot.state.mastery.mastered} />
}
