import { describe, expect, it } from 'vitest'
import {
  PERCENT_CONFLICT,
  echoDuration,
  elapsed,
  feedLine,
  meter,
  padGlyph,
  percent,
  sinceBadge,
  statusBar,
  tokens,
  toolDuration,
  turnDuration,
} from './format'

/**
 * These tests exist to stop the formatters drifting back toward what the documentation
 * says, which is what a future editor will do by accident. Each case cites the captured
 * frame it comes from.
 */

describe('tokens', () => {
  it('drops a trailing .0, which is why 22K is not 22.0K', () => {
    // [09] §12
    expect(tokens(22_000)).toBe('22K')
  })

  it('keeps one decimal otherwise', () => {
    // [09] §3
    expect(tokens(21_100)).toBe('21.1K')
    expect(tokens(76_900)).toBe('76.9K')
  })

  it('renders the window as 1M', () => {
    expect(tokens(1_000_000)).toBe('1M')
  })
})

describe('meter', () => {
  it('shows an empty bar at 2% and one cell at 7%', () => {
    // [09] §3 — a cell is a whole ten percent; partial cells do not exist.
    expect(meter(2)).toBe('[░░░░░░░░░░]')
    expect(meter(7)).toBe('[█░░░░░░░░░]')
  })

  it('is empty before the first turn', () => {
    expect(meter(null)).toBe('[░░░░░░░░░░]')
  })

  it('never overflows ten cells', () => {
    expect(meter(140)).toBe('[██████████]')
  })
})

describe('percent', () => {
  /**
   * Two captured frames require rounding and one requires flooring, so no rule
   * satisfies all three. Rounding wins on count; these tests pin both the two frames
   * it reproduces and the one it cannot, so the residual conflict stays visible rather
   * than being quietly forgotten the next time someone reads this function.
   */
  it('rounds, matching the two 19.xK/1M → 2% frames', () => {
    expect(percent(19_200, 1_000_000)).toBe(2) // [09] §14
    expect(percent(19_400, 1_000_000)).toBe(2) // [09] §15
  })

  it('cannot reproduce the 76.9K/1M → 7% frame, and says so', () => {
    // [09] §3 reads 7%; rounding gives 8. Documented in PERCENT_CONFLICT rather than
    // hidden, because a formatter that silently disagrees with a primary source is
    // exactly the drift this project exists to catch.
    expect(percent(76_900, 1_000_000)).toBe(8)
    expect(PERCENT_CONFLICT).toContain('76.9K/1M')
  })
})

describe('the ✓ badge does not coarsen', () => {
  it('renders 60 seconds as 60s, not 1m', () => {
    // [09] §3 records the badge climbing ✓ 0s → ✓ 46s → ✓ 60s. That last sample is the
    // only evidence this field has, and it rules out reusing turnDuration.
    expect(sinceBadge(0)).toBe('0s')
    expect(sinceBadge(46_000)).toBe('46s')
    expect(sinceBadge(60_000)).toBe('60s')
    expect(turnDuration(60_000)).toBe('1m')
  })
})

describe('the second duration format', () => {
  it('right-aligns in a six-character field, parenthesised', () => {
    expect(echoDuration(17_400)).toBe('( 17.4s)') // [09] §14
    expect(echoDuration(200)).toBe('(  0.2s)') // [09] §5
  })
})

describe('narrow glyphs are widened to the emoji cell', () => {
  it('pads ↓ and leaves emoji alone', () => {
    // [09] §5's `┊ ↓  scroll    down  0.3s` has two spaces after the arrow. The feed
    // aligns on a two-column cell, and this was an undocumented invariant that only
    // held because one caller happened to compensate.
    expect(padGlyph('↓')).toBe('↓ ')
    expect(padGlyph('💻')).toBe('💻')
    expect(feedLine('↓', 'scroll', 'down', 300)).toBe('┊ ↓  scroll    down  0.3s')
  })
})

describe('elapsed and turnDuration are different clocks', () => {
  it('coarsens the session figure to whole minutes', () => {
    // [09] §3: 1s, 42s, 1m, 4m
    expect(elapsed(1000)).toBe('1s')
    expect(elapsed(42_000)).toBe('42s')
    expect(elapsed(240_000)).toBe('4m')
  })

  it('keeps seconds in the turn figure', () => {
    // [09] §3: `⏲ 3m 52s` sits in the same bar whose session figure reads `4m`.
    expect(turnDuration(232_000)).toBe('3m 52s')
    expect(turnDuration(7000)).toBe('7s')
  })
})

describe('statusBar', () => {
  it('reproduces the pre-first-turn frame', () => {
    // [09] §3, frame 1
    expect(
      statusBar({ model: '<model>', used: null, window: 1_000_000, sessionMs: 1000, frozenMs: 0 })
    ).toBe('⚕ <model> │ ctx -- │ [░░░░░░░░░░] -- │ 1s │ ⏲ 0s')
  })

  it('reproduces the live-turn frame', () => {
    // [09] §3, frame 2
    expect(
      statusBar({
        model: '<model>',
        used: 21_100,
        window: 1_000_000,
        sessionMs: 42_000,
        liveMs: 7000,
      })
    ).toBe('⚕ <model> │ 21.1K/1M │ [░░░░░░░░░░] 2% │ 42s │ ⏱ 7s')
  })

  it('reproduces the completed-turn frame apart from the contested percentage', () => {
    // [09] §3, frame 3. Everything here is exact except the `7%`, which no rounding
    // rule can produce alongside the two 2% frames — see PERCENT_CONFLICT. `✓ Ns` is
    // undocumented anywhere, and does not coarsen.
    expect(
      statusBar({
        model: '<model>',
        used: 76_900,
        window: 1_000_000,
        sessionMs: 240_000,
        frozenMs: 232_000,
        sinceMs: 0,
      })
    ).toBe('⚕ <model> │ 76.9K/1M │ [█░░░░░░░░░] 8% │ 4m │ ⏲ 3m 52s │ ✓ 0s')
  })

  /**
   * The load-bearing one. `[01]` §5 and `[05]` §2 both publish a cost field and the docs
   * promise `n/a` for unpriced models; across 300+ captured bars it is absent entirely.
   * If this test ever fails, the guide's central claim about itself has been broken.
   */
  it('never prints a cost field, under any input', () => {
    const cases = [
      { model: 'claude-sonnet-4', used: null, window: 1_000_000, sessionMs: 0 },
      { model: 'gpt-5', used: 500_000, window: 1_000_000, sessionMs: 999_000, liveMs: 61_000 },
      { model: 'x', used: 1, window: 200_000, sessionMs: 1, frozenMs: 1, sinceMs: 1 },
    ]
    for (const input of cases) {
      expect(statusBar(input)).not.toContain('$')
      expect(statusBar(input)).not.toContain('n/a')
    }
  })
})

describe('the tool feed', () => {
  it('pads the verb to a column and uses no backticks or parentheses', () => {
    // [09] §5 — the documented format in [05] §2 has both, and is wrong.
    expect(feedLine('🌐', 'navigate', 'github.com', 2600)).toBe('┊ 🌐 navigate  github.com  2.6s')
    expect(feedLine('💻', '$', 'rm -rf /tmp/hermes-scratch', 5000)).toBe(
      '┊ 💻 $         rm -rf /tmp/hermes-scratch  5.0s'
    )
  })

  it('renders durations to one decimal', () => {
    expect(toolDuration(200)).toBe('0.2s')
    expect(toolDuration(17_400)).toBe('17.4s')
  })
})
