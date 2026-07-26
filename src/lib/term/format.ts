/**
 * The console's own formatters, derived from captured output rather than invented.
 *
 * Every function here reproduces a shape observed in `research/09-captured-session.md`.
 * Where the capture is ambiguous the ambiguity is recorded in a comment and resolved
 * toward the larger sample, never toward whatever is tidier — a formatter that quietly
 * picks the pretty option is how a "verbatim" claim stops being true.
 */

/**
 * Token counts as the bar prints them: one decimal, and a trailing `.0` dropped.
 *
 * `[09]` §3 and §15 give `21.1K/1M`, `76.9K/1M`, `19.4K/1M` and `22K/1M`. That last
 * one is the informative sample — 22,000 tokens prints as `22K`, not `22.0K`, so the
 * decimal is conditional rather than fixed-width.
 */
export function tokens(count: number): string {
  if (count < 1000) return String(count)
  if (count < 1_000_000) return `${trim(count / 1000)}K`
  return `${trim(count / 1_000_000)}M`
}

function trim(value: number): string {
  const fixed = value.toFixed(1)
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
}

/**
 * The ten-cell context meter, one cell per rounded ten percent.
 *
 * `[09]` §3: 2% renders `[░░░░░░░░░░]` and 7% renders `[█░░░░░░░░░]`. Note that 7%
 * lighting a cell means this **rounds** — flooring would leave the bar empty and
 * contradict the frame. An earlier version of this comment claimed the opposite of
 * what the code does, which is the more dangerous of the two errors: a reviewer trusts
 * the comment.
 */
export function meter(percent: number | null): string {
  if (percent === null) return '[░░░░░░░░░░]'
  const filled = Math.min(10, Math.max(0, Math.round(percent / 10)))
  return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}]`
}

/**
 * Context percentage, rounded.
 *
 * **The capture disagrees with itself and the disagreement is not fully resolvable**,
 * because the displayed token figure is itself rounded, so the underlying value cannot
 * be recovered from the transcript. But the evidence is not evenly split:
 *
 * | Frame | Reads | Requires |
 * |---|---|---|
 * | `[09]` §14 — `19.2K/1M` | `2%` | round (floor gives 1) |
 * | `[09]` §15 — `19.4K/1M` | `2%` | round (floor gives 1) |
 * | `[09]` §3 — `76.9K/1M` | `7%` | floor (round gives 8) |
 *
 * Two to one for rounding. This function floored for exactly one revision, on a
 * tiebreak that had counted only one of the two rounding samples, and the cost was
 * concrete: `statusBar` could not reproduce two of the seven captured bars. Rounding
 * reproduces five of seven and fails only the `76.9K` frame.
 *
 * There is no formula that satisfies all three, so the residual conflict is real and
 * `statusBarFidelity` reports it rather than hiding it. Do not "fix" this back to
 * floor without a new capture that settles the rounding rule.
 */
export function percent(used: number, window: number): number {
  if (window <= 0) return 0
  return Math.round((used / window) * 100)
}

/**
 * The one frame no rounding rule can reproduce, named so the console can say so out
 * loud rather than printing a number it knows is contested.
 */
export const PERCENT_CONFLICT = '[09] §3 — 76.9K/1M reads 7%, which this rounds to 8%'

/**
 * Session elapsed, which coarsens rather than counting.
 *
 * `[09]` §3: `1s`, `42s`, `1m`, `4m`. Seconds below a minute, whole minutes above,
 * and never `MM:SS`.
 */
export function elapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m`
}

/**
 * Turn duration, which does *not* coarsen: `⏲ 3m 52s` in the same bar whose session
 * figure reads `4m`. Two clocks, two formats, and reproducing only one of them is the
 * kind of near-miss that makes a reconstruction obvious to anyone who has run the
 * software.
 */
export function turnDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest === 0 ? `${minutes}m` : `${minutes}m ${rest}s`
}

/** Tool-feed durations are one decimal and bare: `2.6s`, `0.2s`, `5.0s`, `17.4s`. */
export function toolDuration(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

/**
 * The *other* duration format, which the feed uses on its pre-result echo line:
 * parenthesised and right-aligned in a six-character field.
 *
 * `[09]` §14 gives `( 17.4s)` and §5 gives `(  0.2s)`. Two formats for the same
 * quantity in the same feed is the sort of detail that only survives a real capture,
 * so it is worth reproducing rather than normalising away.
 */
export function echoDuration(ms: number): string {
  return `(${toolDuration(ms).padStart(6)})`
}

export interface BarState {
  model: string
  /** Null before the first turn, when the bar reads `ctx --` and `--`. */
  used: number | null
  window: number
  sessionMs: number
  /** Live turn time. Renders with `⏱`. Mutually exclusive with `frozenMs`. */
  liveMs?: number
  /** Frozen turn time after completion. Renders with `⏲`. */
  frozenMs?: number
  /** Undocumented `✓ Ns` badge: time since the last turn completed. */
  sinceMs?: number
}

/**
 * The status bar, verbatim in shape.
 *
 * `[09]` §3, and the single most load-bearing correction in the corpus: **there is no
 * cost field.** `[01]` §5 and `[05]` §2 both publish one, and the documentation says an
 * unpriced model shows `n/a`. Across 300+ captured bars the field is absent entirely.
 * If a `$` ever appears in this function's output, the guide's central claim about
 * itself has been broken.
 */
export function statusBar(state: BarState): string {
  const parts = [`⚕ ${state.model}`]

  if (state.used === null) {
    parts.push('ctx --', `${meter(null)} --`)
  } else {
    const pct = percent(state.used, state.window)
    parts.push(`${tokens(state.used)}/${tokens(state.window)}`, `${meter(pct)} ${pct}%`)
  }

  parts.push(elapsed(state.sessionMs))

  if (state.liveMs !== undefined) parts.push(`⏱ ${turnDuration(state.liveMs)}`)
  else if (state.frozenMs !== undefined) parts.push(`⏲ ${turnDuration(state.frozenMs)}`)

  if (state.sinceMs !== undefined) parts.push(`✓ ${sinceBadge(state.sinceMs)}`)

  return parts.join(' │ ')
}

/**
 * The undocumented `✓ Ns` badge, which does **not** coarsen the way `⏲` does.
 *
 * `[09]` §3 records it climbing `✓ 0s` → `✓ 46s` → **`✓ 60s`**. That last sample is the
 * whole point: sixty seconds prints as `60s`, not `1m`. Reusing `turnDuration` here
 * looked harmless and would have contradicted the only evidence this field has.
 */
export function sinceBadge(ms: number): string {
  return `${Math.floor(ms / 1000)}s`
}

/**
 * A tool-feed result line.
 *
 * `[09]` §5, and the format differs from the documentation on three counts: two
 * phases rather than one, no backticks around the target, and no parentheses around
 * the duration. The verb is a short human word padded to a column, not the tool's
 * API name.
 *
 * **`glyph` must occupy two columns.** The captured feed aligns on an emoji-width
 * cell, so every emoji glyph works as-is and every narrow one — `↓` is the only such
 * case in the corpus — must be passed pre-padded as `'↓ '`. This was an undocumented
 * invariant that produced correct output only because the one caller happened to
 * compensate; `padGlyph` now makes it impossible to get wrong.
 */
export function feedLine(glyph: string, verb: string, target: string, ms: number): string {
  return `┊ ${padGlyph(glyph)} ${verb.padEnd(9)} ${target}  ${toolDuration(ms)}`
}

/**
 * Widens a single-column glyph to the emoji cell the feed aligns on. Emoji are already
 * two columns wide and pass through untouched.
 */
export function padGlyph(glyph: string): string {
  return [...glyph].length === 1 && glyph.codePointAt(0)! < 0x1f000 ? `${glyph} ` : glyph
}

/** The first phase, replaced by the result line once the call returns. */
export function preparingLine(glyph: string, tool: string): string {
  return `┊ ${padGlyph(glyph)} preparing ${tool}…`
}
