import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { exec, initialTerm, timeoutApproval, type Line, type TermState } from './machine'
import * as S from './sources'

/**
 * The audit that makes the word "verbatim" mean something.
 *
 * It has been through one adversarial review and both of that review's structural
 * findings are fixed here, because they mattered more than anything they found:
 *
 * **It normalised whitespace, and whitespace is the content.** Collapsing runs of
 * spaces made two 81-character banner rows compare equal to the corpus's 80-character
 * originals, so the audit certified a ragged box border as verbatim. Box art and the
 * feed's padded verb column are *made of* spacing; comparison is now exact, with only
 * markdown's blockquote prefix and trailing whitespace removed.
 *
 * **It only ever looked at `sources.ts`.** Every string `machine.ts` composes inline
 * was invisible to it, which is where a fabricated `Usage: hermes [OPTIONS] COMMAND
 * [ARGS]...` header lived — wearing a real citation, in the first command a sceptic
 * types. The second half of this file drives the machine through every path it has and
 * classifies every line it emits.
 */

const CORPUS = ['08-installed-binary', '09-captured-session']
  .map((name) =>
    readFileSync(fileURLToPath(new URL(`../../../research/${name}.md`, import.meta.url)), 'utf8')
  )
  .join('\n')

/**
 * Corpus lines, blockquote-stripped and edge-trimmed. **Interior spacing is preserved**,
 * which is the whole point: a code fence indents its contents and a blockquote prefixes
 * them, and neither is content — but the run of spaces before a box's right border is,
 * and collapsing it is how an 81-character row passed as an 80-character one.
 */
const CORPUS_LINES = new Set(
  CORPUS.split('\n').map((row) => row.replace(/^\s*>\s?/, '').trim())
)

const inCorpus = (row: string) => CORPUS_LINES.has(row.trim())

/**
 * A looser haystack, for anchoring reconstructions only. Anchoring asks whether a
 * sentence exists *somewhere* in the corpus, including mid-paragraph in prose, so it
 * cannot use line membership. It is deliberately the weaker of the two checks.
 */
const HAYSTACK = CORPUS.split('\n')
  .map((row) => row.replace(/^\s*>\s?/, ''))
  .join(' ')
  .replace(/\s+/g, ' ')

const BLOCKS: [string, S.Block][] = Object.entries(S).filter(
  (entry): entry is [string, S.Block] => {
    const value = entry[1]
    return (
      typeof value === 'object' &&
      value !== null &&
      'lines' in value &&
      'fidelity' in value &&
      'source' in value
    )
  }
)

describe('the corpus is readable', () => {
  it('found both primary-source files', () => {
    expect(CORPUS).toContain('Hermes Agent v0.19.0')
    expect(CORPUS.length).toBeGreaterThan(20_000)
  })

  it('found the blocks to check', () => {
    // Guards the guard: an empty BLOCKS array would make every assertion below pass
    // vacuously, which is the failure mode of every reflection-driven test.
    expect(BLOCKS.length).toBeGreaterThanOrEqual(10)
  })
})

describe('every verbatim block appears in the corpus, character for character', () => {
  for (const [name, block] of BLOCKS) {
    if (block.fidelity !== 'verbatim') continue

    it(`${name} (${block.source})`, () => {
      for (const row of block.lines) {
        if (row.trim() === '' || row.trim() === '---') continue
        expect(inCorpus(row), `not in the corpus, exactly: ${JSON.stringify(row)}`).toBe(true)
      }
    })
  }
})

/**
 * `reconstructed` is the honest label when the layout is this guide's arrangement of
 * real content. It must not become the escape hatch that lets invention through, so a
 * reconstruction still has to be anchored: at least one substantial line of it exists
 * in the corpus exactly. A block that fails this is not a reconstruction, it is fiction.
 */
describe('every reconstruction is anchored in the corpus', () => {
  for (const [name, block] of BLOCKS) {
    if (block.fidelity !== 'reconstructed' || block.source === 'not captured') continue

    it(`${name} (${block.source})`, () => {
      const anchored = block.lines
        .map((row) => row.trim().replace(/\s+/g, ' '))
        .filter((row) => row.length >= 24)
        .some((row) => HAYSTACK.includes(row))
      expect(anchored, `${name} has no line the corpus contains`).toBe(true)
    })
  }
})

describe('every block cites something', () => {
  it('carries a source, and a real one', () => {
    for (const [name, block] of BLOCKS) {
      expect(block.source, `${name} has no source`).toBeTruthy()
      const shaped = /^\[\d{2}\] §/.test(block.source) || block.source === 'not captured'
      expect(shaped, `${name} cites "${block.source}", which is not a corpus reference`).toBe(true)
    }
  })

  it('never labels a "not captured" block verbatim', () => {
    for (const [name, block] of BLOCKS) {
      if (block.source !== 'not captured') continue
      expect(block.fidelity, `${name}`).toBe('reconstructed')
    }
  })
})

/* -------------------------------------------------------------------------- */
/* The machine, which the previous version of this file could not see          */
/* -------------------------------------------------------------------------- */

/**
 * Every line `sources.ts` can contribute: block lines, the bare string constants
 * (`HINT_BAR`, `APPROVAL_HINT_DIGITS` and friends, each carrying its own citation in a
 * docstring), and the refusal block's fixed tail.
 */
const BLOCK_LINES = new Set([
  ...BLOCKS.flatMap(([, block]) => block.lines),
  ...Object.values(S).filter((value): value is string => typeof value === 'string'),
  ...S.notCaptured('sample').lines,
])

/**
 * The same set, edge-trimmed. The machine indents sourced strings when it nests them
 * under a frame — leading whitespace it added is presentation, not a change to the
 * string, so it must not make a sourced line look unaccounted for.
 */
const BLOCK_TRIMMED = new Set([...BLOCK_LINES].map((row) => row.trim()))

/**
 * Lines the console composes rather than reproduces, each with the reason it is not a
 * corpus line. Adding to this list is the deliberate act the audit exists to force:
 * a new inline string either matches the corpus, wears the guide's own voice, or gets
 * written down here with a justification.
 */
const DERIVED: { pattern: RegExp; why: string }[] = [
  { pattern: /^\s*[a-z-]+( · [a-z-]+)*$/, why: 'subcommand names, regrouped from [08] §2' },
  { pattern: /^\s*\/[a-z]+( · \/[a-z]+)*$/, why: 'slash-command names, each cited separately' },
  { pattern: /^\s*approvals\.mode: (smart|manual|off)$/, why: 'echo of the guide’s own :approvals' },
  { pattern: /^\s*usage: :approvals /, why: 'the guide’s own affordance, not a Hermes command' },
  { pattern: /^\s*session ended$/, why: 'the guide’s own session boundary' },
  { pattern: /^command not found: /, why: 'this console’s shell, not Hermes' },
  { pattern: /^\s*Always prompts\.|^\s*An LLM risk-assesses|^\s*Disables the checks/, why: 'mode effects paraphrased from [02] §7 via [09] §11' },
  { pattern: /^● /, why: 'the reader’s own input, echoed' },
  {
    pattern: /^This console runs `hermes`/,
    why: 'this console’s own shell, which is not Hermes and does not pretend to be',
  },
  {
    pattern: /^💾 Self-improvement review: Skill '.+' created\.$/,
    why: '[09] §8 verbatim with the captured skill name substituted for its placeholder',
  },
  {
    pattern: /^\s*┊ 💻 \$ +rm -rf \/tmp\/hermes-scratch {2}51\.5s$/,
    why: 'feed format from [09] §5, duration from [09] §15, which records 51.5s in prose rather than as a printed line',
  },
]

/**
 * Guide-voice markers. `┈` opens every line of this project's own commentary inside the
 * console, `⚠` opens a refusal. Neither is ever dressed as Hermes output.
 */
const GUIDE_VOICE = /^\s*(┈|⚠ )/

function classify(line: Line): 'corpus' | 'block' | 'guide' | 'derived' | 'UNCLASSIFIED' {
  const text = line.text
  if (text.trim() === '') return 'guide'
  if (BLOCK_LINES.has(text) || BLOCK_TRIMMED.has(text.trim())) return 'block'
  if (GUIDE_VOICE.test(text)) return 'guide'
  if (inCorpus(text.replace(/^\s+/, ''))) return 'corpus'
  if (DERIVED.some((entry) => entry.pattern.test(text))) return 'derived'
  return 'UNCLASSIFIED'
}

/** Drives every path the machine has, so nothing is audited only in theory. */
function everyPath(): Line[] {
  const walks: string[][] = [
    ['hermes version'],
    ['hermes --help'],
    ['hermes daemon start'],
    ['hermes journey'],
    ['hermes journey --help'],
    ['hermes journey --json'],
    ['hermes curator'],
    ['hermes kanban'],
    ['hermes learning'],
    ['ls'],
    ['hermes', '/help'],
    ['hermes', '/journey'],
    ['hermes', '/compress'],
    ['hermes', '/exit'],
    ['hermes', ':approvals bogus'],
    ['hermes', 'write me a poem about kubernetes'],
    ['hermes', 'recursively delete /tmp/hermes-scratch'],
    ['hermes', ':approvals off', 'recursively delete /tmp/hermes-scratch'],
    ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', '1'],
    ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', '2'],
    ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', '3'],
    ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', '4'],
    ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', 'nonsense'],
    ['hermes', 'find under-the-radar github repos'],
  ]

  const lines = walks.flatMap((walk) =>
    walk.reduce<TermState>((state, input) => exec(state, input), initialTerm).lines
  )

  // The timeout path, which does not go through `exec`.
  const pending = ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch'].reduce<TermState>(
    (state, input) => exec(state, input),
    initialTerm
  )
  return [...lines, ...timeoutApproval(pending).lines]
}

describe('the machine composes nothing it cannot account for', () => {
  const lines = everyPath()

  it('drove enough paths to be worth trusting', () => {
    expect(lines.length).toBeGreaterThan(150)
  })

  it('every emitted line is corpus, block, guide voice, or declared derived', () => {
    const orphans = lines
      .filter((line) => classify(line) === 'UNCLASSIFIED')
      .map((line) => line.text)

    expect(
      [...new Set(orphans)],
      'unaccounted-for console output — match the corpus, mark it as guide voice with ┈, or declare it in DERIVED'
    ).toEqual([])
  })

  /**
   * The specific failure that got through the last audit. `Usage:`, `OPTIONS` and
   * `ARGS` are Click's defaults and a plausible guess; none of them appears in either
   * capture. Named explicitly so this exact regression cannot recur quietly.
   */
  it('never prints the invented usage header', () => {
    const all = lines.map((line) => line.text).join('\n')
    expect(all).not.toContain('[OPTIONS]')
    expect(all).not.toContain('[ARGS]')
    expect(all).not.toMatch(/^Usage:/m)
  })

  it('never claims a citation shaped like anything but a corpus reference', () => {
    for (const line of lines) {
      if (line.source === undefined) continue
      const shaped = /^\[\d{2}\] §/.test(line.source) || line.source === 'not captured'
      expect(shaped, `bad citation: ${line.source}`).toBe(true)
    }
  })
})

describe('the strings the documentation gets wrong stay wrong here', () => {
  const all = [...BLOCKS.map(([, b]) => b.lines.join('\n')), ...everyPath().map((l) => l.text)].join(
    '\n'
  )

  it("keeps the product's shipped typo", () => {
    expect(S.SPINNER_VERBS).toContain('contemlating')
    expect(CORPUS).toContain('contemlating')
  })

  it('uses the captured skill notice, not the documented one', () => {
    expect(S.skillNotice('x')).toBe("💾 Self-improvement review: Skill 'x' created.")
    expect(all).not.toContain('patched')
  })

  it('never reintroduces the letter-key approval options', () => {
    expect(all).not.toContain('[o]nce')
    expect(all).not.toContain('[s]ession')
  })

  it('never reintroduces a cost field', () => {
    expect(all).not.toMatch(/\$\d/)
  })

  it('never shows an outcome for the two approval options nobody captured', () => {
    for (const choice of ['2', '3']) {
      const state = ['hermes', ':approvals manual', 'recursively delete /tmp/hermes-scratch', choice]
        .reduce<TermState>((current, input) => exec(current, input), initialTerm)
      const text = state.lines.map((line) => line.text).join('\n')
      expect(text).toContain('never captured')
      expect(text).not.toContain('→ allowed once')
    }
  })
})
