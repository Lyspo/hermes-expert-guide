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

export const SIMULATIONS: Record<string, SimScript> = {
  [aTurnInFull.id]: aTurnInFull,
}

export function getSimulation(id: string): SimScript | undefined {
  return SIMULATIONS[id]
}
