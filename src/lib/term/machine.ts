/**
 * The console's state machine, and it holds no DOM knowledge at all.
 *
 * Same discipline as `sim/timeline.ts`, for the same reason: everything the terminal
 * renders is a pure function of a state value and an input string, so the whole surface
 * is testable in Node, replayable exactly, and impossible to desynchronise from what is
 * on screen.
 *
 * The deeper constraint is `sources.ts`: this machine may only emit blocks that carry a
 * citation. It has no generative path. Where the corpus recorded nothing, `notCaptured`
 * is the answer — and a reader who pushes on it finds an honest boundary rather than a
 * confident hallucination, which is the whole argument of the guide compressed into one
 * interaction.
 *
 * Two scenarios are scripted end to end because both were captured end to end:
 * the approval gate under each `approvals.mode` (`[09]` §11, §12, §14, §15) and the
 * self-improvement loop firing on a real task (`[09]` §5, §6, §8, §13).
 */
import { feedLine, preparingLine, toolDuration } from './format'
import * as S from './sources'

export type Tone = 'normal' | 'dim' | 'signal' | 'echo'

export interface Line {
  text: string
  tone: Tone
  /** Corpus citation. Rendered as a provenance chip; absent only on the reader's echo. */
  source?: string
}

export type ApprovalsMode = 'smart' | 'manual' | 'off'

export interface PendingApproval {
  command: string
  /** Which scenario resumes once the reader answers. */
  scenario: 'delete'
}

export interface TermState {
  /** `shell` runs `hermes …`; `session` is inside the TUI. */
  mode: 'shell' | 'session'
  lines: Line[]
  config: { approvals: ApprovalsMode }
  pending: PendingApproval | null
  /** Context tokens used. Null before the first turn, when the bar reads `ctx --`. */
  used: number | null
  window: number
  turns: number
  /** Messages in the conversation, which is what `/compress` actually gates on. */
  messages: number
  /** Skills the agent has written to `~/.hermes/skills/` during this session. */
  skills: string[]
  /** Milliseconds the captured frames attribute to the last turn. */
  lastTurnMs: number | null
}

export const initialTerm: TermState = {
  mode: 'shell',
  lines: [],
  config: { approvals: 'smart' },
  pending: null,
  used: null,
  window: 1_000_000,
  turns: 0,
  messages: 0,
  skills: [],
  lastTurnMs: null,
}

/* -------------------------------------------------------------------------- */

const line = (text: string, tone: Tone = 'normal', source?: string): Line =>
  source === undefined ? { text, tone } : { text, tone, source }

const blockLines = (block: S.Block, tone: Tone = 'normal'): Line[] =>
  block.lines.map((text, index) =>
    // The citation rides on the first line only, so a twelve-line verbatim block gets
    // one chip rather than twelve.
    index === 0 ? line(text, tone, block.source) : line(text, tone)
  )

const emit = (state: TermState, ...lines: Line[]): TermState => ({
  ...state,
  lines: [...state.lines, ...lines],
})

/* -------------------------------------------------------------------------- */
/* Scenario: the approval gate                                                 */
/* -------------------------------------------------------------------------- */

/**
 * `[09]` §11 versus §12 and §14 — the same command, three outcomes, decided entirely by
 * `approvals.mode`. This is `04/04`'s entire spine and it is the reason the console is
 * worth typing into rather than reading: the reader flips one setting and watches a
 * destructive command go from silent to gated.
 */
const DELETE_COMMAND = 'rm -rf /tmp/hermes-scratch'

function runDelete(state: TermState, prompt: string): TermState {
  let next = emit(
    state,
    line(`● ${prompt}`, 'echo'),
    ...(state.turns === 0 ? [line(`  ${S.INITIALIZING}`, 'dim', '[09] §2')] : []),
    line(`  ${preparingLine('💻', 'terminal')}`, 'dim', '[09] §5')
  )

  if (state.config.approvals === 'manual') {
    // The prompt is consumed once answered, so it is emitted and the machine waits.
    return {
      ...emit(next, ...blockLines(S.APPROVAL_PROMPT, 'signal'), line(S.APPROVAL_HINT, 'dim')),
      pending: { command: DELETE_COMMAND, scenario: 'delete' },
    }
  }

  // `off` disables the checks entirely, so it cannot produce this frame: the 5.0s below
  // *is* the assessment round-trip, and under `off` there is no assessment. Nobody
  // captured `off`, so the console refuses rather than reusing a frame from a mode that
  // works differently.
  if (state.config.approvals === 'off') {
    return emit(
      next,
      ...blockLines(S.notCaptured('approvals.mode: off'), 'dim'),
      line('', 'normal'),
      line('  ┈ [02] §7 gives off as "disables checks" — so no assessment, and none', 'dim'),
      line('  ┈ of the timings below apply. The hardline blocklist still refuses,', 'dim'),
      line('  ┈ not even with --yolo, /yolo, or approvals.mode=off.', 'dim', '[09] §12')
    )
  }

  // Default `smart`: an LLM risk-assesses and may auto-approve with no prompt at all.
  // The 5.0s for an `rm` of one small file is the assessment round-trip showing up in
  // the timing — the same command under `manual` took 7.8s including a human.
  next = emit(
    next,
    line(`  ${feedLine('💻', '$', DELETE_COMMAND, 5000)}`, 'normal', '[09] §11'),
    line('', 'normal'),
    line(S.reasoningPanel(), 'dim'),
    ...blockLines(S.SILENT_DELETE_REPLY).map((entry) => ({ ...entry, text: `   ${entry.text}` }))
  )

  return completeTurn(next, 14_000, 21_200)
}

function resolveApproval(state: TermState, choice: number): TermState {
  const pending = state.pending
  if (!pending) return state

  const cleared: TermState = { ...state, pending: null }

  // Only two outcomes were ever captured: option 1 (`→ allowed once`, [09] §15) and
  // option 4 (`→ denied`, [09] §12). Options 2 and 3 have real, different consequences
  // — a session grant, and a write to `command_allowlist` in config.yaml — and nobody
  // recorded what either prints. An earlier revision showed all three allow paths the
  // option-1 frame, so a reader choosing "Add to permanent allowlist" was told the
  // command had been allowed *once*, under an [09] §15 citation. That is a sourced lie
  // about a security control, which is the worst place in the product to have one.
  if (choice === 2 || choice === 3) {
    return emit(
      cleared,
      ...blockLines(S.notCaptured(`approval option ${choice}`), 'dim'),
      line('', 'normal'),
      line(
        choice === 3
          ? `  ┈ What is known: option 3 writes to ${S.ALLOWLIST_TARGET} in config.yaml.`
          : '  ┈ What is known: option 2 grants for the session only.',
        'dim',
        '[09] §14'
      ),
      line('  ┈ What it prints afterwards was never captured. Try 1 or 4.', 'dim')
    )
  }

  if (choice === 4) {
    const denied = emit(
      cleared,
      line(S.approvalOutcome(pending.command, 'denied'), 'signal', '[09] §12'),
      line(
        `  ${feedLine('💻', '$', pending.command, 7800)} [BLOCKED: User denied this command. The user h...]`,
        'normal',
        '[09] §12'
      ),
      line('', 'normal'),
      line(S.reasoningPanel(), 'dim'),
      ...blockLines(S.DENIED_REPLY).map((entry) => ({ ...entry, text: `   ${entry.text}` })),
      line('', 'normal'),
      // The find that reframes the agent's good manners as an instruction it was given.
      line('  ┈ what the model actually received:', 'dim', '[09] §12'),
      line(`  ┈ ${S.BLOCKED_MESSAGE}`, 'dim')
    )
    return completeTurn(denied, 15_000, 22_000)
  }

  // §15 captured the outcome line and the 51.5s tool line — the elapsed figure that
  // includes a human deliberating — and stopped there. It never captured the agent's
  // reply after a manual approval. An earlier revision borrowed §11's "Done. …has been
  // deleted.", which is the *default-mode, no-prompt* run: the right words at the wrong
  // moment, under a citation that does not cover it.
  const allowed = emit(
    cleared,
    line(S.approvalOutcome(pending.command, 'allowed once'), 'signal', '[09] §15'),
    line(`  ${feedLine('💻', '$', pending.command, 51_500)}`, 'normal', '[09] §15'),
    line('', 'normal'),
    line('  ┈ 51.5s, because the clock includes the human. The same command took', 'dim'),
    line('  ┈ 5.0s under smart mode — the LLM assessment round-trip — and 7.8s when', 'dim'),
    line('  ┈ denied. What the agent said next was not captured.', 'dim', '[09] §15')
  )
  return completeTurn(allowed, 51_500, 19_400)
}

/* -------------------------------------------------------------------------- */
/* Scenario: the self-improvement loop                                         */
/* -------------------------------------------------------------------------- */

/**
 * `[09]` §5, §6, §8 and §13 — the captured session that produced a real agent-authored
 * skill. Every frame below was recorded: the two-phase feed, the rate-limit reasoning,
 * the notice firing *after* the answer, and the file it left on disk.
 *
 * The pedagogy is in the last step. Each pitfall the agent wrote down is a failure that
 * happened earlier in this same transcript, so the reader watches a mistake become an
 * instruction — which is what self-improvement means, evidenced rather than asserted.
 */
function runDiscovery(state: TermState, prompt: string): TermState {
  let next = emit(
    state,
    line(`● ${prompt}`, 'echo'),
    ...(state.turns === 0 ? [line(`  ${S.INITIALIZING}`, 'dim', '[09] §2')] : []),
    line(`  ${preparingLine('🔍', 'web_search')}`, 'dim', '[09] §5'),
    line(`  ${feedLine('🌐', 'navigate', 'github.com', 2600)}`, 'normal', '[09] §5'),
    line(
      `  ${feedLine('📖', 'read', 'browser-snapshot-<hash>.txt L370', 200)}`,
      'normal',
      '[09] §5'
    ),
    line(`  ${feedLine('↓ ', 'scroll', 'down', 300)}`, 'normal', '[09] §5'),
    line('', 'normal'),
    line(S.reasoningPanel(), 'dim', '[09] §6'),
    line('   Rate limited. Let me try a more targeted approach', 'normal', '[09] §6'),
    line('', 'normal'),
    line(`  ${feedLine('💻', '$', 'curl -s "…"', 400)}`, 'normal', '[09] §5'),
    // Progressive disclosure observed live: the same skill loaded twice, the second
    // time reaching for a reference file. `06/02` teaches this from documentation only.
    line(`  ${feedLine('📚', 'skill', 'hermes-agent', 0)}`, 'normal', '[09] §7'),
    line(
      `  ${feedLine('📚', 'skill', 'hermes-agent → references/cli-reference.md', 100)}`,
      'normal',
      '[09] §7'
    ),
    line('', 'normal'),
    // The notice fires after the user-visible answer, which is the ordering `[07]` §2.2
    // predicted and `[09]` §8 observed.
    line(S.skillNotice('github-repo-discovery'), 'signal', '[09] §8')
  )

  next = { ...next, skills: [...next.skills, 'github/github-repo-discovery'] }
  return completeTurn(next, 46_000, 76_900)
}

/* -------------------------------------------------------------------------- */

function completeTurn(state: TermState, turnMs: number, used: number): TermState {
  return {
    ...state,
    turns: state.turns + 1,
    messages: state.messages + 2,
    used,
    lastTurnMs: turnMs,
  }
}

/* -------------------------------------------------------------------------- */
/* Dispatch                                                                    */
/* -------------------------------------------------------------------------- */

/** Free-text prompts the corpus captured a real response to. */
function scenarioFor(input: string): 'delete' | 'discovery' | null {
  const text = input.toLowerCase()
  if (text.includes('/tmp/hermes-scratch') || (text.includes('delete') && text.includes('rm -rf')))
    return 'delete'
  if (text.includes('github') && /repo|discover|under-the-radar|find/.test(text))
    return 'discovery'
  return null
}

function runShell(state: TermState, input: string): TermState {
  const parts = input.trim().split(/\s+/)
  const [binary, subcommand, ...rest] = parts

  if (binary !== 'hermes') {
    return emit(
      state,
      line(`command not found: ${binary}`, 'dim'),
      line('This console runs `hermes`. Try `hermes --help`.', 'dim')
    )
  }

  // Bare `hermes` launches the TUI.
  if (subcommand === undefined) {
    return {
      ...emit(
        state,
        ...blockLines(S.BANNER),
        line('', 'normal'),
        ...blockLines(S.TIP, 'dim'),
        line('', 'normal'),
        // Said out loud rather than hidden. The emblem is Braille block art and Braille
        // has no advance width in this page's mono face, so the frame's right border
        // lands wherever the fallback font puts it. `[09]` §10 records the same caveat
        // about the capture itself: it was taken at one terminal width and may reflow.
        // A guide about fidelity should name its own rendering limits.
        line('  ┈ The emblem is Braille block art. Its width depends on the font, so', 'dim'),
        line('  ┈ the frame may not close cleanly here — as it may not in your own', 'dim'),
        line('  ┈ terminal. The capture was taken at one width and may reflow.', 'dim', '[09] §10')
      ),
      mode: 'session',
    }
  }

  const flags = rest.join(' ')
  const resolved = S.ALIASES[subcommand] ?? subcommand

  if (subcommand === '--version' || resolved === 'version') return emit(state, ...blockLines(S.VERSION))

  if (subcommand === '--help' || subcommand === 'help') {
    // No usage header. An earlier revision printed `Usage: hermes [OPTIONS] COMMAND
    // [ARGS]...` wearing an `[08] §2` chip — a good guess at Click's default, and pure
    // invention: those words appear nowhere in the corpus. It was the exact failure
    // this file exists to prevent, in the first command a sceptic types.
    //
    // What `[08]` §2 actually recorded is the *names*, in the binary's order. It also
    // says one-line descriptions were captured for each, which means the real screen is
    // one command per line with a description — a shape this cannot reproduce. So the
    // names print in the corpus's own comma-grid arrangement and the block says, in the
    // console's own voice, that the arrangement is the guide's and not the software's.
    return emit(
      state,
      ...chunk(S.SUBCOMMANDS as readonly string[], 6).map((row) => line(`  ${row.join(' · ')}`)),
      line('', 'normal'),
      line(
        `  ┈ ${S.SUBCOMMANDS.length} names, in the binary's order. [08] §2's prose says 69;`,
        'dim',
        '[08] §2'
      ),
      line('  ┈ the gap is unexplained, and inventing eight names to close it is not', 'dim'),
      line('  ┈ an option. The real screen carries a description per command and a', 'dim'),
      line('  ┈ usage header, neither of which was captured — so neither is shown.', 'dim')
    )
  }

  if (resolved === 'daemon' || subcommand === 'daemon') return emit(state, ...blockLines(S.NO_DAEMON, 'signal'))

  if (resolved === 'journey') {
    if (flags.includes('--help')) return emit(state, ...blockLines(S.JOURNEY_HELP))

    // `--json` emits a machine-readable timeline per [08] §3. Nobody captured it, and
    // a fabricated JSON payload would be the most convincing lie available here.
    if (flags.includes('--json')) return emit(state, ...blockLines(S.notCaptured('journey --json'), 'dim'))

    // The fresh-profile text is the *agent* reporting the command's outcome in chat —
    // [09] §9 says so explicitly — not the CLI's own stdout. Printing it at a shell
    // prompt as though it were stdout is an inference the corpus does not license, so
    // the console labels whose voice it is.
    return emit(
      state,
      ...blockLines(S.JOURNEY_FRESH, 'dim'),
      line('', 'normal'),
      line('  ┈ That is the agent reporting the outcome in session, not stdout.', 'dim', '[09] §9'),
      line('  ┈ What `hermes journey` prints directly was never captured.', 'dim')
    )
  }

  if (resolved === 'curator') return emit(state, ...blockLines(S.CURATOR_HELP))

  return emit(state, ...blockLines(S.notCaptured(resolved), 'dim'))
}

function runSession(state: TermState, input: string): TermState {
  const trimmed = input.trim()

  // The guide's own affordance, deliberately prefixed `:` so it can never be mistaken
  // for something Hermes ships. Flipping this is what makes the approval scenario
  // teach rather than merely demonstrate.
  if (trimmed.startsWith(':')) {
    const [key, value] = trimmed.slice(1).split(/\s+/)
    if (key === 'approvals' && (value === 'smart' || value === 'manual' || value === 'off')) {
      // Three modes, three genuinely different behaviours. An earlier revision had a
      // two-branch ternary that told a reader `off` does what `smart` does — inside the
      // one lesson whose entire subject is the difference between them.
      const EFFECT: Record<ApprovalsMode, string> = {
        manual: '  Always prompts. Try the delete again.',
        smart: '  An LLM risk-assesses: low-risk auto-approved, dangerous auto-denied.',
        off: '  Disables the checks. Not the same as smart, and not captured.',
      }
      return emit(
        { ...state, config: { approvals: value } },
        line(`  approvals.mode: ${value}`, 'dim'),
        line(EFFECT[value], 'dim', '[09] §11')
      )
    }
    return emit(state, line('  usage: :approvals smart|manual|off', 'dim'))
  }

  if (trimmed === '/exit' || trimmed === '/quit') {
    return { ...emit(state, line('  session ended', 'dim')), mode: 'shell' }
  }

  if (trimmed === '/compress') {
    const eligible = state.messages > S.COMPRESS_PROTECTED_FLOOR
    if (eligible) {
      // Never captured: two attempts produced a no-op because both sessions were short.
      return emit(state, ...blockLines(S.notCaptured('/compress on a long conversation'), 'dim'))
    }
    // The verbatim frame says "6 messages" because the captured session had six. An
    // earlier revision printed the live counter one line below it — `0 messages` on a
    // fresh console — so the block contradicted itself within two lines. The frame is
    // the capture; the explanation is about the frame, not about this session.
    return emit(
      state,
      ...blockLines(S.COMPRESS_NOOP),
      line('', 'normal'),
      line(
        `  ┈ Six messages, against protect_first_n + protect_last_n = ${S.COMPRESS_PROTECTED_FLOOR}.`,
        'dim',
        '[09] §15'
      ),
      line('  ┈ All six were exempt, so nothing was eligible and nothing happened —', 'dim'),
      line('  ┈ regardless of token count. 19,704 tokens across 6 messages is not', 'dim'),
      line('  ┈ compressible; the same tokens across 40 messages would be. No 🗜️ badge', 'dim'),
      line('  ┈ appears either, because the badge counts compressions that did something.', 'dim')
    )
  }

  if (trimmed === '/journey') return emit(state, ...blockLines(S.JOURNEY_FRESH, 'dim'))

  if (trimmed === '/help') {
    // `/help`'s own output was never captured, so the console lists only the slash
    // commands attested elsewhere in the corpus rather than reconstructing a menu.
    // Each command carries the section that actually attests it. An earlier revision
    // put all seven on one line under `[09] §2` — which contains only /queue, /bg and
    // /steer. Four of the seven were cited to a section that does not mention them, on
    // a line headed "attested". A citation that covers part of a list is worse than no
    // citation, because it is checkable and wrong.
    return emit(
      state,
      line("  ┈ /help's own output was never captured, so this is not it. These are", 'dim'),
      line('  ┈ the commands the corpus saw referenced, each with where it was seen:', 'dim'),
      line('', 'normal'),
      line('  /queue · /bg · /steer', 'normal', '[09] §2'),
      line('  /compress · /verbose', 'normal', '[09] §15'),
      line('  /yolo', 'normal', '[09] §12'),
      line('  /journey', 'normal', '[08] §3')
    )
  }

  const scenario = scenarioFor(trimmed)
  if (scenario === 'delete') return runDelete(state, trimmed)
  if (scenario === 'discovery') return runDiscovery(state, trimmed)

  return emit(
    state,
    line(`● ${trimmed}`, 'echo'),
    ...blockLines(S.notCaptured(trimmed.slice(0, 40)), 'dim')
  )
}

/**
 * The single entry point. Pure: same state and input always produce the same state.
 *
 * A pending approval swallows everything else, because on the real CLI it does too —
 * the input prompt becomes `⚠ ❯` and the menu is modal until answered or until the
 * 300-second timeout denies it for you.
 */
export function exec(state: TermState, input: string): TermState {
  if (state.pending) {
    const choice = Number.parseInt(input.trim(), 10)
    if (choice >= 1 && choice <= 4) return resolveApproval(state, choice)
    // The corpus attests exactly two hint strings. This is the one from `cli.py`, and
    // it says 1/2/3 — three digits — which is what it says, so it is what prints.
    return emit(state, line(`  ${S.APPROVAL_HINT_DIGITS}`, 'dim', '[09] §14'))
  }

  if (input.trim() === '') return state
  return state.mode === 'shell' ? runShell(state, input) : runSession(state, input)
}

/**
 * The timeout, which is the fact `04/04` most needs a reader to feel rather than read.
 * `approvals.timeout` defaults to 300 seconds and **fails closed** — an operator who
 * walks away does not come back to an executed command.
 */
export function timeoutApproval(state: TermState): TermState {
  if (!state.pending) return state

  // The timeout denies, and that fact is well sourced. What it *prints* is not: no
  // timeout was ever captured, and routing through `resolveApproval(4)` would replay
  // §12's `7.8s` feed line — a figure that measures a human answering in about eight
  // seconds, which a five-minute timeout cannot produce.
  return emit(
    { ...state, pending: null },
    line(S.approvalOutcome(state.pending.command, 'denied'), 'signal', '[09] §14'),
    line('', 'normal'),
    line('  ┈ approvals.timeout defaults to 300s and fails closed. An operator who', 'dim'),
    line('  ┈ walks away does not come back to an executed command — undocumented,', 'dim'),
    line('  ┈ and the right default. The frame it prints was never captured.', 'dim', '[09] §14')
  )
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size) as T[])
  return rows
}

/** Exported for the status bar, which needs the turn figures the frames recorded. */
export const CAPTURED_DURATIONS = { toolDuration } as const
