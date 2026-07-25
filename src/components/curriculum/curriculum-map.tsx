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

const ICE = '228,239,243'
const ICE_DIM = '141,163,172'
const ICE_FAINT = '74,92,101'
const SIGNAL = '196,86,110'

const TONE: Record<Readiness, { rgb: string; alpha: number; scale: number }> = {
  known: { rgb: ICE, alpha: 1, scale: 1.2 },
  ready: { rgb: SIGNAL, alpha: 1.15, scale: 1.5 },
  far: { rgb: ICE_FAINT, alpha: 0.9, scale: 0.95 },
}

/** How much of the box the nearest nodes reach. Slightly over 1, so the graph bleeds. */
const FILL = 1.12
/** Pointer slop for hit-testing, in CSS pixels. Generous: the targets are small. */
const REACH = 26

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

  useEffect(() => {
    const box = frame.current
    const surface = canvas.current
    if (!box || !surface) return

    const context = surface.getContext('2d')
    if (!context) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let raf = 0
    let time = 0

    // Measured from the *container*, never from the canvas. The canvas is absolutely
    // positioned so it cannot contribute to its parent's size, which is what breaks
    // the feedback loop that once produced a three-gigapixel buffer here.
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = box.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      surface.width = Math.round(width * ratio)
      surface.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const centreX = width / 2
      const centreY = height / 2

      const projected = graph.nodes.map((node) => {
        const z = node.z + Math.sin(time * 0.3 + node.x * 9 + node.y * 7) * 0.05
        const perspective = 1 / (1.95 + z)
        return {
          x: centreX + (node.x / extent.x) * perspective * FILL * (width / 2),
          y: centreY + (node.y / extent.y) * perspective * FILL * (height / 2),
          alpha: 0.2 + Math.max(0, perspective - 0.33) * 1.5,
          radius: Math.max(0.9, node.weight * perspective * 3.4),
        }
      })
      points.current = projected

      // With a lesson under the pointer, everything outside its prerequisite chain is
      // pushed down rather than hidden: the rest of the curriculum stays visible as
      // context, which is the whole reason to show it in one frame.
      const lit = (index: number) =>
        chain === null || index === hovered || chain.has(index)
      // Enough that the rest of the curriculum still reads as a structure the chain
      // is embedded in. Pushed too far down, the reveal stops being "here is your
      // path through this" and becomes "here is a path, in the dark".
      const muted = chain === null ? 1 : 0.3

      context.lineWidth = 0.8
      for (const [from, to] of graph.edges) {
        const a = projected[from]
        const b = projected[to]
        if (!a || !b) continue

        const onChain = chain !== null && lit(from) && lit(to)
        const walked = readiness[from] === 'known' && readiness[to] === 'known'
        const weight = onChain ? 0.85 : walked ? 0.5 : 0.22
        const alpha = Math.min(a.alpha, b.alpha) * weight * (onChain ? 1 : muted)
        if (alpha <= 0.004) continue

        context.strokeStyle = `rgba(${onChain ? ICE : walked ? ICE_DIM : ICE_FAINT},${alpha.toFixed(3)})`
        context.beginPath()
        context.moveTo(a.x, a.y)
        context.lineTo(b.x, b.y)
        context.stroke()
      }

      projected.forEach((point, index) => {
        const tone = TONE[readiness[index] ?? 'far']
        const onChain = lit(index)
        const isHovered = index === hovered

        const rgb = isHovered ? ICE : onChain && chain !== null ? ICE : tone.rgb
        const alpha = Math.min(0.95, point.alpha * tone.alpha * (onChain ? 1 : muted))
        const radius = Math.max(0.5, point.radius * tone.scale * (isHovered ? 1.9 : 1))

        context.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`
        context.beginPath()
        context.arc(point.x, point.y, radius, 0, Math.PI * 2)
        context.fill()

        // A ring on the lesson under the pointer, so the target is unmistakable even
        // where the graph is dense.
        if (isHovered) {
          context.strokeStyle = `rgba(${ICE},0.55)`
          context.lineWidth = 1
          context.beginPath()
          context.arc(point.x, point.y, radius + 6, 0, Math.PI * 2)
          context.stroke()
          context.lineWidth = 0.8
        }
      })
    }

    const loop = () => {
      time += 0.005
      draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    draw()
    if (!still) raf = requestAnimationFrame(loop)

    const observer = new ResizeObserver(() => {
      resize()
      draw()
    })
    observer.observe(box)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [graph, readiness, chain, hovered, extent])

  const locate = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const surface = canvas.current
    if (!surface) return
    const rect = surface.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    let nearest: number | null = null
    let best = REACH
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
    <div data-curriculum-map>
      <div
        ref={frame}
        className="relative h-[clamp(22rem,56vh,36rem)] w-full"
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 min-h-[5.5rem]">
          {active ? (
            <div className="max-w-[38rem] border-l border-signal pl-[calc(var(--step)*0.6)]">
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
            <p className="max-w-[34rem] font-mono text-[0.68rem] leading-relaxed text-ice-dim">
              Every point is a lesson, every line a prerequisite it declares, and depth is
              how far into the course it sits. Point at one to light up everything you
              need first.
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
    </div>
  )
}
