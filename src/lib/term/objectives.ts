import type { TermState } from './machine'

/**
 * Console objectives: the strongest form of mastery this guide can ask for.
 *
 * A question can be passed by recognising a sentence. An objective cannot — the reader
 * has to drive the console until the thing actually happens, and the predicate reads
 * what the console printed rather than what the reader claims. That is the difference
 * between "I read about the approval gate" and "I have watched a recursive delete run
 * with no prompt, then made it prompt, then answered it."
 *
 * Predicates are pure functions of `TermState`, so they are testable without a browser
 * and cannot be satisfied by anything except output the machine actually emitted — and
 * the machine can only emit what the corpus captured. The chain holds end to end.
 *
 * Every id here is validated against lesson frontmatter at build time. A lesson naming
 * an objective that does not exist fails the build rather than becoming unmasterable.
 */

export interface Objective {
  id: string
  /** What the reader is asked to do, in the imperative. */
  label: string
  /** How, when they are stuck. Never gives away the observation itself. */
  hint: string
  done: (state: TermState) => boolean
}

const text = (state: TermState) => state.lines.map((line) => line.text).join('\n')

export const OBJECTIVES: Objective[] = [
  {
    id: 'approval-gate-both-modes',
    label: 'Run the same destructive command under both approval modes.',
    hint: 'Ask it to recursively delete /tmp/hermes-scratch. Then `:approvals manual` and ask again.',
    done: (state) => {
      const output = text(state)
      // The default-mode run: `[09]` §11's 5.0s, which is the LLM assessment
      // round-trip showing up in the timing rather than a prompt.
      const silent = output.includes('rm -rf /tmp/hermes-scratch  5.0s')
      // And a gate that was actually answered, either way.
      const gated = /⚠ Approval: rm -rf \/tmp\/hermes-scratch → (denied|allowed once)/.test(output)
      return silent && gated
    },
  },
  {
    id: 'skill-loop-fires',
    label: 'Make the self-improvement review fire, and read what it wrote.',
    hint: 'Give it a real task — ask it to find under-the-radar GitHub repos.',
    done: (state) => state.skills.length > 0,
  },
  {
    id: 'no-daemon',
    label: 'Confirm against the software that `hermes daemon` does not exist.',
    hint: 'Type it. Then check the real command surface with `hermes --help`.',
    done: (state) => {
      const output = text(state)
      return output.includes("No such command 'daemon'") && output.includes('prompt-size')
    },
  },
  {
    id: 'compress-noop',
    label: 'Watch /compress do nothing, and find out why.',
    hint: 'Start a session with `hermes`, then run `/compress`.',
    done: (state) => text(state).includes('No changes from compression'),
  },
  {
    id: 'refusal-boundary',
    label: 'Find the edge of what was actually captured.',
    hint: 'Ask the console for a command nobody recorded — `hermes kanban`, say.',
    done: (state) => text(state).includes('never captured'),
  },
]

export const OBJECTIVE_IDS: string[] = OBJECTIVES.map((objective) => objective.id)

export function objectiveById(id: string): Objective | undefined {
  return OBJECTIVES.find((objective) => objective.id === id)
}
