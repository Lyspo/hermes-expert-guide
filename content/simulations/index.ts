import type { SimScript } from '@/lib/sim/script'

/**
 * The replay registry.
 *
 * Scripts are imported eagerly because they are small typed data — a few kB each —
 * and eager import keeps the transcript server-rendered, which is what makes the
 * no-JavaScript and reduced-motion cases complete rather than degraded. The player
 * component is what loads lazily.
 */
import { script as aTurnInFull } from './a-turn-in-full'
import { script as memoryFillsUp } from './memory-fills-up'
import { script as aJobThatFiresAtNine } from './a-job-that-fires-at-nine'
import { script as lettingSomeoneElseIn } from './letting-someone-else-in'
import { script as threeChildren } from './three-children-and-no-memory-of-you'

export const SIMULATIONS: Record<string, SimScript> = {
  [aTurnInFull.id]: aTurnInFull,
  [memoryFillsUp.id]: memoryFillsUp,
  [aJobThatFiresAtNine.id]: aJobThatFiresAtNine,
  [lettingSomeoneElseIn.id]: lettingSomeoneElseIn,
  [threeChildren.id]: threeChildren,
}

export function getSimulation(id: string): SimScript | undefined {
  return SIMULATIONS[id]
}
