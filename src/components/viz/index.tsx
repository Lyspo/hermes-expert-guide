import type { ReactNode } from 'react'
import { MemoryPlate } from './memory-plate'
import { OrchestrationPlate } from './orchestration-plate'
import { PromptPlate } from './prompt-plate'
import { SkillLoopPlate } from './skill-loop-plate'

/**
 * The plate registry.
 *
 * Plates are server components with no client JavaScript at all — the scroll-scrubbed
 * variants in design.md are a later enhancement layered on top, not a prerequisite.
 * A plate is complete and readable as static SVG, which is also what makes it work in
 * print and under reduced motion.
 */
export const PLATES: Record<string, () => ReactNode> = {
  prompt: PromptPlate,
  memory: MemoryPlate,
  'skill-loop': SkillLoopPlate,
  orchestration: OrchestrationPlate,
}

/**
 * Below this, a plate's 10px labels shrink faster than they stay legible, so the
 * figure scrolls instead of scaling. Wide content scrolls in its own container —
 * the page itself never does.
 */
const LEGIBLE_WIDTH = '38rem'

export function Viz({ id, caption }: { id: string; caption?: string }) {
  const Plate = PLATES[id]

  if (!Plate) {
    return (
      <p className="my-[var(--step)] border-l-2 border-signal pl-3 font-mono text-[0.8rem] text-signal">
        No plate registered as “{id}”.
      </p>
    )
  }

  return (
    <figure className="my-[calc(var(--step)*1.6)]">
      <div className="transcript overflow-x-auto px-[calc(var(--step)*0.9)] py-[calc(var(--step)*0.9)]">
        <div style={{ minWidth: LEGIBLE_WIDTH }}>
          <Plate />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-[calc(var(--step)*0.4)] max-w-[68ch] font-mono text-[0.65rem] leading-[1.7] text-ice-dim">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
