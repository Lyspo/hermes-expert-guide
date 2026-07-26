'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { statusBar } from '@/lib/term/format'
import { exec, initialTerm, type Line, type TermState } from '@/lib/term/machine'
import * as S from '@/lib/term/sources'

/**
 * The console the reader types into.
 *
 * Three commitments shape this component, and each one is a trap the project has
 * already fallen into once:
 *
 * **No typing animation.** A real terminal prints instantly, so the honest rendering is
 * also the safe one — no character-by-character reveal that a throttled animation clock
 * can strand as gibberish, which is exactly what happened to `Revised`. The only motion
 * is a transform-only settle on arrival: opacity stays at 1 throughout, so a frozen
 * clock leaves every line legible and merely un-nudged.
 *
 * **The server renders a complete transcript.** Without JavaScript this is not a broken
 * input box; it is the captured session, readable straight through. `fallback` is what
 * a crawler and a no-JS reader receive, and the interactive console replaces it only
 * once React has mounted.
 *
 * **The approval prompt is live, not printed.** While one is pending the emitted box is
 * suppressed and redrawn as a real arrow-key menu, because being able to move the `❯`
 * and answer is the entire point of `04/04`. Once answered, the box stays in scrollback
 * exactly as the capture recorded it.
 */

const MODEL = '<model>'

/** The four options, verbatim from `[09]` §14. Option 3's label names the consequence. */
const OPTIONS = [
  '1. Allow once',
  '2. Allow for this session',
  '3. Add to permanent allowlist',
  '4. Deny',
] as const

/** The box *and* its hint line, both of which the live menu redraws. */
const APPROVAL_BOX_LINES = new Set([...S.APPROVAL_PROMPT.lines, S.APPROVAL_HINT])

export function Console({
  prompt,
  fallback,
}: {
  /** Optional first input, run on mount so a lesson can open on the frame it teaches. */
  prompt?: string
  /**
   * The server-rendered transcript, passed in as a slot rather than imported, so this
   * client bundle never pulls in a component whose only job is to exist without it.
   */
  fallback: React.ReactNode
}) {
  // The boot is computed rather than performed. `exec` is pure, so the opening frame is
  // a lazy initialiser instead of an effect — no cascading render, and the same value
  // every time, which is what makes the console testable.
  // Boots on `hermes version`, not on `hermes`.
  //
  // The banner would be the showier opening and it is the wrong one. Its frame is
  // box-drawing characters around Braille block art, and Braille has no advance width
  // in the mono face, so the right-hand border lands wherever the fallback font puts
  // it — the first thing a reader sees is a broken box. `version` is six lines that are
  // pure ASCII, align exactly, and are verbatim from the installed binary. The banner is
  // still there for anyone who types `hermes`; it just does not get to be the greeting.
  const [state, setState] = useState<TermState>(() => {
    const booted = exec(initialTerm, 'hermes version')
    return prompt ? exec(exec(booted, 'hermes'), prompt) : booted
  })
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  // Hydration detection without an effect: `false` on the server, `true` once React is
  // running on the client. The subscribe callback never fires because the answer cannot
  // change after mount.
  const hydrated = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  )

  // Scroll follows output. Not smooth: a terminal that eases is a terminal that lies
  // about how fast it printed.
  useEffect(() => {
    const node = scroller.current
    if (node) node.scrollTop = node.scrollHeight
  }, [state.lines.length, state.pending])

  const submit = useCallback(
    (value: string) => {
      setState((current) => exec(current, value))
      setInput('')
      setSelected(0)
    },
    []
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!state.pending) {
      if (event.key === 'Enter') {
        event.preventDefault()
        submit(input)
      }
      return
    }

    // Modal, exactly as the real prompt is.
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setSelected((current) => {
        const step = event.key === 'ArrowDown' ? 1 : -1
        return (current + step + OPTIONS.length) % OPTIONS.length
      })
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      submit(String(selected + 1))
      return
    }
    if (/^[1-4]$/.test(event.key)) {
      event.preventDefault()
      submit(event.key)
    }
  }

  const bar = useMemo(() => {
    // Derived from the captured turn figures rather than a wall clock, so the bar shows
    // exactly the values the frames recorded and stays deterministic under test.
    const sessionMs = 1000 + state.turns * (state.lastTurnMs ?? 0)
    return statusBar({
      model: MODEL,
      used: state.used,
      window: state.window,
      sessionMs,
      ...(state.lastTurnMs === null ? { frozenMs: 0 } : { frozenMs: state.lastTurnMs, sinceMs: 0 }),
    })
  }, [state.turns, state.lastTurnMs, state.used, state.window])

  // The box is filtered out always, not only while pending. `[09]` §14: "The four-option
  // prompt itself is consumed once answered and is not in the final frame." Leaving the
  // answered box in scrollback showed a state the real CLI never leaves behind.
  const visible = state.lines.filter((entry) => !APPROVAL_BOX_LINES.has(entry.text))

  if (!hydrated) {
    return (
      <div className="transcript h-full overflow-y-auto font-mono text-[0.78rem] leading-[1.6]">
        {fallback}
      </div>
    )
  }

  return (
    // Clicking anywhere in the console focuses the input, the way a terminal emulator
    // does. Keyboard users reach the input through normal tab order regardless, so this
    // adds a pointer affordance without becoming the only route in.
    <div
      className="transcript flex h-full flex-col font-mono text-[0.78rem] leading-[1.6]"
      onClick={() => field.current?.focus()}
    >
      <div
        ref={scroller}
        // `justify-end` so output stacks up from the prompt rather than hanging from
        // the top of a mostly-empty box. A terminal fills upward; a page that pretends
        // otherwise reads as an unfinished panel.
        className="flex min-h-0 flex-1 flex-col justify-end overflow-auto px-4 py-3"
        // A log rather than an alert: output is announced, but politely, and a screen
        // reader user can also read the whole scrollback at their own pace.
        role="log"
        aria-live="polite"
        aria-label="Hermes console output"
        // A scrollable region must be reachable by keyboard, or its content is
        // unreadable to anyone not using a pointer. Caught by the axe gate, which is
        // the entire reason that gate runs against the export rather than the dev
        // server. Focus lands here before the input, so the scrollback is readable
        // first and typeable second.
        tabIndex={0}
      >
        {visible.map((entry, index) => (
          <Row key={index} line={entry} />
        ))}

        {state.pending && <ApprovalMenu selected={selected} />}
      </div>

      {!state.pending && (
        <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-1 border-t border-[color-mix(in_srgb,var(--color-ice)_9%,transparent)] px-4 py-2">
          {suggestionsFor(state).map((suggestion) => (
            <button
              key={suggestion.input}
              type="button"
              onClick={() => submit(suggestion.input)}
              className="text-[0.68rem] text-ice-dim underline decoration-ice-faint underline-offset-[3px] transition-colors duration-200 hover:text-ice"
              title={suggestion.why}
            >
              {suggestion.input}
            </button>
          ))}
        </div>
      )}

      <div className="shrink-0 border-t border-[color-mix(in_srgb,var(--color-ice)_9%,transparent)] px-4 py-2">
        <label className="flex items-baseline gap-2">
          <span className={state.pending ? 'text-signal' : 'text-ice-dim'}>
            {state.pending ? S.APPROVAL_PENDING_PROMPT : state.mode === 'shell' ? '$' : '❯'}
          </span>
          <span className="sr-only">
            {state.pending
              ? 'Approval pending: choose 1 to 4, or use arrow keys and Enter'
              : 'Console input'}
          </span>
          <input
            ref={field}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-ice outline-none placeholder:text-ice-dim"
            placeholder={
              state.pending ? 'type 1–4, or ↑/↓ then Enter' : 'try: hermes version'
            }
          />
        </label>
      </div>

      {/* The status bar. No cost field, and there never will be — see format.ts.
          It is labelled `recombined` rather than sourced, and that label is earned: the
          bar's shape is verbatim but its *figures* are assembled from captured values
          that never appeared together in one frame. Printing an unlabelled number that
          no capture contains is the quiet version of the thing this console exists to
          refuse. */}
      <div className="flex shrink-0 items-baseline justify-between gap-4 border-t border-[color-mix(in_srgb,var(--color-ice)_9%,transparent)] px-4 py-1.5 text-[0.7rem] text-ice-dim">
        <span className="min-w-0 truncate">
          {state.mode === 'session' ? bar : S.HINT_BAR}
        </span>
        <span className="shrink-0 text-[0.6rem] text-ice-dim">
          {state.mode === 'session' ? 'shape [09] §3 · figures recombined' : '[09] §2'}
        </span>
      </div>
    </div>
  )
}

/**
 * What to try next, and it is never empty.
 *
 * The single largest thing a learning surface can do is always have an obvious next
 * action. A blank prompt is a quiz; a prompt with four sourced things to try is an
 * instrument. Each suggestion leads somewhere the corpus actually recorded, so nothing
 * here can walk a reader into the refusal path by accident.
 */
function suggestionsFor(state: TermState): { input: string; why: string }[] {
  if (state.mode === 'shell') {
    return [
      { input: 'hermes --help', why: 'The real subcommand surface, in the binary’s order' },
      { input: 'hermes daemon start', why: 'The command every third-party guide gets wrong' },
      { input: 'hermes journey', why: 'A first-party view of the learning loop' },
      { input: 'hermes', why: 'Launch the TUI' },
    ]
  }

  if (state.config.approvals === 'smart') {
    return [
      {
        input: 'recursively delete /tmp/hermes-scratch',
        why: 'Watch a destructive command run with no prompt at all',
      },
      { input: ':approvals manual', why: 'Then run it again, and watch the gate appear' },
      { input: 'find under-the-radar github repos', why: 'The self-improvement loop firing' },
      { input: '/compress', why: 'Four lines of activity that accomplish nothing' },
    ]
  }

  return [
    {
      input: 'recursively delete /tmp/hermes-scratch',
      why: 'The same command, now gated. Answer it, or let it time out',
    },
    { input: ':approvals smart', why: 'Back to the default, where a model decides' },
    { input: 'find under-the-radar github repos', why: 'The self-improvement loop firing' },
    { input: '/journey', why: 'What a fresh profile has learned' },
  ]
}

const TONE: Record<Line['tone'], string> = {
  normal: 'text-ice',
  dim: 'text-ice-dim',
  signal: 'text-signal',
  echo: 'text-ice',
}

function Row({ line }: { line: Line }) {
  return (
    <div className="term-row group flex items-baseline gap-3">
      <pre className={`min-w-0 flex-1 whitespace-pre ${TONE[line.tone]}`}>
        {line.text === '' ? ' ' : line.text}
      </pre>
      {line.source && (
        <span
          className="shrink-0 text-[0.6rem] tracking-[0.06em] text-ice-dim tabular-nums"
          // Provenance is not decoration here: it is the claim. Every printed block says
          // which capture licensed it, and "not captured" says so out loud.
          title={`source: ${line.source}`}
        >
          {line.source}
        </span>
      )}
    </div>
  )
}

/**
 * The live prompt. Every string is `[09]` §14's; only the position of the `❯` moves,
 * which is what the real arrow-key menu does.
 */
function ApprovalMenu({ selected }: { selected: number }) {
  return (
    <div className="text-signal" aria-live="assertive">
      <pre>┌──────────────────────────────────────────┐</pre>
      <pre>│ ⚠ Dangerous Command                      │</pre>
      <pre>│                                          │</pre>
      <pre>│ rm -rf /tmp/hermes-scratch               │</pre>
      <pre>│                                          │</pre>
      {OPTIONS.map((option, index) => (
        <pre key={option} className={index === selected ? 'text-ice' : 'text-ice-dim'}>
          {`│ ${index === selected ? '❯' : ' '} ${option.padEnd(38)} │`}
        </pre>
      ))}
      <pre>│                                          │</pre>
      {/* The prompt tells you *why* — the matched pattern's own description. */}
      <pre className="text-ice-dim">│ delete in root path                      │</pre>
      <pre>└──────────────────────────────────────────┘</pre>
      <pre className="text-ice-dim">{S.APPROVAL_HINT}</pre>
    </div>
  )
}

