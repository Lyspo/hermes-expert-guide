'use client'

import { useReducer } from 'react'
import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { QUESTIONS, TRACK_BLURBS, scoreAssessment } from '@/lib/tracks'
import { TRACKS, TRACK_LABELS, type Track } from '@/lib/site'
import { useGuide } from './track-provider'

/**
 * Placement.
 *
 * A plain reducer rather than a state machine library: the flow is linear with one
 * branch, and a dependency would be larger than the logic. Motion is loaded through
 * LazyMotion with the `domAnimation` feature set so this route costs a few kB
 * rather than the full library.
 *
 * Five questions, answerable in under a minute, with an explicit escape at every
 * step — a reader who already knows their track should never be made to earn it.
 */

type State =
  | { step: 'intro' }
  | { step: 'asking'; index: number; answers: Record<string, string> }
  | { step: 'result'; track: Track; answers: Record<string, string> }

type Action =
  | { type: 'start' }
  | { type: 'answer'; questionId: string; choiceId: string }
  | { type: 'back' }
  | { type: 'restart' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { step: 'asking', index: 0, answers: {} }

    case 'answer': {
      if (state.step !== 'asking') return state
      const answers = { ...state.answers, [action.questionId]: action.choiceId }
      const next = state.index + 1
      return next >= QUESTIONS.length
        ? { step: 'result', track: scoreAssessment(answers), answers }
        : { step: 'asking', index: next, answers }
    }

    case 'back': {
      if (state.step !== 'asking' || state.index === 0) return { step: 'intro' }
      return { ...state, index: state.index - 1 }
    }

    case 'restart':
      return { step: 'intro' }

    default:
      return state
  }
}

/**
 * Enter-only, and transform-only.
 *
 * Two deliberate constraints, both learned from the same failure. An exit
 * animation with AnimatePresence's `wait` mode makes the next step's mount depend
 * on the previous step's animation *finishing*, so a stalled animation clock
 * deadlocks the flow with nothing on screen. And animating opacity from zero means
 * a stalled clock leaves the content invisible.
 *
 * So arriving content slides and leaving content just leaves, and nothing fades
 * from nothing. If the animation never runs at all, the step is eight pixels off
 * its final position and perfectly readable — which is what design.md means by a
 * defined resting state.
 */
const arrive = {
  initial: { y: 10 },
  animate: { y: 0 },
  transition: { duration: 0.34, ease: [0.16, 1, 0.3, 1] as const },
}

export function Assessment() {
  const [state, dispatch] = useReducer(reducer, { step: 'intro' })
  const { setTrack, completeAssessment } = useGuide()

  const choose = (track: Track) => setTrack(track)

  /**
   * Records an answer, and commits the placement the moment the final one lands
   * rather than when the reader clicks through to the guide. Deferring the write
   * to the call-to-action loses the placement of anyone who reaches the result and
   * then leaves by the header, the back button, or by closing the tab — which is
   * most of the ways a person actually leaves a page.
   */
  const answer = (questionId: string, choiceId: string) => {
    if (state.step !== 'asking') return
    const answers = { ...state.answers, [questionId]: choiceId }
    if (state.index + 1 >= QUESTIONS.length) {
      completeAssessment(answers, scoreAssessment(answers))
    }
    dispatch({ type: 'answer', questionId, choiceId })
  }

  return (
    <LazyMotion features={domAnimation} strict>
        {state.step === 'intro' && (
          <m.div key="intro" {...arrive}>
            <h1 className="font-display text-[2.375rem] leading-[1.05] tracking-[-0.03em]">
              Five questions, under a minute.
            </h1>
            <p className="mt-[var(--step)] max-w-[62ch] text-[1.0625rem] text-ice-dim">
              They place you on one of three tracks. Tracks are three perspectives on
              the same material, not three difficulty levels — nothing is hidden from
              anyone, and you can switch whenever you like.
            </p>

            <div className="mt-[calc(var(--step)*1.5)] flex flex-wrap items-center gap-[var(--step)]">
              <button
                type="button"
                onClick={() => dispatch({ type: 'start' })}
                className="cursor-pointer border border-ice bg-ice px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-void uppercase transition-transform duration-200 active:scale-[0.98]"
              >
                Begin
              </button>
              <span className="font-mono text-[0.7rem] text-ice-dim">
                or choose directly:
              </span>
            </div>

            <ul className="mt-[var(--step)] flex flex-wrap gap-3">
              {TRACKS.map((track) => (
                <li key={track}>
                  <Link
                    href="/hermes/"
                    onClick={() => choose(track)}
                    className="inline-block border border-ice-faint px-4 py-2 font-mono text-[0.7rem] tracking-[0.08em] uppercase no-underline transition-colors duration-200 hover:border-ice"
                  >
                    {TRACK_LABELS[track]}
                  </Link>
                </li>
              ))}
            </ul>
          </m.div>
        )}

        {state.step === 'asking' && (
          <m.div key={`q-${state.index}`} {...arrive}>
            <p className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
              Question {state.index + 1} of {QUESTIONS.length}
            </p>

            {/* Progress as a real meter, not decoration. */}
            <div
              className="mt-3 h-px w-full max-w-[32rem] bg-ice-faint"
              role="progressbar"
              aria-valuenow={state.index + 1}
              aria-valuemin={1}
              aria-valuemax={QUESTIONS.length}
              aria-label="Placement progress"
            >
              <div
                className="h-px bg-ice transition-[width] duration-300"
                style={{ width: `${((state.index + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h1 className="font-display mt-[var(--step)] text-[1.875rem] leading-[1.1] tracking-[-0.025em]">
              {QUESTIONS[state.index]!.prompt}
            </h1>

            {QUESTIONS[state.index]!.note && (
              <p className="mt-2 max-w-[56ch] text-[0.9375rem] text-ice-dim">
                {QUESTIONS[state.index]!.note}
              </p>
            )}

            <ul className="mt-[calc(var(--step)*1.2)] flex flex-col gap-2">
              {QUESTIONS[state.index]!.choices.map((choice) => (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => answer(QUESTIONS[state.index]!.id, choice.id)}
                    className="w-full cursor-pointer border border-ice-faint px-4 py-3 text-left text-[1rem] transition-colors duration-200 hover:border-ice hover:bg-deep active:scale-[0.995]"
                  >
                    {choice.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => dispatch({ type: 'back' })}
              className="mt-[var(--step)] cursor-pointer bg-transparent font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase underline decoration-ice-faint transition-colors duration-200 hover:text-ice"
            >
              Back
            </button>
          </m.div>
        )}

        {state.step === 'result' && (
          <m.div key="result" {...arrive}>
            <p className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
              Your track
            </p>

            <h1 className="font-display mt-3 text-[2.75rem] leading-[1.02] tracking-[-0.035em]">
              {TRACK_LABELS[state.track]}
            </h1>

            <p className="mt-[var(--step)] max-w-[62ch] text-[1.0625rem]">
              {TRACK_BLURBS[state.track]}
            </p>

            <p className="mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[0.9375rem] text-ice-dim">
              Lessons now show the depth that fits. Nothing is removed — material for
              other tracks stays reachable, and you can change track from the header at
              any time.
            </p>

            <div className="mt-[calc(var(--step)*1.5)] flex flex-wrap items-center gap-[var(--step)]">
              <Link
                href="/hermes/"
                className="border border-ice bg-ice px-5 py-2.5 font-mono text-[0.7rem] tracking-[0.1em] text-void uppercase no-underline transition-transform duration-200 active:scale-[0.98]"
              >
                Start the guide
              </Link>
              <button
                type="button"
                onClick={() => dispatch({ type: 'restart' })}
                className="cursor-pointer bg-transparent font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase underline decoration-ice-faint transition-colors duration-200 hover:text-ice"
              >
                Answer again
              </button>
            </div>
          </m.div>
        )}
    </LazyMotion>
  )
}
