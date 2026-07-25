import type { Track } from './site'

/**
 * The placement questions and their scoring.
 *
 * Kept pure and free of React so the scoring can be tested directly — placing a
 * reader on the wrong track is a quiet failure that no type checker catches.
 *
 * The questions ask what the reader *wants from* Hermes, not how skilled they
 * are. Tracks here are three perspectives, not three difficulty levels, so a
 * quiz that measured expertise would sort people along the wrong axis.
 */

export interface Choice {
  id: string
  label: string
  /** Weight toward each track. Values are small integers; magnitude is meaning. */
  weight: Partial<Record<Track, number>>
}

export interface Question {
  id: string
  /** The question itself, in the reader's own terms. */
  prompt: string
  /** Shown under the prompt when the question needs framing. */
  note?: string
  choices: Choice[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'why',
    prompt: 'What do you want Hermes for?',
    choices: [
      {
        id: 'personal',
        label: 'Running my own work better — email, research, recurring admin',
        weight: { newcomer: 3, operator: 1 },
      },
      {
        id: 'build',
        label: 'Building something with it, or on it',
        weight: { operator: 3 },
      },
      {
        id: 'decide',
        label: 'Deciding whether my organisation can permit it',
        weight: { architect: 3, operator: 1 },
      },
      {
        id: 'curious',
        label: 'Understanding how a self-improving agent actually works',
        weight: { newcomer: 1, operator: 1, architect: 1 },
      },
    ],
  },
  {
    id: 'terminal',
    prompt: 'How does a terminal feel to you?',
    note: 'Every track uses one. This only changes how much is explained.',
    choices: [
      {
        id: 'home',
        label: "It's where I work",
        weight: { operator: 3, architect: 1 },
      },
      {
        id: 'fine',
        label: 'Fine with exact commands to paste',
        weight: { newcomer: 2, architect: 2 },
      },
      {
        id: 'rarely',
        label: 'I open one rarely and follow instructions carefully',
        weight: { newcomer: 3 },
      },
    ],
  },
  {
    id: 'where',
    prompt: 'Where will it run?',
    choices: [
      {
        id: 'laptop',
        label: 'My own machine',
        weight: { newcomer: 3, operator: 1 },
      },
      {
        id: 'server',
        label: 'A server I administer',
        weight: { operator: 3 },
      },
      {
        id: 'shared',
        label: "Somewhere other people's data passes through",
        weight: { architect: 3, operator: 1 },
      },
      {
        id: 'unsure',
        label: "Haven't decided",
        weight: { newcomer: 1, architect: 1 },
      },
    ],
  },
  {
    id: 'question',
    prompt: 'Which question would you most want answered by the end?',
    choices: [
      {
        id: 'howto',
        label: 'How do I get it doing something useful for me?',
        weight: { newcomer: 3 },
      },
      {
        id: 'mechanism',
        label: 'How does it actually work under the hood?',
        weight: { operator: 3 },
      },
      {
        id: 'control',
        label: 'What can it do that I have not authorised, and how would I know?',
        weight: { architect: 3 },
      },
    ],
  },
  {
    id: 'wrong',
    prompt: 'Something goes wrong at 2am. What do you want to have?',
    choices: [
      {
        id: 'undo',
        label: 'A way to undo it and a plain explanation',
        weight: { newcomer: 3 },
      },
      {
        id: 'logs',
        label: 'Logs, a config file, and the code path',
        weight: { operator: 3 },
      },
      {
        id: 'record',
        label: 'A record I can hand to someone who will ask hard questions',
        weight: { architect: 3 },
      },
    ],
  },
]

/**
 * Sums the weights of the chosen answers and returns the highest.
 *
 * Ties break toward the *less* specialised track — Newcomer over Operator, and
 * Operator over Architect — because being over-explained to is a mild
 * irritation, while being under-explained to loses the reader entirely. The
 * asymmetry is deliberate.
 *
 * Answers referencing unknown questions or choices are ignored rather than
 * throwing: a stored answer set can outlive an edit to the questions.
 */
export function scoreAssessment(answers: Record<string, string>): Track {
  const totals: Record<Track, number> = { newcomer: 0, operator: 0, architect: 0 }

  for (const question of QUESTIONS) {
    const chosen = answers[question.id]
    if (!chosen) continue
    const choice = question.choices.find((candidate) => candidate.id === chosen)
    if (!choice) continue
    for (const [track, weight] of Object.entries(choice.weight)) {
      totals[track as Track] += weight ?? 0
    }
  }

  // Order encodes the tie-break; `>` never displaces an earlier equal score.
  const order: Track[] = ['newcomer', 'operator', 'architect']
  return order.reduce(
    (best, track) => (totals[track] > totals[best] ? track : best),
    order[0] as Track,
  )
}

/** How each track is described back to the reader once it is chosen. */
export const TRACK_BLURBS: Record<Track, string> = {
  newcomer:
    'You get the full path with nothing assumed: exact commands, plain explanations, and a warning before anything that can bite.',
  operator:
    'You get the mechanical model — file paths, config precedence, code paths, and the failure modes that only show up in production.',
  architect:
    'You get the control surface: what the agent can reach, what is auditable, where the guarantees stop, and what you cannot yet promise a reviewer.',
}
