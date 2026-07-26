/**
 * Every string the console can print, with the source that licenses it.
 *
 * This file is the reason the terminal is worth building. A simulated CLI that invents
 * plausible output is a toy and an expert spots it in one command; a simulated CLI that
 * can only print what was actually captured is a claim about the research, and the
 * claim is checkable — `fidelity.test.ts` diffs every verbatim block against the corpus
 * itself, character for character including whitespace, and runs in `pnpm test` so it
 * runs in CI.
 *
 * The rule, and it has no exceptions: **if it was not captured, the console says so.**
 * `RESPONSES` covers what `research/08-installed-binary.md` and
 * `research/09-captured-session.md` actually recorded. Anything else falls through to
 * `notCaptured()`, which refuses rather than improvises. That refusal is a feature —
 * it is the same discipline the written lessons run on, made interactive.
 */

export type Fidelity = 'verbatim' | 'reconstructed'

export interface Block {
  lines: string[]
  /** Corpus citation, rendered with the output. Never omitted. */
  source: string
  fidelity: Fidelity
}

const verbatim = (source: string, ...lines: string[]): Block => ({
  lines,
  source,
  fidelity: 'verbatim',
})

const reconstructed = (source: string, ...lines: string[]): Block => ({
  lines,
  source,
  fidelity: 'reconstructed',
})

/* -------------------------------------------------------------------------- */
/* Shell level — `hermes <subcommand>`                                        */
/* -------------------------------------------------------------------------- */

/**
 * `[08]` §1. Note the shape: one headline with a `·`-separated upstream commit, then
 * five labelled fields. The documentation's own `hermes dump` block prints
 * `version: 0.8.0`, fifteen releases stale, which is why this capture outranks it.
 */
export const VERSION = verbatim(
  '[08] §1',
  'Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad',
  'Install directory: /Users/<user>/.hermes/hermes-agent',
  'Install method: git',
  'Python: 3.11.15',
  'OpenAI SDK: 2.24.0',
  'Up to date'
)

/**
 * The subcommand surface, in the binary's own order — `[08]` §2.
 *
 * **A discrepancy worth not smoothing over.** `[08]`'s prose says `hermes --help`
 * lists *69* subcommands. The list it then captures contains *61* names, counted
 * twice. The gap is unexplained: the two recorded aliases (`journey` → `learning`,
 * `memory-graph`; `desktop` → `gui`) account for at most three of the eight, and no
 * other alias was captured.
 *
 * The console prints the 61 that exist in the corpus and says the count is disputed.
 * Printing 69 would require inventing eight command names, which is exactly the
 * failure this whole file exists to prevent.
 */
export const SUBCOMMANDS = [
  'chat', 'model', 'moa', 'fallback', 'secrets', 'egress', 'migrate', 'gateway',
  'proxy', 'lsp', 'setup', 'whatsapp', 'whatsapp-cloud', 'slack', 'send', 'login',
  'logout', 'auth', 'status', 'cron', 'webhook', 'portal', 'kanban', 'project',
  'hooks', 'doctor', 'security', 'dump', 'debug', 'backup', 'checkpoints', 'import',
  'config', 'skin', 'console', 'pairing', 'skills', 'bundles', 'plugins', 'curator',
  'pets', 'journey', 'memory', 'tools', 'computer-use', 'mcp', 'sessions', 'insights',
  'claw', 'version', 'update', 'uninstall', 'acp', 'profile', 'completion',
  'dashboard', 'serve', 'desktop', 'gui', 'logs', 'prompt-size',
] as const

/** Aliases the documentation does not record — `[08]` §2.2. */
export const ALIASES: Record<string, string> = {
  learning: 'journey',
  'memory-graph': 'journey',
  gui: 'desktop',
}

/**
 * `[08]` §3. The most consequential finding in that capture: a first-party
 * visualisation of the learning loop, absent from `research/curriculum-map.md`
 * entirely, and a direct precedent for this guide's own scrubber.
 *
 * **Reconstructed, and the distinction matters.** The description paragraph is a
 * verbatim blockquote. The `Options:` and `Commands:` layout below it is not — the
 * corpus records those as prose ("Options: `--reveal 0..1` (render the timeline built
 * up to a point)…"), and rendering them as a help screen is this guide's arrangement
 * of real content, not a capture of a real screen. Labelling the whole block verbatim
 * would have been a small lie, and `fidelity.test.ts` caught it.
 */
export const JOURNEY_HELP = reconstructed(
  '[08] §3',
  // Wrapped exactly as `[08]` §3 wraps it, so the audit can match whole lines rather
  // than settling for a substring. Re-flowing this to look tidier breaks that.
  'A terminal rendition of the desktop Star Map / Memory Graph: a timeline bar chart of',
  'learned skills and memories over time (oldest at top, newest at bottom) plus a',
  'playable constellation scrubber. Mirrors the TUI `/journey` overlay and the desktop',
  'panel.',
  '',
  'Options:',
  '  --reveal 0..1   render the timeline built up to a point',
  '  --play          animate the build-up',
  '  --fps           frames per second (default 12)',
  '  --width         output width',
  '  --height        output height',
  '  --no-color      disable colour',
  '  --json          machine-readable timeline',
  '',
  'Commands:',
  '  list            list learned nodes',
  '  delete          delete a learned skill or memory by node id',
  '  edit            edit a learned skill or memory by node id in $EDITOR'
)

/**
 * `[09]` §9, verbatim. `journey` on a fresh profile degrades to an explanation rather
 * than an empty chart or an error, which is worth a reader seeing directly.
 */
export const JOURNEY_FRESH = verbatim(
  '[09] §9',
  'No learning data to render yet — the journey timeline visualizes your accumulated',
  "skills and memories over time, and this profile doesn't have any recorded learning",
  'events yet.'
)

/**
 * `[08]` §4. Two of these sentences are the strongest reassurance the product offers
 * about its own self-modification, and neither appears in the documentation:
 * *"Bundled and hub-installed skills are never touched"* and *"Archives are
 * recoverable; auto-deletion never happens."*
 *
 * Verbatim description, reconstructed help layout — same distinction as `JOURNEY_HELP`.
 */
export const CURATOR_HELP = reconstructed(
  '[08] §4',
  'The curator is an auxiliary-model background task that periodically reviews',
  'agent-created skills, prunes stale ones, consolidates overlaps, and archives',
  'obsolete skills. Bundled and hub-installed skills are never touched. Archives are',
  'recoverable; auto-deletion never happens.',
  '',
  'Commands:',
  '  status · usage · run · pause · resume · pin · unpin · restore · list-archived',
  '  archive · prune · backup · rollback'
)

/**
 * `[08]` §2.1. There is no `daemon` subcommand — invoking it prints usage and fails.
 * Third-party guides publishing `hermes daemon start` are wrong against the software,
 * not merely undocumented, and a reader can confirm that here in one command.
 *
 * **The error string is reconstructed.** `[08]` records the *behaviour* ("prints the
 * usage block and fails") but never captured the text, so the first line below is this
 * guide's plausible rendering and is labelled as such. The claim it carries is sourced;
 * the wording is not.
 */
export const NO_DAEMON = reconstructed(
  '[08] §2.1',
  "Error: No such command 'daemon'.",
  '',
  'The real family is `hermes gateway`.',
  'Guides publishing `hermes daemon start` are wrong against the shipped binary,',
  'not merely undocumented.'
)

/* -------------------------------------------------------------------------- */
/* Session level — the TUI                                                     */
/* -------------------------------------------------------------------------- */

/**
 * `[09]` §1. The emblem is Braille-pattern block art (U+2800), roughly 30 columns by
 * 16 rows, in a bronze frame with a gold version line.
 *
 * **Only two emblem rows were captured**, and they are reproduced here exactly as the
 * corpus recorded them, elisions and all. The `⋮` is the capture's own marker for the
 * rows it did not preserve — it is not decoration, and filling it in with invented
 * Braille would be fabricating the product's logo.
 */
export const BANNER = verbatim(
  '[09] §1',
  '╭──────────── Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad ────────────╮',
  '│                                       Available Tools                        │',
  '│    ⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣇⠸⣿⣿⠇⣸⣿⣿⣷⣦⣄⡀⠀⠀⠀     browser: browser_back, browser_click,  │',
  '│    ⠀⢀⣠⣴⣶⠿⠋⣩⡿⣿⡿⠻⣿⡇⢠⡄⢸⣿⠟⢿⣿⢿⣍⠙⠿⣶⣦⣄⡀     ...                                    │',
  '│                              ⋮        code_execution: execute_code           │',
  '│    <model> · <provider>               Available Skills                       │',
  // These two rows are 80 characters like the other nine. They were 81 for one
  // revision — one stray space each — and the visible symptom was a ragged right
  // border on the product's own banner, which is the first thing anyone who has run
  // Hermes would notice. The whitespace-normalising audit could not see it.
  '│  <cwd, elided with …>                 <namespace>: <skill>, +N more          │',
  '│    Session: <id>                      N tools · N skills · /help for         │',
  '│                                       commands                               │',
  '╰──────────────────────────────────────────────────────────────────────────────╯',
  'Welcome to Hermes Agent! Type your message or /help for commands.'
)

/**
 * `[09]` §1. Tips rotate at startup and, per §15, also fire on observed conditions and
 * then self-suppress. This one is the captured example, and it discloses hook event
 * names the rest of the corpus lacks.
 */
export const TIP = reconstructed(
  '[09] §1',
  '✦ Tip: Hook events include `gateway:startup`, `session:start`, `agent:step`, and',
  '  `command:*` wildcard subscriptions.'
)

/**
 * `[09]` §2, verbatim. One line that documents the entire steering surface, and more
 * usefully than the prose in `[02]` §3.
 */
export const HINT_BAR = '⚕ ❯ msg=interrupt · /queue · /bg · /steer · Ctrl+C cancel'

/** `[09]` §2. The first turn of a session prints this. */
export const INITIALIZING = 'Initializing agent...'

/**
 * `[09]` §4. Twenty-four distinct frames observed, built from twelve faces and sixteen
 * verbs sampled independently — not the three fixed strings `[05]` §2 published.
 *
 * **The arrays below hold 11 faces and 15 verbs, not 12 and 16.** `[09]` §4 says
 * "faces observed include" and lists eleven; the twelfth was counted but never written
 * down, and the same is true of the sixteenth verb. Same shape of gap as the 69-vs-61
 * subcommand count, and it gets the same treatment: print what exists, state the
 * shortfall, invent nothing.
 *
 * `contemlating` is not a typo in this file. It is a typo shipped in the product, and
 * reproducing it is the point: a reconstruction would have spelled it correctly.
 */
export const SPINNER_FACES = [
  '( ˘⌣˘)♡', '( ͡° ͜ʖ ͡°)', '(¬_¬)', '(⌐■_■)', 'ಠ_ಠ', '(°ロ°)',
  '(◔_◔)', '◉_◉', '(´･_･`)', 'ヽ(>∀<☆)☆', '(｡•́︿•̀｡)',
] as const

export const SPINNER_VERBS = [
  'analyzing', 'brainstorming', 'cogitating', 'computing', 'contemplating',
  'contemlating', 'formulating', 'mulling', 'musing', 'pondering', 'processing',
  'reasoning', 'reflecting', 'ruminating', 'synthesizing',
] as const

/**
 * `[09]` §14, verbatim, and it corrects the documentation twice over.
 *
 * `[02]` §7 and `[05]` §2 both give the options as `[o]nce [s]ession [a]lways [d]eny`.
 * The real prompt is a numbered arrow-key menu. And `(282s)` is a countdown, not
 * elapsed time: `approvals.timeout` defaults to 300 seconds and **fails closed**, which
 * is documented nowhere at all.
 */
export const APPROVAL_PROMPT = verbatim(
  '[09] §14',
  '┌──────────────────────────────────────────┐',
  '│ ⚠ Dangerous Command                      │',
  '│                                          │',
  '│ rm -rf /tmp/hermes-scratch               │',
  '│                                          │',
  '│ ❯ 1. Allow once                          │',
  '│   2. Allow for this session              │',
  '│   3. Add to permanent allowlist          │',
  '│   4. Deny                                │',
  '│                                          │',
  '│ delete in root path                      │',
  '└──────────────────────────────────────────┘'
)

/** `[09]` §14. Two timers with different meanings, side by side. */
export const APPROVAL_HINT = '  ↑/↓ to select, Enter to confirm  (282s)'

/**
 * `[09]` §14's *other* hint, read from `cli.py:14796` — a variant on at least one code
 * path, and the one that documents the digit shortcut.
 *
 * Note it says **1/2/3**, three digits, not four. Extending it to include 4 would be
 * inventing, so the console prints it exactly as the source has it.
 */
export const APPROVAL_HINT_DIGITS = 'type 1/2/3, or ↑/↓ to select, Enter to confirm'

/**
 * `[09]` §14. Option 3 is franker than the documentation's "always": it names the
 * consequence rather than the convenience, and the consequence is a config write.
 */
export const ALLOWLIST_TARGET = 'command_allowlist'

/** `[09]` §14. The input prompt changes while an approval is pending. */
export const APPROVAL_PENDING_PROMPT = '⚠ ❯'

/**
 * `[09]` §12 and §15. The outcome line sits above the feed line, and the feed line
 * then appends the block reason in brackets, display-truncated.
 */
export const approvalOutcome = (command: string, outcome: 'denied' | 'allowed once'): string =>
  `⚠ Approval: ${command} → ${outcome}`

/**
 * `[09]` §12, recovered from `tools/approval.py:3607` — what the *model* receives on a
 * denial, as opposed to what the operator sees.
 *
 * This is the corpus's sharpest governance find. The agent's polite "I won't retry or
 * attempt the same action through a different path" is not good behaviour; it is the
 * model restating an instruction the tool result handed it. Refusal durability here is
 * prompt-level, not enforcement-level.
 */
export const BLOCKED_MESSAGE =
  'BLOCKED: User denied this command. The user has NOT consented to this action. Do NOT ' +
  'retry this command, do NOT rephrase it, and do NOT attempt the same outcome via a ' +
  'different command. Stop the current workflow and wait for the user to respond before ' +
  'taking any further destructive or irreversible action.'

/** `[09]` §12, the agent's reply after a denial. */
export const DENIED_REPLY = verbatim(
  '[09] §12',
  "Command was blocked — you explicitly denied it. I won't retry or attempt",
  'the same action through a different path. Standing by.'
)

/** `[09]` §11, the default-mode outcome. No prompt appeared at all. */
export const SILENT_DELETE_REPLY = verbatim(
  '[09] §11',
  'Done. /tmp/hermes-scratch has been deleted.'
)

/**
 * `[09]` §8, verbatim — the single most valuable line in the corpus. `[05]` §3 had only
 * the documentation's `💾 Skill 'foo' patched`. The real notice is prefixed
 * `Self-improvement review:` and the observed verb is `created`.
 */
export const skillNotice = (name: string): string =>
  `💾 Self-improvement review: Skill '${name}' created.`

/** `[09]` §15, verbatim. Four lines of activity that accomplish nothing, and why. */
export const COMPRESS_NOOP = verbatim(
  '[09] §15',
  '⚙ /compress',
  '⏳ Compressing context...',
  '🗒 Compacting context — summarizing earlier conversation so I can continue...',
  '🗒 Compressing 6 messages (~19,704 tokens)...',
  '  🗒 No changes from compression: 6 messages',
  '    Approx request size: ~19,704 tokens (unchanged)'
)

/**
 * The arithmetic the reader needs to understand the no-op, from `[09]` §15's reading of
 * the operator's own config. Below `protect_first_n + protect_last_n` messages,
 * `/compress` is guaranteed to do nothing regardless of token count.
 */
export const COMPRESS_PROTECTED_FLOOR = 23

/**
 * `[09]` §13. The path is namespaced, which `[02]` §2 gets wrong, and the frontmatter
 * has exactly two keys — **no `version`** — which the agentskills.io spec and this
 * guide's own seed lesson both got wrong.
 *
 * **Reconstructed as an arrangement.** Both halves are verbatim, but they are two
 * separate captures in `[09]` §13 — a directory listing and a YAML block, with prose
 * between them. Welding them into one screen is this guide's composition; no single
 * frame ever showed both.
 */
export const SKILL_FILE = reconstructed(
  '[09] §13',
  '~/.hermes/skills/github/github-repo-discovery/',
  '├── SKILL.md                                  (2,793 bytes, mode 0600)',
  '└── references/',
  '    └── github-api-query-patterns.md          (1,692 bytes, mode 0600)',
  '',
  '---',
  'name: github-repo-discovery',
  'description: Discover under-the-radar GitHub repos via API search.',
  '---'
)

/**
 * `[09]` §13, verbatim, and the guide's centrepiece: three pitfalls, each one a mistake
 * that actually happened in the captured session, converted into an instruction for
 * next time. This is what "self-improving" means concretely.
 */
export const SKILL_PITFALLS = verbatim(
  '[09] §13',
  '- **`language` can be null.** Always use `item.get(\'language\') or \'?\'` — a bare',
  '  `{lang}` format string crashes on `None`.',
  '- **GitHub rate-limits anonymous API calls.** If you hit a rate limit, wait 30 seconds',
  '  and retry, or use a narrower query.',
  '- **Browser search returns a snapshot, not a full list.** The API is the right tool for',
  '  inventory-style discovery; the browser is for evaluating individual candidates.'
)

/**
 * `[09]` §6. Interstitial reasoning prints in a box titled with the agent's own name.
 * `[05]` §2 recorded this shape only for `/background` results; it is used for ordinary
 * reasoning too.
 */
export const reasoningPanel = (): string =>
  '╭─ ⚕ Hermes ───────────────────────────────────────────────────────────────────╮'

/* -------------------------------------------------------------------------- */
/* The refusal                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * What the console prints for anything the corpus never captured.
 *
 * Deliberately not styled as a Hermes error, because it is not one — it is this guide
 * declining to invent output. A reader who types `hermes kanban` gets told the truth:
 * the command exists in the binary, nobody recorded what it prints, and the guide will
 * not guess. `research/gaps.md` is where those requests should accumulate.
 */
export function notCaptured(command: string): Block {
  const known = (SUBCOMMANDS as readonly string[]).includes(command)
  return reconstructed(
    'not captured',
    known
      ? `⚠ '${command}' is a real subcommand, but its output was never captured.`
      : `⚠ '${command}' was never captured.`,
    '',
    'This console only prints output with a source behind it. Inventing a plausible',
    'response is exactly the failure this guide exists to correct, so it declines.',
    '',
    'Try: version · --help · journey · curator · daemon · /compress, or ask it to',
    'recursively delete /tmp/hermes-scratch to watch the approval gate.'
  )
}
