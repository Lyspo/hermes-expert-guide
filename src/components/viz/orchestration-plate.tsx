import { VizBox, VizEdge, VizNote, VizStage } from './stage'

/** The statuses a task moves through, in order. Drawn to scale with their names. */
const STATES = ['triage', 'todo', 'ready', 'running', 'blocked', 'done', 'archived']

const CHAR = 5.6
const PAD = 6
const GAP = 4

/** Where the Kanban column begins. The two models are read side by side. */
const RIGHT = 350

/**
 * VIZ-4 — two ways to hand off work, and the one event that separates them.
 *
 * A comparison table can state that `delegate_task` is not resumable and Kanban is.
 * It cannot *demonstrate* it, because the difference is not a property of either
 * model — it is what happens to each of them when the same thing occurs. So the
 * restart is drawn once, as a single rule across both columns, and the plate's whole
 * argument is what each side does where the rule crosses it.
 *
 * On the left every crossing is refused: three severed links and three children that
 * the process can now only mark `unknown`. On the right one crossing completes,
 * because the thing below the line was a process and the thing above it was a row.
 *
 * Signal is used for the restart and for nothing else — the rule, the four cuts it
 * makes, and the one reclaim it permits. Every pink mark on this plate is the same
 * event.
 */
export function OrchestrationPlate() {
  // Chips sized from their labels rather than to a grid: a state machine drawn on a
  // grid implies the states are interchangeable, and they are not. Laid out by prefix
  // sum rather than by accumulating into a variable, which the compiler rejects.
  const widths = STATES.map((label) => label.length * CHAR + PAD * 2)
  const chips = STATES.map((label, index) => ({
    label,
    width: widths[index]!,
    x: RIGHT + widths.slice(0, index).reduce((total, width) => total + width + GAP, 0),
  }))

  return (
    <VizStage
      title="Two ways to hand off work, and one restart"
      description="Hermes has two unrelated ways to give work to another agent, and the question that separates them is what happens when something ends. On the left, delegate_task is a function call: a parent forks up to three anonymous children that begin with no knowledge of the conversation. When the process restarts, the links to those children are severed — a restarted Hermes can only mark running children unknown, and only results that had already been returned survive. On the right, Kanban is a durable queue and a state machine — triage, todo, ready, running, blocked, done, archived — where every task is a row in a SQLite database and every worker is a separate operating-system process. The same restart kills the worker and severs its claim, but the row is untouched, so the dispatcher reclaims the task on its next tick and spawns a new worker. The claim only goes stale once the worker's process is genuinely dead; a live worker in the middle of a long call has its claim extended instead. One event, two consequences: on one side the work is lost, on the other it is picked up again."
      width={720}
      height={420}
    >
      <text x={0} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        DELEGATE_TASK — A FUNCTION CALL
      </text>
      <text x={350} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        KANBAN — A WORK QUEUE
      </text>

      {/* Left: the call stack, forked and about to be cut. */}
      <VizBox
        x={0}
        y={26}
        w={300}
        h={52}
        label="parent agent"
        sublabel="one delegate_task call"
        tone="near"
      />

      {[47, 150, 253].map((x) => (
        <VizEdge
          key={x}
          from={[x, 78]}
          to={[x, 230]}
          kind="absent"
          arrow
          breakAt={[x, 193]}
        />
      ))}

      {[0, 103, 206].map((x, index) => (
        <VizBox
          key={x}
          x={x}
          y={230}
          w={94}
          h={46}
          label={`child ${index + 1}`}
          sublabel="unknown"
          tone="ghost"
        />
      ))}

      <VizNote x={0} y={298} width={300}>
        Anonymous to begin with, and gone at the end. Only results that had already
        come back survive the restart.
      </VizNote>

      {/* Right: the same work, held as rows rather than as frames. */}
      {chips.map((chip) => (
        <g key={chip.label}>
          <rect
            x={chip.x}
            y={26}
            width={chip.width}
            height={22}
            fill={chip.label === 'running' ? 'var(--color-deep)' : 'transparent'}
            stroke={
              chip.label === 'running' ? 'var(--color-ice-dim)' : 'var(--color-ice-faint)'
            }
            strokeWidth={1}
          />
          <text
            x={chip.x + PAD}
            y={41}
            fill={chip.label === 'running' ? 'var(--color-ice)' : 'var(--color-ice-dim)'}
            fontSize={9}
          >
            {chip.label}
          </text>
        </g>
      ))}

      <text x={350} y={68} fill="var(--color-ice-faint)" fontSize={9}>
        one durable row per task, in ~/.hermes/kanban.db
      </text>

      <VizBox
        x={350}
        y={76}
        w={364}
        h={52}
        label="task 14 — running"
        sublabel="assigned to a named profile, with its own memory"
        tone="near"
      />

      <VizEdge from={[420, 128]} to={[420, 230]} kind="absent" arrow breakAt={[420, 193]} />

      <VizBox
        x={350}
        y={230}
        w={170}
        h={46}
        label="worker process"
        sublabel="its PID is gone"
        tone="ghost"
      />

      <VizBox
        x={544}
        y={230}
        w={170}
        h={46}
        label="the dispatcher"
        sublabel="back on its 60 s tick"
      />

      <VizEdge from={[629, 230]} to={[629, 130]} kind="change" arrow label="reclaim" />

      <VizNote x={350} y={298} width={364}>
        The row outlived the process. A claim goes stale only once the PID is genuinely
        dead — a live worker mid-call has its claim extended — and the run closes as
        reclaimed rather than vanishing.
      </VizNote>

      {/* One event. Drawn once, broken only to carry its own name. */}
      <line x1={0} y1={187} x2={263} y2={187} stroke="var(--color-signal)" strokeWidth={1} />
      <line x1={387} y1={187} x2={720} y2={187} stroke="var(--color-signal)" strokeWidth={1} />
      <text
        x={325}
        y={191}
        fill="var(--color-signal)"
        fontSize={9}
        textAnchor="middle"
      >
        THE GATEWAY RESTARTS
      </text>

      <line x1={0} y1={366} x2={720} y2={366} stroke="var(--color-ice-faint)" strokeWidth={1} />
      <VizNote x={0} y={386} width={712}>
        So the question that picks between them is not how many agents you need. It is
        whether the work has to survive something ending — a restart, a crash, a person
        going home.
      </VizNote>
    </VizStage>
  )
}
