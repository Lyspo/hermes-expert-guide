/**
 * HermesScript — the recorded-session format.
 *
 * Typed TypeScript modules rather than JSON, so scripts get autocomplete, comments
 * and compile-time checking for free. A script describes *what happened*, never how
 * it should look: presentation belongs to the player.
 *
 * The format is deliberately shaped so a real capture can replace a reconstruction
 * without touching any code. `fidelity` is mandatory and per-script, because at the
 * time of writing no recording of a real Hermes session is known to exist publicly,
 * and every replay here is reconstructed from documented output formats. When a real
 * capture arrives, the honest change is one field and the event list — nothing else.
 */

export type SimEvent =
  /** What the operator typed. `cps` overrides the default typing speed. */
  | { t: 'user'; text: string; cps?: number }
  /** Reasoning the UI shows before acting. Collapsed by default in long runs. */
  | { t: 'think'; text: string; collapsed?: boolean }
  /** Prose the agent writes back. */
  | { t: 'say'; text: string; cps?: number }
  /** A tool invocation, with the arguments the model supplied. */
  | { t: 'tool'; name: string; args?: string }
  /** A tool's result. `truncated` records how many lines were elided. */
  | { t: 'result'; name: string; output: string; ms?: number; truncated?: number }
  /**
   * The pedagogical payload: the agent writing or revising its own procedure.
   * First-class rather than a styled tool call, because these moments are the
   * reason the replays exist at all.
   */
  | { t: 'skill'; kind: 'create' | 'improve' | 'invoke'; name: string; note?: string }
  /** Something entering or being read from the record. */
  | { t: 'memory'; layer: 'memory' | 'user' | 'session'; note: string }
  /** Delegation, and what came back. */
  | { t: 'agent'; kind: 'spawn' | 'return'; label: string; note?: string }
  /** Dead air, in milliseconds. Used where the real session waited. */
  | { t: 'wait'; ms: number }
  /** A named position, for scrubber ticks and deep links. */
  | { t: 'marker'; id: string; label: string }
  /** Teaching overlay. Pauses playback in guided mode; always visible in the transcript. */
  | { t: 'note'; text: string }

export interface SimScript {
  id: string
  title: string
  /** One line on what the reader should watch for. */
  premise: string
  /**
   * How much of this is literally what Hermes prints.
   *
   * `verbatim` — captured from a real session or copied from documented output.
   * `reconstructed` — assembled from documented formats; the sequence is plausible
   *   and sourced, but this exact session never ran.
   */
  fidelity: 'verbatim' | 'reconstructed'
  /** Where the formats came from. Rendered with the replay; never omitted. */
  source: string
  /** The Hermes release whose output format this reflects. */
  hermesVersion: string
  events: SimEvent[]
}

/** Characters per second, when an event does not override it. */
export const DEFAULT_CPS = { user: 42, say: 90 } as const

/** How long a non-typed event occupies, in milliseconds. */
export const DEFAULT_MS = {
  think: 900,
  tool: 420,
  result: 520,
  skill: 1500,
  memory: 900,
  agent: 700,
  marker: 0,
  note: 0,
} as const
