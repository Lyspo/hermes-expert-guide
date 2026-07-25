'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SimScript } from '@/lib/sim/script'
import { buildTimeline, revealed, stepBoundaries, visibleAt } from '@/lib/sim/timeline'
import { EventRow } from './transcript-body'

const SPEEDS = [0.5, 1, 1.5, 3] as const

/**
 * Progressive playback over the transcript.
 *
 * The state is one number. Everything rendered is derived from `virtualTime` by the
 * pure engine, which is why scrubbing lands exactly where playing would and why
 * changing speed mid-replay cannot desynchronise anything.
 *
 * Two things this deliberately does not do. It never advances time inside a React
 * state update loop — the frame loop writes to a ref and schedules one state commit
 * per frame. And it never depends on an animation completing: with reduced motion
 * the replay opens finished, and stepping is discrete.
 */
export function Player({ script }: { script: SimScript }) {
  const timeline = useMemo(() => buildTimeline(script), [script])

  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<number>(1)
  const [stepMode, setStepMode] = useState(false)

  const frame = useRef(0)
  const last = useRef(0)

  // A reader who has asked for less motion gets the finished transcript and a
  // step-through control instead of a clock.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (query.matches) {
        setStepMode(true)
        setPlaying(false)
        setTime(timeline.total)
      }
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [timeline.total])

  useEffect(() => {
    if (!playing) return
    last.current = performance.now()

    const tick = (now: number) => {
      const delta = now - last.current
      last.current = now
      setTime((current) => {
        const next = current + delta * speed
        if (next >= timeline.total) {
          setPlaying(false)
          return timeline.total
        }
        return next
      })
      frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [playing, speed, timeline.total])

  const toggle = useCallback(() => {
    if (time >= timeline.total) setTime(0)
    setPlaying((value) => !value)
  }, [time, timeline.total])

  const step = useCallback(
    (direction: 1 | -1) => {
      setPlaying(false)
      const { next, previous } = stepBoundaries(timeline, time)
      setTime(direction === 1 ? next : previous)
    },
    [timeline, time],
  )

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setPlaying(false)
      setTime(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setPlaying(false)
      setTime(timeline.total)
    }
  }

  const slots = visibleAt(timeline, time)
  const done = time >= timeline.total
  const currentMarker = [...timeline.markers].reverse().find((marker) => marker.at <= time)

  return (
    <div
      className="transcript mt-[calc(var(--step)*0.75)]"
      onKeyDown={onKeyDown}
      // Focusable so keyboard control works without hunting for a button, and
      // labelled so its purpose is announced.
      tabIndex={0}
      role="group"
      aria-label={`Replay: ${script.title}. Space to play or pause, arrow keys to step.`}
    >
      <ol className="min-h-[22rem] overflow-x-auto px-[calc(var(--step)*0.75)] py-[calc(var(--step)*0.7)]">
        {slots.map((slot) => {
          const typed = slot.event.t === 'user' || slot.event.t === 'say'
          return (
            <EventRow
              key={slot.index}
              event={slot.event}
              reveal={
                typed && slot.progress < 1
                  ? revealed((slot.event as { text: string }).text, slot.progress)
                  : undefined
              }
              active={typed && slot.progress < 1}
            />
          )
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3 border-t border-ice-faint/60 px-[calc(var(--step)*0.75)] py-[calc(var(--step)*0.5)]">
        <button
          type="button"
          onClick={toggle}
          className="w-[4.5rem] shrink-0 cursor-pointer border border-ice-faint bg-transparent py-1 font-mono text-[0.65rem] tracking-[0.1em] text-ice uppercase transition-colors duration-200 hover:border-ice"
        >
          {playing ? 'Pause' : done ? 'Replay' : 'Play'}
        </button>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous event"
            className="cursor-pointer border border-ice-faint bg-transparent px-2 py-1 font-mono text-[0.65rem] text-ice-dim transition-colors duration-200 hover:border-ice hover:text-ice"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next event"
            className="cursor-pointer border border-ice-faint bg-transparent px-2 py-1 font-mono text-[0.65rem] text-ice-dim transition-colors duration-200 hover:border-ice hover:text-ice"
          >
            ›
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={Math.round(timeline.total)}
          value={Math.round(time)}
          onChange={(event) => {
            setPlaying(false)
            setTime(Number(event.target.value))
          }}
          aria-label="Position in replay"
          aria-valuetext={
            currentMarker ? currentMarker.label : done ? 'End' : 'Beginning'
          }
          className="h-1 min-w-[7rem] flex-1 cursor-pointer accent-[var(--color-ice)]"
        />

        <button
          type="button"
          onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed as 1) + 1) % SPEEDS.length]!)}
          aria-label={`Speed: ${speed} times. Click to change.`}
          className="w-[3rem] shrink-0 cursor-pointer border border-ice-faint bg-transparent py-1 font-mono text-[0.65rem] text-ice-dim transition-colors duration-200 hover:border-ice hover:text-ice"
        >
          {speed}×
        </button>
      </div>

      {stepMode && (
        <p className="border-t border-ice-faint/60 px-[calc(var(--step)*0.75)] py-2 font-mono text-[0.65rem] text-ice-dim">
          Reduced motion is on, so the replay opens finished. Step through it with the
          arrows.
        </p>
      )}
    </div>
  )
}
