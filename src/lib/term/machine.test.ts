import { describe, expect, it } from 'vitest'
import { exec, initialTerm, timeoutApproval, type TermState } from './machine'
import * as S from './sources'

/** Runs a sequence of inputs from a fresh console and returns the final state. */
function run(...inputs: string[]): TermState {
  return inputs.reduce<TermState>((state, input) => exec(state, input), initialTerm)
}

const text = (state: TermState) => state.lines.map((entry) => entry.text).join('\n')

describe('purity', () => {
  it('produces identical state for identical input, every time', () => {
    const a = run('hermes', 'recursively delete /tmp/hermes-scratch')
    const b = run('hermes', 'recursively delete /tmp/hermes-scratch')
    expect(a).toEqual(b)
  })

  it('never mutates the state it was given', () => {
    const before = JSON.stringify(initialTerm)
    exec(initialTerm, 'hermes version')
    expect(JSON.stringify(initialTerm)).toBe(before)
  })
})

describe('the shell', () => {
  it('prints the version block verbatim', () => {
    expect(text(run('hermes version'))).toContain(
      'Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad'
    )
  })

  it('reports the subcommand count it actually has, and flags the discrepancy', () => {
    const out = text(run('hermes --help'))
    expect(out).toContain('chat')
    expect(out).toContain('prompt-size')
    expect(out).toContain("[08] §2's prose says 69")
    // The whole point: no invented names padding 61 up to 69.
    expect(S.SUBCOMMANDS).toHaveLength(61)
  })

  it('fails on `hermes daemon`, because the software does', () => {
    expect(text(run('hermes daemon start'))).toContain("No such command 'daemon'")
  })

  it('resolves the undocumented aliases', () => {
    expect(text(run('hermes learning'))).toBe(text(run('hermes journey')))
    expect(text(run('hermes memory-graph'))).toBe(text(run('hermes journey')))
  })

  it('degrades journey to an explanation on a fresh profile', () => {
    expect(text(run('hermes journey'))).toContain('No learning data to render yet')
  })

  it('refuses to invent output for a real but uncaptured subcommand', () => {
    const out = text(run('hermes kanban'))
    expect(out).toContain("'kanban' is a real subcommand, but its output was never captured")
    expect(out).toContain('declines')
  })
})

describe('the approval gate — the same command, three outcomes', () => {
  const ASK = 'recursively delete /tmp/hermes-scratch'

  it('runs silently under the default smart mode, with no prompt at all', () => {
    const state = run('hermes', ASK)
    expect(state.pending).toBeNull()
    const out = text(state)
    expect(out).toContain('rm -rf /tmp/hermes-scratch  5.0s')
    expect(out).toContain('Done. /tmp/hermes-scratch has been deleted.')
    expect(out).not.toContain('Dangerous Command')
  })

  it('prompts under manual mode, with the numbered menu the docs get wrong', () => {
    const state = run('hermes', ':approvals manual', ASK)
    expect(state.pending).not.toBeNull()
    const out = text(state)
    for (const row of S.APPROVAL_PROMPT.lines) expect(out).toContain(row)
    expect(out).toContain('1. Allow once')
    expect(out).toContain('4. Deny')
    // The letter-key form [o]nce [s]ession [a]lways [d]eny appears nowhere on a real
    // v0.19.0 CLI, and must appear nowhere here either.
    expect(out).not.toContain('[o]nce')
  })

  it('shows the countdown, which is time remaining rather than time spent', () => {
    expect(text(run('hermes', ':approvals manual', ASK))).toContain(
      '↑/↓ to select, Enter to confirm  (282s)'
    )
  })

  it('holds every other input while the prompt is pending', () => {
    const pending = run('hermes', ':approvals manual', ASK)
    const nudged = exec(pending, 'hello')
    expect(nudged.pending).not.toBeNull()
    // The hint is `cli.py`'s own, and it says 1/2/3 — three digits. Extending it to
    // four would be inventing, so the console prints the source's wording.
    expect(text(nudged)).toContain('type 1/2/3, or ↑/↓ to select, Enter to confirm')
  })

  it('on denial, shows what the model was actually told', () => {
    const out = text(run('hermes', ':approvals manual', ASK, '4'))
    expect(out).toContain('⚠ Approval: rm -rf /tmp/hermes-scratch → denied')
    expect(out).toContain('[BLOCKED: User denied this command. The user h...]')
    expect(out).toContain('do NOT attempt the same outcome via a different command')
  })

  it('on allow-once, shows the 51.5s that includes the human deliberating', () => {
    const out = text(run('hermes', ':approvals manual', ASK, '1'))
    expect(out).toContain('⚠ Approval: rm -rf /tmp/hermes-scratch → allowed once')
    expect(out).toContain('51.5s')
  })

  /** The undocumented behaviour that matters most: an unanswered prompt denies. */
  it('fails closed on timeout', () => {
    const pending = run('hermes', ':approvals manual', ASK)
    const timedOut = timeoutApproval(pending)
    expect(timedOut.pending).toBeNull()
    expect(text(timedOut)).toContain('→ denied')
    expect(text(timedOut)).not.toContain('allowed once')
  })
})

describe('the self-improvement loop', () => {
  it('fires the notice after the answer, not before', () => {
    const state = run('hermes', 'find under-the-radar github repos')
    const lines = state.lines.map((entry) => entry.text)
    const answer = lines.findIndex((entry) => entry.includes('curl -s'))
    const notice = lines.findIndex((entry) => entry.includes('Self-improvement review'))
    expect(answer).toBeGreaterThan(-1)
    expect(notice).toBeGreaterThan(answer)
  })

  it('uses the captured notice, not the documented one', () => {
    const out = text(run('hermes', 'find under-the-radar github repos'))
    expect(out).toContain("💾 Self-improvement review: Skill 'github-repo-discovery' created.")
    expect(out).not.toContain('patched')
  })

  it('records the skill under a namespaced path', () => {
    const state = run('hermes', 'find under-the-radar github repos')
    expect(state.skills).toEqual(['github/github-repo-discovery'])
  })

  it('shows progressive disclosure happening, not described', () => {
    const out = text(run('hermes', 'find under-the-radar github repos'))
    expect(out).toContain('skill     hermes-agent  0.0s')
    expect(out).toContain('references/cli-reference.md')
  })
})

describe('/compress', () => {
  it('is a no-op below the protected floor, and says why', () => {
    const out = text(run('hermes', '/compress'))
    expect(out).toContain('No changes from compression: 6 messages')
    expect(out).toContain('protect_first_n + protect_last_n = 23')
  })

  it('refuses to simulate the case nobody captured', () => {
    let state = run('hermes')
    // Two captured turns still leave the conversation far below 23 messages, so drive
    // the counter directly rather than pretending a long session was recorded.
    state = { ...state, messages: 40 }
    expect(text(exec(state, '/compress'))).toContain('never captured')
  })
})

describe('the refusal is the feature', () => {
  it('declines free text it has no recording of', () => {
    const out = text(run('hermes', 'write me a poem about kubernetes'))
    expect(out).toContain('This console only prints output with a source behind it')
  })

  it('never claims a source it does not have', () => {
    const state = run('hermes', 'hermes kanban', 'write me a poem')
    for (const entry of state.lines) {
      if (entry.source === undefined) continue
      expect(entry.source === 'not captured' || /^\[\d{2}\] §/.test(entry.source)).toBe(true)
    }
  })
})
