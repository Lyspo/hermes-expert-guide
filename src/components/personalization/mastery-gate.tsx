'use client'

import { useState, useSyncExternalStore } from 'react'
import { getServerSnapshot, getSnapshot, grantMastery, subscribe } from '@/lib/guide-store'
import { isoDay, skillFor } from '@/lib/mastery'

/**
 * The comprehension gate, posed as the software's own approval prompt.
 *
 * `decisions.md` 010's rule for this whole layer is that every game surface has to be a
 * real artefact of Hermes rather than a mechanic borrowed and recoloured. A quiz is the
 * most borrowable thing there is, so it is not one: it is the numbered arrow-key menu
 * from `[09]` §14, with four options because that prompt has four, answered the way the
 * real one is answered. A reader learns the interaction by being asked a question
 * through it.
 *
 * Getting it right writes a skill into their `~/.hermes/skills/` tree — the namespaced
 * path from `[09]` §13 — which is what the version ladder is computed from.
 *
 * Getting it wrong is not punished and not hidden. The explanation appears either way,
 * because the point is the correction rather than the score, and a gate that conceals
 * the answer until the reader guesses it is a gate that teaches guessing.
 */

export interface Check {
  question: string
  options: string[]
  answer: number
  because: string
  source: string
}

export function MasteryGate({ lessonId, check }: { lessonId: string; check: Check }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [picked, setPicked] = useState<number | null>(null)
  const [selected, setSelected] = useState(0)

  const mastered = snapshot.state.mastery.mastered.includes(lessonId)
  const skill = skillFor(lessonId)

  // Reserved height while the client has not read storage yet, so the panel does not
  // shift the lesson under the reader's cursor on hydration.
  if (!snapshot.hydrated) {
    return <div className="mt-[calc(var(--step)*2)] h-[13rem] border-t border-ice-faint" />
  }

  // `answered` wins over `mastered`, and the ordering is load-bearing.
  //
  // A correct answer writes to storage, which re-renders this component with
  // `mastered` true. Checking that first meant the explanation was replaced by the
  // "Mastered" panel in the same frame it appeared — the reader saw a reward and never
  // saw why they were right, which is the whole reason the check exists. The compact
  // panel is for a *later* visit, when the correction has already been read.
  if (mastered && picked === null) {
    return (
      <section className="mt-[calc(var(--step)*2)] border-t border-ice-faint pt-[calc(var(--step)*1)]">
        <p className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
          Mastered
        </p>
        <pre className="mt-[calc(var(--step)*0.5)] overflow-x-auto font-mono text-[0.78rem] text-ice">
          {`${skill.path}\n└── SKILL.md`}
        </pre>
        <p className="mt-[calc(var(--step)*0.5)] max-w-[62ch] text-[0.85rem] leading-[1.7] text-ice-dim">
          Written into your agent&rsquo;s skill library, in the namespaced layout the real
          binary uses. Your version and uptime are on your{' '}
          <a href="/profile/" className="underline">
            profile
          </a>
          .
        </p>
      </section>
    )
  }

  const answered = picked !== null
  const correct = picked === check.answer

  const commit = (choice: number) => {
    if (answered) return
    setPicked(choice)
    if (choice === check.answer) grantMastery(lessonId, isoDay(new Date()))
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (answered) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setSelected((current) => (current + step + check.options.length) % check.options.length)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commit(selected + 1)
      return
    }
    if (/^[1-4]$/.test(event.key)) {
      event.preventDefault()
      commit(Number(event.key))
    }
  }

  return (
    <section className="mt-[calc(var(--step)*2)] border-t border-ice-faint pt-[calc(var(--step)*1)]">
      <h2 className="font-mono text-[0.7rem] tracking-[0.08em] text-ice-dim uppercase">
        Master this lesson
      </h2>

      <div className="transcript mt-[calc(var(--step)*0.75)] p-4 font-mono text-[0.8rem] leading-[1.7]">
        <p className="text-ice">{check.question}</p>

        <ul
          className="mt-[calc(var(--step)*0.6)] outline-none"
          // The whole menu is one tab stop with roving selection, which is how the real
          // prompt behaves and how a listbox is meant to work — four separate tab stops
          // would be four times the keystrokes for no gain.
          role="listbox"
          aria-label="Answer"
          tabIndex={answered ? -1 : 0}
          onKeyDown={onKeyDown}
        >
          {check.options.map((option, index) => {
            const number = index + 1
            const isAnswer = number === check.answer
            const isPicked = number === picked
            const marker = answered ? (isAnswer ? '✔' : isPicked ? '✘' : ' ') : selected === index ? '❯' : ' '
            return (
              <li
                key={option}
                role="option"
                aria-selected={answered ? isPicked : selected === index}
                onClick={() => commit(number)}
                className={`flex cursor-pointer gap-2 py-0.5 ${
                  answered
                    ? isAnswer
                      ? 'text-ice'
                      : isPicked
                        ? 'text-signal'
                        : 'text-ice-dim'
                    : selected === index
                      ? 'text-ice'
                      : 'text-ice-dim'
                }`}
              >
                <span aria-hidden="true" className="w-3 shrink-0">
                  {marker}
                </span>
                <span>
                  {number}. {option}
                </span>
              </li>
            )
          })}
        </ul>

        {!answered && (
          <p className="mt-[calc(var(--step)*0.6)] text-[0.7rem] text-ice-dim">
            ↑/↓ to select, Enter to confirm — or type 1, 2, 3 or 4
          </p>
        )}
      </div>

      {/* The explanation appears whether they were right or wrong. The correction is
          the point; the score is not. */}
      {answered && (
        <div role="status" className="mt-[calc(var(--step)*0.75)]">
          <p className="font-mono text-[0.7rem] tracking-[0.08em] uppercase">
            <span className={correct ? 'text-ice' : 'text-signal'}>
              {correct ? 'Mastered' : 'Not this time'}
            </span>
            <span className="ml-3 text-ice-dim">{check.source}</span>
          </p>
          <p className="mt-[calc(var(--step)*0.4)] max-w-[62ch] text-[0.9rem] leading-[1.7] text-ice-dim">
            {check.because}
          </p>
          {correct && (
            <pre className="mt-[calc(var(--step)*0.6)] overflow-x-auto font-mono text-[0.78rem] text-ice-dim">
              {`${skill.path}\n└── SKILL.md   written`}
            </pre>
          )}
          {!correct && (
            <p className="mt-[calc(var(--step)*0.4)] max-w-[62ch] text-[0.85rem] leading-[1.7] text-ice-dim">
              Nothing is lost. Reload the lesson to try again once you have read the section
              this comes from.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
