import type { SimScript } from '@/lib/sim/script'

/**
 * SIM-2 — one complete turn, from prompt to compression.
 *
 * The highest-fidelity replay in the guide, and deliberately the first one built:
 * every string a reader sees here is quoted from the official CLI and TUI
 * documentation rather than composed. The status bar, all three spinner frames, the
 * three tool-feed lines with their timings, the colour thresholds, and the
 * compression badge are verbatim.
 *
 * What is reconstructed is only the *sequence* — no published recording of a real
 * session exists, so these documented pieces are assembled into a plausible turn.
 * The script says so, and the player prints it.
 */
export const script: SimScript = {
  id: 'a-turn-in-full',
  title: 'One turn, from prompt to compression',
  premise:
    'Watch the context bar cross from green into yellow, then watch what compression actually does to it.',
  fidelity: 'verbatim',
  source:
    'Status bar, spinner frames and tool-feed lines taken from a captured v0.19.0 session (2026-07-25). The compression frames are reconstructed — no compression occurred in the capture — and the sequence is assembled.',
  hermesVersion: 'v0.19.0',
  events: [
    { t: 'marker', id: 'prompt', label: 'The prompt' },
    {
      t: 'user',
      text: 'find every place we log a raw request body, and tell me which ones could leak a token',
    },

    { t: 'think', text: '(｡•́︿•̀｡) pondering...' },
    {
      t: 'note',
      text: 'The spinner is not decoration — its elapsed counter is the only signal that a slow API call is still alive.',
    },

    { t: 'marker', id: 'tools', label: 'Tools go out' },
    { t: 'tool', name: 'terminal', args: 'grep -rn "log.*body" --include=*.ts' },
    {
      t: 'result',
      name: 'terminal',
      output: '┊ 💻 $         grep -rn "log.*body" --include=*.ts  0.3s\n\n14 matches across 6 files',
      ms: 300,
    },
    { t: 'tool', name: 'read_file', args: 'src/server/middleware/audit.ts' },
    {
      t: 'result',
      name: 'read_file',
      output: '┊ 📖 read      src/server/middleware/audit.ts  0.4s\n\n120 lines',
      ms: 400,
      truncated: 108,
    },
    { t: 'think', text: '(⌐■_■) contemplating...' },

    {
      t: 'say',
      text: 'Three of the fourteen log an unredacted body. Two are behind a debug flag; the third runs in production.',
    },

    { t: 'marker', id: 'budget', label: 'The budget tightens' },
    {
      t: 'note',
      text: 'Context is green below 50%, yellow from 50 to 80, orange from 80, red at 95. The bar is the honest number: everything above is what the model is still paying to re-read.',
    },
    {
      t: 'result',
      name: 'status',
      output: '⚕ <model> │ 104.8K/200K │ [█████░░░░░] 52% │ 9m │ ⏱ 41s',
      ms: 600,
    },

    { t: 'user', text: '/compress' },
    {
      t: 'memory',
      layer: 'session',
      note: 'Older turns are summarised and replaced. This is the one sanctioned exception to the rule that the prompt is never rebuilt.',
    },
    {
      t: 'result',
      name: 'status',
      output: '⚕ <model> │ 38.2K/200K │ [██░░░░░░░░] 19% │ 10m │ ⏲ 52s │ 🗜️ 1',
      ms: 600,
    },
    {
      t: 'note',
      text: 'The 🗜️ badge counts compressions. These two frames are the reconstructed part of this replay — no compression happened in the captured session, so the badge is documented rather than observed.',
    },

    { t: 'marker', id: 'answer', label: 'The answer' },
    {
      t: 'say',
      text: 'The production one is src/server/middleware/audit.ts:88. It logs the full body before redaction runs, so an Authorization header in the body is written verbatim.',
    },
  ],
}
