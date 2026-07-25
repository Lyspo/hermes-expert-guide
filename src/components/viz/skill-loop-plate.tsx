import { VizBarrier, VizBox, VizEdge, VizNote, VizStage } from './stage'

/**
 * VIZ-3 — the improvement loop, one turn at a time.
 *
 * The plate exists for two things prose cannot hold in one piece: an *ordering*
 * (your answer is finished before any of this starts) and a *negative* (nothing
 * comes back). The negative is the payload. It is the single most
 * governance-relevant fact about the loop and it is invisible in a sentence,
 * because a sentence cannot draw an arrow and then not draw it.
 *
 * So the arrangement is vertical and one-way: your turn along the top, the walls
 * beneath it, the fork below the walls, and the store below that. The only line
 * that travels upward is the one that is stopped.
 *
 * Signal appears exactly twice — on the write, because a written skill is a change,
 * and on the arrow that is refused. Nothing else earns it.
 */
export function SkillLoopPlate() {
  // Ten ticks, because ten is the default interval for both nudge counters.
  const ticks = Array.from({ length: 10 }, (_, index) => 14 + index * 34)

  return (
    <VizStage
      title="The improvement loop, one turn at a time"
      description="A counter inside the tool-calling loop advances by one on every API-call iteration — not once per message. When it reaches ten, and only after the user-visible answer has been delivered in full and the turn was not interrupted, Hermes spawns a background review: a daemon thread that replays a snapshot of the conversation on the parent's own model and asks whether any skill or memory should be saved or updated. That fork is walled in four ways. Two walls face your session: _persist_disabled is set and _session_db is None, so nothing it does is written into the running conversation. Two walls bound what it may touch at all: its toolset is whitelisted to the skill and memory tools, and any command that would raise an approval prompt is auto-denied on its behalf. Its writes leave through the one opening in that whitelist and land in the namespaced skills directory, owner-only. No arrow returns to the live session; the source names the failure that absence prevents as curator takeover. Separately, on a far slower clock, the curator works over the same store."
      width={720}
      height={580}
    >
      {/* Your turn, along the top. It is complete before anything below exists. */}
      <text x={0} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        YOUR TURN — AND IT FINISHES FIRST
      </text>

      <VizBox
        x={0}
        y={20}
        w={336}
        h={96}
        label="the tool-calling loop"
        sublabel="one message, many API-call iterations"
        tone="near"
      />
      {ticks.map((x, index) => (
        <line
          key={x}
          x1={x}
          y1={76}
          x2={x}
          y2={88}
          stroke={index === 9 ? 'var(--color-ice)' : 'var(--color-ice-faint)'}
          strokeWidth={1}
        />
      ))}
      <text x={14} y={106} fill="var(--color-ice-faint)" fontSize={9}>
        the counter · +1 per iteration, never per message
      </text>

      <VizBox
        x={384}
        y={20}
        w={336}
        h={96}
        label="your answer"
        sublabel="complete, and already on your screen"
        tone="near"
      />
      <text x={394} y={106} fill="var(--color-ice-faint)" fontSize={9}>
        none of what follows has happened yet
      </text>

      <VizEdge from={[336, 68]} to={[384, 68]} arrow />

      <VizNote x={384} y={142} width={216}>
        Only then, and only if the counter has reached ten and the turn ran to the
        end, does the fork spawn.
      </VizNote>

      {/* The spawn comes in from the side: it is the parent creating the fork, not
          something crossing the isolation walls. */}
      <VizEdge from={[620, 116]} to={[620, 318]} kind="ondemand" />
      <VizEdge from={[620, 318]} to={[326, 318]} kind="ondemand" arrow />

      {/* The two walls that face your session, and the line they stop. */}
      <VizNote x={0} y={150} width={180}>
        The arrow that does not exist: nothing the fork writes or says re-enters the
        running conversation.
      </VizNote>
      <VizEdge
        from={[200, 274]}
        to={[200, 130]}
        kind="absent"
        arrow
        breakAt={[200, 267]}
      />

      <VizBarrier x={0} y={240} w={320} />
      <VizBarrier x={0} y={258} w={320} />
      <text x={332} y={226} fill="var(--color-ice-faint)" fontSize={9}>
        WHAT KEEPS IT OUT OF YOUR SESSION
      </text>
      <text x={332} y={245} fill="var(--color-ice-dim)" fontSize={10}>
        _persist_disabled = True
      </text>
      <text x={332} y={263} fill="var(--color-ice-dim)" fontSize={10}>
        _session_db = None
      </text>

      <VizBox
        x={0}
        y={274}
        w={320}
        h={104}
        label="the background review fork"
        sublabel="a daemon thread replaying a snapshot"
        tone="near"
      />
      <text x={10} y={334} fill="var(--color-ice-dim)" fontSize={10}>
        “should any skill or memory be
      </text>
      <text x={10} y={348} fill="var(--color-ice-dim)" fontSize={10}>
        saved or updated?”
      </text>
      <text x={10} y={366} fill="var(--color-ice-faint)" fontSize={9}>
        on the parent’s own model, by default
      </text>

      {/* The whitelist is a wall with exactly one opening, so the write leaves
          through it rather than around it. */}
      <VizBarrier x={0} y={392} w={320} door={[140, 180]} />
      <VizBarrier x={0} y={410} w={320} door={[140, 180]} />
      <text x={332} y={378} fill="var(--color-ice-faint)" fontSize={9}>
        AND WHAT IT MAY TOUCH AT ALL
      </text>
      <text x={332} y={397} fill="var(--color-ice-dim)" fontSize={10}>
        tool whitelist: skills + memory
      </text>
      <text x={332} y={415} fill="var(--color-ice-dim)" fontSize={10}>
        approval prompts: auto-denied
      </text>

      <VizEdge from={[160, 378]} to={[160, 432]} kind="change" arrow />

      <VizBox
        x={0}
        y={436}
        w={320}
        h={58}
        label="~/.hermes/skills/<namespace>/<skill>/"
        sublabel="SKILL.md · mode 0600 · owner-only"
      />

      <VizBox
        x={400}
        y={436}
        w={320}
        h={58}
        label="the curator"
        sublabel="the same store, on a slower clock"
      />
      <VizEdge from={[400, 465]} to={[326, 465]} kind="ondemand" arrow />

      <line x1={0} y1={508} x2={720} y2={508} stroke="var(--color-ice-faint)" strokeWidth={1} />

      <VizNote x={0} y={528} width={330}>
        Without that isolation the fork’s own instructions would land in your session,
        and your next turn would read them back as orders. The source names the
        failure it prevents: curator takeover.
      </VizNote>
      <VizNote x={380} y={528} width={330}>
        The curator is a different pass on a different clock — every 168 hours, and
        only after two idle hours. It never deletes; the worst it does is archive.
      </VizNote>
    </VizStage>
  )
}
