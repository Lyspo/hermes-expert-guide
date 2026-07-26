'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/guide-store'
import { ancestorsOf, readinessOf, type CurriculumGraph, type Readiness } from '@/lib/graph'
import type { MapEntry } from '@/lib/curriculum-graph'

/**
 * The curriculum, as the thing itself rather than a list pretending to be one.
 *
 * design.md: "module and lesson order maps to depth and position in the field, so the
 * curriculum map is a view of the structure rather than a table of contents drawn to
 * look like one." This is that page. Every point is a lesson at its real position in
 * the prerequisite graph, and the interaction is the part that teaches: point at any
 * lesson and its entire chain back to the root lights up while everything else
 * recedes. "What do I need before this" stops being a list of links to click through
 * and becomes a shape you can see in one glance — which for a lesson eleven levels
 * deep is the difference between an answer and a research task.
 *
 * The accessibility contract is what makes this shippable rather than a demo. The
 * canvas is `aria-hidden` and carries no information of its own: every lesson is also
 * a real link in the list below, grouped by module, complete in the static HTML and
 * reachable by keyboard. Focus a link and its node lights up with the same chain, so
 * a keyboard reader gets the same teaching, not a lesser version of it. Without
 * JavaScript the page is a well-organised index of the curriculum, which is exactly
 * what it should degrade to.
 */

// The palette moved into `field-renderer.ts` when the drawing did: colour is now a
// material sampled by a shader rather than an rgba string, and keeping a second copy
// here as text was how the two would drift apart.

/** A module's shop-window prose, so the index below the map is the only index. */
export interface MapModule {
  number: number
  title: string
  summary: string
  url: string
  written: number
  total: number
  minutes: number
}

export function CurriculumMap({
  graph,
  entries,
  modules,
}: {
  graph: CurriculumGraph
  entries: MapEntry[]
  modules: MapModule[]
}) {
  const router = useRouter()
  const frame = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  /** Projected positions, refreshed every drawn frame, so hit-testing is a lookup. */
  const points = useRef<Array<{ x: number; y: number }>>([])
  const [hovered, setHovered] = useState<number | null>(null)

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const completedKey = snapshot.state.progress.completedLessons.join('|')

  const readiness = useMemo(() => {
    const done = new Set(snapshot.state.progress.completedLessons)
    return graph.nodes.map((node) => readinessOf(node, done))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, completedKey])

  const chain = useMemo(
    () => (hovered === null ? null : ancestorsOf(graph, hovered)),
    [graph, hovered],
  )

  /**
   * The layout's reach on each axis, measured separately.
   *
   * Normalising both against one radius looked principled and wasted half the box:
   * the widest nodes sit near the horizontal axis, so that single figure is set by
   * `x` and leaves `y` filling about half of what it could. Per-axis, the drawing
   * fills whatever container it is given, and the ellipse comes from the box's own
   * proportions rather than from a constant nobody would think to re-tune.
   */
  const extent = useMemo(() => {
    const x = Math.max(...graph.nodes.map((node) => Math.abs(node.x))) || 1
    const y = Math.max(...graph.nodes.map((node) => Math.abs(node.y))) || 1
    return { x, y }
  }, [graph])

  /**
   * What the next drawn frame should show, held in a ref rather than closed over.
   *
   * The renderer is built once and *driven*; it is not rebuilt when the pointer moves.
   * An earlier version listed `hovered` in the effect's dependencies, so every hover
   * tore the field down and stood a new one up — and since `dispose` forced the WebGL
   * context lost, the replacement linked its programs against a dead context and threw.
   * A map that died the moment you pointed at it, from a dependency array.
   */
  const frameState = useRef<{
    hovered: number | null
    chain: Set<number> | null
    readiness: readonly Readiness[]
  }>({ hovered: null, chain: null, readiness: [] })

  // Assigned in an effect rather than during render: writing a ref while rendering is
  // a lint error here for good reason, and this one only has to be current by the time
  // the next animation frame runs, which is strictly after commit.
  useEffect(() => {
    frameState.current = { hovered, chain, readiness }
  }, [hovered, chain, readiness])

  useEffect(() => {
    const box = frame.current
    const surface = canvas.current
    if (!box || !surface) return

    let cancelled = false
    let teardown: (() => void) | undefined

    void (async () => {
      // Imported inside the effect, so OGL is in no bundle until this map mounts.
      // Statically importing it put 14 kB of renderer into the guide index's initial
      // payload — `pnpm budgets` caught it at +16.9 kB against a 4 kB allowance, which
      // is the entire reason that gate was rewritten to measure first-party code.
      const { createField } = await import('./field-renderer')
      if (cancelled) return

      // Lit geometry rather than a flat painting — see `field-renderer.ts` for why, and
      // `research/design/06-direction-calibration.md` for the reactions that decided it.
      const field = createField(surface, graph, extent)
      if (!field) return

      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let raf = 0
      let time = 0

      // Measured from the *container*, never from the canvas. The canvas is absolutely
      // positioned so it cannot contribute to its parent's size, which is what breaks
      // the feedback loop that once produced a three-gigapixel buffer here.
      const resize = () => {
        const rect = box.getBoundingClientRect()
        field.resize(Math.max(1, rect.width), Math.max(1, rect.height))
      }

      const draw = () => {
        points.current = field.draw({ time, ...frameState.current })
      }

      const loop = () => {
        time += 0.016
        draw()
        raf = requestAnimationFrame(loop)
      }

      resize()
      draw()
      if (!still) raf = requestAnimationFrame(loop)

      // With motion stilled nothing repaints on its own, so the highlight has to be
      // driven by whatever changed it.
      const repaint = () => {
        if (still) draw()
      }
      box.addEventListener('pointermove', repaint)
      box.addEventListener('focusin', repaint)

      const observer = new ResizeObserver(() => {
        resize()
        draw()
      })
      observer.observe(box)

      teardown = () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
        box.removeEventListener('pointermove', repaint)
        box.removeEventListener('focusin', repaint)
        field.dispose()
      }
    })()

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [graph, extent])

  const locate = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const surface = canvas.current
    if (!surface) return
    const rect = surface.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Always the nearest node, with no proximity threshold: while the pointer is over
    // the map it owns whichever lesson is closest, the way a Voronoi cell does.
    //
    // This was a radius check, and it made the whole page look broken. The nodes are
    // two or three pixels across and spread over a box a thousand wide, so requiring
    // a hit within 26px of one meant that sweeping the pointer across the graph found
    // nothing about four times in five — and a map that does not respond is
    // indistinguishable from a decorative field of dots. It survived review because
    // every check drove the interaction through the lesson links below, which set the
    // state directly and never exercise this function at all.
    let nearest: number | null = null
    let best = Infinity
    points.current.forEach((point, index) => {
      const distance = Math.hypot(point.x - x, point.y - y)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    setHovered(nearest)
  }, [])

  const open = useCallback(() => {
    if (hovered === null) return
    const entry = entries[hovered]
    if (entry?.written) router.push(entry.url)
  }, [hovered, entries, router])

  const active = hovered === null ? null : entries[hovered]
  const byModule = useMemo(() => {
    const grouped = new Map<number, Array<{ index: number; entry: MapEntry }>>()
    entries.forEach((entry, index) => {
      const existing = grouped.get(entry.moduleNumber)
      if (existing) existing.push({ index, entry })
      else grouped.set(entry.moduleNumber, [{ index, entry }])
    })
    return [...grouped.entries()].sort((a, b) => a[0] - b[0])
  }, [entries])

  return (
    <section data-curriculum-map aria-labelledby="curriculum-map-heading">
      {/*
        A titled, bounded component — not a backdrop.

        The first version had no heading, no frame and no surface: bare points on the
        page ground with a 10px caption under them. Every other component here sits on
        a plane with a hairline edge, so the one that did not read as decoration, and
        a reader looking for "the map" could not tell it from the ambient field behind
        every other page. A feature has to announce that it is one.
      */}
      <div className="flex flex-wrap items-baseline justify-between gap-[calc(var(--step)*0.5)] border-t border-ice-faint pt-[calc(var(--step)*0.7)]">
        <h2
          id="curriculum-map-heading"
          className="font-display text-[1.5rem] tracking-[-0.02em]"
        >
          The shape of the course
        </h2>
        <p className="font-mono text-[0.68rem] text-ice-dim">
          51 lessons · 79 prerequisites · 11 deep
        </p>
      </div>

      <p className="mt-[calc(var(--step)*0.5)] max-w-[64ch] text-[0.95rem] leading-relaxed text-ice-dim">
        Every point is a lesson and every line a prerequisite it declares in its own
        frontmatter. Point at any one of them and everything you need to understand
        first lights up with it — then click to open it.
      </p>

      <div
        ref={frame}
        className="transcript relative mt-[calc(var(--step)*0.8)] h-[clamp(20rem,50vh,32rem)] w-full"
        onPointerLeave={() => setHovered(null)}
      >
        <canvas
          ref={canvas}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ cursor: active?.written ? 'pointer' : 'default' }}
          onPointerMove={locate}
          onClick={open}
        />

        {/*
          The readout. Reserves its height whether or not anything is hovered, so the
          layout never moves under the pointer — the one thing guaranteed to make a
          map like this feel broken.
        */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 min-h-[5.5rem] px-[calc(var(--step)*0.9)] pb-[calc(var(--step)*0.8)]">
          {active ? (
            <div
              data-readout
              className="max-w-[38rem] border-l border-signal pl-[calc(var(--step)*0.6)]"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.06em] text-ice-dim uppercase">
                {String(active.moduleNumber).padStart(2, '0')} · {active.moduleTitle}
              </p>
              <p className="mt-[calc(var(--step)*0.25)] font-display text-[1.35rem] leading-tight tracking-[-0.02em] text-ice">
                {active.title}
              </p>
              <p className="mt-[calc(var(--step)*0.25)] font-mono text-[0.68rem] text-ice-dim">
                {active.duration} min ·{' '}
                {chain === null || chain.size === 0
                  ? 'no prerequisites'
                  : `${chain.size} lesson${chain.size === 1 ? '' : 's'} before it`}
                {active.written ? '' : ' · not yet written'}
              </p>
            </div>
          ) : (
            <p className="font-mono text-[0.68rem] text-ice-dim">
              Point anywhere in the field →
            </p>
          )}
        </div>
      </div>

      {/*
        The same graph as an index: complete without JavaScript, ordered, and keyboard
        reachable. Hovering or focusing an entry lights its node and chain, so this is
        not a lesser fallback — it is the same interaction through a different input.
      */}
      <ol className="mt-[calc(var(--step)*2)]">
        {byModule.map(([number, items]) => {
          const group = modules.find((candidate) => candidate.number === number)
          return (
          <li key={number} className="border-t border-ice-faint py-[calc(var(--step)*0.9)]">
            <p className="font-mono text-[0.68rem] tracking-[0.06em] text-ice-dim uppercase">
              {String(number).padStart(2, '0')} · {group?.total ?? items.length} lessons ·{' '}
              {group?.minutes ?? 0} min
            </p>
            <h2 className="mt-[calc(var(--step)*0.2)] font-display text-[1.35rem] tracking-[-0.02em]">
              <Link href={group?.url ?? '#'} className="no-underline">
                {group?.title ?? items[0]!.entry.moduleTitle}
              </Link>
            </h2>
            {group && (
              <p className="mt-[calc(var(--step)*0.3)] max-w-[64ch] text-[0.95rem] leading-relaxed text-ice-dim">
                {group.summary}
              </p>
            )}
            <ol className="mt-[calc(var(--step)*0.5)] flex flex-wrap gap-x-[calc(var(--step)*0.9)] gap-y-[calc(var(--step)*0.2)]">
              {items.map(({ index, entry }) => (
                <li key={entry.url}>
                  {entry.written ? (
                    <Link
                      href={entry.url}
                      onMouseEnter={() => setHovered(index)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                      className="text-[0.9rem] text-ice decoration-ice-faint underline-offset-2"
                    >
                      {entry.title}
                    </Link>
                  ) : (
                    <span
                      onMouseEnter={() => setHovered(index)}
                      className="text-[0.9rem] text-ice-dim"
                    >
                      {entry.title}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </li>
          )
        })}
      </ol>
    </section>
  )
}
