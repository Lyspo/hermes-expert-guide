import * as S from '@/lib/term/sources'

/**
 * What the console is before JavaScript arrives, and what it stays for a reader who
 * never gets any.
 *
 * A server component on purpose: it renders into the exported HTML, so the captured
 * approval gate is in the document a crawler indexes and a screen reader can read
 * straight through. The interactive console is an enhancement layered on top of this,
 * never a replacement for it — which is the rule `decisions.md` 010 says must not be
 * quietly traded away when it becomes inconvenient.
 *
 * The frames are `[09]` §14 and §12: the prompt as it stands pending, then the outcome.
 * Together they are the one thing a reader most needs to see about this software.
 */
export function StaticTranscript() {
  return (
    <div className="px-4 py-3">
      <p className="mb-3 font-mono text-[0.7rem] text-ice-dim">
        Captured session · Hermes v0.19.0 · {S.APPROVAL_PROMPT.source} — the interactive
        console needs JavaScript. This transcript does not.
      </p>
      {/* Scrollable, therefore focusable — a terminal frame is wider than a phone and
          a reader who cannot drag it must still be able to reach the right-hand side. */}
      <pre
        tabIndex={0}
        className="overflow-x-auto font-mono text-[0.78rem] leading-[1.6] text-ice"
      >
        {[
          '● recursively delete /tmp/hermes-scratch',
          '',
          '  ' + '┊ 💻 preparing terminal…',
          '',
          ...S.APPROVAL_PROMPT.lines,
          S.APPROVAL_HINT,
          '',
          S.approvalOutcome('rm -rf /tmp/hermes-scratch', 'denied'),
          '',
          ...S.DENIED_REPLY.lines,
        ].join('\n')}
      </pre>
      <p className="mt-3 font-mono text-[0.7rem] text-ice-dim">
        Under the default <code>approvals.mode: smart</code> the same command runs with no
        prompt at all — {S.SILENT_DELETE_REPLY.source}.
      </p>
    </div>
  )
}
