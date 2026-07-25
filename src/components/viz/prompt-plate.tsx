import { VizBox, VizMeter, VizNote, VizStage } from './stage'

/**
 * VIZ-1 — the system prompt, exploded.
 *
 * Five facts that are one picture and five paragraphs: prompt-cache economics, the
 * fixed-overhead complaint, why progressive disclosure exists, why memory is a frozen
 * snapshot, and why nothing may mutate mid-conversation. They are all the same fact
 * seen from different sides, and the side they share is a horizontal line.
 *
 * So the plate is a stack in receive order with that line drawn through it. Above it,
 * everything is read cheaply and may not change. Below it, one block is rewritten on
 * every turn. Signal marks the line and nothing else, because the line is the only
 * thing on this plate that *is* a change.
 *
 * The memory band carries a real meter rather than a number, and the meter's label is
 * the verbatim header Hermes injects — a budget drawn as a budget.
 */
export function PromptPlate() {
  return (
    <VizStage
      title="The system prompt, exploded"
      description="Before your first word the model has already read five things, in a fixed order. SOUL.md supplies identity and is loaded only from the Hermes home directory. One project context file is included — the first match of .hermes.md, AGENTS.md, CLAUDE.md or .cursorrules, capped at 20,000 characters and truncated beyond it. Memory follows as a frozen snapshot of two capped files, roughly 1,300 tokens in total, injected with a header stating how full it is. Then the skill index, which is name and description only and costs about 3,000 tokens however many skills are installed. Then every tool schema, around seventy tools across twenty-eight toolsets, sent on every call whether used or not. A cache breakpoint sits under all of that: everything above it is a cached prefix that is read rather than rewritten, and a cached prefix is roughly ten times cheaper to read than to write. Only the conversation below the line is rewritten each turn. That ratio is the reason nothing above the line is allowed to change mid-session."
      width={720}
      height={500}
    >
      <text x={0} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        WHAT THE MODEL HAS READ BEFORE YOUR FIRST WORD
      </text>

      <VizBox
        x={0}
        y={24}
        w={470}
        h={46}
        label="SOUL.md"
        sublabel="identity · loaded only from HERMES_HOME"
        tone="near"
      />
      <text x={486} y={44} fill="var(--color-ice-dim)" fontSize={10}>
        you write this one
      </text>

      <VizBox
        x={0}
        y={80}
        w={470}
        h={46}
        label="# Project Context"
        sublabel="one file — first match of four wins"
        tone="near"
      />
      <text x={486} y={100} fill="var(--color-ice-dim)" fontSize={10}>
        ≤ 20,000 chars, then cut
      </text>

      <VizBox
        x={0}
        y={136}
        w={470}
        h={74}
        label="memory"
        sublabel="MEMORY.md and USER.md, a frozen snapshot"
        tone="near"
      />
      <VizMeter x={10} y={182} w={450} used={1474} total={2200} label="[67% — 1,474/2,200 chars]" />
      <text x={486} y={156} fill="var(--color-ice-dim)" fontSize={10}>
        ≈ 1,300 tokens, by design
      </text>

      <VizBox
        x={0}
        y={220}
        w={470}
        h={46}
        label="the skill index"
        sublabel="name and description only"
        tone="near"
      />
      <text x={486} y={240} fill="var(--color-ice-dim)" fontSize={10}>
        ≈ 3,000 tokens, however
      </text>
      <text x={486} y={256} fill="var(--color-ice-faint)" fontSize={9}>
        many you have installed
      </text>

      <VizBox
        x={0}
        y={276}
        w={470}
        h={46}
        label="every tool schema"
        sublabel="70+ tools, about 28 toolsets"
        tone="near"
      />
      <text x={486} y={296} fill="var(--color-ice-dim)" fontSize={10}>
        sent every call, used or not
      </text>

      {/* The line the whole plate is about. */}
      <text x={0} y={336} fill="var(--color-signal)" fontSize={9}>
        THE CACHE BREAKPOINT — EVERYTHING ABOVE IS READ, NOT REWRITTEN
      </text>
      <line x1={0} y1={344} x2={720} y2={344} stroke="var(--color-signal)" strokeWidth={1} />

      <VizBox
        x={0}
        y={360}
        w={470}
        h={52}
        label="the conversation"
        sublabel="your messages, and everything since"
      />
      <text x={486} y={380} fill="var(--color-ice-dim)" fontSize={10}>
        rewritten every turn
      </text>

      <line x1={0} y1={440} x2={720} y2={440} stroke="var(--color-ice-faint)" strokeWidth={1} />

      <VizNote x={0} y={460} width={350}>
        A cached prefix is roughly ten times cheaper to read than to write. That ratio is
        why nothing above the line may change mid-session.
      </VizNote>
      <VizNote x={370} y={460} width={340}>
        The project’s own tracker measures the fixed overhead at 73% of each call — about
        13.9k tokens. That is this diagram, totalled.
      </VizNote>
    </VizStage>
  )
}
