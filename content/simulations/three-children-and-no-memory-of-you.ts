import type { SimScript } from '@/lib/sim/script'

/**
 * SIM-7 — three children, and none of them has met you.
 *
 * "Subagents know nothing" is the fact readers most reliably fail to internalise
 * from prose, because it sounds like a caveat rather than the design. Watching a
 * child receive two string fields and nothing else fixes it in one pass.
 *
 * The tool call, the live-log path, the `tail -f` invocation and the config block are
 * quoted. The child's log *contents* are not published anywhere, so the tailed lines
 * follow only the shape the documentation describes — timestamped, with tool calls
 * rendered `-> tool_name({args})` — and the replay marks them as reconstructed.
 *
 * The `/agents` overlay is deliberately absent. The docs describe a tree view in
 * prose and publish no frame of it; drawing box-art here would produce the most
 * screenshot-like and least sourced thing on the site.
 */
export const script: SimScript = {
  id: 'three-children-and-no-memory-of-you',
  title: 'Three children, and no memory of you',
  premise:
    'Three subagents start at once. Watch exactly how much of your conversation goes with them.',
  fidelity: 'reconstructed',
  source:
    'The batch tool call, the live-log path format, the tail -f invocation, the delegation config and the leaf blocklist are quoted from the delegation documentation, v0.19.0. Log line contents follow the documented shape but are not themselves published, and the /agents overlay is described rather than drawn because no frame of it exists.',
  hermesVersion: 'v0.19.0',
  events: [
    { t: 'marker', id: 'batch', label: 'One call, three children' },
    {
      t: 'result',
      name: 'delegate_task',
      output: `delegate_task(tasks=[
    {"goal": "Research topic A", "context": "Focus on recent primary sources"},
    {"goal": "Research topic B", "context": "Compare the leading explanations"},
    {"goal": "Fix the build", "context": "Project root: /home/user/project"}
])`,
      ms: 1100,
    },
    {
      t: 'note',
      text: 'Look at what a child is given: a goal and a context, both strings. That is the entire inheritance. Not the conversation, not a summary of it, not the last few turns — nothing but those two fields. Three run concurrently by default.',
    },
    { t: 'agent', kind: 'spawn', label: 'task-0', note: 'Research topic A' },
    { t: 'agent', kind: 'spawn', label: 'task-1', note: 'Research topic B' },
    { t: 'agent', kind: 'spawn', label: 'task-2', note: 'Fix the build' },
    {
      t: 'note',
      text: 'The handle comes back immediately — a top-level delegation runs in the background and posts results later. The parent is free to keep working, which is also how you end up with children outliving the exchange that produced them.',
    },

    { t: 'marker', id: 'watch', label: 'Watching one of them' },
    {
      t: 'user',
      text: 'tail -f ~/.hermes/cache/delegation/live/deleg_ab12cd34/task-0.log',
    },
    {
      t: 'result',
      name: 'terminal',
      output: `[12:04:18] thinking  scoping the search before spending calls
[12:04:19] -> web_search({"query": "topic A primary sources 2026"})
[12:04:23] <- 8 results
[12:04:31] -> read_file({"path": "/home/user/notes/topic-a.md"})
[12:04:31] <- error: no such file`,
      ms: 1600,
    },
    {
      t: 'note',
      text: 'Those lines follow the documented shape rather than a captured log — the format is published, the contents are not, and this replay will not pretend otherwise. The last line is the interesting one anyway: the child reached for a file it was never told about, because it was reasoning from a goal and had no idea what exists.',
    },
    {
      t: 'note',
      text: 'The /agents overlay would show all three as a live tree with cost and token rollups and kill controls. It is not drawn here: the documentation describes it in prose and publishes no frame of it, so there is nothing to reproduce.',
    },

    { t: 'marker', id: 'back', label: 'What comes back, and in what order' },
    { t: 'agent', kind: 'return', label: 'task-2', note: 'finished first' },
    { t: 'agent', kind: 'return', label: 'task-0', note: 'finished second' },
    {
      t: 'agent',
      kind: 'return',
      label: 'task-1',
      note: 'exhausted its 50-iteration budget and returned failed',
    },
    {
      t: 'note',
      text: 'They finished in the order 2, 0, 1 and are presented sorted by task index, so the arrival order is invisible to you. One failed — there is no wall-clock timeout by default, so a child ends on a real error or by exhausting max_iterations — and the other two results are unaffected.',
    },
    {
      t: 'say',
      text: 'Topic A and the build are done. Topic B hit its iteration budget without converging; the log is at task-1.log if you want to see where it went in circles.',
    },

    { t: 'marker', id: 'limits', label: 'What they could not have done' },
    {
      t: 'result',
      name: 'config',
      output: `delegation:
  max_iterations: 50
  max_concurrent_children: 3
  max_spawn_depth: 1
  orchestrator_enabled: true
  model: "provider/model-name"`,
      ms: 900,
    },
    {
      t: 'note',
      text: 'None of the three could have delegated further: depth is 1 by default, and nesting needs both role="orchestrator" on the child and a raised depth. None could write memory or clarify. And none was more capable than the parent — children inherit the parent\'s enabled toolsets, so the model cannot hand a child something it does not have itself.',
    },
    {
      t: 'note',
      text: 'One thing this replay cannot show you, because it survived: a process restart does not resume running children. They are marked unknown and nothing retries them. Results already returned are safe; work in flight is not.',
    },
  ],
}
