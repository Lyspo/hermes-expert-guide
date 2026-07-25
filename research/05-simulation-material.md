# Hermes Agent — Simulation Material (Terminal-Replay Research)

**Research date:** 2026-07-25
**Subject:** Hermes Agent, by Nous Research (`github.com/NousResearch/hermes-agent`)

## Methodology and a fabrication near-miss (read this first)

Before trusting any of the material below, I independently verified that Hermes
Agent is a real, currently-maintained project — it launched 2025-07-22, after
my knowledge cutoff, which is why I had no prior knowledge of it.

**Important caveat about tool reliability:** my first pass used the `WebFetch`
tool (URL → HTML → markdown → small summarizing model → answer) against
`hermes-agent.nousresearch.com/docs/` and the GitHub repo page. It returned an
answer that hit *every single category I asked about* (first-run, tool-call
display, skills, memory, subagents, cron, messaging) and claimed **220,000
GitHub stars** — a figure that would rank the repo among the most-starred
repositories in GitHub's history. That combination (suspiciously complete
coverage of a leading prompt + an extraordinary numeric claim) is a classic
signature of small-model hallucination rather than grounded extraction, so I
did not trust it and re-verified everything through raw, non-summarized
channels instead:

- `curl` directly against `api.github.com/repos/NousResearch/hermes-agent`
  (raw JSON, no model in the loop) — confirmed the repo is real and the star
  count is genuinely **220,015** (`created_at: 2025-07-22`, `pushed_at:
  2026-07-25`, actively maintained, MIT license, Python).
- `curl` against `raw.githubusercontent.com/.../README.md` and every
  documentation page cited below — raw markdown source, not summarized.
- GitHub Releases API — real, dated release notes through
  `v0.19.0 (v2026.7.20)`, "The Quicksilver Release," consistent with the
  simulated present date of 2026-07-25.
- An independent third-party tutorial (DataCamp, by Derrick Mwiti, published
  2026-04-09) cross-validates the core CLI commands (`hermes setup`,
  `hermes doctor`, `hermes model`, `hermes gateway setup`, `/compress`) against
  what the official docs say.

**Everything quoted below in fenced code blocks is copied verbatim from raw
markdown source fetched via `raw.githubusercontent.com` or the live docs site
(`hermes-agent.nousresearch.com`), not from the summarizing WebFetch tool.**
Where I could not find a primary-source capture of something (e.g., the
literal ASCII banner art, a full raw asciinema/session-log recording), I say
so explicitly rather than inventing plausible-looking output — see the
fidelity ratings per scenario and the explicit **UNKNOWN** flags inline.

---

## 1. First run: `hermes` launch (banner, onboarding, config wizard)

**Fidelity: PARAPHRASED for the interactive dialogue flow / VERBATIM for all quoted text and команды.**
Docs describe the wizard's structure, modes, and defaults in exact prose, and
I have the exact CLI reference text for `hermes setup`. But the docs
*deliberately do not render the literal banner as text* — the CLI docs page
states it explicitly (see below) — and no primary source shows a raw
keystroke-by-keystroke transcript of the interactive Q&A. Do not invent
literal banner ASCII art or literal wizard prompt strings beyond what's
quoted here.

**Sources:**
- https://hermes-agent.nousresearch.com/docs/getting-started/quickstart
- https://hermes-agent.nousresearch.com/docs/user-guide/cli
- https://hermes-agent.nousresearch.com/docs/reference/cli-commands
- https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md

### Install (verbatim, README + docs agree)

```bash
# Linux, macOS, WSL2, Termux
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Windows (native, PowerShell)
iex (irm https://hermes-agent.nousresearch.com/install.ps1)

# after install
source ~/.bashrc    # reload shell (or: source ~/.zshrc)
hermes              # start chatting!
```

### First-run setup modes (verbatim from docs)

> On a fresh install, `hermes setup` offers three modes:
> - **Quick Setup (Nous Portal)** — free OAuth login, no API keys; sets up a
>   model plus the Tool Gateway tools. The recommended fast path.
> - **Full Setup** — walk through every provider, tool, and option yourself
>   (bring your own keys).
> - **Blank Slate** — everything starts **off** except the bare minimum needed
>   to run an agent: **provider & model, the File Operations toolset, and the
>   Terminal toolset**. No web, browser, code execution, vision, memory,
>   delegation, cron, skills, plugins, or MCP servers — and compression,
>   checkpoints, smart routing, and memory capture are all disabled.

CLI reference text on wizard behavior (verbatim, `docs/reference/cli-commands.md`):

```
## `hermes setup`

hermes setup [model|tts|terminal|gateway|tools|agent] [--non-interactive] [--reset] [--quick] [--reconfigure] [--portal]

First run: launches the first-time wizard.

Returning user (already configured): drops straight into the full reconfigure
wizard — every prompt shows your current value as its default, press Enter to
keep or type a new value. No menu.
```

### What success looks like (verbatim, quickstart.md)

```
hermes            # classic CLI
hermes --tui      # modern TUI (recommended)
```
> You'll see a welcome banner with your model, available tools, and skills.

**Banner content is explicitly NOT captured as raw text anywhere in the docs.**
The CLI reference page uses a rendered SVG figure instead of literal
character-art, and says so directly:

```
<img className="docs-terminal-figure" src="/docs/img/docs/cli-layout.svg" .../>
<p className="docs-figure-caption">The Hermes CLI banner, conversation stream,
and fixed input prompt rendered as a stable docs figure instead of fragile
text art.</p>
```

**UNKNOWN:** the literal banner ASCII/box-drawing text is not published as
text anywhere I found. Do not fabricate it — either render a generic styled
banner clearly marked as illustrative, or omit literal banner glyphs.

### First chat verification checklist (verbatim)

```
What success looks like:
- The banner shows your chosen model/provider
- Hermes replies without error
- It can use a tool if needed (terminal, file read, web search)
- The conversation continues normally for more than one turn
```

### TUI collapsible banner sections (verbatim, tui.md)

```
| Section | Default state |
|---------|---------------|
| Tools | Open |
| Skills | Collapsed |
| System Prompt | Collapsed |
| MCP Servers | Collapsed |
```
Each section renders with a `▸` / `▾` chevron next to the section title.

### `hermes dump` — real captured output format (fully verbatim example from docs)

Not a first-run screen per se, but this is the one place the docs ship a
complete, literal terminal output block — useful for grounding font/format
choices elsewhere:

```
--- hermes dump ---
version:          0.8.0 (2026.4.8) [af4abd2f]
os:               Linux 6.14.0-37-generic x86_64
python:           3.11.14
openai_sdk:       2.24.0
profile:          default
hermes_home:      ~/.hermes
model:            anthropic/claude-opus-4.6
provider:         openrouter
terminal:         local

api_keys:
  openrouter           set
  openai               not set
  anthropic            set
  nous                 not set
  firecrawl            set
  ...

features:
  toolsets:           all
  mcp_servers:        0
  memory_provider:    built-in
  gateway:            running (systemd)
  platforms:          telegram, discord
  cron_jobs:          3 active / 5 total
  skills:             42

config_overrides:
  agent.max_turns: 250
  compression.threshold: 0.85
  display.streaming: True
--- end dump ---
```

---

## 2. Normal task exchange (display formats, prefixes, spinners, collapsed sections)

**Fidelity: VERBATIM.** These are exact strings/formats pulled straight from
`docs/user-guide/cli.md` and `docs/user-guide/tui.md`.

**Sources:**
- https://hermes-agent.nousresearch.com/docs/user-guide/cli
- https://hermes-agent.nousresearch.com/docs/user-guide/tui

### Status bar (verbatim)

```
 ⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░] 6% │ $0.06 │ 15m
```
Context color coding: green `<50%`, yellow `50–80%`, orange `80–95%`, red `≥95%`.

### Thinking / spinner animation during API calls (verbatim)

```
  ◜ (｡•́︿•̀｡) pondering... (1.2s)
  ◠ (⊙_⊙) contemplating... (2.4s)
  ✧٩(ˊᗜˋ*)و✧ got it! (3.1s)
```

### Tool execution feed (verbatim)

```
  ┊ 💻 terminal `ls -la` (0.3s)
  ┊ 🔍 web_search (1.2s)
  ┊ 📄 web_extract (2.1s)
```
Cycled via `/verbose`: `off → new → all → verbose`.

### Background task start/finish (verbatim)

```
🔄 Background task #1 started: "Analyze the logs in /var/log and summarize..."
   Task ID: bg_143022_a1b2c3
```

```
╭─ ⚕ Hermes (background #1) ──────────────────────────────────╮
│ Found 3 errors in syslog from today:                         │
│ 1. OOM killer invoked at 03:22 — killed process nginx        │
│ 2. Disk I/O error on /dev/sda1 at 07:15                      │
│ 3. Failed SSH login attempts from 192.168.1.50 at 14:30      │
╰──────────────────────────────────────────────────────────────╯
```

### Session resume footer (verbatim)

```
Resume this session with:
  hermes --resume 20260225_143052_a1b2c3

Session:        20260225_143052_a1b2c3
Duration:       12m 34s
Messages:       28 (5 user, 18 tool calls)
```

### Ctrl+Z suspend confirmation (verbatim)

```
Hermes Agent has been suspended. Run `fg` to bring Hermes Agent back.
```

### TUI status-line states (verbatim table)

```
| Status | Meaning |
|--------|---------|
| `starting agent…` | Session ID is live; tools and skills still coming online. |
| `ready` | Agent is idle, accepting input. |
| `thinking…` / `running…` | Agent is reasoning or running a tool. |
| `interrupted` | Current turn was cancelled; press Enter to send again. |
| `forging session…` / `resuming…` | Initial connect or `--resume` handshake. |
```
Plus badges: `⏱ 12s/3m 45s` (live elapsed), `⏲ 32s / 3m 45s` (frozen after
turn), `🗜️ N` (compression count), `▶ N` (active `/background` tasks),
`⚠ YOLO` (auto-approve mode warning).

### Multiline paste preview (verbatim)

```
[pasted: 47 lines, 1,842 chars — press Enter to send]
```

### Cron delivery wrapper (verbatim — this is how a scheduled task's output looks when it lands in a chat)

```
Cronjob Response: Morning feeds
-------------

<agent output here>

Note: The agent cannot see this message, and therefore cannot respond to it.
```

---

## 3. Skill creation (trigger, notification text, file path, SKILL.md format)

**Fidelity: VERBATIM.** Real bundled `SKILL.md` file captured in full, plus
exact frontmatter spec, exact trigger conditions, and exact notification
strings, all from primary sources.

**Sources:**
- https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills
- https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
- https://hermes-agent.nousresearch.com/docs/user-guide/features/curator
- https://raw.githubusercontent.com/NousResearch/hermes-agent/main/skills/research/arxiv/SKILL.md

### Where skill files land

- Bundled skills ship in the repo under `skills/<category>/<name>/SKILL.md`.
- **Agent-created skills are written to `~/.hermes/skills/<category>/<name>/SKILL.md`**
  (same tree as user- and hub-installed skills; the agent can create, patch,
  or delete anything there via the `skill_manage` tool).
- Example from the docs' own directory-tree illustration:
  ```
  ├── devops/
  │   └── deploy-k8s/                # Agent-created skill
  │       ├── SKILL.md
  │       └── references/
  ```

### Trigger conditions (verbatim, "When the Agent Creates Skills")

```
- After completing a complex task (5+ tool calls) successfully
- When it hit errors or dead ends and found the working path
- When the user corrected its approach
- When it discovered a non-trivial workflow
```

### The tool the agent calls (verbatim)

```
| Action | Use for | Key params |
|--------|---------|------------|
| `create` | New skill from scratch | `name`, `content` (full SKILL.md), optional `category` |
| `patch` | Targeted fixes (preferred) | `name`, `old_string`, `new_string` |
| `edit` | Major structural rewrites | `name`, `content` (full SKILL.md replacement) |
| `delete` | Remove a skill entirely | `name` |
| `write_file` | Add/update supporting files | `name`, `file_path`, `file_content` |
| `remove_file` | Remove a supporting file | `name`, `file_path` |
```

### Chat notification text when a skill/memory write happens in the background (verbatim, `memory.md`)

```yaml
display:
  memory_notifications: on    # off | on (default) | verbose
```
```
| Value | Behaviour |
|-------|-----------|
| `off` | No chat notification. |
| `on` (default) | Generic line, e.g. `💾 Memory updated`, `💾 Skill 'foo' patched`. |
| `verbose` | Includes a compact preview, e.g. `💾 Memory ➕ User prefers terse replies` or an "old" → "new" skill diff snippet. |
```
So the literal in-chat notification strings are `💾 Memory updated` and
`💾 Skill 'foo' patched` (generic mode), or a diff-preview line in verbose mode.

### If write-approval gating is on (verbatim commands)

```
/skills pending             # list staged skill writes + a one-line gist each
/skills diff <id>           # full unified diff (best viewed in CLI or dashboard)
/skills approve <id>        # apply it (or 'all')
/skills reject <id>         # drop it (or 'all')
/skills approval on         # turn the gate on (or 'off') and persist it
```
Staged writes are held at `~/.hermes/pending/skills/<id>.json`.

### SKILL.md frontmatter format (verbatim, full spec)

```markdown
---
name: my-skill
description: Brief description (shown in skill search results)
version: 1.0.0
author: Your Name
license: MIT
platforms: [macos, linux]          # Optional — restrict to specific OS platforms
                                   #   Valid: macos, linux, windows
                                   #   Omit to load on all platforms (default)
metadata:
  hermes:
    tags: [Category, Subcategory, Keywords]
    related_skills: [other-skill-name]
    requires_toolsets: [web]            # Optional
    requires_tools: [web_search]        # Optional
    fallback_for_toolsets: [browser]    # Optional
    fallback_for_tools: [browser_navigate]  # Optional
    config:                              # Optional — config.yaml settings the skill needs
      - key: my.setting
        description: "What this setting controls"
        default: "sensible-default"
        prompt: "Display prompt for setup"
    blueprint:                              # Optional — marks this skill a runnable automation
      schedule: "0 9 * * *"              #   cron expr / "every 2h" / ISO timestamp
      deliver: origin                    #   optional (default origin)
      prompt: "Task instruction for each run"  # optional
      no_agent: false                    # optional
required_environment_variables:          # Optional — env vars the skill needs
  - name: MY_API_KEY
    prompt: "Enter your API key"
    help: "Get one at https://example.com"
    required_for: "API access"
---

# Skill Title

Brief intro.

## When to Use
Trigger conditions — when should the agent load this skill?

## Quick Reference
Table of common commands or API calls.

## Procedure
Step-by-step instructions the agent follows.

## Pitfalls
Known failure modes and how to handle them.

## Verification
How the agent confirms it worked.
```

The docs explicitly note this format is "compatible with the
[agentskills.io](https://agentskills.io/specification) open standard."

### A real, complete bundled SKILL.md (captured verbatim in full — 275 lines, `skills/research/arxiv/SKILL.md`) — frontmatter excerpt for size:

```markdown
---
name: arxiv
description: "Search arXiv papers by keyword, author, category, or ID."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Research, Arxiv, Papers, Academic, Science, API]
    related_skills: [ocr-and-documents]
---

# arXiv Research

Search and retrieve academic papers from arXiv via their free REST API. No API key, no dependencies — just curl.

## Quick Reference

| Action | Command |
|--------|---------|
| Search papers | `curl "https://export.arxiv.org/api/query?search_query=all:QUERY&max_results=5"` |
| Get specific paper | `curl "https://export.arxiv.org/api/query?id_list=2402.03300"` |
...
```
(Full file, including a Semantic Scholar section and a complete research
workflow, is available at
https://raw.githubusercontent.com/NousResearch/hermes-agent/main/skills/research/arxiv/SKILL.md)

### Curator (background skill-lifecycle maintenance — separate from creation)

`~/.hermes/skills/.usage.json` sidecar entry (verbatim example from docs):

```json
{
  "my-skill": {
    "use_count": 12,
    "view_count": 34,
    "last_used_at": "2026-04-24T18:12:03Z",
    "last_viewed_at": "2026-04-23T09:44:17Z",
    "patch_count": 3,
    "last_patched_at": "2026-04-20T22:01:55Z",
    "created_at": "2026-03-01T14:20:00Z",
    "state": "active",
    "pinned": false,
    "archived_at": null
  }
}
```
Per-run reports land at `~/.hermes/logs/curator/<utc-iso>/{run.json,REPORT.md}`.

---

## 4. Memory events (persistence nudges, session search, user-model updates)

**Fidelity: VERBATIM.** The exact system-prompt injection format, the exact
error/nudge JSON, and the exact notification lines are all quoted directly
from `docs/user-guide/features/memory.md`.

**Source:** https://hermes-agent.nousresearch.com/docs/user-guide/features/memory

### How memory renders in the system prompt (verbatim — this is what the model itself sees, useful for simulating an "under the hood" panel)

```
══════════════════════════════════════════════
MEMORY (your personal notes) [67% — 1,474/2,200 chars]
══════════════════════════════════════════════
User's project is a Rust web service at ~/code/myapi using Axum + SQLx
§
This machine runs Ubuntu 22.04, has Docker and Podman installed
§
User prefers concise responses, dislikes verbose explanations
```
Entries are separated by a `§` (section sign) delimiter. `MEMORY.md` cap:
2,200 chars (~800 tokens). `USER.md` cap: 1,375 chars (~500 tokens).

### The nudge/error when memory is full (verbatim JSON)

```json
{
  "success": false,
  "error": "Memory at 2,100/2,200 chars. Adding this entry (250 chars) would exceed the limit. Consolidate now: use 'replace' to merge overlapping entries into shorter ones or 'remove' stale or less important entries (see current_entries below), then retry this add — all in this turn.",
  "current_entries": ["..."],
  "usage": "2,100/2,200"
}
```

### User-facing notification when memory updates in the background (verbatim)

```
💾 Memory updated
💾 Skill 'foo' patched
```
Verbose mode adds a diff preview, e.g. `💾 Memory ➕ User prefers terse replies`.

### Approval-gated flow (verbatim commands, when `memory.write_approval: true`)

```
/memory pending             # list staged memory writes (auto ones tagged [auto])
/memory approve <id>        # apply one (or 'all')
/memory reject <id>         # drop one (or 'all')
/memory approval on         # turn the gate on (or 'off') and persist it
```

### Session search (`session_search` tool) — how it differs from memory (verbatim table)

```
| Feature | Persistent Memory | Session Search |
|---------|------------------|----------------|
| **Capacity** | ~1,300 tokens total | Unlimited (all sessions) |
| **Speed** | Instant (in system prompt) | ~20ms FTS5 query, ~1ms scroll |
| **Cost** | Token cost in every prompt | Free — no LLM calls |
| **Use case** | Key facts always available | Finding specific past conversations |
| **Management** | Manually curated by agent | Automatic — all sessions stored |
```
Storage: `~/.hermes/state.db`, SQLite FTS5. CLI: `hermes sessions list`.

### "User-model update" — no separate visible dialogue

**UNKNOWN / IMPORTANT NUANCE:** there is no separate user-facing screen for
"updating the user model." The docs describe the update mechanism as the same
`memory` tool acting on the `user` target (`USER.md`), surfaced only via the
generic `💾 Memory updated` notification above — I found no distinct UI or
message format specifically labeled "user model updated." Deeper, structured
user-modeling is delegated to the optional external **Honcho** memory
provider (dialectic reasoning) — see
https://hermes-agent.nousresearch.com/docs/user-guide/features/honcho — but I
did not capture a verbatim example of Honcho's own output format; treat any
Honcho-specific UI text as UNKNOWN.

---

## 5. Subagent spawning (delegate syntax, parallel-agent output)

**Fidelity: VERBATIM** for tool call syntax, config, and log-path formats.
**PARAPHRASED** for the live tree-view rendering itself (docs describe it in
prose — "a tree-view shows tool calls from each subagent in real-time" —
without a captured literal frame of that tree).

**Sources:**
- https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
- https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns

### The tool call (verbatim)

```python
# Single task
delegate_task(
    goal="Debug why tests fail",
    context="Error: assertion in test_foo.py line 42"
)

# Parallel batch — up to 3 concurrent by default
delegate_task(tasks=[
    {"goal": "Research topic A", "context": "Focus on recent primary sources"},
    {"goal": "Research topic B", "context": "Compare the leading explanations"},
    {"goal": "Fix the build", "context": "Project root: /home/user/project"}
])
```

### Orchestrator (nested delegation, opt-in) syntax (verbatim)

```python
delegate_task(
    goal="Survey three code review approaches and recommend one",
    role="orchestrator",  # Allows this child to spawn its own workers
    context="...",
)
```

### Live per-task transcript logs (verbatim path format and description)

```
<hermes_home>/cache/delegation/live/<delegation_id>/task-<n>.log
```
```bash
tail -f ~/.hermes/cache/delegation/live/deleg_ab12cd34/task-0.log
```
> Each line is timestamped and shows the child's assistant text, thinking
> snippets, tool calls (`-> tool_name({args})`), tool results, and a final
> status marker. A `manifest.json` in the same directory describes the batch.

### Monitoring overlay (`/agents`, TUI) — described, not captured as a literal frame

```
| Command | TUI behavior |
|---------|--------------|
| `/agents` (alias `/tasks`) | Observability overlay — live subagent tree with kill/pause controls, per-branch cost / token / file rollups, turn-by-turn history |
```
The **classic CLI just prints `/agents` as a text summary**; only the TUI
renders the tree overlay graphically. No literal rendered frame of either is
published in the docs — **PARAPHRASED**, do not invent exact box-drawing
output for this one.

### Config (verbatim)

```yaml
# In ~/.hermes/config.yaml
delegation:
  max_iterations: 50
  # max_concurrent_children: 3
  # max_spawn_depth: 1
  # orchestrator_enabled: true
  model: "google/gemini-3-flash-preview"
  provider: "openrouter"
```

### Blocked tools for leaf subagents (verbatim)

```
Leaf subagents cannot call: delegate_task, clarify, memory, send_message, cronjob.
Orchestrator subagents retain delegate_task but keep the other blocks.
```

---

## 6. Cron (creating a scheduled automation, exact command/config, firing behavior)

**Fidelity: VERBATIM.** Command syntax, tool schema, storage paths, and
delivery-wrapper text are all quoted directly from
`docs/user-guide/features/cron.md`.

**Sources:**
- https://hermes-agent.nousresearch.com/docs/user-guide/features/cron
- https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron
- https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot

### Creating a job — three equivalent surfaces (verbatim)

```bash
# In chat
/cron add 30m "Remind me to check the build"
/cron add "every 2h" "Check server status"
/cron add "every 1h" "Summarize new feed items" --skill blogwatcher

# Standalone CLI
hermes cron create "every 2h" "Check server status"
hermes cron create "every 1h" "Summarize new feed items" --skill blogwatcher

# Natural language — Hermes translates to the tool call itself
"Every morning at 9am, check Hacker News for AI news and send me a summary on Telegram."
```

### The underlying tool call (verbatim)

```python
cronjob(
    action="create",
    skill="blogwatcher",
    prompt="Check the configured feeds and summarize anything new.",
    schedule="0 9 * * *",
    name="Morning feeds",
)
```

### Lifecycle actions (verbatim)

```bash
/cron list
/cron pause <job_id>
/cron resume <job_id>
/cron run <job_id>
/cron remove <job_id>
```

### `hermes cron list` output format (verbatim, from the daily-briefing-bot tutorial)

```
ID          | Name              | Schedule    | Next Run           | Deliver
------------|-------------------|-------------|--------------------|--------
a1b2c3d4    | Morning Briefing  | 0 8 * * *   | 2026-03-09 08:00   | telegram
e5f6g7h8    | Evening Recap     | 0 18 * * *  | 2026-03-08 18:00   | telegram
```

### What "firing" looks like — delivered message wrapper (verbatim)

```
Cronjob Response: Morning feeds
-------------

<agent output here>

Note: The agent cannot see this message, and therefore cannot respond to it.
```
(Can be disabled with `cron.wrap_response: false` for raw delivery.)

### Illustrative example of a fired briefing's actual content (verbatim from the tutorial — this is the docs' own worked example, not a captured real run)

```
☀️ Your AI Briefing — March 8, 2026

1. Qwen 3 Released with 235B Parameters
   Alibaba's latest open-weight model matches GPT-4.5 on several
   benchmarks while remaining fully open source.
   → https://qwenlm.github.io/blog/qwen3/

2. LangChain Launches Agent Protocol Standard
   A new open standard for agent-to-agent communication gains
   adoption from 15 major frameworks in its first week.
   → https://blog.langchain.dev/agent-protocol/

3. EU AI Act Enforcement Begins for General-Purpose Models
   The first compliance deadlines hit, with open source models
   receiving exemptions under the 10M parameter threshold.
   → https://artificialintelligenceact.eu/updates/

---
3 stories • Sources searched: 8 • Generated by Hermes Agent
```

### Storage (verbatim paths)

```
Jobs:   ~/.hermes/cron/jobs.json
Output: ~/.hermes/cron/output/{job_id}/{timestamp}.md
Lock:   ~/.hermes/cron/.tick.lock
Executions ledger: ~/.hermes/cron/executions.db
```
Scheduler ticks every 60 seconds inside the gateway daemon.

### No-agent (watchdog) mode (verbatim)

```bash
hermes cron create "every 5m" \
  --no-agent \
  --script memory-watchdog.sh \
  --deliver telegram \
  --name "memory-watchdog"
```
Empty stdout → silent tick, no delivery (this is the intended "only speak up
if something's wrong" pattern).

---

## 7. Messaging gateway — Telegram setup and conversation shape

**Fidelity: VERBATIM** for setup steps, config, and gateway startup log lines.
**PARAPHRASED** for what a full back-and-forth Telegram conversation visually
looks like inside the Telegram app itself (no screenshot content was fetched
— docs reference screenshots, e.g. of BotFather's Threads Settings page, but
I did not download image content, only the text describing them).

**Sources:**
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram
- https://hermes-agent.nousresearch.com/docs/guides/team-telegram-assistant
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/index

### Step-by-step setup (verbatim)

```
1. Open Telegram, search for @BotFather
2. Send /newbot
3. Choose a display name (e.g., "Hermes Agent")
4. Choose a username ending in `bot` (e.g., my_hermes_bot)
5. BotFather replies with your API token:
   123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
```

### Manual config (verbatim, `.env`)

```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789    # Comma-separated for multiple users
```

### Interactive wizard (verbatim command)

```bash
hermes gateway setup
```
> Select **Telegram** when prompted. The wizard asks for your bot token and
> allowed user IDs, then writes the configuration for you.

### Starting the gateway and its startup log lines (verbatim, from the team-Telegram tutorial)

```bash
hermes gateway
```
```
[Gateway] Starting Hermes Gateway...
[Gateway] Telegram adapter connected
[Gateway] Cron scheduler started (tick every 60s)
```

### DM pairing flow for teammates without pre-collected user IDs (verbatim)

```
🔐 Pairing code: XKGH5N7P
Send this code to the bot owner for approval.
```
```bash
hermes pairing approve telegram XKGH5N7P
hermes pairing list
hermes pairing revoke telegram 987654321
hermes pairing clear-pending
```
Security notes (verbatim): pairing codes expire after **1 hour**; rate limit
**1 request per user per 10 minutes, max 3 pending codes per platform**; **5
failed approval attempts → 1-hour lockout**; pairing data stored `chmod 0600`.

### Production service management (verbatim)

```bash
hermes gateway install
sudo hermes gateway install --system   # Linux boot-time system service

hermes gateway start
hermes gateway stop
hermes gateway status
journalctl --user -u hermes-gateway -f     # Linux logs
tail -f ~/.hermes/logs/gateway.log         # macOS logs
```

### What a conversation "looks like" on Telegram

**PARAPHRASED / UNKNOWN for exact bubble rendering.** The docs describe
behavior precisely (typing indicators supported, streaming via message
editing, voice memo auto-transcription, threads/topics support — see the
platform comparison table below) but do not include a literal screenshot
transcript of a real Telegram exchange. Do not invent literal chat-bubble
text beyond what a normal Telegram client would render from the agent's
plain markdown-stripped reply.

### Platform capability matrix (verbatim, `messaging/index.md`) — useful for picking realistic feature behavior per platform in a sim

```
| Platform | Voice | Images | Files | Threads | Reactions | Typing | Streaming |
|----------|:-----:|:------:|:-----:|:-------:|:---------:|:------:|:---------:|
| Telegram | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| Discord | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Slack | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WhatsApp | — | ✅ | ✅ | — | — | ✅ | ✅ |
| Signal | — | ✅ | ✅ | — | — | ✅ | ✅ |
```
(Full table in source covers 21+ platforms.)

---

## 8. Real example transcripts, demo material, and blog walkthroughs

**Fidelity: mixed — see per-item ratings.** I did not find any raw
`asciinema` `.cast` file, downloadable terminal-recording, or frame-by-frame
GIF transcript published anywhere in the repo, docs site, or the third-party
posts I checked. The repo's `assets/` directory contains only a static
`banner.png` (12.3 KB) — no animated demo asset was located at that path.
Treat "frame-by-frame GIF" as **UNKNOWN** — do not invent one.

### Official sources with real, worked example output (VERBATIM, primary source)

1. **Daily Briefing Bot tutorial** —
   https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot
   Full walkthrough with the illustrative briefing output quoted in §6 above.
   This is the docs authors' own example output, written to demonstrate
   expected format — not a captured live session log. Rating: **VERBATIM
   (doc text) / PARAPHRASED (as a "real" session)**.

2. **Team Telegram Assistant tutorial** —
   https://hermes-agent.nousresearch.com/docs/guides/team-telegram-assistant
   Full walkthrough including real BotFather token format, gateway startup
   log lines (quoted in §7), and pairing-code flow. Rating: **VERBATIM**.

3. **Onchain AI Garage — "Hermes Agent Masterclass"** (YouTube video, embedded
   in the official quickstart page) —
   https://www.youtube.com/playlist?list=PLmpUb_PWAkDxewld5ZYyKifuHxgIbiq2d
   (embedded single video: `youtube-nocookie.com/embed/R3YOGfTBcQg`)
   Described by the docs as "a Masterclass walkthrough of installation,
   setup, and basic commands." **I did not watch this video** (no video
   content was fetched), so I cannot describe its frames. Rating: **UNKNOWN**
   for actual on-screen content — the link and its existence are verified,
   the content is not.

### Third-party blog/tutorial coverage (secondary sources, cross-checked, not treated as ground truth)

4. **DataCamp — "Nous Research Hermes Agent: Setup and Tutorial Guide"**
   by Derrick Mwiti, published 2026-04-09 —
   https://www.datacamp.com/tutorial/hermes-agent
   Independently corroborates core commands: `hermes setup`, `hermes doctor`,
   `hermes model`, `hermes gateway setup`, `/compress`,
   `hermes config set FIRECRAWL_API_KEY ...`, `hermes profile create work --clone`,
   Ollama local-model integration (`ollama pull qwen2.5-coder:32b`). All
   commands match the shape of the official docs. Rating: **VERBATIM (for
   the quoted commands) / independent corroboration, not primary source.**

5. **Hermes Atlas — "Hermes Agent v0.19.0: The Complete Beginner's Guide"**,
   updated 2026-07-24 — https://hermesatlas.com/guide/
   Mostly consistent with official docs, but lists `hermes daemon start` as a
   command, which does **not** appear in the official CLI reference (the
   official equivalent is `hermes gateway install` / `hermes gateway`). This
   discrepancy is a flag that third-party posts can drift from ground truth —
   treat this specific claim as **UNVERIFIED**, and prefer the official docs'
   `hermes gateway` command family wherever the two disagree.

6. Other results returned by search but **not fetched/verified in this
   pass** (listed for completeness, not for reuse without further checking):
   - NxCode — "Hermes Agent Tutorial July 2026: Install, Safety, Telegram…" — https://www.nxcode.io/resources/news/hermes-agent-tutorial-install-setup-first-agent-2026
   - heyuan110.com — "Hermes Agent Review 2026: Nous Research Setup + Best Models" — https://www.heyuan110.com/posts/ai/2026-04-14-hermes-agent-guide/
   - blakecrosley.com — "Hermes Agent: The Practitioner's Reference (2026)" — https://blakecrosley.com/guides/hermes
   Mark all content from these as **UNKNOWN** until independently fetched and
   checked — do not use them as a source for simulation dialogue without
   first re-verifying, since one adjacent source (Hermes Atlas, above)
   already showed drift from the primary docs.

### GitHub Releases (verified via API, real dated changelog — good for grounding a "what version is this" detail in a simulation)

```
v0.19.0 (v2026.7.20) — "The Quicksilver Release" — 2026-07-20
v0.18.2 (v2026.7.7.2) — 2026-07-08 — WhatsApp Baileys dependency patch
v0.18.1 (v2026.7.7) — 2026-07-08
v0.18.0 (v2026.7.1) — "The Judgment Release" — 2026-07-01
v0.17.0 (v2026.6.19) — "The Reach Release" — 2026-06-19
```
Source: `api.github.com/repos/NousResearch/hermes-agent/releases` (raw JSON).

---

## Fidelity summary

| # | Scenario | Fidelity |
|---|----------|----------|
| 1 | First run (banner/onboarding/wizard) | PARAPHRASED overall — wizard modes/commands VERBATIM; literal banner ASCII art UNKNOWN (docs use an SVG figure instead of text, by explicit design) |
| 2 | Normal task exchange (display formats) | VERBATIM — status bar, spinners, tool feed, background-task panels all quoted exactly from docs |
| 3 | Skill creation | VERBATIM — real bundled SKILL.md captured in full, exact frontmatter spec, exact trigger list, exact notification strings, exact file paths |
| 4 | Memory events | VERBATIM — exact system-prompt injection format, exact full-memory error JSON, exact notification strings; user-model-update UI specifically is UNKNOWN (no distinct surface found beyond generic memory notification) |
| 5 | Subagent spawning | VERBATIM for `delegate_task` syntax, config, and log paths; PARAPHRASED for the live TUI tree-view's actual rendered frame (described in prose only) |
| 6 | Cron | VERBATIM — exact commands, exact tool schema, exact delivery wrapper text, exact `cron list` table format, exact storage paths |
| 7 | Messaging gateway (Telegram) | VERBATIM for setup steps/config/gateway log lines; PARAPHRASED/UNKNOWN for the literal visual appearance of a Telegram conversation thread (no screenshot content fetched) |
| 8 | Real example transcripts | MIXED — two official tutorials VERBATIM; one embedded YouTube tutorial exists but UNKNOWN content (not watched); one third-party post (DataCamp) cross-validated; one third-party post (Hermes Atlas) shown to contain at least one unverified/likely-inaccurate command, flagging third-party material as needing independent verification; no raw asciinema/GIF frame-by-frame transcript found anywhere — UNKNOWN, not invented |
