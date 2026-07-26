import type { SimScript } from '@/lib/sim/script'

/**
 * SIM-3 — the memory cap, hit and resolved.
 *
 * The lesson that hosts this replay proves the "three-layer memory system" claim
 * wrong by argument. This proves it by arithmetic: the reader watches a character
 * counter refuse a write. A vector store does not do that.
 *
 * Every string a reader sees is quoted from the memory documentation — the
 * system-prompt injection block, the full-memory error payload in full, and the
 * notification line. What is assembled is the sequence.
 *
 * One honesty note is built into the events rather than hidden in this comment: the
 * injection example and the error example are two separate published frames with
 * different usage figures, so the replay says so at the point the numbers change
 * rather than quietly smoothing them into one continuous session.
 */
export const script: SimScript = {
  id: 'memory-fills-up',
  title: 'Memory fills up, and the agent has to clean house',
  premise:
    'Watch a write get refused by a character count, and watch the error tell the agent exactly how to recover — in the same turn.',
  fidelity: 'verbatim',
  source:
    'Injection format, the full-memory error payload, and the notification line quoted from the memory documentation, v0.19.0. The frozen-snapshot rule is from the context documentation. The sequence is assembled; the two quoted frames carry different usage figures because they are separate published examples.',
  hermesVersion: 'v0.19.0',
  events: [
    { t: 'marker', id: 'injected', label: 'What the model actually receives' },
    {
      t: 'result',
      name: 'system-prompt',
      output: `══════════════════════════════════════════════
MEMORY (your personal notes) [67% — 1,474/2,200 chars]
══════════════════════════════════════════════
User's project is a Rust web service at ~/code/myapi using Axum + SQLx
§
This machine runs Ubuntu 22.04, has Docker and Podman installed
§
User prefers concise responses, dislikes verbose explanations`,
      ms: 900,
    },
    {
      t: 'note',
      text: 'There is the whole of long-term memory: a header with a character count, and entries separated by a section sign. Not a store to be queried — a block of text pasted into the prompt, which is why it is capped at all.',
    },

    { t: 'marker', id: 'write', label: 'A write that does not fit' },
    {
      t: 'note',
      text: 'The next two frames are quoted from the same documentation page but are separate examples, so the usage figure jumps from 1,474 to 2,100. Assume a few sessions have passed.',
    },
    {
      t: 'user',
      text: 'we moved the api off heroku to fly.io last week — worth remembering, the old app is gone',
    },
    { t: 'think', text: '(｡•́︿•̀｡) pondering...' },
    { t: 'tool', name: 'memory', args: 'action="add" target="memory"' },
    {
      t: 'result',
      name: 'memory',
      output: `{
  "success": false,
  "error": "Memory at 2,100/2,200 chars. Adding this entry (250 chars) would exceed the limit. Consolidate now: use 'replace' to merge overlapping entries into shorter ones or 'remove' stale or less important entries (see current_entries below), then retry this add — all in this turn.",
  "current_entries": ["..."],
  "usage": "2,100/2,200"
}`,
      ms: 1100,
    },
    {
      t: 'note',
      text: 'Read the error again. It does not just refuse — it names the two recovery actions, hands over the current entries to work from, and specifies when: all in this turn. The cap is enforced by a failure that carries its own remedy.',
    },

    { t: 'marker', id: 'consolidate', label: 'Consolidation, in the same turn' },
    { t: 'think', text: '(⌐■_■) contemplating...' },
    { t: 'tool', name: 'memory', args: 'action="replace"' },
    {
      t: 'memory',
      layer: 'memory',
      note: 'Two overlapping entries about the machine are merged into one shorter line. This is the agent editing its own notes to make room, not the system evicting anything.',
    },
    { t: 'tool', name: 'memory', args: 'action="add" target="memory"' },
    { t: 'result', name: 'memory', output: '💾 Memory updated', ms: 700 },
    {
      t: 'say',
      text: 'Noted — the API is on fly.io now and the Heroku app is gone. I consolidated two older entries to fit it.',
    },

    { t: 'marker', id: 'catch', label: 'And the catch' },
    {
      t: 'memory',
      layer: 'session',
      note: 'The file on disk has changed. The block at the top of this replay has not.',
    },
    {
      t: 'note',
      text: 'Memory is read once, at session start, and injected as a frozen snapshot. The agent has just written something it cannot see. Ask it in this same conversation what it knows about your hosting and it will describe Heroku — correctly, because that is genuinely what is in its context. Start a new session and it knows.',
    },
  ],
}
