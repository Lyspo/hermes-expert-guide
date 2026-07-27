/**
 * The arrival: the evidence, at reading distance.
 *
 * The landing page opened on typography and a rule, with the right half of the viewport
 * empty. `06-direction-calibration.md` records the author being shown that register —
 * by-kin.com's editorial restraint — and rejecting it outright, while ranking
 * activetheory.net and igloo.inc joint first. This is the arrival built from what those
 * two actually do.
 *
 * **What Active Theory does** is use monospace as literal procedural rendering rather
 * than as a technical-sounding costume — `01-reference-sites.md` approved it in those
 * words. **What Igloo does** is put real form in a real space with a structural overlay
 * on top. The version of both that this project can build, and no competing guide can,
 * is its own evidence: a wall of *actually captured* Hermes output, receding.
 *
 * Every line below is verbatim from the research corpus. None of it is filler text
 * shaped to look technical — `evidence-field.test.ts` asserts each line appears in
 * `research/` or in the console's cited source table, which is the same discipline the
 * lessons run on, applied to a decorative surface so that it stops being decorative.
 * That is the whole idea: the texture *is* the argument. A reader who leans in finds a
 * real status bar with no cost field in it.
 *
 * **Rendered as text in CSS 3D, not as a canvas**, for three reasons. It is honest —
 * you can select these lines and check them, which a picture of text does not allow.
 * It costs **zero client JavaScript**, on a page with 2.4 kB of first-party budget left.
 * And `CLAUDE.md` bans reintroducing an ambient background canvas, a rule written after
 * a decorative field was mistaken for the real curriculum graph; this stays on the right
 * side of it by being neither ambient nor a canvas nor decorative.
 *
 * The moment is a settle, once, on arrival. Its resting state is the settled position,
 * so reduced motion, a stalled clock and no CSS animation support all land on the
 * finished wall rather than on an empty one.
 */

/**
 * Captured Hermes output, verbatim.
 *
 * Ordered so the nearest lines — the ones a reader can actually read — are the ones
 * that carry a correction. The status bar has no cost field where the documentation
 * says it does; the approval prompt is a numbered menu where the documentation says
 * letters. Someone who has run Hermes will recognise the first and be surprised by the
 * second, and that is the page's argument arriving before any prose does.
 */
const LINES: readonly string[] = [
  '⚕ <model> │ 21.1K/1M │ [░░░░░░░░░░] 2% │ 42s │ ⏱ 7s',
  '  ┊ 💻 preparing terminal…',
  '  ┊ 💻 $         rm -rf /tmp/hermes-scratch  5.0s',
  '│ ⚠ Dangerous Command                      │',
  '│ ❯ 1. Allow once                          │',
  '│   2. Allow for this session              │',
  '│   3. Add to permanent allowlist          │',
  '│   4. Deny                                │',
  '│ delete in root path                      │',
  '  ↑/↓ to select, Enter to confirm  (282s)',
  '⚕ ❯ msg=interrupt · /queue · /bg · /steer · Ctrl+C cancel',
  'MEMORY (your personal notes) [67% — 1,474/2,200 chars]',
  '┊ 📚 skill hermes-agent',
  '→ references/cli-reference.md',
  '🗒 Compressing 6 messages (~19,704 tokens)...',
  '  🗒 No changes from compression: 6 messages',
  'Welcome to Hermes Agent! Type your message or /help for commands.',
  'Initializing agent...',
  '⚕ <model> │ ctx -- │ [░░░░░░░░░░] -- │ 1s │ ⏲ 0s',
  '│ ⚠ Dangerous Command                      │',
  '  ↑/↓ to select, Enter to confirm  (282s)',
  '⚕ <model> │ 21.2K/1M │ [░░░░░░░░░░] 2% │ 32s │ ⏲ 14s │ ✓ 0s',
]

export function EvidenceField() {
  return (
    <div
      className="evidence-field"
      // The lines are quoted in full, in context, inside the lessons that source them.
      // Here they are texture with provenance, and reading twenty-two decontextualised
      // terminal fragments aloud would be a worse experience than skipping them.
      aria-hidden="true"
    >
      <div className="evidence-plane">
        {LINES.map((line, index) => (
          <pre
            key={index}
            className="evidence-line"
            style={{ ['--i' as string]: `${index}` }}
          >
            {line}
          </pre>
        ))}
      </div>
    </div>
  )
}

/** Exported for the provenance test, which is the only thing that should read it. */
export const EVIDENCE_LINES = LINES
