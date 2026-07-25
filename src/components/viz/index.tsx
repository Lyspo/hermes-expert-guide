import type { ReactNode } from 'react'
import { AuthorizationPlate } from './authorization-plate'
import { EgressPlate } from './egress-plate'
import { MemoryPlate } from './memory-plate'
import { OrchestrationPlate } from './orchestration-plate'
import { PromptPlate } from './prompt-plate'
import { SkillLoopPlate } from './skill-loop-plate'
import { ScrubbedPlate } from './scroll/scrubbed-plate'

/**
 * The plate registry.
 *
 * Plates are server components with no client JavaScript at all. A plate that depicts
 * a *sequence* may additionally declare its beats in BEATS below, and is then wrapped
 * in a scroll scene that advances through them at the reader's pace — an enhancement
 * layered on a finished diagram, never a prerequisite for one. A plate with no beats
 * stays exactly what it was, which is also what makes plates work in print and under
 * reduced motion.
 */
export const PLATES: Record<string, () => ReactNode> = {
  prompt: PromptPlate,
  memory: MemoryPlate,
  'skill-loop': SkillLoopPlate,
  orchestration: OrchestrationPlate,
  authorization: AuthorizationPlate,
  egress: EgressPlate,
}

/**
 * The steps of the mechanisms that have one, in order, each matching a `beat` on the
 * plate's own elements. Read by the reader and not only by the scene: they render as
 * an ordered list whether or not anything animates.
 *
 * Only the skill loop has them. Its ordering — your answer is complete before the fork
 * exists — and its negative are the two things a single frame asks the reader to
 * assemble from arrows; scrubbed, the ordering is performed instead. The other plates
 * describe arrangements rather than sequences, and nothing is gained by revealing an
 * arrangement a piece at a time.
 */
const BEATS: Record<string, string[]> = {
  'skill-loop': [
    'the counter reaches ten',
    'your answer is delivered',
    'the fork spawns',
    'the walls close',
    'nothing comes back',
    'the write lands',
    'the curator, days later',
  ],
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

  const beats = BEATS[id]
  const drawing = (
    <div className="transcript overflow-x-auto px-[calc(var(--step)*0.9)] py-[calc(var(--step)*0.9)]">
      <div style={{ minWidth: LEGIBLE_WIDTH }}>
        <Plate />
      </div>
    </div>
  )

  return (
    <figure className="my-[calc(var(--step)*1.6)]">
      {beats ? <ScrubbedPlate beats={beats}>{drawing}</ScrubbedPlate> : drawing}
      {caption && (
        <figcaption className="mt-[calc(var(--step)*0.4)] max-w-[68ch] font-mono text-[0.65rem] leading-[1.7] text-ice-dim">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
