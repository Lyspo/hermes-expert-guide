import { VizBox, VizEdge, VizMeter, VizNote, VizStage } from './stage'

/**
 * VIZ-2 — memory as three separate mechanisms, not three layers.
 *
 * The one plate in the guide where the design world and the factual claim are the
 * same gesture: the widely repeated "three-layer memory system" is drawn as the
 * superseded state, struck through, with the correct arrangement standing beside it.
 * The signal colour appears exactly twice — on the strike, and on the one arrow that
 * carries a correction — because that is what it means.
 *
 * The arrangement is the argument. Two bounded files sit on the same row because
 * they are the same kind of thing; the index sits apart because it is searched
 * rather than injected; the external provider stands *beside* rather than beneath,
 * because "layer" implies a stack and there is no stack.
 */
export function MemoryPlate() {
  return (
    <VizStage
      title="Memory: two files and an index"
      description="Hermes memory is not a three-layer stack. Two capped markdown files, MEMORY.md at 2,200 characters and USER.md at 1,375, are injected into the system prompt as a frozen snapshot when a session starts. Separately, a SQLite database with a full-text index holds every past session and is searched on demand rather than injected. An optional external provider can stand alongside these, but it replaces nothing and sits in no hierarchy."
      width={720}
      height={400}
    >
      {/* The superseded claim, drawn and struck. */}
      <g>
        <text x={0} y={12} fill="var(--color-ice-faint)" fontSize={10}>
          WHAT IS WIDELY REPEATED
        </text>
        <VizBox x={0} y={24} w={150} h={28} label="skill memory" tone="ghost" />
        <VizBox x={0} y={54} w={150} h={28} label="conversational" tone="ghost" />
        <VizBox x={0} y={84} w={150} h={28} label="user modelling" tone="ghost" />
        {/* The strike: one stroke through the whole stack. */}
        <line
          x1={-8}
          y1={110}
          x2={158}
          y2={22}
          stroke="var(--color-signal)"
          strokeWidth={2}
        />
        <VizNote x={0} y={130} width={150}>
          Three layers implies a stack, and a stack implies precedence. There is no
          stack.
        </VizNote>
      </g>

      <VizEdge from={[168, 68]} to={[212, 68]} kind="change" arrow />

      {/* What is actually there. */}
      <text x={228} y={12} fill="var(--color-ice-dim)" fontSize={10}>
        WHAT IS ACTUALLY THERE
      </text>

      {/* Injected at session start: two bounded pages, same row, same kind. */}
      <rect
        x={228}
        y={22}
        width={472}
        height={124}
        fill="none"
        stroke="var(--color-ice-faint)"
        strokeWidth={1}
        strokeDasharray="2 4"
      />
      <text x={238} y={38} fill="var(--color-ice-dim)" fontSize={10}>
        injected once, at session start — a frozen snapshot
      </text>

      <VizBox x={238} y={48} w={210} h={44} label="MEMORY.md" sublabel="what it learned" tone="near" />
      <VizMeter x={238} y={100} w={210} used={1474} total={2200} label="1,474 / 2,200 characters" />

      <VizBox x={470} y={48} w={210} h={44} label="USER.md" sublabel="who you are" tone="near" />
      <VizMeter x={470} y={100} w={210} used={620} total={1375} label="620 / 1,375 characters" />

      {/* Searched, not injected. Deliberately on its own row. */}
      <VizBox
        x={238}
        y={188}
        w={280}
        h={52}
        label="state.db — every past session"
        sublabel="SQLite, full-text index"
      />
      <VizEdge from={[378, 188]} to={[378, 146]} kind="ondemand" label="searched on demand" />
      <VizNote x={238} y={258} width={280}>
        Not in the prompt. The agent runs a query when it needs something, which is
        why recall works across weeks without costing tokens every turn.
      </VizNote>

      {/* Beside, never beneath. */}
      <VizBox
        x={548}
        y={188}
        w={152}
        h={52}
        label="external provider"
        sublabel="optional, one of ~8"
        tone="ghost"
      />
      <VizNote x={548} y={258} width={152}>
        Stands alongside. Replaces nothing, and sits in no hierarchy.
      </VizNote>

      {/* The consequence, stated on the plate rather than left to the caption. */}
      <line
        x1={0}
        y1={324}
        x2={720}
        y2={324}
        stroke="var(--color-ice-faint)"
        strokeWidth={1}
      />
      <VizNote x={0} y={344} width={330}>
        Because the two files are a snapshot, anything written to them during a
        session does not reach the model until the next one. That is the prompt-cache
        rule, not a bug.
      </VizNote>
      <VizNote x={370} y={344} width={330}>
        And because they are capped in characters rather than tokens, memory is
        roughly 1,300 tokens by design — small, inspectable, and at a known path.
      </VizNote>
    </VizStage>
  )
}
