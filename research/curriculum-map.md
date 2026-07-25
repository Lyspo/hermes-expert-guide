# Curriculum map — The Hermes Guide

Hermes Agent **v0.19.0** ("The Quicksilver Release", tag `v2026.7.20`, 2026-07-20).
Map written 2026-07-25 against the seven research documents in this directory.

This is the design document for the curriculum: modules in reading order, lessons
within each, per-track relevance, prerequisites, and the sourced material every
lesson draws from. It is opinionated by design — one recommended map, not a menu.
Where an alternative ordering was considered and rejected, the rejection is
recorded on one line rather than left implicit.

The product's claim is that **sequence is the product**. Anyone can enumerate
Hermes's surface; the official docs already do, alphabetically and completely.
The value here is the order, the honest duration, and saying plainly what to
skip. That means this document has to do two things a feature list never does:
justify each module's position, and name what is deliberately left out.

---

## 1. Conventions

**Source shorthand.** Every lesson cites the research file and section it draws
from. A lesson with no source is not allowed; where I believe a lesson is needed
and the corpus cannot support it, it appears in §20 (Research gaps) instead of
in a module.

| Key | File |
|---|---|
| `[01]` | `research/01-docs-core.md` — install, quickstart, learning path, platform support, CLI, configuration, features overview, tools/toolsets |
| `[02]` | `research/02-docs-systems.md` — memory, skills, MCP, voice, SOUL.md, context files, security, gateway, Portal, providers, cron, delegation, architecture, CLI reference, FAQ |
| `[03]` | `research/03-ecosystem.md` — repo facts, release timeline, awesome-list, self-evolution repo, Skills Hub, Nous Portal |
| `[04]` | `research/04-community-use-cases.md` — real workflows, pitfalls, comparisons, security incidents, first-week accounts |
| `[05]` | `research/05-simulation-material.md` — verbatim terminal formats with explicit fidelity ratings |
| `[06]` | `research/06-docs-remaining-features.md` — user stories, tool gateway, dashboard, memory providers, plugins, browser, ACP, API server, platform support, Telegram, skills catalogues, kanban, MoA, hooks, checkpoints, webhooks, desktop, profiles |
| `[07]` | `research/07-extension-and-ops.md` — developer/extension APIs, the self-improvement machinery traced to code paths, MoA, kanban/projects, webhooks/hooks, egress firewall |

**Lesson ids** are the content-collections `id`: `hermes/<NN-module>/<NN-lesson>`.
Files live at `content/guides/hermes/<NN-module>/<NN-lesson>.mdx` per decision 008.
Prerequisites are written in full id form because the build fails on dangling
references, and that check is only useful if the ids are exact.

**Relevance** is per track, per the `relevance` enum already in
`content-collections.ts`:

- `core` — on this track's path, counted in its progress
- `skim` — worth knowing, presented condensed, not required
- `skip` — genuinely not for this reader; reachable, never suggested

**Duration accounting.** `duration` in frontmatter is the honest reading time for
a reader for whom the lesson is `core`. For track totals I count `core` at full
duration, `skim` at 40% (the condensed variant is genuinely shorter, not just
optional), and `skip` at zero. Rounded to whole minutes. This convention is
stated because otherwise "total minutes per track" is meaningless.

**Track shorthand** in tables: **N** = Newcomer, **O** = Operator, **A** = Architect.
`C` = core, `S` = skim, `—` = skip.

---

## 2. The map at a glance

| # | Module | Slug | Arc | Lessons | Minutes |
|---|---|---|---|---|---|
| 1 | First contact | `01-first-contact` | orientation | 4 | 31 |
| 2 | Standing it up | `02-standing-it-up` | installation | 4 | 48 |
| 3 | Running a session | `03-running-a-session` | fluency | 4 | 40 |
| 4 | Tools and isolation | `04-tools-and-isolation` | capability | 4 | 51 |
| 5 | What the agent knows | `05-what-it-knows` | context | 5 | 55 |
| 6 | Skills and the improvement loop | `06-skills-and-the-loop` | cognition | 8 | 99 |
| 7 | Unattended operation | `07-unattended` | autonomy | 6 | 77 |
| 8 | More than one agent | `08-more-than-one-agent` | multiplicity | 5 | 62 |
| 9 | Extension and routing | `09-extension-and-routing` | extension | 5 | 69 |
| 10 | Deployment and governance | `10-deployment-and-governance` | judgement | 6 | 79 |
| | **Total** | | | **51** | **611** |

The shape of the arc, in one line each: know what it is → get it running safely →
become fluent at the terminal → give it capability and bound that capability →
understand everything it knows → understand how it changes itself → let it act
without you → let it act as several → extend and route it → deploy it and judge it.

---

## 3. Module 1 — First contact

`content/guides/hermes/01-first-contact/` · arc: `orientation` · 4 lessons · 31 min

**Why it sits here.** Nothing precedes orientation, but the choice worth
defending is what orientation *contains*. Most guides open with installation.
This one opens with the mechanical model — one system prompt assembled per
session, a tool-dispatch loop, a SQLite record — because every later lesson is a
detail of that model, and because a reader who installs first and learns the
model later spends the whole guide fitting facts to a wrong mental picture. The
module also states the guide's own map and its exclusions up front: telling a
reader what you will not teach them is the cheapest way to earn the right to
their sequence.

**After it, the reader can** describe what Hermes is without repeating marketing
("multi-level memory system", "three-layer memory"), locate any subsystem on a
map, and know which version they are reading about and how to tell when the guide
has gone stale.

**Deferred deliberately.** Nothing is installed in this module. The reader may be
on a phone; PRODUCT.md requires the guide be worth reading before it is worth
following, and this module is where that promise is kept.

---

**`01-what-hermes-is.mdx` — What Hermes actually is** · 8 min · N `C` / O `C` / A `C`
> An agent that writes its own procedures, keeps a record across sessions, and hands work to copies of itself — what that means mechanically, and what it does not mean.
> **Prereqs** none
> **Draws from** `[03]` §1 (README positioning, "the agent that grows with you", the closed-loop feature table); `[02]` product tagline; `[01]` §7 (features overview); `[04]` §2.1–2.2 (agent-first vs gateway-first framing, learning loop).
> **Note** This lesson already exists as a scaffold and must be rewritten from the corpus. It carries the first, unexplained sight of a skill file being written — the mechanism is not named until `06/05`. That is principle 3 ("show the mechanism, then name it") applied across the whole guide, not within one page.

**`02-the-agent-loop.mdx` — The loop, and the one rule it obeys** · 10 min · N `C` / O `C` / A `C`
> Input → assemble one system prompt → call the model → dispatch tool calls in parallel → persist → repeat, and why nothing may rebuild that prompt mid-conversation.
> **Prereqs** `hermes/01-first-contact/01-what-hermes-is`
> **Draws from** `[02]` §13 (AIAgent, five subsystems, prompt tiers stable→context→volatile, data-flow patterns); `[04]` §1.1 (core loop, thread-pool tool dispatch, "a cached prefix is ~10x cheaper to read than to write", iteration budget); `[03]` §1 (AGENTS.md: prompt caching is "sacred", "the core is a narrow waist", the footprint ladder).

**`03-the-map-and-what-we-skip.mdx` — The whole surface, and what this guide leaves out** · 7 min · N `C` / O `C` / A `C`
> Every Hermes subsystem named once, where each is taught, and the explicit list of what is excluded from this curriculum with the reason for each exclusion.
> **Prereqs** `hermes/01-first-contact/01-what-hermes-is`
> **Draws from** `[01]` §7 (features overview, the full feature inventory); `[01]` §3 (the docs' own learning paths and their stated durations, presented as the thing this guide is not); `[02]` docs index/nav tree; `[06]` §§2–19 (the remaining feature surface); `[06]` §20 (features with no documentation page at all).
> **Note** This is where the exclusion list in §13.5 of this document becomes reader-facing. It is also where the docs' own "Advanced: 4–6 hours" claim is contrasted with this guide's honest totals.

**`04-versions-and-what-goes-stale.mdx` — Reading a project that ships weekly** · 6 min · N `S` / O `C` / A `C`
> Twenty-two releases between March and July 2026, how to tell what you are running, and the three ways this guide can be wrong.
> **Prereqs** `hermes/01-first-contact/01-what-hermes-is`
> **Draws from** `[03]` §1 (full release timeline v0.2.0→v0.19.0 with dates and themes); `[01]` §fact-uncertain (no docs page states the product version; "config version 17" is a schema version, not the release); `[02]` §14 (`hermes version`, `hermes dump`); `[05]` §1 (`hermes dump` verbatim output block); `[05]` §8.5 (Hermes Atlas publishes `hermes daemon start`, which is not in the official CLI — third-party drift, demonstrated); `[04]` §1.2 (explicit warning that install snippets go stale within weeks).

---

## 4. Module 2 — Standing it up

`content/guides/hermes/02-standing-it-up/` · arc: `installation` · 4 lessons · 48 min

**Why it sits here.** Second, because the reader now has a model to hang the
install on, and because everything from module 3 onward assumes a working agent.
The module's real work is not the installer — that is one command — it is the two
decisions the installer does not make for you: which model, and how much of your
machine the agent may touch. The provider lesson exists because the single most
common documented failure is a model with too small a context window, and the
blast-radius lesson exists because this is the last moment before the reader can
do real damage.

**After it, the reader can** run `hermes`, hold a multi-turn conversation with a
model that can actually call tools, know where every file Hermes owns lives, and
state accurately what the agent can reach on their machine by default.

**Deferred deliberately.** No gateway, no Docker, no skills. `[01]` §2 quotes the
docs' own rule and this module enforces it: "if Hermes cannot complete a normal
chat, do not add more features yet."

---

**`01-install.mdx` — Installing it, and where everything lands** · 12 min · N `C` / O `C` / A `S`
> The install paths per platform, what the installer brings with it, the exact directory it creates, and which platforms are supported versus tolerated.
> **Prereqs** `hermes/01-first-contact/01-what-hermes-is`
> **Draws from** `[01]` §1 (install commands, prerequisites, auto-installed deps, install-location table, non-sudo/service-user path, `--skip-browser`, `HERMES_HOME`, `hermes doctor`); `[01]` §4 and `[06]` §9 (Tier 1 / Tier 2 / unsupported platform matrix, "Docker installs do not support `hermes update`", the refused-platform warning); `[05]` §1 (install block, verbatim).
> **Note** The Architect variant is a short read: the platform tiers and the directory layout matter to them; the shell reload does not.

**`02-choosing-a-provider.mdx` — Picking a model that can actually do this** · 14 min · N `C` / O `C` / A `C`
> The 64,000-token floor, the one-command Portal path versus bringing your own keys, and why Nous's own Hermes 4 is not the recommended model for Hermes Agent.
> **Prereqs** `hermes/02-standing-it-up/01-install`
> **Draws from** `[01]` §2 (`hermes setup --portal`, `hermes model`, the secrets/settings split, the hard 64K minimum rejected at startup); `[02]` §9 (Nous Portal, Tool Gateway's five backends, the refresh-token-only credential claim, the "Hermes 4 not recommended" caveat); `[02]` §10 (provider matrix, Ollama/vLLM/llama.cpp/LM Studio flags, the nine-source context-length resolution chain, named custom providers); `[04]` §1.4 pitfall 2 (small local models fail multi-step tool calling; `delegate_task` fails silently under 64K).
> **Note** Prints no Portal prices — see §20, gap 3. Presents the `hermes portal info` vs `hermes portal status|open|tools` conflict rather than picking one.

**`03-first-run-and-what-good-looks-like.mdx` — First run, and how to know it worked** · 10 min · N `C` / O `C` / A `—`
> The three setup modes, the first four prompts worth typing, the docs' own success checklist, and the recovery sequence when it fails.
> **Prereqs** `hermes/02-standing-it-up/02-choosing-a-provider`
> **Draws from** `[05]` §1 (the three setup modes verbatim, the `hermes setup` reference text, the success checklist verbatim, and the explicit instruction not to fabricate banner art); `[01]` §2 (the four example verification prompts, slash commands shown on first run, the ordered recovery sequence `hermes doctor` → `model` → `setup` → `sessions list` → `--continue` → `gateway status`); `[01]` §5 (TUI vs classic CLI).
> **Carries** SIM-1.

**`04-blast-radius-before-you-continue.mdx` — What it can reach, before you let it** · 12 min · N `C` / O `C` / A `C`
> The agent has your filesystem access; here is what is always blocked, what asks first, what cannot be overridden, and what happened the two times someone turned the asking off.
> **Prereqs** `hermes/01-first-contact/02-the-agent-loop`, `hermes/02-standing-it-up/01-install`
> **Draws from** `[01]` §6 (the docs' own warning: "The agent has the same filesystem access as your user account"); `[02]` §7 (always-blocked paths, credential-store protection, `approvals.mode: smart` as default, the hardline blocklist and its non-overridability, YOLO mode and its banner); `[04]` §3.3 (the Thailand Ministry of Finance post-exploitation case, told as a story; the GitHub #30151 `shutil.rmtree` data loss; @Anic888's finding that container deployments shipped with approvals disabled); `[04]` §1.2, §1.4 pitfall 1 (restrict to one project directory first; WhatsApp gives it your real phone number with no preview).
> **Note** This lesson tells the incidents; `10/04` analyses them. The duplication is intentional and the two lessons cross-link explicitly.

---

## 5. Module 3 — Running a session

`content/guides/hermes/03-running-a-session/` · arc: `fluency` · 4 lessons · 40 min

**Why it sits here.** Third, because fluency at the terminal is what makes every
later module cheap to learn. A reader who cannot read the status bar cannot tell
whether their problem is the model, the context budget, or their own prompt — and
will misattribute every failure for the rest of the guide. The configuration
lesson closes the module rather than opening the guide, because a config
reference read before you have felt any of the pressures it relieves is a list of
keys; read after two hours of sessions, it is a set of answers.

**After it, the reader can** read the status bar and predict when compression will
fire, resume any past session, redirect a running agent without killing its work,
and set any configuration value into the right file with confidence about
precedence.

**Deferred deliberately.** No tools yet. This module is about the instrument, not
what the instrument reaches.

---

**`01-the-status-bar-and-the-context-budget.mdx` — Reading the instrument** · 11 min · N `C` / O `C` / A `S`
> Every element of the status bar, what the colour thresholds mean, and what compression actually does to your conversation when it fires.
> **Prereqs** `hermes/02-standing-it-up/02-choosing-a-provider`
> **Draws from** `[05]` §2 (status bar verbatim, spinner frames verbatim, tool-execution feed verbatim, TUI status-line table and badges); `[01]` §5 (status-bar element list, context colour thresholds, `🗜️ N` compression count, tool preview length, thinking-animation examples); `[01]` §6 (full `compression:` reference — threshold 0.50, `protect_first_n: 3`, `protect_last_n: 20`, target ratio, hot-reload behaviour, the rule that the summary model's context must be at least as large as the main model's; the two context-pressure warning tiers).
> **Carries** SIM-2.

**`02-sessions-and-resuming.mdx` — The record, and getting back to it** · 9 min · N `C` / O `C` / A `S`
> Sessions as durable objects in SQLite: resuming by id, name, or title, what lineage means after a compression, and what a background session is.
> **Prereqs** `hermes/03-running-a-session/01-the-status-bar-and-the-context-budget`
> **Draws from** `[01]` §5 (`--continue`/`-c`/`--resume`/`-r`, resume by title, `hermes sessions list|rename`, `/title`, session storage in `~/.hermes/state.db`, lineage across compressed/resumed sessions, `/background` semantics and its response format); `[05]` §2 (session-resume footer verbatim, background task start/finish panels verbatim, `Ctrl+Z` suspend line verbatim); `[02]` §1 (state.db, FTS5 index, `hermes sessions list`); `[02]` §14 (`hermes sessions` full subcommand set: browse, export, delete, prune, archive, stats).

**`03-steering-a-running-agent.mdx` — Interrupting, queueing, steering** · 8 min · N `C` / O `S` / A `—`
> Three different things that happen when you type while the agent is working, how to pick one, and the keybindings that do not work in your terminal.
> **Prereqs** `hermes/03-running-a-session/01-the-status-bar-and-the-context-budget`
> **Draws from** `[01]` §5 (`display.busy_input_mode` with all three modes and the steer→queue fallback, `/busy` subcommands, the full keybinding table, `Ctrl+C` double-press behaviour, the Shift+Enter terminal support matrix and the Windows Terminal `Alt+Enter` conflict, multi-line input methods, `/stop`, tool-progress display, quick commands); `[01]` §5 + `[02]` §5 (personalities as a session-level overlay).
> **Note** Must present the personality-count conflict: `[01]` §5 names 14 built-in personalities, `[02]` §5 states 12 total and names 11. Three figures, no resolution — the lesson says so.

**`04-configuration-you-will-actually-touch.mdx` — Two files, and which one wins** · 12 min · N `C` / O `C` / A `C`
> `config.yaml` versus `.env`, the four-level precedence chain, the commands that route values to the right place, and the substitution syntax that only works one way.
> **Prereqs** `hermes/02-standing-it-up/01-install`
> **Draws from** `[01]` §6 (the `~/.hermes/` directory structure, the four-level precedence order, the secrets-versus-settings quote, `hermes config show|edit|get|set|unset|check|migrate` and the auto-routing behaviour, `${VAR}` substitution and the fact that bare `$VAR` is not expanded, `updates:` block, the "config version 17" schema-versus-product distinction); `[02]` §14 (`hermes config` reference, `hermes dump`); `[06]` §3 (the dashboard's Config tab exposes 150+ fields from `DEFAULT_CONFIG` — cited as the honest scale of the surface this lesson deliberately does not enumerate).
> **Note** Everything reference-shaped moves to Cheatsheet 2. The lesson teaches the model; the cheatsheet carries the keys.

---

## 6. Module 4 — Tools and isolation

`content/guides/hermes/04-tools-and-isolation/` · arc: `capability` · 4 lessons · 51 min

**Why it sits here.** Fourth, and the two halves are one module on purpose.
Teaching capability and containment separately produces readers who can recite
`approvals.mode` and still run `--yolo`, which is exactly the failure mode `[04]`
§3.3 documents in the wild. The order inside the module matters too: the tool
catalogue first (what it can do), then the terminal in detail (the tool that
actually reaches your machine), then the execution backends (where that reach
lands), then approvals (the gate). Each lesson narrows the blast radius the
previous one opened.

**After it, the reader can** enable exactly the toolsets a task needs, choose an
execution backend for a given trust level, and explain the single most
consequential asymmetry in Hermes's security model: the dangerous-command check
is skipped entirely on container and cloud backends.

**Deferred deliberately.** MCP is not taught here even though it is "more tools".
MCP is a way to *acquire* tools from third parties, and a reader who meets it
before understanding toolset scoping, approvals, and credential filtering will
install a server and grant it everything. It waits for `09/01`.

---

**`01-tools-and-toolsets.mdx` — The catalogue, and how to shrink it** · 13 min · N `C` / O `C` / A `C`
> Every built-in tool by category, the toolsets that group them, how to restrict them per platform and globally, and why Hermes deliberately has so few core tools.
> **Prereqs** `hermes/03-running-a-session/04-configuration-you-will-actually-touch`
> **Draws from** `[01]` §8 (tools by category, the 23 toolset names, platform presets, `hermes tools`, `--toolsets`); `[01]` §6 (`agent.disabled_toolsets` and the quote that it applies *after* per-platform config); `[02]` §13 (central registry, "70+ registered tools across ~28 toolsets", self-registration at import); `[03]` §1 (AGENTS.md's footprint ladder and the narrow-waist rule: every tool schema is sent on every API call, so a new core tool is the last resort); `[07]` §1.3 (toolset resolution, composite expansion, the dynamic schema patching that stops the model hallucinating unavailable tools).

**`02-terminal-and-process.mdx` — The terminal tool, and the long-running job** · 11 min · N `S` / O `C` / A `S`
> How the agent actually runs commands, how it manages a process it started, and the truncation limits that decide what it sees of the output.
> **Prereqs** `hermes/04-tools-and-isolation/01-tools-and-toolsets`
> **Draws from** `[01]` §8 (`terminal`, `process` with all seven actions, `background=true`, PTY mode, sudo support and the `SUDO_PASSWORD` caveat); `[01]` §6 (`tool_output.max_bytes/max_lines/max_line_length` and the 40%-head/60%-tail truncation marker, `file_read_max_chars` and the unchanged-region stub, `terminal.timeout`, `persistent_shell`); `[02]` §7 (file-write safety: always-blocked paths, `HERMES_WRITE_SAFE_ROOT`, the blocked-write error strings, the `cron/jobs.json` patch prohibition); `[02]` §15 (the `node: command not found` / `terminal.shell_init_files` gotcha for nvm/asdf users).

**`03-execution-backends-and-isolation.mdx` — Six places the agent's commands can run** · 15 min · N `S` / O `C` / A `C`
> Local, Docker, SSH, Singularity, Modal, Daytona — what each isolates, what it costs, and the check that four of them skip.
> **Prereqs** `hermes/04-tools-and-isolation/01-tools-and-toolsets`, `hermes/02-standing-it-up/04-blast-radius-before-you-continue`
> **Draws from** `[02]` §7 (the six-backend table with isolation and dangerous-command-check columns — the row where docker/singularity/modal/daytona say "Skipped" is the lesson's centre; the Docker security flags applied to every container; persistent versus ephemeral mounts; `docker_forward_env` empty by default); `[01]` §6 (the full `terminal:` block, the Docker sub-block in detail, `docker_run_as_host_user` and `docker_mount_cwd_to_workspace` tradeoffs, `docker_network: false` air-gap and the rebuild-on-toggle behaviour, SSH ControlMaster details, Modal/Daytona/Singularity requirements and limits, remote-to-host file sync triggers, the container label scheme, the note that parallel subagents share one container); `[01]` §8 (container security feature list).
> **Carries** VIZ-5's upper half is drafted here and completed in `10/02`.

**`04-approvals-in-depth.mdx` — The gate, and the four ways past it** · 12 min · N `S` / O `C` / A `C`
> Smart, manual, and off; your own deny rules; YOLO; and the blocklist that none of them can move.
> **Prereqs** `hermes/04-tools-and-isolation/03-execution-backends-and-isolation`, `hermes/02-standing-it-up/04-blast-radius-before-you-continue`
> **Draws from** `[02]` §7 (the three approval modes and what smart mode does with each risk band, the full `approvals:` block including `cron_mode: deny` and the 300s fail-closed timeout, user deny rules applied *before* YOLO and enforced only on host-reaching backends, the dangerous-pattern categories from `tools/approval.py`, the four CLI options `[o]nce [s]ession [a]lways [d]eny` and where "always" persists, the gateway approval flow, Tirith's detections and its Windows gap); `[07]` §1.3 (`DANGEROUS_PATTERNS`, `detect_dangerous_command()`, smart-approval auxiliary model, per-session tracking); `[06]` §10 (the verbatim Telegram approval prompt); `[06]` §1 DEV WORKFLOW (the community audit of 129 sessions finding 112 with approval-gate violations — evidence that the gate is routinely bypassed in practice).
> **Carries** SIM-8.

---

## 7. Module 5 — What the agent knows

`content/guides/hermes/05-what-it-knows/` · arc: `context` · 5 lessons · 55 min

**Why it sits here.** Fifth, immediately before skills, because the system prompt
is the object skills and memory both write into, and because the reader has now
watched the context bar fill and has a reason to care what is occupying it. The
module opens with the assembled prompt as a single artefact — identity, project
context, memory, skill index, tool schemas — and only then decomposes it. That
ordering is the point: memory taught in isolation invites the "three-layer memory
system" misreading that the corpus explicitly contradicts, whereas memory taught
as one bounded block inside a cached prefix cannot be misread that way.

**After it, the reader can** account for what is in their system prompt and
roughly what it costs, write a SOUL.md that does not belong in AGENTS.md, predict
when a memory write will and will not affect the next reply, and choose between
curated memory and full-text recall for a given question.

**Deferred deliberately.** External memory providers close the module rather than
lead it, and are `skim` on every track. Nine providers exist; none is default;
the built-in system is what every reader will actually run. Saying so is more
useful than a tour.

---

**`01-what-is-in-the-system-prompt.mdx` — The prompt, exploded** · 13 min · N `C` / O `C` / A `C`
> The ordered layers of what the model sees before your first word, the cache boundary that runs through them, and why that boundary is the reason so much of Hermes works the way it does.
> **Prereqs** `hermes/01-first-contact/02-the-agent-loop`, `hermes/04-tools-and-isolation/01-tools-and-toolsets`
> **Draws from** `[02]` §13 (prompt builder, the `stable → context → volatile` tiers, prompt-stability design principle); `[02]` §5 (SOUL.md occupies slot #1); `[02]` §6 (`build_context_files_prompt()`, the `# Project Context` header, injection scan, truncation); `[02]` §1 (memory injected as a frozen snapshot at session start to preserve the prefix cache); `[02]` §2 (the skill index at ~3k tokens for metadata only); `[01]` §6 (prompt caching: auto-enabled for Claude on native Anthropic/OpenRouter/Portal, 1h TTL breakpoints on system prompt and skill blocks); `[04]` §1.1 ("a cached prefix is ~10x cheaper to read than to write"); `[03]` §1 (AGENTS.md: caching is sacred; every model tool is sent on every call); `[03]` §1 open issues (#4379 "73% of each API call is fixed overhead (~13.9K tokens)", #6839 lazy tool-schema loading); `[02]` §14 (`hermes prompt-size`).
> **Carries** VIZ-1.

**`02-soul-and-project-context.mdx` — Identity, and the file that belongs to the project** · 10 min · N `C` / O `C` / A `C`
> SOUL.md as who the agent is everywhere, the one project file that loads per session, and the scan that can silently refuse both.
> **Prereqs** `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`
> **Draws from** `[02]` §5 (SOUL.md location and slot, "existing user SOUL.md files are never overwritten", loaded only from `HERMES_HOME` and never from CWD, the fallback identity, what belongs in it and what belongs in AGENTS.md, the verbatim rule of thumb, `/personality` as a session overlay, custom personalities under `agent.personalities`); `[02]` §6 (the five project file types in priority order, first-match-wins, the different directory-walking rules per type, progressive discovery up to five parents, the 20,000-char cap and 70/20/10 truncation ratio, the 8,000-char subdirectory cap, the verbatim truncation and BLOCKED message formats, the six injection-detection categories); `[01]` §6 (`context_file_max_chars` and the fact that it does not affect `read_file`); `[01]` §7 (context references, the `@`-mention syntax for files, folders, git diffs, URLs).

**`03-memory-the-two-files.mdx` — Memory is two capped files** · 14 min · N `C` / O `C` / A `C`
> `MEMORY.md` and `USER.md` with their real character limits, the three actions the agent has, the read action it does not have, and why your last correction will not be in the prompt until tomorrow.
> **Prereqs** `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`
> **Draws from** `[02]` §1 (the two-file system with exact caps 2,200 and 1,375 chars, storage under `~/.hermes/memories/`, the frozen-snapshot rule, the `memory` tool's `add`/`replace`/`remove` and the explicit absence of a read action, the two targets, the save-proactively and skip lists, capacity management and the consolidate-at-80% practice, duplicate rejection, injection/credential/invisible-Unicode scanning, the full `memory:` config block, `display.memory_notifications` with all three values and per-platform override, write-approval staging and its four slash commands, background review on an auxiliary model and the compact-digest behaviour); `[05]` §4 (the verbatim system-prompt injection format with the `§` delimiter and the `[67% — 1,474/2,200 chars]` header, the verbatim full-memory error JSON, the verbatim `💾 Memory updated` notification, the verbatim approval-gated command set, the explicit UNKNOWN on any distinct "user model updated" surface); `[04]` §1.4 pitfall 5 and `[04]` §1.3 ("stale memory is the number one cause of weird agent behavior"); `[04]` §1.1 (memory files need periodic compaction or they degrade context quality).
> **Carries** SIM-3, VIZ-2. Must correct the record: the widely repeated "three-layer memory system" is not what the docs describe.

**`04-recall-session-search.mdx` — Everything you ever said, searchable** · 8 min · N `C` / O `C` / A `S`
> A full-text index over every past session, what it returns, what it costs, and the questions it answers that memory cannot.
> **Prereqs** `hermes/05-what-it-knows/03-memory-the-two-files`
> **Draws from** `[02]` §1 (the `session_search` tool, SQLite FTS5 at `~/.hermes/state.db`, raw messages with "no summarization", ~20ms query and ~1ms scroll, the verbatim memory-versus-search comparison table); `[05]` §4 (the same comparison table verbatim); `[03]` §1 (v0.15.0: `session_search` made 4,500× faster — the release-note figure that explains why this is now usable); `[02]` §14 (`hermes sessions` surface, `hermes insights`).

**`05-external-memory-providers.mdx` — Nine other memories, and whether you want one** · 10 min · N `S` / O `S` / A `S`
> The pluggable providers, what each adds, the latency one reader measured, and the honest answer about whether the built-in system is enough.
> **Prereqs** `hermes/05-what-it-knows/03-memory-the-two-files`
> **Draws from** `[06]` §4 (the nine providers with storage/cost/tools/dependency/distinguishing-feature table, the one-active-at-a-time constraint, running alongside rather than replacing built-in memory, `hermes memory setup|status|off`, per-provider config specifics, profile isolation behaviour); `[02]` §1 (the eight named on the memory page, and the correction that Honcho is one optional plugin rather than a built-in layer); `[04]` §5.3 (Allard Quek's measured Honcho latency — 10s registration, 12s session retrieval — with limited perceived benefit, and Honcho remaining active in logs after attempts to disable it); `[04]` §1.4 pitfall 5 (the recommendation to install one immediately, presented as a contested opinion rather than advice); `[03]` §2 (the ~17 community memory providers, as evidence of how unsettled this layer is).
> **Note** `skim` on all three tracks, deliberately. Also presents the count conflict: `[02]` §1 documents eight, `[06]` §4 documents nine.

---

## 8. Module 6 — Skills and the improvement loop

`content/guides/hermes/06-skills-and-the-loop/` · arc: `cognition` · 8 lessons · 99 min

**Why it sits here.** Sixth of ten — the centre of the guide, in both senses. The
positioning argument is in §13.1 and it is the most consequential ordering decision
in this map, so it is argued there at length rather than summarised here. The
internal order is: the artefact (a skill is a markdown file with frontmatter),
then its economics (progressive disclosure), then acquiring other people's
(trust), then writing one on purpose (`/learn`), and only then the four lessons
about the agent writing them for itself — mechanism, policy, maintenance, and
discipline. Four lessons on the loop is not indulgence: `[07]` §2 traces it to
four genuinely separate code paths, and a reader who conflates them cannot debug
any of them.

**After it, the reader can** read and write a SKILL.md, judge a skill from the hub
before installing it, explain precisely what fires the background review and what
that fork is and is not allowed to do, predict what the review will choose to
save, and name the two mechanisms that stop the library rotting.

**Deferred deliberately.** Nothing about cron or the gateway. The loop must be
understood on a machine the reader is watching before it is understood on one they
are not — its failure mode (skills that harden into self-imposed refusals) is
strictly worse unattended.

---

**`01-skills-as-procedure.mdx` — A skill is a file** · 14 min · N `C` / O `C` / A `C`
> The anatomy of a SKILL.md, a real bundled one read end to end, where they live, and the slash command every one of them becomes.
> **Prereqs** `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`
> **Draws from** `[05]` §3 (the full verbatim frontmatter spec including `blueprint`, the standard body sections, the real bundled `arxiv` SKILL.md captured in full, the agent-created skill path `~/.hermes/skills/<category>/<name>/SKILL.md`, the docs' own directory-tree illustration); `[02]` §2 (agentskills.io conformance, `~/.hermes/skills/` as the primary source of truth, the per-skill directory layout, the frontmatter field list, "Every installed skill is automatically available as a slash command", skill stacking up to five leading tokens, skill bundles with their YAML and CLI); `[07]` §1.1 (the Skill-versus-Tool decision rule, `${HERMES_SKILL_DIR}` and `${HERMES_SESSION_ID}` substitution, and the inline-shell feature that is off by default because it executes on the host with no approval prompt); `[06]` §11 (the bundled catalogue, cited as scale rather than enumerated); `[03]` §5 (agentskills.io as an open standard adopted by 42+ clients).

**`02-progressive-disclosure.mdx` — Why a hundred skills cost almost nothing** · 9 min · N `S` / O `C` / A `S`
> Three levels of loading, what each costs in tokens, and the conditional flags that hide a skill when it is not needed.
> **Prereqs** `hermes/06-skills-and-the-loop/01-skills-as-procedure`, `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`
> **Draws from** `[02]` §2 (the three levels with the ~3k-token figure for level 0, `skills_list()` / `skill_view(name)` / `skill_view(name, path)`, conditional activation via `requires_toolsets`/`fallback_for_toolsets` and the bundled `duckduckgo-search` example, external skill directories and shadowing); `[03]` §5 (the standard's own three-stage discovery/activation/execution framing); `[04]` §1.1 (the rationale quote: "don't load every skill, every memory, every tool's full docs into the system prompt"); `[03]` §1 open issues (#6839 lazy tool-schema loading, #4379 fixed-overhead measurement — the ceiling this mechanism does not reach); `[03]` §2 (`eagle-eye`, a community five-layer router narrowing 50+ skills to five candidates, as evidence the problem is real at scale).

**`03-installing-skills-and-trust.mdx` — Other people's skills** · 12 min · N `C` / O `C` / A `C`
> The hub, the taps, the four trust levels, the scan that runs before install, and what the wildly inconsistent skill counts tell you about this ecosystem.
> **Prereqs** `hermes/06-skills-and-the-loop/01-skills-as-procedure`
> **Draws from** `[02]` §2 (the registry sources including `official`, `skills-sh`, `well-known`, `url`, `github`; the four trust levels and exactly which orgs are `trusted`; the full `hermes skills` command surface; `--force` semantics for community findings; custom taps and `taps.json`; the `.bundled_manifest` sync that silently updates unmodified bundled skills and permanently skips user-modified ones; `skills.guard_agent_created`); `[03]` §5 (the Skills Hub's release-by-release build-up, the v0.17.0 per-skill security scan, the v0.19.0 unified Capabilities page, and the three irreconcilable skill counts — 19,932 vs 672 vs 124,000+); `[03]` §2 (the awesome-list's own trust-boundary disclaimer: "a discovery aid, not a security endorsement"); `[06]` §12 (the optional catalogue and `hermes skills install official/<category>/<skill>`); `[04]` §3.3 (CSA's finding that community skill marketplaces carry npm-style supply-chain risk).

**`04-writing-a-skill-deliberately.mdx` — Making one on purpose** · 12 min · N `C` / O `C` / A `S`
> `/learn` from a directory, a URL, or what you just did; the tool the agent uses; and the blueprint field that turns a skill into a scheduled job you still have to approve.
> **Prereqs** `hermes/06-skills-and-the-loop/01-skills-as-procedure`
> **Draws from** `[02]` §2 (`/learn` with all four source types, the `skill_manage` action set with `patch` marked preferred, write-approval staging to `~/.hermes/pending/skills/` and the five review commands, output/media delivery directives); `[07]` §2.6 (`/learn` is explicitly user-triggered and not part of the nudge loop; `build_learn_prompt()` is one prompt over the existing toolset with no separate distillation engine; the embedded authoring standards including `author: Hermes` literal; every surface calls the same function); `[07]` §1.1 (blueprints register a *suggested* cron job and never auto-schedule, reviewed via `/suggestions`, accepted through the same `cron.jobs.create_job` the `cronjob` tool uses — "no second job engine"); `[05]` §3 (the verbatim `skill_manage` action table, the staged-write commands, the `💾 Skill 'foo' patched` notification).

**`05-the-nudge-and-the-review-fork.mdx` — What actually fires, and what it is allowed to do** · 15 min · N `C` / O `C` / A `C`
> A counter that increments once per tool-loop iteration, a forked agent that runs after your answer is already on screen, and the four walls that keep it out of your conversation.
> **Prereqs** `hermes/06-skills-and-the-loop/01-skills-as-procedure`, `hermes/06-skills-and-the-loop/04-writing-a-skill-deliberately`
> **Draws from** `[07]` §2.1 (the config keys `memory.nudge_interval` and `skills.creation_nudge_interval`, both default 10; the counter incrementing per API-call iteration rather than per user message; the reset on any `skill_manage` use; the `turn_finalizer` trigger condition and the fact that the spawn happens only after `final_response` and only when not interrupted; the note that the curator doc's "~every 10 agent turns" is an approximation of an iteration count); `[07]` §2.2 (the module docstring quote; model routing — parent runtime by default for cache warmth, `auxiliary.background_review.*` to route it cheaper, full replay on the same model versus a 24-message digest on a different one; the `["skills"]`-plus-`"memory"` tool whitelist and its verbatim denial message; `_persist_disabled` and `_session_db = None` with the named "curator-takeover root cause" they prevent; approval auto-deny; compression disabled; nested nudges disabled).
> **Carries** SIM-4, VIZ-3. The flagship lesson of the guide.

**`06-the-editorial-policy.mdx` — The prompt that decides what gets remembered** · 12 min · N `C` / O `C` / A `C`
> There is no classifier — the policy is instruction text, and reading it is how you predict whether your agent will get better or get strange.
> **Prereqs** `hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork`
> **Draws from** `[07]` §2.3 (the "Be ACTIVE" instruction and the claim that a pass doing nothing is a missed opportunity; the class-level target shape versus a flat list of one-session entries; the signal list including the statement that frustration signals are first-class skill signals; the strict four-step preference order from patching a currently-loaded skill through creating a new umbrella, with the naming prohibition; the anti-capture list and the specific warning that negative tool claims "harden into refusals the agent cites against itself for months"; protected bundled and hub skills; the literal `"Nothing to save."` output); `[07]` §2.4 (the two distinct paths this phrase maps to — in-session self-patching and cross-session consolidation — and the usage counters each writes).

**`07-the-curator.mdx` — The maintenance pass nobody asked for** · 13 min · N `S` / O `C` / A `C`
> Usage telemetry, three states, a deterministic phase that always runs and an LLM phase that does not, and the three-part test that decides which skills it is allowed to touch.
> **Prereqs** `hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork`, `hermes/06-skills-and-the-loop/06-the-editorial-policy`
> **Draws from** `[07]` §2.5 (what it is and the accumulation problem it exists for; trigger conditions — both `interval_hours` 168 and `min_idle_hours` 2 must be satisfied — and the first-run deferral that gives you a full interval before it touches anything; the two-phase run with `consolidate: false` by default; package-aware consolidation rules; the full `curator:` config block and the `auxiliary.curator` slot; `prune_builtins` semantics and the guarantee that bundled skills are only ever archived; the precise three-part "agent-created" test and the fact that only the background review fork sets that marker, so user-requested skills are left alone; the full CLI; pre-run tar.gz backups and reversible rollback; pinning semantics — exempt from transitions and from agent deletion, but patches still land; protected built-ins like `plan`; per-run `run.json` and `REPORT.md`; the consolidated storage-path table); `[05]` §3 (the verbatim `.usage.json` sidecar entry and the curator report paths); `[03]` §1 (v0.12.0 shipped the Autonomous Curator); `[04]` §5.1 (a reader's Day-4 observation of it consolidating three skills into one).

**`08-keeping-it-from-getting-worse.mdx` — Evolving without quietly getting weird** · 12 min · N `C` / O `C` / A `C`
> The discipline layer power users add on top of the loop, the separate research pipeline that is not part of Hermes, and the open problem nobody has solved.
> **Prereqs** `hermes/06-skills-and-the-loop/06-the-editorial-policy`, `hermes/06-skills-and-the-loop/07-the-curator`
> **Draws from** `[04]` §3.4 (the champion/challenger "sensei loop" with a held-out validation set and the explicit principle "never promote on the working set... holdout promotion is the immune system"); `[03]` §2 (the awesome-list's operational playbook "Self-improvement without self-delusion" and its warning that "the trick is not 'evolve faster'; it's 'evolve without quietly getting weird'"); `[03]` §4 (the self-evolution repo in full: DSPy + GEPA, no GPU, ~$2–10 per run, the five gates ending in mandatory human PR review, only Phase 1 implemented, the disputed integration boundary in issue #18, and the reported no-op bug #141); `[03]` §1 open issues (#11692 "Receipts for self-improving agents: proving which skill version produced which output" — the unsolved provenance problem); `[04]` §Facts-uncertain and §5.1 versus §1.4 pitfall 4 (the direct contradiction between two first-person accounts about whether autonomous skill creation reliably fires); `[04]` §1.3 ("automatic does not mean magic... passive use generates minimal gains").
> **Note** Must present the auto-creation-reliability conflict as a conflict; no source resolves it.

---

## 9. Module 7 — Unattended operation

`content/guides/hermes/07-unattended/` · arc: `autonomy` · 6 lessons · 77 min

**Why it sits here.** Seventh, because unattended operation is the first point at
which every earlier control becomes load-bearing rather than theoretical: an
approval prompt nobody is present to answer, a skill written at 3am with no one
reading the diff, a memory limit hit in a session that will never be resumed. The
module leads with cron rather than the gateway even though cron *runs inside* the
gateway, because a scheduled job is the smallest complete unit of unattended work
and it lets the reader meet the gateway as the thing a job needs rather than as a
platform tour. Authorization comes before the platform walkthrough for the same
reason it comes before anything: the default is deny, and readers who learn
Telegram first will paste an allow-all into their config to make the tutorial work.

**After it, the reader can** put a real recurring task into production, expose the
agent to exactly the people they intend, describe what an inbound webhook can and
cannot be trusted to have said, and estimate what any of it costs per day.

**Deferred deliberately.** Nineteen messaging platforms are not taught. One is,
end to end. The gateway is a single process with one authorization chain and
identical mechanics per adapter, so the second platform is a lookup, not a lesson —
Cheatsheet 5 carries the capability matrix.

---

**`01-scheduled-work.mdx` — Work that happens without you** · 15 min · N `C` / O `C` / A `C`
> Four schedule formats, three ways to create a job, the sixty-second tick that runs it in a fresh session, and the four constraints that will surprise you.
> **Prereqs** `hermes/03-running-a-session/04-configuration-you-will-actually-touch`, `hermes/04-tools-and-isolation/04-approvals-in-depth`
> **Draws from** `[02]` §11 (all four schedule formats; the chat, CLI, and natural-language creation surfaces; the verbatim execution-model quote and the per-tick sequence; the `.tick.lock`; the storage paths for jobs, output, and the executions ledger; the delivery-target list; the `cron:` config block; skill attachment single and multiple; `--workdir` behaviour including the fact that workdir jobs run sequentially to avoid terminal-state corruption; no-agent script mode with `{"wakeAgent": false}` for cheap polling; job chaining via `context_from`; continuable jobs and `attach_to_session`; `[SILENT]` suppression and the exception that failed jobs always deliver; the constraint that cron sessions cannot create cron jobs and that cron-management tools are disabled inside them; unpinned jobs snapshotting the default model and failing closed; creation-time prompt-injection scanning); `[05]` §6 (verbatim creation commands, the verbatim `cronjob()` tool call, the verbatim `hermes cron list` table, the verbatim delivery wrapper including "Note: The agent cannot see this message", the docs' own worked briefing output, the storage paths, the no-agent watchdog invocation); `[02]` §7 (`approvals.cron_mode: deny`); `[04]` §1.10 (cron jobs silently not firing because the gateway is not running).
> **Carries** SIM-5.

**`02-the-gateway.mdx` — One process, many front doors** · 11 min · N `C` / O `C` / A `C`
> What the gateway actually is, why `hermes setup` does not start it, and how to run it so it stays up.
> **Prereqs** `hermes/07-unattended/01-scheduled-work`
> **Draws from** `[02]` §8 (the verbatim mechanical description — adapters, per-chat session store, dispatch to AIAgent, and the cron scheduler ticking every 60 seconds inside it; the single-process design; the enumerated platform list; the full `hermes gateway` subcommand set and options; log location; the WSL2 recommendation to prefer foreground `hermes gateway run` over systemd); `[02]` §13 (the gateway's role in the architecture, session routing, authorization, slash-command dispatch, lifecycle hooks); `[04]` §1.4 pitfall 3 (`hermes setup` configures the gateway but does not start it — the single most common "my bot is broken" cause); `[02]` §15 (gateway troubleshooting: status, allowlist, token validity, macOS PATH recapture via `hermes gateway install`); `[05]` §7 (the verbatim gateway startup log lines and the production service-management commands).
> **Note** Presents the platform-count conflict: `[02]` §8/§13 say 20 adapters and "20+", the integrations index says "27+", the enumerated list contains 21 rows.

**`03-authorization-and-pairing.mdx` — Who is allowed to talk to it** · 12 min · N `C` / O `C` / A `C`
> Six checks ending in deny, allowlists per platform and globally, and the pairing flow that lets you add a colleague without collecting their user id first.
> **Prereqs** `hermes/07-unattended/02-the-gateway`, `hermes/02-standing-it-up/04-blast-radius-before-you-continue`
> **Draws from** `[02]` §7 (the check order in full and the verbatim warning that with no allowlists and no allow-all everyone is denied; per-platform and global allowlist variables; DM pairing with its 8-char code, 1-hour TTL, 1-request-per-10-minutes rate limit, max 3 pending, 5-failures-to-lockout, `unauthorized_dm_behavior`, the `hermes pairing` commands, and `~/.hermes/pairing/` storage; cross-session isolation); `[05]` §7 (the verbatim pairing-code block and the verbatim pairing CLI, plus the security notes including `chmod 0600` storage); `[06]` §10 (per-platform access control in depth: `allow_from`, `group_allow_from`, `group_allowed_chats`, guest mode, admin-only and user-allowed command lists, `/whoami`); `[02]` §7 deployment checklist (never `GATEWAY_ALLOW_ALL_USERS=true`; prefer pairing over hardcoded ids; review allowlists periodically); `[06]` §1 MESSAGING (the community DM-approval gate built for kid-facing Discord bots, as evidence of what the built-in chain does not cover).
> **Carries** SIM-6, VIZ-6.

**`04-telegram-end-to-end.mdx` — One platform, done properly** · 14 min · N `C` / O `C` / A `—`
> BotFather to a working assistant: the token, the privacy setting that silently breaks groups, the home channel your cron jobs deliver to, and the settings worth changing.
> **Prereqs** `hermes/07-unattended/03-authorization-and-pairing`
> **Draws from** `[06]` §10 (the complete walkthrough: bot creation and token format, optional BotFather customisation, privacy mode plus the critical remove-and-re-add requirement, finding your user id, `.env` configuration, file handling and the supported-type list, webhook mode with its mandatory secret, proxy config, `/sethome` and the negative group-chat-id note, voice in and out including the ffmpeg requirement, large-file MTProto path, group mention configuration, private-chat and forum topics with skill binding, streaming transports, rich messages, slash-command access control, status indicator, command-menu priority, reactions, per-channel system prompts, the model picker, DNS-over-HTTPS fallback, notification volume, the verbatim exec-approval prompt, the verbatim `clarify` inline keyboard with its 600s timeout, the UX behaviours, the troubleshooting matrix, and session-key isolation); `[05]` §7 (the verbatim setup steps, `.env` block, wizard command, and the explicit instruction not to invent chat-bubble rendering).

**`05-event-driven-triggers.mdx` — When something else starts the work** · 12 min · N `—` / O `C` / A `C`
> Inbound webhooks: routes, signatures, filters, the zero-LLM delivery path, and the sentence that matters most — authenticated is not trusted.
> **Prereqs** `hermes/07-unattended/03-authorization-and-pairing`
> **Draws from** `[06]` §17 (the adapter's job, setup and health check, the full static route field list, prompt templating with dot notation and `{__raw__}`, the payload-filter operator set, script filters and their outcome table, the GitHub and GitLab walkthroughs, delivery notes, dynamic subscriptions and their hot reload with static precedence, all four HMAC schemes with the V2 replay window, rate limit, idempotency cache, body cap, and the full response-code table); `[07]` §5.1 (the same surface plus the verbatim `:::warning` — "HMAC validation authenticates the *sender*, not the *content*... The trust boundary is the agent's capability surface, not the input channel" — and the four recommended hardenings: sandbox the runtime, scope the toolset, keep approvals on, template narrowly; also the note that the agent can create its own subscriptions via the terminal tool guided by a skill).
> **Note** `skip` for Newcomer. A non-engineer with no repository to receive events from has nothing to apply this to, and saying so is more useful than a condensed version.

**`06-what-unattended-costs.mdx` — The bill, and where it comes from** · 13 min · N `C` / O `C` / A `C`
> Why the same question costs two to three times more through Telegram than in the terminal, what the fixed overhead actually is, and the five settings that change the number.
> **Prereqs** `hermes/07-unattended/02-the-gateway`, `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`
> **Draws from** `[04]` §1.4 pitfall 7 (the reported figures — 4 million tokens in two hours, 21,000 tokens for simple queries through messaging gateways — and the explanation that gateway overhead runs 2–3× CLI cost because platform state, history, skills, memory, and system prompt are re-sent every turn; the advice on cheap models, selective toolsets, and flat-rate plans for always-on deployments); `[04]` §5.3 (37M input tokens, 120K output, 600 requests in one day — day two of one reader's use); `[03]` §1 open issues (#4379's measured 73% fixed overhead, ~13.9K tokens per call); `[01]` §6 (prompt caching and its 1-hour TTL; the full auxiliary-model system as the mechanism for moving cheap work off the main model, including per-task fallback chains; `tool_loop_guardrails` with the explicit recommendation to set `hard_stop_enabled: true` for gateway, cron, and kanban workers; `agent.max_turns` and the grace call at the limit; credential pools); `[06]` §3 (the dashboard Analytics tab: tokens, cache-hit percentage, cost, per-model breakdown over 7/30/90 days); `[02]` §14 (`hermes insights --days --source`); `[06]` §1 COST OPTIMIZATION (the tiered smart-routing pattern, the 60–90% context-token reduction via output rewriting, the sub-$20/month deployments).

---

## 10. Module 8 — More than one agent

`content/guides/hermes/08-more-than-one-agent/` · arc: `multiplicity` · 5 lessons · 62 min

**Why it sits here.** Eighth, after unattended operation, because a fleet is
unattended work multiplied and every quality problem multiplies with it. The
module's first lesson exists solely to prevent a confusion, which is unusual and
deliberate — see §13.4. Profiles come after both orchestration models rather than
before them, because profiles read as "just another agent" until you have seen a
Kanban worker be a named profile with its own memory; at that point profiles stop
being a convenience and become the identity system the board depends on.

**After it, the reader can** choose between a function call and a work queue for a
given handoff and say why, run several isolated agents on one machine without
context bleed, and state the honest gate for moving from one agent to several.

**Deferred deliberately.** Mixture of Agents is *not* here, despite the name. It
is a model-selection strategy, not task orchestration; putting it in this module
would manufacture exactly the confusion lesson 1 exists to prevent. It lives in
`09/03` with an explicit disclaimer.

---

**`01-two-orchestration-models.mdx` — A function call and a work queue** · 10 min · N `C` / O `C` / A `C`
> Hermes has two entirely different ways to give work to another agent; here is the one question that tells you which you need.
> **Prereqs** `hermes/06-skills-and-the-loop/01-skills-as-procedure`, `hermes/07-unattended/02-the-gateway`
> **Draws from** `[07]` §4.1 (the docs' own eight-row comparison table across shape, blocking, child identity, resumability, human-in-the-loop, agents per task, audit trail, and coordination; the one-sentence distinction quote; the fact that they compose — a kanban worker can call `delegate_task`); `[06]` §13 (the Kanban-versus-`delegate_task` framing and the four conditions that select the board: work crosses agent boundaries, needs restart resilience, involves humans, or needs post-execution discoverability); `[03]` §1 (the correction to the widely repeated claim: v0.6.0 was Profiles and multi-instance, not multi-agent orchestration; the real lineage is v0.11.0 orchestrator role → v0.13.0 Kanban → v0.15.0 platform); `[04]` §5.4 (a widely-read community framework that states "native multi-agent orchestration shipped in v0.6.0" — reproduced as the error, with the release notes as the correction).
> **Carries** VIZ-4. Must present the version conflict rather than silently correcting it.

**`02-delegate-task.mdx` — Children that know nothing** · 14 min · N `S` / O `C` / A `C`
> Spawning subagents with their own context and terminal, why they start blank, the three-at-a-time default, and what a restart does to work in flight.
> **Prereqs** `hermes/08-more-than-one-agent/01-two-orchestration-models`, `hermes/04-tools-and-isolation/01-tools-and-toolsets`
> **Draws from** `[02]` §12 (the mechanism and the verbatim section heading "Subagents Know Nothing"; single and parallel-batch forms with the default of three concurrent; the requirement to pass everything via `goal` and `context`; the crucial orchestration distinction that top-level calls run asynchronously in the background while `role="orchestrator"` children wait synchronously; flat-by-default nesting and `max_spawn_depth`; tool inheritance so a child can never exceed the parent; `ThreadPoolExecutor` concurrency with results sorted by task index; no wall-clock timeout by default and the optional `child_timeout_seconds` floor of 30s; the `/agents` overlay and the live per-task logs; durability — completion events stored in `state.db` before publishing, but process restarts do not resume running children, which are marked `unknown`, and the explicit recommendation to use `cronjob` or `terminal(background=True)` when durability matters; the full `delegation:` config block; the `delegate_task`-versus-`execute_code` distinction; lifecycle and interrupt behaviour); `[05]` §5 (verbatim tool-call syntax for single, batch, and orchestrator forms; the verbatim live-log path and `tail -f` invocation; the verbatim config block; the leaf-blocklist text; the explicit instruction that the `/agents` tree has no published rendered frame and must not be invented); `[01]` §6 (parallel subagents share one Docker container).
> **Carries** SIM-7. Must present the leaf-blocklist conflict: three different lists appear across `[02]` §12 and `[05]` §5.

**`03-the-kanban-board.mdx` — A board agents can actually finish work on** · 16 min · N `—` / O `C` / A `C`
> Durable tasks in SQLite, named workers claiming them, heartbeats and reclaim, decomposition, and the audit trail that outlives every conversation.
> **Prereqs** `hermes/08-more-than-one-agent/01-two-orchestration-models`, `hermes/07-unattended/02-the-gateway`
> **Draws from** `[07]` §4.1–4.13 (the opening definition quote; the two-front-doors design and the single backing store; the full data model — board, task with its seven statuses, link, comment, the three workspace kinds with the absolute-path requirement described as a confused-deputy escape vector, dispatcher with its 60s tick and failure limit, tenant as a soft namespace; multi-board commands and the board-resolution precedence including the env var the dispatcher sets so workers cannot see other boards; `hermes project` and the `bind-board` mechanics; the nine `kanban_*` worker tools and the three verbatim reasons they are tools rather than shell calls; the worker lifecycle with heartbeat cadence, the 4h stale timeout, protocol violations and the two synthetic pre-exit nudges; the orchestrator anti-temptation rule; dispatch, claim with its 15-minute TTL and PID-liveness check, decompose with auto mode and per-tick cap, specify, and swarm; parent/child promotion and the deterministic block-loop breaker; runs, the recommended metadata shape, the refusal to bulk-close with a summary, and reclaimed-run handling; the full three-cluster event reference including `respawn_guarded` reasons and `gave_up`; the dashboard/REST surface and the explicit security statement that `/api/plugins/` routes skip auth — "**Don't do that on a shared host**"; worker lanes as the extension contract and the note that non-Hermes CLIs are "not yet a paved path"; the deliberate single-host limitation; the release history); `[06]` §13 (the same surface from the user-guide page, plus the quick-start sequence and the `/kanban` slash command with auto-subscription notifications).
> **Note** `skip` for Newcomer. A durable multi-agent board is not a tool for a first deployment, and pretending otherwise is how `[04]` §3.3's data-loss incident happened.

**`04-profiles-and-projects.mdx` — Several agents on one machine** · 12 min · N `C` / O `C` / A `C`
> Profiles as the sanctioned isolation boundary — and the thing they conspicuously do not isolate.
> **Prereqs** `hermes/03-running-a-session/04-configuration-you-will-actually-touch`, `hermes/08-more-than-one-agent/01-two-orchestration-models`
> **Draws from** `[06]` §19 (what a profile isolates — config, API keys, memory, sessions, skills, gateway state; creation with `--clone` and `--clone-all`; command aliases, the `-p` flag, and sticky defaults; per-profile gateway services and the token locks that prevent duplicate bot-token use; the explicit statement that profiles do **not** sandbox filesystem access; shareable profile distributions); `[02]` §15 (profiles versus `HERMES_HOME`, full isolation with no shared memory or sessions, `hermes update` syncing skills across all profiles, no documented profile limit, `hermes backup` versus `hermes profile export` and exactly which one contains credentials); `[02]` §14 (the full `hermes profile` subcommand tree); `[07]` §4.4 (`hermes project` from the module docstring: a human-named workspace spanning folders with one primary repo, anchoring desktop session grouping, and the `bind-board` sync that points a board's `default_workdir` at the primary path); `[06]` §20 (the confirmation that `hermes project` has no documentation page at all); `[04]` §1.4 pitfall 6 (context bleed between work and personal use, and the warning that profiles are not a filesystem sandbox — use Docker for that); `[04]` §3.4 (the community fleet pattern: a folder per agent, each with its own `.env`, container, and repository).
> **Note** The `hermes project` half must be labelled as sourced from source code rather than documentation — see §20, gap 8.

**`05-when-not-to-scale.mdx` — The level you are actually ready for** · 10 min · N `C` / O `C` / A `C`
> A four-level progression with an honest gate on each, and the one sentence to remember before adding an agent.
> **Prereqs** `hermes/08-more-than-one-agent/01-two-orchestration-models`, `hermes/08-more-than-one-agent/04-profiles-and-projects`
> **Draws from** `[04]` §5.4 (the four levels with their explicit move-on gates, and the warning repeated verbatim across the piece: "every level multiplies whatever quality you've established at the level before it", plus "you do NOT want to automate slop"); `[04]` §1.3 (when to split agents — only for genuinely different permissions, secrets, or long-term memory — and the explicit warning against one mega-agent with excessive scope); `[04]` §1.10 (start with one agent; add containers only when the workload needs separate credentials or memory); `[04]` §3.3 issue #30151 (the Kanban `default_workdir` inheritance that led `_cleanup_workspace()` to `shutil.rmtree` a user's entire projects directory with no confirmation and no warning log — the concrete cost of scaling before understanding cleanup semantics); `[04]` §5.5 (the cross-source first-week pattern and the advice to review output daily for two weeks before tapering).

---

## 11. Module 9 — Extension and routing

`content/guides/hermes/09-extension-and-routing/` · arc: `extension` · 5 lessons · 69 min

**Why it sits here.** Ninth. Everything in this module changes what Hermes can
reach or how it decides, and none of it changes the model the reader now holds —
which is precisely why it comes late. MCP in particular is deferred from module 4
on purpose: it is a mechanism for acquiring tools written by strangers, and it is
only safe to teach to a reader who already understands toolset scoping, approval
gates, and credential filtering. The module ends with two deliberately broad
survey lessons — the other front doors, and the media surface — because their
content is real but shallow, and inflating each into its own module would be the
padding this guide exists not to do.

**After it, the reader can** wire an MCP server with a filtered tool surface,
write a plugin or a shell hook and know which of three hook systems they are
using, route models and auxiliary tasks deliberately, and describe every other
way into the same agent without mistaking any of them for a different product.

---

**`01-mcp-servers.mdx` — Tools from somewhere else** · 14 min · N `S` / O `C` / A `C`
> Stdio and HTTP servers, the filter that decides what the model can see, and the two directions this protocol runs.
> **Prereqs** `hermes/04-tools-and-isolation/01-tools-and-toolsets`, `hermes/03-running-a-session/04-configuration-you-will-actually-touch`
> **Draws from** `[02]` §3 (stdio, HTTP, and OAuth transport configs; the full config-key table including mTLS, idle and lifetime recycling, and `supports_parallel_tool_calls`; all four auth methods and where tokens are cached; the curated catalog and the verbatim claim that manifests are PR-reviewed before shipping; the tool-selection checklist flow and its fallbacks; startup discovery, registry registration, and the `notifications/tools/list_changed` refresh; the `mcp_<server>_<tool>` naming convention; per-server filtering with the rule that include wins over exclude; the full `hermes mcp` CLI and `/reload-mcp`; MCP sampling with its rate and round caps; `hermes mcp serve` exposing Hermes's own messaging capabilities to other clients via ten tools; the security posture — stdio subprocess env filtered to a safe baseline, config-level control of the model-visible surface); `[02]` §7 (the exact safe-baseline variable list and the credential-redaction patterns applied before errors reach the model); `[02]` §15 (MCP troubleshooting); `[04]` §1.5 (the community pattern of running Hermes as a specialised subagent behind Claude via MCP).

**`02-plugins-and-hooks.mdx` — Changing behaviour without forking** · 15 min · N `—` / O `C` / A `S`
> A plugin's contract, the three separate hook systems and which runs where, and the consent model with a gap in it.
> **Prereqs** `hermes/04-tools-and-isolation/01-tools-and-toolsets`, `hermes/06-skills-and-the-loop/01-skills-as-procedure`
> **Draws from** `[06]` §5 (general versus provider plugins; the five discovery sources and their override order; the sub-category directories; minimal structure and `plugin.yaml`; the full `PluginContext` capability list; the opt-in model and which categories bypass it; the plugin-hook event set; the tool schema and handler contract; env-var gating; pip distribution; `inject_message` and its CLI-only limitation; the config-v21 grandfathering migration; the interactive UI and the one-memory-provider/one-context-engine constraints); `[07]` §1.4 (the routing table that sends most needs somewhere other than a plugin; the caution that third-party-product plugins ship as standalone repos; the `register(ctx)` contract and the full documented `ctx` API including `register_tool(..., override=True)` as the only sanctioned way to shadow a built-in; `pre_llm_call` as the only hook whose return value matters, why it appends to the user message rather than the system prompt, and the 10,000-char spill to `hook_outputs/`; the thread-safe lazy-singleton utilities explicitly designed for the self-improvement fork; lazy-install gating; the five specialised plugin types; the four named common mistakes); `[07]` §5.2 (the three-system comparison table; the gateway hook directory contract and its nine-event catalogue with context keys; the full plugin-hook event list including the transform hooks; the shell-hook config block, the JSON wire protocol with both accepted response dialects, and the consent model keyed on the exact command string — with the admission that "script edits are silently trusted" and that `hermes hooks doctor` flags mtime drift to catch it; the three bypasses required for non-TTY contexts; the `hermes hooks` CLI; the ordering rule that plugin hooks win ties); `[06]` §15 (the shell-hook subset and its allowlist file).

**`03-choosing-and-routing-models.mdx` — Which model, for which part of the work** · 15 min · N `S` / O `C` / A `S`
> Routing, fallbacks, credential pools, reasoning effort, the auxiliary slots that keep cheap work off your main model, and Mixture of Agents — which is not multi-agent orchestration.
> **Prereqs** `hermes/02-standing-it-up/02-choosing-a-provider`, `hermes/07-unattended/06-what-unattended-costs`
> **Draws from** `[01]` §6 (the full auxiliary-model system: the universal per-task pattern, the nine task slots with their timeouts, the thirty-odd available auxiliary providers, the option-precedence rule, per-task fallback chains walked in order on rate-limit/timeout/payment errors, the OpenRouter routing extras and the explicit note that main-agent routing does not propagate to auxiliary tasks, the legacy env vars and the config-only keys; reasoning effort with its eight levels, per-model overrides, spelling-tolerant matching, and four-level resolution priority; tool-use enforcement and its three injected layers; credential-pool strategies; prompt caching and its TTL options); `[02]` §10 (provider routing sort options and the `:nitro`/`:floor` suffixes, fallback provider lists, the Pareto code router and `min_coding_score`); `[07]` §3 and `[06]` §14 (MoA as a virtual model provider; the seven-step per-turn mechanics including reference models running without tool schemas; the full config block; `reference_max_tokens` as the latency lever; the three `fanout` cadences and the July 2026 default change from `per_iteration` to `user_turn`; `privacy_filter` levels and the always-on credential masking; per-slot reasoning effort; `save_traces`; the CLI; the one-shot `/moa` and why it is deliberately not a model switch; the HermesBench figures 0.8202 / 0.7607 / 0.7412; how caching is preserved by appending below the stable prefix; the constraints — no recursive presets, one reference failure does not abort the turn, and the multiplication of model calls).
> **Note** Opens by stating what MoA is not, because "mixture of agents" reads as task orchestration and is not.

**`04-the-other-front-doors.mdx` — Dashboard, desktop, editor, HTTP** · 12 min · N `S` / O `S` / A `S`
> Four other ways into the same agent, what each is genuinely for, and the two facts among them that change your threat model.
> **Prereqs** `hermes/07-unattended/02-the-gateway`, `hermes/03-running-a-session/04-configuration-you-will-actually-touch`
> **Draws from** `[06]` §3 (the web dashboard: launch and flags, prerequisites, machine-level multi-profile behaviour, the page inventory, the REST surface, and — the load-bearing part — the auth gate that engages on non-loopback binds, its fail-closed behaviour when no provider is registered, the three provider types with their token TTLs and rate limits, the cookie set, and the `dashboard-auth.log` audit trail); `[07]` §4.10 (the countervailing fact: the dashboard's auth middleware *skips* `/api/plugins/` routes by design, so binding non-loopback exposes every plugin route including Kanban's with no auth); `[06]` §18 (the desktop app: what it adds, the per-session YOLO toggle in the status bar, repository discovery config, backend resolution order, the remote-backend connection path and its explicit "put it behind a VPN" warning, the uninstall tiers, the plugin system); `[06]` §7 (ACP: the `hermes-acp` toolset and what it deliberately excludes, the three editor configurations, the four approval tiers with the reasoning behind `allow_session` as the editor default, and `HERMES_ACP_SKIP_CONFIGURED_MCP`); `[06]` §8 (the API server: the OpenAI-compatible surface, bearer auth required on *all* deployments including loopback, the Runs and Jobs and Sessions APIs, `X-Hermes-Session-Key` for memory scoping, the 100-response LRU limit and the no-file-upload limitation, multi-user setup via per-profile ports, proxy mode).
> **Note** This is a survey by design — see §13.5. It is the lesson that keeps ACP and the API server from each becoming a module they do not deserve. The two governance facts (dashboard fail-closed auth; the plugin-route bypass) are repeated in `10/01` and `10/03` because a reader on the Architect track may reach those before this.

**`05-voice-vision-and-the-browser.mdx` — Giving it eyes, ears, and a browser** · 13 min · N `C` / O `S` / A `S`
> The I/O modalities bolted onto the same loop: a voice pipeline that can run free and offline, image input and generation, and a browser that reads accessibility trees rather than pixels.
> **Prereqs** `hermes/04-tools-and-isolation/01-tools-and-toolsets`, `hermes/07-unattended/02-the-gateway`
> **Draws from** `[02]` §4 (the STT → LLM → TTS pipeline; activation in CLI, messaging, and Discord voice channels; the STT and TTS provider tables with latencies and the local → groq → openai fallback order; install extras and system dependencies; sentence-by-sentence streaming TTS; barge-in and how the agent is told it was interrupted; the 26-phrase hallucination filter; two-stage silence detection with its exact thresholds; the voice config block; the zero-cost local path requiring no API keys); `[01]` §7 (vision and clipboard image paste; image generation via FAL with its eleven named models; the ten TTS provider options); `[01]` §6 (the full TTS provider configuration and the speed hierarchy); `[06]` §2 (the Tool Gateway's nine image-model ids and the per-tool `use_gateway` precedence); `[06]` §6 (browser automation: accessibility trees with `@e1`-style refs; the six backends; the full env-var and YAML surface; the tool list; hybrid routing that spawns a local Chromium for private addresses while public URLs go to the cloud provider; the 15,000-char snapshot cap and its summarisation; session lifecycle and recording retention; stealth and SSRF behaviour; and the limitations — no file downloads, `/browser connect` is CLI-only); `[06]` §1 GENERAL (the blind developer's NVDA translator addon, and the accessibility story from the reader who cannot type well — voice as access, not novelty).

---

## 12. Module 10 — Deployment and governance

`content/guides/hermes/10-deployment-and-governance/` · arc: `judgement` · 6 lessons · 79 min

**Why it sits here.** Last, and it is the Architect's destination rather than an
appendix. Everything in this module is a *consolidation* of controls the reader has
already met in situ: the checklist assembles them, the secrets lesson draws the
boundary they all sit on, the audit lesson inventories what evidence exists, the
incident lesson shows what happens when the controls are absent, and the closing
lesson is permission to say no. A governance module placed second would have been
a list of settings for mechanisms the reader had not seen; placed tenth, it is a
review. The Architect who needs it earlier is served by a named spine (§19.3)
rather than by moving the module.

**After it, the reader can** harden a deployment against the documented threat
model, say precisely which artefacts constitute an audit trail and which questions
have no answer, recount the real incidents accurately, and write a defensible
internal position on where this agent may and may not be used.

---

**`01-the-deployment-checklist.mdx` — Hardening a real deployment** · 12 min · N `S` / O `C` / A `C`
> The ten-item checklist from the docs, worked through with the command or key that implements each, plus the five additions the community learned the hard way.
> **Prereqs** `hermes/04-tools-and-isolation/03-execution-backends-and-isolation`, `hermes/07-unattended/03-authorization-and-pairing`
> **Draws from** `[02]` §7 (the verbatim ten-item deployment checklist; API-key hygiene including `chmod 600`; network isolation via a separate machine and the SSH backend with credentials in `.env` rather than `config.yaml`; cross-session isolation and cron path-traversal hardening; working-directory validation); `[01]` §6 (`terminal.cwd`, resource caps, `tool_loop_guardrails` with `hard_stop_enabled: true` for unattended contexts); `[02]` §7 (`approvals.cron_mode: deny`); `[04]` §1.2 (the practitioner checklist: restrict the filesystem to one project directory first, dedicated bot token plus allowlist, keys in env or secret storage and never in chat, read-only workflows before write access, containers for experimental automation, monthly release-note review); `[04]` §1.10 (documenting VPS credentials per agent when running more than one); `[06]` §3 and `[07]` §4.10 (the dashboard bind and the plugin-route auth bypass, restated as checklist items).

**`02-secrets-and-egress.mdx` — Where the credentials are, and what the proxy does not cover** · 15 min · N `—` / O `C` / A `C`
> Every place a secret can live, what each execution surface can see, and a credential-substitution firewall documented as carefully by what it fails to protect as by what it does.
> **Prereqs** `hermes/04-tools-and-isolation/03-execution-backends-and-isolation`, `hermes/03-running-a-session/04-configuration-you-will-actually-touch`
> **Draws from** `[02]` §7 (the environment and credential isolation rules per surface — `execute_code` blocking variables by name pattern, local terminal blocking Hermes infra vars, Docker passing nothing by default, Modal mounting credential files, MCP subprocesses stripped to a safe baseline; skill-declared env vars and credential files with their mount semantics; MCP credential redaction patterns; the always-blocked credential stores); `[02]` §9 (the Portal claim that the refresh token at `auth.json` is the only credential on disk, with short-lived JWTs minted per request); `[03]` §1 (v0.19.0's Bitwarden/1Password `SecretSource` plugin interface); `[02]` §14 (`hermes secrets bitwarden` surface); `[07]` §6.1 (the whole egress lesson: why the sandbox normally holds real keys and the exfiltration path that motivates the feature; iron-proxy's pinned version, checksum verification, and TLS termination via a local CA; the Docker-only limitation; the verbatim governance framing about the trusted-proxy boundary; the default allowlisted upstream hosts; the full SSRF deny-CIDR list including the IPv4-mapped-IPv6 dual-stack bypass it closes; the auth schemes covered and the explicit statement that Bedrock SigV4 and Vertex service accounts are *not* covered so the isolation guarantee is incomplete for them; the CLI; Bitwarden rotation semantics; the bind policy; and the full two-column statement of what it protects against and the seven things it does not — host compromise, CA-key theft or endpoint hijack, raw-socket bypass, mounted credential files, exfiltration to an allowlisted host, uncovered providers, and in-memory secret recovery; the state directory with its file modes and the note that the audit-log path is pre-created but stays empty on the pinned binary); `[07]` §6.2 (`hermes proxy` as an entirely different, inbound feature — named here so the two are never confused).
> **Carries** VIZ-5.

**`03-the-record-what-is-auditable.mdx` — What Hermes writes down** · 14 min · N `—` / O `S` / A `C`
> An inventory of every durable artefact an autonomous run leaves behind, and an honest list of the questions none of them answer.
> **Prereqs** `hermes/06-skills-and-the-loop/07-the-curator`, `hermes/08-more-than-one-agent/03-the-kanban-board`, `hermes/07-unattended/01-scheduled-work`
> **Draws from** `[02]` §1 (`state.db` with FTS5 as the complete session record, and lineage across compressions); `[02]` §11 (cron's `executions.db` ledger with its five states, and per-run output files under `cron/output/{job_id}/{timestamp}.md`); `[02]` §12 (delegation completion events persisted to `state.db` before publishing, the append-only per-task live logs with their `manifest.json`, and the durability gap — running children are marked `unknown` after a restart); `[07]` §2.5 (the curator's per-run `run.json` and `REPORT.md` including the explicit rename map, `.usage.json` telemetry, and the pre-run tar.gz backups that make every pass reversible); `[07]` §2.2 (the deliberate *absence* of a record: the review fork is barred from writing to `state.db`, so its reasoning is not in the session transcript by design — the fix for the curator-takeover failure is also an audit gap, and the lesson must say both); `[07]` §4.8–4.9 (the `task_runs` attempt history, structured `metadata` handoffs, and the append-only `task_events` table with its full three-cluster event vocabulary — the strongest audit artefact in the system); `[07]` §6.1 (`iron-proxy.log` holding per-request records today and the reserved-but-empty `audit.log`); `[06]` §3 (`dashboard-auth.log` as JSON lines with sensitive fields redacted; the Logs and Analytics tabs); `[02]` §14 (`hermes logs` with its named log set, and `hermes debug share` with its redaction options); `[03]` §1 open issues (#11692 — proving which skill version produced which output is an acknowledged unsolved problem).
> **Note** The Architect's payoff lesson. It is the one place the guide answers "can this be audited" with a list rather than an adjective.

**`04-failure-modes-and-incidents.mdx` — What has actually gone wrong** · 14 min · N `S` / O `C` / A `C`
> Three CVEs, one architectural audit, one nation-state-adjacent misuse, one deleted projects directory, and a comparison industry that reported none of it.
> **Prereqs** `hermes/02-standing-it-up/04-blast-radius-before-you-continue`, `hermes/04-tools-and-isolation/04-approvals-in-depth`
> **Draws from** `[04]` §3.3 (CVE-2026-7396, CVE-2026-7397, and CVE-2026-6829 with their CVSS scores, affected files, versions, and fixes; @Anic888's April audit finding regex-bypassable command detection, unrestricted reads of SSH keys and token caches, container deployments shipping with all approval checks disabled by default, persistent skill files enabling post-session execution, and nine further high-severity findings; CSA's top-line lesson that "the more consequential risks in both frameworks are architectural, not implementation bugs"; the enterprise mitigations they recommend; the Thailand Ministry of Finance case in full — the HiveServer2 initial vector unrelated to Hermes, YOLO mode used to remove approvals, the reconnaissance the agent then ran autonomously, the 575 result folders on an exposed staging server, the attribution caveats, and the analytical takeaway that agent automation scaled routine post-exploitation work rather than discovering anything novel; issue #30151's root cause in `_cleanup_workspace()`); `[04]` §2.4 and §Facts-uncertain (the comparison piece claiming "no publicly documented CVEs through May 2026", dated the same month as the CSA note that documents three — presented as a demonstrated failure of secondary sources); `[04]` §5.3 (an agent hallucinating that it had completed a task); `[03]` §1 (the sweeper bot's three permitted auto-close reasons, as evidence of how issue volume is actually managed at 25,000 open items).

**`05-keeping-it-running.mdx` — Diagnosis, backup, rollback, update** · 13 min · N `C` / O `C` / A `S`
> The five commands to run when something breaks, the snapshot system that is off by default, and what `hermes update` does to your machine.
> **Prereqs** `hermes/03-running-a-session/04-configuration-you-will-actually-touch`, `hermes/07-unattended/02-the-gateway`
> **Draws from** `[02]` §14 (`hermes doctor [--fix]`, `hermes status [--all|--deep]`, `hermes dump`, `hermes logs` with its named logs and filters, `hermes debug share`, `hermes backup` and `hermes import`, `hermes checkpoints`, `hermes security audit` against OSV.dev); `[01]` §1 (`hermes doctor`, `hermes config check`, `hermes config migrate` as the documented troubleshooting trio); `[01]` §6 (the `updates:` block — `pre_update_backup` modes, `backup_keep`, and non-interactive local-change handling; git installs auto-stashing dirty tracked files); `[06]` §9 (the fact that Docker installs do not support `hermes update` at all); `[06]` §16 (checkpoints in full: opt-in by default since v2, the shared shadow git store that never touches the project's `.git`, the trigger list across file tools and destructive terminal commands, one checkpoint per directory per turn, the `/rollback` command family including `diff` and single-file restore, the CLI, the config defaults, the restore mechanism that also undoes the last conversation turn, and the seven safety guards including skipping `$HOME` and directories over 50,000 files); `[02]` §7 (the supply-chain advisory scanner running at startup, doctor, and gateway start, with `--ack` persistence; lazy installs and their four guarantees plus `security.allow_lazy_installs`); `[02]` §15 (the troubleshooting catalogue by category).

**`06-when-not-to-use-hermes.mdx` — Where it should not be trusted** · 11 min · N `C` / O `C` / A `C`
> The fit criteria, the limits that are structural rather than temporary, and what a defensible internal position looks like.
> **Prereqs** `hermes/10-deployment-and-governance/01-the-deployment-checklist`, `hermes/10-deployment-and-governance/04-failure-modes-and-incidents`, `hermes/06-skills-and-the-loop/08-keeping-it-from-getting-worse`
> **Draws from** `[04]` §1.7 (the four fit criteria repeated across operator sources — the task is repetitive but not fully structured, the data is safe to expose to a model, the output is easy for a human to review, the time saved is measurable — and the explicit statement that the business case is weaker outside them); `[04]` §2.1–2.6 (the Hermes-versus-OpenClaw framing used as a lens rather than a verdict, the choose-which synthesis, and the hybrid suggestion); `[07]` §4.12 (Kanban's deliberate single-host limitation, quoted); `[03]` §1 open issues (the multi-tenancy cluster — #34352, #9514, #10143 — as evidence that running one Hermes for several humans has no supported answer; the token-overhead cluster; 25,052 open items); `[02]` §15 (one WhatsApp number cannot run multiple agents; profiles do not share bot tokens); `[04]` §Facts-uncertain (the general caveat that this whole content ecosystem is time-stamped snapshots rather than durable facts); `[02]` §14 (`hermes claw migrate` — named in one line as the exit path from OpenClaw, and not taught).

---

## 13. The hard cases, decided

### 13.1 Where the self-improvement loop goes

**Decision: module 6 of 10, split across four lessons (`06/05`–`06/08`), positioned
after skills-as-artefact and before unattended operation.**

The tension is real in both directions. Too early and the reader has no skills to
improve — they watch a file get written and have no idea what the file does, so
"it improves itself" is received on faith, which is exactly the credulity this
guide exists to disrupt. Too late and it becomes a footnote to the thing they
came for.

Three constraints resolve it:

1. **The loop's unit of work is a SKILL.md.** `[07]` §2.3's preference order is
   unreadable — "patch a currently-loaded skill" versus "add a support file under
   an existing umbrella" — to anyone who has not read a SKILL.md and does not know
   what `references/` is for. So `06/01`–`06/04` must precede it. That fixes the
   lower bound.
2. **The loop's failure mode is worse unattended.** The anti-capture list in
   `[07]` §2.3 exists because a captured negative claim "hardens into refusals the
   agent cites against itself for months after the actual problem was fixed." A
   reader who deploys to cron and a messaging gateway before understanding this
   will accumulate self-imposed constraints with nobody reading the diffs. So it
   must precede module 7. That fixes the upper bound.
3. **The loop can be *shown* long before it is *named*.** `01/01` includes the
   first, unexplained sight of a skill file being written — no vocabulary, no
   mechanism, just the artefact appearing. The reader carries that image for five
   modules. This is design.md's `strike`/`annotate` world and PRODUCT.md principle
   3 doing real pedagogical work: the reader watches a loop close in lesson one
   and is handed the vocabulary in lesson thirty-one.

Between those bounds, module 6 is the only slot. It also lands at the guide's
literal centre, which is where the centrepiece belongs.

**Rejected alternative.** Making it module 2 — the "lead with the differentiator"
instinct. Rejected because the differentiator is not the claim, it is the
mechanism, and the mechanism is four cooperating code paths whose distinctions
(`[07]` §2: nudge counter, review fork, editorial prompt, curator) are meaningless
without the artefact they operate on. A module-2 version would have to be
impressionistic, and an impressionistic account of a self-modifying system is
precisely what the corpus shows secondary sources already producing.

**Also rejected.** Splitting the loop across modules — mechanism in 6, curator in
10 as "governance". Rejected because the curator is the *answer* to the loop's
accumulation problem; separating them leaves the reader with a problem and no
resolution for four modules, and leaves the Architect with a maintenance pass
whose purpose they cannot see.

### 13.2 Security and isolation: standalone or threaded

**Decision: both, on purpose — threaded as mechanism, consolidated as governance,
with one early anchor and one named early path.**

A standalone security module fails one audience or the other whichever slot you
choose. Early, it teaches `docker_forward_env` before terminal backends exist and
the authorization chain before the gateway exists; readers skip it and do the
dangerous thing anyway. Late, the Newcomer has already pointed an agent at their
home directory. So the material is placed three ways:

**(a) One early anchor: `02/04-blast-radius-before-you-continue`, core on all three
tracks.** Positioned at the exact moment the reader first has a working agent and
can therefore first hurt themselves. It carries only what is actionable before any
configuration exists: the docs' own warning that the agent has your user's
filesystem access, the always-blocked paths, the fact that smart approvals are on
by default, the hardline blocklist that nothing overrides, and the two documented
incidents told as stories. It is deliberately narrative rather than
configuration-heavy, because its job is to install caution, not settings.

**(b) In situ, wherever the mechanism lives.** Isolation backends and approvals in
module 4 because that is where execution is taught. Trust levels and the skill
scanner in `06/03` because that is where third-party code enters. The
authorization chain in `07/03` and "authenticated is not trusted" in `07/05`
because that is where strangers reach the agent. Credential filtering in `09/01`
because that is where MCP subprocesses spawn. This is not diffusion — it is the
recognition that security is a property of each subsystem rather than a topic.
Teaching it apart from the subsystem is how you produce readers who can recite
`approvals.mode` and still run `--yolo`, which is the failure `[04]` §3.3
documents at a national ministry.

**(c) Module 10 as consolidation, not introduction.** The checklist, the credential
boundary, the audit inventory, the incident catalogue, and the refusal. Every
control in it has already been met once; module 10 assembles them into a position
you could defend in a meeting.

**And for the Architect who needs it early:** §19.3 defines a nine-lesson
**control-review spine** — `01/01`, `01/02`, `02/04`, `04/03`, `04/04`, `06/05`,
`06/06`, `10/02`, `10/03` — at 113 minutes, which skips installation entirely and
is a legitimate first pass. That is how "the Architect needs it early" is honoured
without duplicating content or restructuring the guide around one track.

**Rejected alternative.** A dedicated module 2 titled "Security". Rejected on both
grounds above, and on a third: it would let the other two tracks treat security as
a module they had completed.

### 13.3 The 262 user stories

**Decision: a browsable appendix, plus a strictly rationed in-lesson device. Never
their own module.**

`[06]` §1 is the highest-density page in the corpus — 262 attributed stories across
15 categories from 11 sources — and it is the best evidence in the whole research
pass *that* people run this thing successfully. It is also nearly useless as
instruction: stories are outcomes without procedures. Fifteen categories of them
would produce a listicle module, which is exactly what a neighbouring guide would
build and what this one should not.

So:

- **Appendix** at `/hermes/appendix/field-notes` — the full set, filterable by
  category and by which lesson's mechanism each story exercises. Not a lesson: no
  duration, no track relevance, no place in progress. It is a reference surface,
  and treating it as one is the honest classification.
- **In-lesson device**: a `<FieldNote>` component surfacing **one** attributed
  story at the exact point its mechanism is taught, with platform, handle, and
  date. **Cap of one per lesson**, and only where the story is *evidence for a
  claim the lesson is already making*. Otherwise it is decoration, and design.md
  bans decoration by name.
- **Assignments already made**: the measured 73%-fixed-overhead analysis in
  `07/06`; the audit of 129 sessions finding 112 with approval-gate violations in
  `04/04`; the $0.014-per-night autonomous dream cycles in `07/01`; the blind
  developer's NVDA translator addon in `09/05`; the printing-factory task-centric
  memory rebuild in `05/03`; the self-improving skill-audit skill on a cron job in
  `06/08`; "one month with Hermes: don't build the whole machine on day one" in
  `08/05`; the k8s-cluster-over-laptop deployment in `10/01`.
- **Required hedge**: the page states 262, and `[06]` §Facts-uncertain records that
  stories are visibly cross-listed across categories, so per-category counts are
  approximate. The guide may cite the figure only with that caveat attached.

**Rejected alternative.** A "what people actually do with it" module early on, as
motivation. Rejected because motivation-by-anecdote is what the SEO content mills
in `[04]` §4 already supply in volume, and because a reader who has not yet
installed anything cannot distinguish an impressive story from an impossible one.

### 13.4 Kanban boards versus `delegate_task`

**Decision: a dedicated framing lesson before either mechanism, then one lesson
each, taught in deliberately different vocabulary, each closing with the same
one-line contrast.**

These are two genuinely different orchestration models that share a problem
domain, and `[07]` §4.1 is unusually clear about the difference: RPC fork-join
versus a durable message queue with a state machine. The confusion risk is high
because both are reached by asking "can another agent do this", and the
consequences of confusing them are asymmetric — a reader who expects durability
from `delegate_task` will lose work on a restart (`[02]` §12: running children are
marked `unknown`), and a reader who expects a function call from Kanban will be
baffled by a dispatcher tick.

The three devices that keep them apart:

1. **`08/01-two-orchestration-models` teaches the shape before either
   implementation**, using the docs' own eight-row comparison table, and installs
   the single discriminating question the reader will actually use at the keyboard:
   *does this handoff need to survive a restart and be readable by a human?* Yes →
   board. No → call. Everything else is detail.
2. **Different vocabulary, held consistently.** The delegation lesson talks about
   *children*, *goals*, and *context*; the Kanban lesson talks about *workers*,
   *tasks*, *claims*, and *runs*. The corpus already uses these words this way;
   the discipline is refusing to blur them for variety's sake.
3. **They compose, and the guide says so twice.** `[07]` §4.1 notes a Kanban worker
   can call `delegate_task` internally. Teaching that resolves the anxiety that
   picking one forecloses the other, which is what drives readers to conflate them
   in the first place.

**Rejected alternative.** Teach only Kanban and mention delegation in passing, on
the grounds that Kanban is the more capable system. Rejected because
`delegate_task` is not opt-in: the model reaches for it, and a reader who has not
met it will one day have three concurrent children, one shared Docker container,
and no idea why a restart lost them.

**Also rejected.** Separate modules. Rejected because it makes it possible to learn
one and never meet the other, which is the exact outcome the framing lesson exists
to prevent.

### 13.5 What is deliberately excluded

The test applied throughout: **does this teach a mechanism the reader will reason
with, or is it a surface they can look up?** Mechanisms earn lessons. Surfaces earn
cheatsheet rows. Cosmetics earn nothing.

**Excluded entirely**

| Excluded | Why |
|---|---|
| **Petdex pets** (`hermes pets`) — `[02]` §14 | Cosmetic. Teaches nothing and spends reader trust. Not even named. |
| **Batch trajectory generation, `batch_runner.py`, trajectory compression, RL training** — `[07]` §2.7 | Real, well documented, and *not part of the running agent*. It is offline dataset tooling for training models — a different job from operating one. `[07]` itself records that no source confirms it is used in any published training run. One sentence in `01/03` names it and says why it is out. |
| **Per-platform messaging pages beyond Telegram** (19 others) — `[02]` §8 | One gateway process, one authorization chain, identical mechanics per adapter. The second platform is a lookup, not a lesson. Becomes Cheatsheet 5 (the verbatim capability matrix from `[05]` §7). |
| **Skills-catalogue enumeration** (~91 bundled + ~200 optional) — `[06]` §11, §12 | A list. `06/03` teaches how to search and judge instead. Becomes an appendix. |
| **Nous Portal prices** — `[03]` §6 | The corpus's figures are WebSearch snippets; direct fetch returned HTTP 429 twice. The guide names the tiers and prints no dollar amounts. See §20, gap 3. |
| **Nix/NixOS setup, Termux specifics, Windows-native feature gaps** — `[01]` §4, `[06]` §9 | Tier 2 / best-effort per the docs ("Breaks often due to node.js packaging woes"). Named in `02/01` via the platform-tier table so affected readers know where they stand; not taught. |
| **Domain integrations** — Home Assistant, Spotify, blockchain, finance, gaming, robotics skills — `[06]` §12, `[04]` §1.9 | The *pattern* (a skill wraps a CLI) is taught once in `06/01`. Two hundred instances of it are not a curriculum. |
| **Discord voice-channel permission integers and gateway intents** — `[02]` §4 | Pure reference. Cheatsheet only. |
| **`hermes claw migrate` / OpenClaw migration** — `[02]` §14 | One line in `10/06`. Relevant to a small population, mechanically uninteresting. |
| **`hermes lsp`, `hermes computer-use`, Atropos/RL environments** — `[02]` §14 | Named in `01/03`'s map, not taught. Peripheral surfaces with no bearing on the model. |
| **`htui` / `hgui` worktree dev helpers** — `[07]` §1.6 | Explicitly "developer shell-function conveniences, not shipped Hermes commands". Contributor material. |
| **Adding built-in tools and providers to the repo** — `[07]` §1.2, §1.5 | Both docs open by telling you not to: the plugin route and the custom-provider path cover the real need. `09/02` teaches plugins; the core-contribution path is out of scope for a guide about *using* Hermes. |

**Included but demoted to a paragraph inside `09/04`, not given lessons**

- **ACP / IDE integration** — `[06]` §7. Re-exposes the same agent through an
  editor. No new mechanism. Its one genuinely interesting idea — the four approval
  tiers and the reasoning for `allow_session` as the editor default — is worth a
  paragraph, not fourteen minutes.
- **API server** — `[06]` §8. Same reasoning. Its two load-bearing facts (bearer
  auth required even on loopback; 100-response LRU cap) go to Cheatsheet 1.
- **Web dashboard and desktop app** — `[06]` §3, §18. Feature tours in the docs.
  Their two governance-relevant facts — the auth gate's fail-closed behaviour, and
  `[07]` §4.10's finding that `/api/plugins/` routes skip that auth entirely — are
  pulled forward into `10/01` and `10/03` where they matter.

**Included but relocated so it is not mistaken for something else**

- **Mixture of Agents** — `[06]` §14, `[07]` §3. It is a model-selection strategy
  that reads like task orchestration. Putting it in module 8 would manufacture the
  confusion `08/01` exists to prevent, so it lives in `09/03` and that lesson opens
  by saying what it is not.

---

## 14. Simulation scenarios

Eight scripted replays. `[05]` rates each of its eight scenarios and marks four
things explicitly **UNKNOWN**; those four are prohibited rather than approximated,
and the prohibitions are listed at the end of this section. Every replay ships with
its fidelity stated on the surface, per decision 006, and as a complete semantic
transcript a screen reader can read straight through, per PRODUCT.md's
accessibility commitments — playback is the enhancement.

Fidelity vocabulary is `[05]`'s own: **VERBATIM** (every rendered string is quoted
from a primary source), **PARAPHRASED** (behaviour is documented but its rendering
is not, so the replay is a reconstruction and says so), **UNKNOWN** (no source —
must not be rendered).

---

**SIM-1 · `first-run`** → `hermes/02-standing-it-up/03-first-run-and-what-good-looks-like`

*Must show:* the install one-liner, the shell reload, `hermes`, the three setup
modes as a choice, a first prompt answered, one tool call appearing in the feed,
and the four-item success checklist being satisfied one line at a time.

*Fidelity ceiling:* **PARAPHRASED overall.** VERBATIM for the install block, the
three setup-mode descriptions, the `hermes setup` CLI-reference text, and the
success checklist — all quoted in `[05]` §1. **The banner is UNKNOWN**: `[05]` §1
records that the docs deliberately use an SVG figure instead of character art and
instructs that it not be fabricated. The replay renders a labelled placeholder
frame stating that the banner is not published as text. Interactive wizard prompt
strings beyond what is quoted must not be invented — the modes are presented as a
menu carrying a paraphrase badge.

*Why it exists:* it is the only replay a reader with no install can measure their
own first run against, and the honest gaps in it are themselves instructive.

---

**SIM-2 · `a-turn-in-full`** → `hermes/03-running-a-session/01-the-status-bar-and-the-context-budget`

*Must show:* the status bar with model, token count, context bar, cost, and
duration; spinner frames cycling; the tool-execution feed with three different
tools and their timings; the context bar crossing green → yellow; `/compress`
invoked; the `🗜️ 1` badge appearing afterwards.

*Fidelity ceiling:* **VERBATIM.** `[05]` §2 quotes the status bar, all three
spinner frames, all three tool-feed lines, the TUI status-line states, and every
badge exactly. `[01]` §5 supplies the colour thresholds and `[01]` §6 the
compression parameters.

*Why it exists:* the flagship. It is the highest-fidelity material in the corpus
and the single densest lesson-to-source match, so it carries the guide's claim that
the replays are sourced rather than art-directed.

---

**SIM-3 · `memory-fills-up`** → `hermes/05-what-it-knows/03-memory-the-two-files`

*Must show:* the memory block as the model receives it — the `═══` rule, the
`MEMORY (your personal notes) [67% — 1,474/2,200 chars]` header, entries separated
by `§`; an `add` that would exceed the cap; the full-memory error payload; the agent
consolidating with `replace` and retrying in the same turn; `💾 Memory updated` in
chat; and a closing annotation that the new entry will not appear in the prompt
until the next session.

*Fidelity ceiling:* **VERBATIM.** `[05]` §4 quotes the injection format, the error
JSON in full, and the notification strings. The frozen-snapshot rule is from
`[02]` §1.

*Why it exists:* it is the clearest possible refutation of the "three-layer memory
system" claim — the reader sees a character counter, not a vector store.

---

**SIM-4 · `the-skill-writes-itself`** → `hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork`

*Must show:* a long tool-heavy turn; the iteration counter advancing (as a margin
annotation, **not** as terminal output — it is internal state and is never printed);
the user-visible answer delivered *first*; the background review firing after it;
`💾 Skill 'foo' patched`; and the resulting SKILL.md diff, stoppable and
inspectable at the exact frame the file changes.

*Fidelity ceiling:* **VERBATIM** for the notification string, the SKILL.md format,
the `skill_manage` action names, and the file path (`[05]` §3). **PARAPHRASED, and
labelled as a reconstruction from source code**, for the internal counter and the
fork's lifecycle — `[07]` §2.1–2.2 is ground truth for the *behaviour* (it is read
from `agent/conversation_loop.py`, `agent/turn_finalizer.py`, and
`agent/background_review.py` at a pinned commit) but publishes no terminal
rendering. The distinction between "quoted from documentation" and "reconstructed
from source" must be visible on the replay, not buried in a footnote.

*Why it exists:* PRODUCT.md's stated differentiator — "stop on the exact moment the
agent writes a skill file for itself, inspect what it wrote, and step forward." This
is that moment. It is the one replay whose absence would make the guide ordinary.

---

**SIM-5 · `a-job-that-fires-at-nine`** → `hermes/07-unattended/01-scheduled-work`

*Must show:* the natural-language request; the `cronjob(action="create", …)` call it
becomes; `hermes cron list` rendering the job; the 60-second tick; and the delivered
message inside its wrapper, including the line "Note: The agent cannot see this
message, and therefore cannot respond to it."

*Fidelity ceiling:* **VERBATIM** for the three creation surfaces, the tool call, the
`cron list` table, the delivery wrapper, and the storage paths — all quoted in
`[05]` §6. The briefing *content* is verbatim from the docs' own daily-briefing
tutorial but is the authors' illustration rather than a captured run, and `[05]` §8
says so; the replay labels it as such.

*Why it exists:* the wrapper's last line is the most consequential sentence in cron
and the easiest to miss in prose. Seeing it arrive teaches the constraint.

---

**SIM-6 · `letting-someone-else-in`** → `hermes/07-unattended/03-authorization-and-pairing`

*Must show:* gateway startup log lines; an unknown user's message being denied; the
pairing code presented to them; `hermes pairing approve telegram XKGH5N7P` on the
owner's terminal; the same user's next message answered.

*Fidelity ceiling:* **VERBATIM** for the three gateway startup lines, the pairing-code
block, and the pairing CLI (`[05]` §7). **PARAPHRASED / UNKNOWN for the messaging
side**: `[05]` §7 states plainly that no screenshot content was fetched and
instructs that chat-bubble text not be invented. The messaging half therefore
renders as a labelled plain transcript, never as imitation Telegram UI.

*Why it exists:* the authorization chain ends in default-deny, which readers
disbelieve until they watch their own colleague get refused.

---

**SIM-7 · `three-children-and-no-memory-of-you`** → `hermes/08-more-than-one-agent/02-delegate-task`

*Must show:* a `delegate_task(tasks=[…])` batch of three; the immediate handle
return while the parent continues; `tail -f` against a live per-task log at the real
path; results arriving out of order but presented sorted by task index; one child
failing and the batch surviving it.

*Fidelity ceiling:* **VERBATIM** for the tool-call syntax (single, batch, and
orchestrator forms), the live-log path format and its `tail -f` invocation, the
config block, and the leaf-blocklist text — all in `[05]` §5. **PARAPHRASED with an
explicit prohibition for the `/agents` overlay**: `[05]` §5 says the tree view is
described in prose only, with no published frame, and instructs that box-drawing
output not be invented. The replay uses the guide's own diagram treatment for the
tree and states why it is a diagram rather than a capture.

*Why it exists:* "Subagents Know Nothing" is the fact readers most reliably fail to
internalise from prose. Watching a child receive nothing but `goal` and `context`
fixes it.

---

**SIM-8 · `the-approval-you-should-have-read`** → `hermes/04-tools-and-isolation/04-approvals-in-depth`

*Must show:* a terminal command matching a dangerous pattern; the four-option CLI
prompt; the consequence of choosing `always` (persisted to `command_allowlist` in
`config.yaml`); the same command under `--yolo` running unprompted with `⚠ YOLO`
visible in the status bar; and finally a hardline-blocklist command refused *even
under YOLO*.

*Fidelity ceiling:* **VERBATIM** for the option set `[o]nce [s]ession [a]lways
[d]eny`, the `⚠ YOLO` badge, the blocklist contents, and the rule "Hardline
blocklist still applies regardless of YOLO status" (`[02]` §7, `[05]` §2).
**PARAPHRASED** for the surrounding prompt wording, which is not quoted anywhere.
The Telegram variant *is* verbatim — `[06]` §10 quotes "⚠️ This command is
potentially dangerous (recursive delete). Reply "yes" to approve." — and is shown
alongside so the reader sees the same gate rendered on two surfaces.

*Why it exists:* three sequential facts that prose flattens into one — the gate
exists, you can turn it off, and one layer beneath it cannot be turned off. The
third is the only reassurance in Hermes's security model that survives a
misconfigured deployment, and the reader should see it hold.

---

### Prohibited replays

Four things `[05]` marks UNKNOWN, which therefore may not be built, no matter how
much a lesson would benefit:

1. **Literal banner ASCII art** — `[05]` §1. The docs use an SVG figure by explicit
   design and publish no character art.
2. **A rendered `/agents` subagent tree** — `[05]` §5. Described in prose; no frame
   published; the classic CLI prints a text summary and only the TUI draws a tree.
3. **Telegram (or any messaging) chat-bubble UI** — `[05]` §7. No screenshot content
   was fetched; behaviour is documented, appearance is not.
4. **Any replay presented as a captured recording** — `[05]` §8. No asciinema cast,
   session log, or animated demo exists anywhere in the repo, the docs, or the
   third-party sources checked. The repo's `assets/` holds one static `banner.png`.

A fifth, softer prohibition: **no third-party command may appear in a replay**.
`[05]` §8.5 caught Hermes Atlas publishing `hermes daemon start`, which is not in
the official CLI reference. Replays use the official surface only.

---

## 15. System visualizations

Six exploded technical plates, built to design.md's specification: 1px keyline,
prior state ghosted, one flat `--annotation` on the active part, 1:1 call-out boxes,
dashed leader arrows, oversized step numerals, `assemble` scroll-scrubbed. Diagrams
carry real text and accessible descriptions; they are never images of words.

Six rather than ten, and none of them one-per-module. A plate earns its build only
if it explains something prose cannot hold in one piece — usually a *simultaneity*
(several things true at once) or a *negative* (an arrow that does not exist).

---

**VIZ-1 · The system prompt, exploded** → `hermes/05-what-it-knows/01-what-is-in-the-system-prompt`

*Shows:* the ordered layers the model receives before the first user word — SOUL.md
in slot 1, the one project context file that won the first-match race, the memory
block with its character budget rendered as an actual budget, the skill index at
metadata-only, every tool schema, then the conversation. Overlaid: the cache
boundary, with everything above the tail marked as the cached prefix.

*Why it earns a plate:* it explains prompt-cache economics, the 73%-fixed-overhead
complaint, why progressive disclosure exists, why memory is a frozen snapshot, and
why nothing may mutate mid-conversation — five facts that are one picture and five
paragraphs. Nothing else in the guide has that ratio.

*Sources:* `[02]` §13 (prompt tiers), §5 (slot 1), §6 (project context assembly),
§1 (frozen snapshot), §2 (skill index cost); `[01]` §6 (caching, TTL breakpoints);
`[04]` §1.1 (10× read-versus-write); `[03]` §1 (AGENTS.md: caching is sacred, every
tool schema on every call); `[03]` §1 open issues (#4379).

---

**VIZ-2 · Memory: two files and an index** → `hermes/05-what-it-knows/03-memory-the-two-files`

*Shows:* three mechanisms as three separate objects rather than three layers —
`MEMORY.md` (2,200 chars) and `USER.md` (1,375) as bounded pages injected at session
start; `state.db` with its FTS5 index as an archive searched on demand; the optional
external provider as a bolt-on standing beside them, not beneath them.

*Why it earns a plate:* it is the guide's correction-of-the-record made visual. The
plate uses design.md's `strike` motion literally: the widely repeated three-layer
stack is drawn as the ghosted prior state, struck through, with the correct
arrangement resolving above it. That is the one place in the guide where the design
world and the factual claim are the same gesture.

*Sources:* `[02]` §1 (caps, storage, the comparison table, providers as optional);
`[05]` §4 (injection format, the comparison table verbatim); `[04]` §1.1, §1.4
pitfall 5 (the three-mechanism framing that gets compressed into "three layers");
PRODUCT.md positioning.

---

**VIZ-3 · The improvement loop, one turn at a time** → `hermes/06-skills-and-the-loop/05-the-nudge-and-the-review-fork`

*Shows:* the counter incrementing once per tool-loop iteration; the user-visible
response delivered; *then* the fork spawning; the fork's four isolation walls drawn
as actual barriers (tool whitelist, `_persist_disabled`, `_session_db = None`,
approval auto-deny); the write landing in `~/.hermes/skills/`; and — the plate's
real payload — **the arrow that does not exist**: nothing returns to the live
session, annotated with the curator-takeover failure that absence prevents. The
curator orbits the same store on a slower, separate cadence.

*Why it earns a plate:* it is the only way to show an ordering (answer first, review
second) and a negative (no path back into the session) in the same frame, and both
are load-bearing. The absent arrow is also the single most governance-relevant fact
in the loop, and it is invisible in prose.

*Sources:* `[07]` §2.1 (counter and trigger), §2.2 (fork mechanics, the four
isolation flags, the named root cause), §2.4 (the two self-improvement paths), §2.5
(curator cadence and scope).

---

**VIZ-4 · Two ways to hand off work** → `hermes/08-more-than-one-agent/01-two-orchestration-models`

*Shows:* side by side — `delegate_task` as a call stack (parent → three children →
join), with the restart line drawn *through* it as a cut that loses the children;
Kanban as a queue plus state machine (`triage → todo → ready → running →
blocked/done → archived`) with the dispatcher orbiting it, and the same restart line
drawn as a *reclaim* rather than a loss.

*Why it earns a plate:* the discriminating question is about restart behaviour, and
restart behaviour is the one thing a static comparison table states but cannot
demonstrate. Drawing the same event twice, with opposite consequences, is the whole
lesson.

*Sources:* `[07]` §4.1 (the comparison table, the one-sentence distinction), §4.2
(the state machine and dispatcher), §4.6–4.9 (claim, reclaim, promotion, events);
`[02]` §12 (async handles, orchestrator synchrony, the restart gap).

---

**VIZ-5 · Where the credentials are** → `hermes/10-deployment-and-governance/02-secrets-and-egress`

*Shows:* host and sandbox with the boundary between them; which secrets exist on
which side under each backend; the egress proxy substituting an opaque token for a
real key at the boundary; and — drawn in the same weight, not as a footnote — the
seven paths it does not cover.

*Why it earns a plate:* the egress feature's documentation is unusually honest about
its limits, and a plate that draws protections and gaps at equal weight is the
guide's whole posture in one image. It is also the plate an Architect will screenshot
into a risk review, which is a legitimate design goal.

*Sources:* `[02]` §7 (per-surface environment isolation, credential stores,
skill-declared vars and files); `[07]` §6.1 (the credential-substitution mechanism,
allowlist, SSRF CIDRs, covered auth schemes, the uncovered SigV4 and Vertex
providers, and the full does-not-protect list); `[07]` §6.2 (the distinct inbound
proxy, drawn once and dismissed so it is never conflated).

---

**VIZ-6 · The authorization chain** → `hermes/07-unattended/03-authorization-and-pairing`

*Shows:* six gates as a decision cascade terminating in **default deny**, with the
DM-pairing branch expanded to include its TTL, rate limit, pending cap, and lockout
threshold.

*Why it earns a plate:* it is small, and it is the one image that makes "if no
allowlists are configured, all users are denied" feel like a design decision rather
than a footnote.

*Sources:* `[02]` §7 (the check order and the verbatim warning, pairing limits);
`[06]` §10 (per-platform allowlist layers, guest mode).

*Cut first if scope demands.* The chain also reads well as an ordered list, so it is
the only plate here whose loss would cost comprehension rather than eliminate it.

---

## 16. Glossary

Forty-eight terms. The selection rule: a term earns an entry if it is **load-bearing
in a lesson** and either **misused in the wild** or **easy to confuse with a
neighbouring term**. Terms that are self-explanatory from their name are omitted;
padding a glossary is how it stops being consulted.

**Identity and context**

- **SOUL.md** — The agent's identity file, loaded from `HERMES_HOME` into slot 1 of the system prompt and never read from the working directory.
- **Context file** — A project-local instruction file (`.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`); exactly one loads per session, first match wins.
- **Context reference** — The `@` syntax that injects a file, folder, git diff, or URL inline into a message.
- **System prompt tier** — One of three assembly bands (`stable`, `context`, `volatile`) that determine what may change without breaking the prefix cache.
- **Prefix cache** — The stable head of the prompt that providers can cache; reading it is roughly ten times cheaper than writing it, which is why nothing may mutate mid-conversation.

**Memory and recall**

- **MEMORY.md** — Curated environment and project notes, capped at 2,200 characters (~800 tokens).
- **USER.md** — Curated facts about the user, capped at 1,375 characters (~500 tokens).
- **Memory target** — Which of the two files a `memory` tool call writes to: `memory` or `user`.
- **Frozen snapshot** — The rule that memory is read into the prompt once at session start; a write lands on disk immediately but reaches the model only next session.
- **Session search** — The `session_search` tool: an FTS5 full-text query over every stored session in `state.db`, returning raw messages with no summarisation.
- **`state.db`** — The SQLite database holding session metadata, message history, lineage, and the full-text index.
- **Memory provider** — An optional external backend (nine documented) that runs *alongside* the built-in files, never replacing them; one active at a time.
- **Compression** — The mechanism that summarises middle turns as the context limit approaches, protecting the first three and last twenty turns.
- **Lineage** — The parent/child relationship between sessions created by compression or resumption.

**Skills**

- **Skill** — A directory containing a required `SKILL.md`: YAML frontmatter plus markdown instructions, conforming to the agentskills.io standard.
- **agentskills.io** — The open skill format, originally developed by Anthropic and released as a standard, adopted by 42+ clients.
- **Skills Hub** — Hermes's own browsing and installation interface for skills; distinct from the standard it installs.
- **Tap** — A GitHub repository of curated skills registered as an installation source.
- **Trust level** — One of `builtin`, `official`, `trusted`, `community`, determining whether a scan finding blocks an install.
- **Progressive disclosure** — Three-level loading: metadata only, then full SKILL.md, then a named reference file.
- **Skill bundle** — A YAML file grouping several skills under one slash command.
- **Blueprint** — A frontmatter block that registers a skill as a *suggested* cron job; it never schedules itself.
- **`skill_manage`** — The agent-facing tool for creating, patching, editing, and deleting skills and their support files.
- **`/learn`** — The user-triggered path to a new skill, from a directory, URL, conversation, or pasted text. Not part of the autonomous loop.

**The improvement loop**

- **Nudge interval** — `skills.creation_nudge_interval` (default 10): tool-loop iterations, not user turns, before a skill review is queued.
- **Background review fork** — A daemon-thread copy of the agent spawned after the visible response, restricted to memory and skill tools, barred from writing to `state.db`.
- **Curator-takeover** — The named failure the fork's isolation prevents: its harness prompt leaking into the real session and the agent "becoming" the curator on the next turn.
- **Agent-created** — A three-part test (not bundled, not hub-installed, marked `created_by: agent`) satisfied only by skills the background fork created; it decides what the curator may touch.
- **Curator** — The slower maintenance pass over agent-created skills: deterministic `active → stale → archived` transitions always, opt-in LLM consolidation.
- **Pinned skill** — Exempt from curator transitions and from agent deletion; still receives content patches.
- **Usage telemetry** — `.usage.json`, tracking `use_count`, `view_count`, `patch_count`, timestamps, state, and pin flag per skill.

**Tools and containment**

- **Toolset** — A named group of tools that can be enabled or disabled as a unit, per platform or globally.
- **Narrow waist** — The design rule that every tool schema is sent on every API call, making a new core tool the most expensive possible extension.
- **Footprint ladder** — The escalation order for adding capability: extend existing code → CLI command plus skill → service-gated tool → plugin → MCP server → new core tool.
- **Terminal backend** — Where the agent's shell commands execute: `local`, `docker`, `ssh`, `singularity`, `modal`, or `daytona`.
- **Hardline blocklist** — A small set of commands refused unconditionally, unaffected by YOLO mode, `approvals.mode: off`, or headless cron.
- **`approvals.mode`** — `smart` (default; an LLM triages risk), `manual` (always ask), or `off`.
- **YOLO mode** — Auto-approval of dangerous commands, with a red banner and a `⚠ YOLO` status badge. The hardline blocklist still applies.
- **Tirith** — The pre-execution scanner for homograph URLs, pipe-to-interpreter patterns, and terminal injection. Silently skipped on Windows.
- **`HERMES_WRITE_SAFE_ROOT`** — An optional prefix allowlist restricting `write_file` and `patch` to named directories.
- **Checkpoint** — A snapshot in a shared shadow git store taken before a destructive operation; opt-in by default, restored with `/rollback`.

**Gateway and automation**

- **Gateway** — The single long-running process hosting every platform adapter, per-chat session routing, authorization, and the cron scheduler.
- **Adapter** — One platform's integration inside the gateway.
- **DM pairing** — The flow where an unknown user receives an 8-character code the owner approves from the CLI.
- **Cron tick** — The 60-second scheduler pass inside the gateway that starts a fresh agent session per due job.
- **No-agent job** — A scheduled script that runs without invoking the model at all; silent unless it produces output.
- **Webhook route** — A named inbound HTTP endpoint with its own secret, filters, prompt template, and delivery target.

**Multiple agents**

- **`delegate_task`** — The tool that spawns child agents with fresh context, inherited toolsets, and their own terminal; three concurrent by default.
- **Leaf subagent** — A child that cannot delegate further; the default. `role="orchestrator"` plus a raised `max_spawn_depth` is required to nest.
- **Kanban board** — A durable SQLite task board where named profiles claim and complete work; single-host by design.
- **Claim** — A worker's atomic lease on a ready task, reclaimed only if the worker's process has actually died.
- **Protocol violation** — A worker process exiting cleanly while its task is still `running`, having called neither `kanban_complete` nor `kanban_block`.
- **Profile** — A fully isolated Hermes instance — config, keys, memory, sessions, skills, gateway state — that does **not** isolate the filesystem.
- **Project** — A human-named workspace spanning folders with one primary repo; optionally bound to a board to set its default working directory.

**Models and routing**

- **Auxiliary model** — A per-task model slot (vision, compression, review, curator, decomposer, and others) that keeps cheap work off the main model.
- **Mixture of Agents** — A virtual provider where reference models advise and an aggregator writes the response and calls the tools. Not task orchestration.
- **Credential pool** — Several keys for one provider, rotated by a named strategy on rate limits or failure.
- **Tool Gateway** — Nous Portal's routing of search, image, TTS, and browser tool calls through Nous infrastructure instead of your own keys.
- **Egress proxy** — `hermes egress` / iron-proxy: a host daemon that swaps an opaque sandbox token for a real upstream credential, so the sandbox never holds a key.

---

## 17. Cheatsheets

Nine, printable, and load-bearing rather than decorative: **the cheatsheets exist so
the lessons do not have to be reference material.** Every duration in §19 depends on
this division holding — `03/04` is twelve minutes instead of thirty precisely because
the 150-field configuration surface lives in Cheatsheet 2.

| # | Cheatsheet | Contents | Sources |
|---|---|---|---|
| 1 | **The command surface** | Every `hermes` command grouped as the reference groups them, with deprecated commands marked (`hermes login`/`logout` → `hermes auth`) and the doc-level naming conflict flagged (`hermes portal info` vs `status\|open\|tools`). Includes the API server's bearer-auth-always rule and its 100-response LRU cap, pulled out of `09/04`. | `[02]` §14; `[06]` §8 |
| 2 | **Configuration keys that matter** | The ~50 keys a real deployment touches, each with its default, its file (`config.yaml` or `.env`), and the lesson that explains it. Explicitly a subset: the dashboard exposes 150+, and saying which 50 matter is the editorial act. | `[01]` §6; `[02]` §§1–2, 7, 11–12; `[06]` §13, §16; `[07]` §2.5, §6.1 |
| 3 | **Map of `~/.hermes/`** | Every path the corpus names, what writes it, whether it is safe to delete, and what is lost if you do. Includes the ones that only appear in code-sourced material (`pending/`, `cache/delegation/live/`, `skills/.archive/`, `skills/.curator_backups/`, `proxy/`, `shell-hooks-allowlist.json`). | `[01]` §6; `[02]` §§1–2, 7, 11; `[05]` §3–§6; `[06]` §16; `[07]` §2.5, §6.1 |
| 4 | **Isolation matrix** | Six backends × isolation, dangerous-command check, secrets present by default, file sync, and what each is for. The row where four backends *skip* the dangerous-command check is the reason this is a cheatsheet and not a paragraph. | `[02]` §7; `[01]` §6, §8 |
| 5 | **Platform capability matrix** | Voice, images, files, threads, reactions, typing, streaming per messaging platform — the verbatim table, extended with the delivery targets cron accepts. This is what replaces nineteen platform lessons. | `[05]` §7; `[02]` §11 |
| 6 | **Unattended hardening checklist** | Printable. The docs' ten items plus the community's five, each with the exact command or config key that implements it, and a column for "verified on \_\_\_\_". Designed to be signed. | `[02]` §7; `[04]` §1.2, §1.10; `[01]` §6; `[07]` §4.10 |
| 7 | **Slash commands in session** | The full set with which surfaces each works on (CLI / TUI / gateway / dashboard), since several are CLI-only in ways the docs mention only in passing (`/browser connect`, `inject_message`-backed commands). | `[01]` §5; `[02]` §§1–2, 7, 11–12; `[06]` §6, §13–14 |
| 8 | **Cron formats and constraints** | The four schedule formats with worked examples, the delivery-target list, and the five constraints in a box: no recursive cron, prompts must be self-contained, workdir jobs run sequentially, unpinned jobs snapshot the default model and fail closed, cron-management tools are disabled inside cron runs. | `[02]` §11; `[05]` §6 |
| 9 | **When it does not work** | An ordered diagnostic list — `hermes doctor` → `hermes model` → `hermes gateway status` → `~/.hermes/logs/` → `hermes dump` — plus the fifteen most common symptoms with their documented cause. Ordered, not alphabetical, because that is the whole point. | `[02]` §15; `[01]` §1–2; `[04]` §1.2, §1.4 |

---

## 18. Recorded conflicts the lessons must present

The corpus contradicts itself in places, and so do the docs. Per CLAUDE.md's first
non-negotiable and PRODUCT.md principle 1, the guide shows both sides rather than
quietly choosing one. Each conflict is assigned to the lesson that owns it, so no
conflict is orphaned.

| Conflict | The two (or three) claims | Sources | Owned by |
|---|---|---|---|
| Portal status command | `hermes portal info` vs `hermes portal status\|open\|tools` | `[02]` §9 vs §14 | `02/02` + Cheatsheet 1 |
| Personality count | 14 named on the CLI page; "12 total" claimed and 11 named on the personality page | `[01]` §5 vs `[02]` §5 | `03/03` |
| Messaging platform count | "20 platform adapters" and "20+"; "27+" on the integrations index; 21 rows in the enumerated list | `[02]` §8, §13; `[03]`; `[04]` §2.5 | `07/02` |
| Memory architecture | "Three-layer memory system" (widely repeated, and a three-mechanism framing in one deep-dive) vs two capped files + FTS5 + optional provider | `[04]` §1.1 vs `[02]` §1 | `05/03` + VIZ-2 |
| Memory provider count | Eight on the memory page; nine on the providers page (Memori documented separately) | `[02]` §1 vs `[06]` §4 | `05/05` |
| Leaf subagent blocklist | Three different lists: `delegation, clarify, memory, code_execution`; `delegation, clarify, memory, send_message`; `delegate_task, clarify, memory, send_message, cronjob` | `[02]` §12 (twice) vs `[05]` §5 | `08/02` |
| Multi-agent orchestration version | v0.6.0 (community framework) vs v0.11.0 orchestrator role → v0.13.0 Kanban (release notes) | `[04]` §5.4 vs `[03]` §1 | `08/01` |
| Hermes CVEs | "No publicly documented CVEs through May 2026" vs three CVEs documented that same month | `[04]` §2.4 vs §3.3 | `10/04` |
| Autonomous skill creation reliability | Fires unprompted after a complex task vs stays vague and generic unless explicitly requested | `[04]` §5.1 vs §1.4 pitfall 4 | `06/08` |
| Skills Hub scale | 19,932 catalogue entries (release notes) vs 672 (one third-party site) vs 124,000+ (another) | `[03]` §5 | `06/03` |
| Self-evolution integration | Treated as part of Hermes by secondary sources vs an adjacent repo producing PRs, disputed in its own issue tracker | `[03]` §4 | `06/08` |
| Third-party command drift | `hermes daemon start` published by a practitioner guide; absent from the official CLI reference | `[05]` §8.5 | `01/04` |
| Learning-path duration | The docs' "Advanced: 4–6 hours" for a thinner path vs this guide's honest totals | `[01]` §3 vs §19 below | `01/03` |
| Product version on-page | No docs page states the release; "config version 17" is a schema version and is routinely mistaken for one | `[01]` §5, §6, §8, §Facts-uncertain | `01/04`, `03/04` |
| Petronella / innFactory claims | Marketing-derived security claims contradicted by primary security sources, in a pattern the research pass names explicitly | `[04]` §2.4, §Facts-uncertain | `10/04` |

Two further items are **not** conflicts but must carry an explicit provenance
label, because they are sourced from code rather than documentation and a reader
deserves to know which: the self-improvement internals in `06/05`–`06/06` (read from
`agent/*.py` at a pinned commit) and `hermes project` in `08/04` (read from a module
docstring, with `[06]` §20 confirming no documentation page exists).

---

## 19. Totals, and an honest look at them

### 19.1 The numbers

**51 lessons. 611 minutes of written material (10 h 11 m) if you read every word of
every lesson on every track.** Nobody does that; the tracks exist so nobody has to.

Per module, per track (`core` at full duration, `skim` at 40%, `skip` at zero):

| Module | Total | Newcomer | Operator | Architect |
|---|---:|---:|---:|---:|
| 1 · First contact | 31 | 27 | 31 | 31 |
| 2 · Standing it up | 48 | 48 | 48 | 31 |
| 3 · Running a session | 40 | 40 | 35 | 20 |
| 4 · Tools and isolation | 51 | 28 | 51 | 44 |
| 5 · What the agent knows | 55 | 49 | 49 | 44 |
| 6 · Skills and the loop | 99 | 86 | 99 | 87 |
| 7 · Unattended operation | 77 | 65 | 77 | 63 |
| 8 · More than one agent | 62 | 38 | 62 | 62 |
| 9 · Extension and routing | 69 | 30 | 54 | 36 |
| 10 · Deployment and governance | 79 | 35 | 71 | 71 |
| **All modules** | **611** | **446** | **577** | **489** |

And the number that actually matters — the **core path**, which is what a reader on
a track is asked to complete:

| Track | Core lessons | Core minutes | Skim | Skip | Core path |
|---|---:|---:|---:|---:|---|
| Newcomer | 33 | **382** | 13 | 5 | **6 h 22 m** |
| Operator | 46 | **554** | 5 | 0 | **9 h 14 m** |
| Architect | 35 | **429** | 13 | 3 | **7 h 09 m** |

Structural facts worth stating alongside them: the longest lesson is 16 minutes
(`08/03-the-kanban-board`), the mean is 12.0, and **no lesson exceeds 16 minutes by
design** — PRODUCT.md commits to recoverable progress in ten-to-thirty-minute
sessions, and a twenty-five-minute lesson is not recoverable halfway through.

### 19.2 The sanity check

**Yes, the Newcomer path is over six hours, and that is a problem.**

Not a problem of accuracy — 382 minutes is what this material honestly costs. It is
a problem of *presentation*: a capable non-engineer reading in evening
ten-to-thirty-minute sessions needs 13 to 38 sittings to finish, and a progress bar
that moves 3% a night is a bar that gets abandoned. The Operator's 9 h 14 m is
defensible (they are evaluating infrastructure they will run, and the docs' own
"Advanced: 4–6 hours" path is both thinner and less honest) but it is still the
largest number here and it should not be discovered rather than disclosed.

Three things follow, and I would do all three.

**(a) Disclose the number on the track-selection screen.** Not "about six hours" —
the exact figure, the sitting count, and the promise it buys. A reader who accepts
6 h 22 m up front finishes; a reader who discovers it at module 6 does not.

**(b) Publish a named spine per track: a real, completable first pass.** This is the
substantive answer, and it is a better one than deleting content, because the
material is not padding — it is the outcome PRODUCT.md promises. Each spine is a
subset that stands alone, ends somewhere useful, and is explicitly labelled as pass
one of two.

**(c) Make three specific relevance flips for the Newcomer**, which are the right
call independent of length:

| Flip | From → to | Saves | Why it is right anyway |
|---|---|---:|---|
| `03/03-steering-a-running-agent` | core → skim | 5 | Three busy-input modes is a preference, not a competence. The default is fine. |
| `09/05-voice-vision-and-the-browser` | core → skim | 8 | Voice is a genuine draw, but it is a capability the reader can adopt after they have something worth talking to. |
| `10/05-keeping-it-running` | core → skim | 8 | `hermes doctor` belongs in Cheatsheet 9, which they will reach for at the moment they need it rather than three weeks earlier. |
| `07/04-telegram-end-to-end` | core → skim | 8 | Reluctantly. Telegram is how a non-engineer actually uses Hermes, so this is the flip I would reverse first if the number came down another way. |

Those four take the Newcomer core to **348 minutes (5 h 48 m)**. It does not get
below five hours, and I would not pretend otherwise: the promised outcome — deploy
it for real work, explain its mechanics accurately, judge where it should not be
trusted — is not a three-hour outcome. Claiming it were would be the same
dishonesty as the "100 hours of Hermes lessons in 19 minutes" videos catalogued in
`[04]` §4.

**If the written total itself must shrink** (build capacity rather than reading
time), cut in this order:

1. **`09/04-the-other-front-doors`** — 12 min, one lesson. `skim` on all three
   tracks already; its content folds into Cheatsheet 1, and its two governance facts
   are duplicated in `10/01` and `10/03` by design.
2. **`05/05-external-memory-providers`** — 10 min, one lesson. `skim` on all three
   tracks; becomes an appendix table. Nine optional providers, none default.
3. **Merge `03/01` + `03/02`** into one 16-minute "Reading the instrument, and
   getting back to it" — saves 4 min and one lesson, and the two are adjacent
   anyway.

That is **611 → 585 minutes, 51 → 48 lessons** without touching a single mechanism.
Anything beyond it starts removing things the outcome depends on.

### 19.3 The three spines

Named, linkable first passes. Each is a subset of its track's core path — no new
lessons, no alternate content, so the spine and the full path never diverge.

**Newcomer · "First deployment" · 12 lessons · 144 min (2 h 24 m)**
`01/01` → `01/02` → `02/01` → `02/02` → `02/03` → `02/04` → `03/01` → `03/04` →
`05/03` → `06/01` → `06/04` → `07/01`
*Ends with:* a real recurring task running on a schedule, on a machine whose blast
radius they have deliberately set, with memory and one hand-written skill in play.
That is a genuine outcome, not a checkpoint.

**Operator · "Evaluation pass" · 12 lessons · 140 min (2 h 20 m)**
`01/01` → `01/02` → `01/04` → `02/02` → `04/01` → `04/03` → `05/01` → `06/05` →
`07/02` → `07/06` → `08/01` → `10/01`
*Ends with:* enough to decide whether to pilot it — the mechanical model, the
isolation options, what the prompt costs, what the self-improvement loop actually
does, what unattended operation costs per day, and the hardening checklist. No
Telegram, no Kanban, no plugins. It is the read before the decision.

**Architect · "Control review" · 9 lessons · 113 min (1 h 53 m)**
`01/01` → `01/02` → `02/04` → `04/03` → `04/04` → `06/05` → `06/06` → `10/02` →
`10/03`
*Ends with:* a defensible position on a self-modifying autonomous agent — what it
can reach, what gates it, what the loop is permitted to change, where the
credentials live and what the boundary does not cover, and exactly which artefacts
constitute an audit trail. Skips installation entirely, which is correct: this
reader may never run the software and should not have to in order to govern it.

---

## 20. Research gaps

Lessons or lesson content I believe the curriculum needs and the corpus cannot
support. Naming them is more useful than papering over them, and each one is a
concrete research task rather than a lament.

**1 · No supported multi-tenant deployment pattern.** `[03]` §1 shows the demand
clearly — open issues #34352 ("Solving the Multi-Tenant Hermes Problem"), #9514
(single-daemon multi-agent with per-topic workspace and memory isolation), #10143
(topic-to-profile routing) — and `[06]` §19 gives profiles as the sanctioned
isolation, which explicitly does not sandbox the filesystem. Every Architect will
ask "can we run one Hermes for a team", and the honest answer is currently "not in a
documented way". `10/06` states that, but a proper lesson would need material that
does not exist. **Task:** determine whether any documented pattern exists for
serving several humans from one installation with isolation guarantees, or confirm
authoritatively that there is none.

**2 · No reproducible cost model.** `07/06-what-unattended-costs` is `core` on all
three tracks and every figure in it is anecdotal: 4 M tokens in two hours, 21 K
tokens for a simple messaging query, 37 M input tokens in one day, a single
measured 73% fixed overhead from six request dumps. There is no baseline of the form
"tokens per turn, per surface, at a fixed toolset and skill count". **Task:** either
measure one on a real install (which the author intends to have), or state in the
lesson that no reproducible baseline exists and present the anecdotes as bounds
rather than figures. The second is acceptable; silence is not.

**3 · Nous Portal pricing is unverified.** `[03]` §6 records that
`portal.nousresearch.com` returned HTTP 429 on two direct fetch attempts, so every
tier price is a WebSearch snippet. **Decision already taken:** print no dollar
figures anywhere in the guide; name the tiers and link out. **Task:** one successful
direct fetch would let `02/02` say something useful about cost of entry, which is
the first question a Newcomer asks.

**4 · The `/agents` subagent tree has no captured frame.** `[05]` §5 documents the
overlay in prose only. This blocks the replay that would most help
`08/02-delegate-task` — watching three children's tool calls interleave live.
**Task:** capture it, or accept the diagram substitute permanently.

**5 · The launch banner is not published as text.** `[05]` §1 confirms the docs use
an SVG figure by explicit design. SIM-1's opening frame is therefore a labelled
placeholder. **Task:** capture it on a real install; it is the single cheapest
fidelity upgrade available.

**6 · Windows-native feature gaps are unenumerated.** `[01]` §4 and `[06]` §9 both
say only "A few features are not available", and `[02]` §7 adds that Tirith is
silently skipped on Windows with WSL recommended instead. A Windows reader cannot be
told what they lose, which is a real accessibility failure for a Tier-1 platform.
**Task:** enumerate the gap, or state in `02/01` that the docs do not.

**7 · Whether autonomous skill creation reliably fires is genuinely unresolved.**
`[04]` §5.1 reports it happening unprompted after a complex task; `[04]` §1.4 pitfall
4 reports skills staying vague unless explicitly requested. Both are single
first-person accounts and `[04]` §Facts-uncertain notes the discrepancy may be model,
task, or version. This is a conflict to present (assigned to `06/08`), not a hole to
fill — but it means the guide cannot tell a reader what to *expect*, only what the
mechanism is. **Task:** if a real install happens, this is the highest-value thing to
observe over a fortnight.

**8 · `hermes project` has no end-user documentation.** `[07]` §4.4 sources it
entirely from a module docstring and argparse tree; `[06]` §20 confirms via 404
probing that no page exists. `08/04` therefore teaches a shipped CLI feature from
source code, and must say so. **Task:** re-check on each release; a Projects page
would supersede that section.

**9 · Two quoted-text gaps in material the guide leans on.** `[07]` §Facts-uncertain
records that `KANBAN_GUIDANCE` — the system-prompt block injected into every Kanban
worker, and the mechanism that teaches workers the lifecycle — was never fetched, and
that `agent/curator.py` was not read line by line, so the consolidation-pass prompt
text is unquoted. Both matter because the guide's strongest claim about the loop is
that its policy *is* readable instruction text (`06/06` quotes the review prompt to
prove it). For the curator and for Kanban workers, the guide can describe the policy
but not show it. **Task:** fetch both.

**10 · `docs/hermes-kanban-v1-spec.pdf` was never read.** `[07]` §Facts-uncertain: the
Kanban docs repeatedly cite it as the canonical design-rationale document, including
eight named collaboration patterns with worked examples. Those patterns would
materially improve `08/03` and `08/05`. **Task:** read the PDF.

**11 · Deprecation timelines are unstated.** `[07]` §Facts-uncertain notes `hermes
kanban daemon` is deprecated with a `--force` escape hatch "for one release cycle"
and no stated removal version. With releases every one to two weeks, a guide that
cannot date a deprecation cannot warn about it. **Task:** track it; the same problem
will recur, so the answer is probably a per-lesson deprecation note rather than a
one-off check.

**12 · No recording of any kind exists.** `[05]` §8 is unambiguous: no asciinema
cast, no session log, no animated demo anywhere in the repo, docs, or third-party
sources; `assets/` holds one static `banner.png`. Every replay in §14 is therefore
reconstructed from documented formats, and PRODUCT.md leaves open whether the author
installs Hermes later and re-records. **This is the single decision most worth
resolving before launch.** SIM-1, SIM-6, and SIM-7 are the three whose value depends
most on it — they are also the three with the largest PARAPHRASED/UNKNOWN surface.
Until then, the per-replay fidelity badge is not a nicety; it is the thing that keeps
the guide honest.

**13 · Reddit is a hole, not an omission.** `[04]` §3.1 states plainly that no Reddit
thread content was retrieved and that every r/LocalLLaMA-adjacent claim in the corpus
is inferred from secondary guide-sites. The local-model story in `02/02` and the
cost-optimisation material in `07/06` both lean on that community's findings at one
remove. **Task:** source it directly, or attribute those claims to the secondary
sites that actually carry them rather than to "the community".

---

## 21. Amendments from the installed binary (2026-07-25)

`research/08-installed-binary.md` records read-only introspection of a real v0.19.0
install. Two amendments to this map follow from it, and one confirmation.

**Amendment 1 — `hermes journey` needs a home in module 6.** The command (aliased
`learning` and `memory-graph`) renders a timeline of learned skills and memories over
time, with `--reveal`, `--play`, and `--json`, plus `list`/`delete`/`edit` on
individual nodes. It appears nowhere in this map and nowhere in `[01]`–`[07]`. It is a
first-party visualisation of the exact mechanism the guide claims is Hermes's
differentiator, and its `delete`/`edit` subcommands are a governance control — a human
correcting what the agent learned — which module 10 currently cannot answer. Proposed:
a section in `06/07-the-curator` or a new `06/09`, plus a citation in
`10/03-the-record-what-is-auditable`.

**Amendment 2 — `06/08-keeping-it-from-getting-worse` has a stronger opening than
planned.** The curator's own help text states that bundled and hub-installed skills
are never touched, and that "archives are recoverable; auto-deletion never happens."
That is the single strongest reassurance in the product about the self-improvement
loop, and it should lead the lesson rather than appear as mitigation. The binary also
exposes `curator backup` and `curator rollback` — the skill library is versioned,
which this map does not currently claim anywhere — and `curator usage`, which reports
telemetry for all skills "with provenance," distinguishing built-in from hub from
agent-created. That is an audit surface for module 10.

**Confirmation — the `hermes daemon start` drift is now a stronger claim.** There is no
`daemon` subcommand in the shipped binary. Lesson `01/04` has been updated: the
third-party command is wrong against the software, not merely absent from the docs.

**Unchanged.** Nothing here upgrades SIM-1 or SIM-4; no session was run, so both remain
reconstructions. `hermes dump` was deliberately not captured because it can contain
credential material, so the docs' stale `0.8.0` block is still the only published
example of that command's output.

---

## 22. Amendments from the captured session (2026-07-25)

`research/09-captured-session.md` records the corpus's only real recording. It
supersedes `[05]` on every format it touches, and it changes four map decisions.

**SIM-1 is unblocked and can be built verbatim.** The banner is Braille block art
inside a bronze-and-gold box frame, with a two-column tools/skills panel, a welcome
line, and a rotating `✦ Tip:`. The map's prohibition on "literal banner ASCII art" was
correct about the documentation and wrong about the software; the prohibition is lifted
for structure and strings, with the emblem reproduced as a static block rather than
typed out. §1 of `[09]` has the shape.

**SIM-4's notification is verbatim now, and the docs' version was wrong.** The real
string is `💾 Self-improvement review: Skill '<name>' created.` — prefixed, and
`created` rather than `patched`. Observed firing unprompted after the answer on the
first substantial session of a fresh install, which also settles the conflict `[04]`
recorded as unresolved about whether autonomous skill creation reliably fires. The
SKILL.md diff remains unavailable; the file was not opened.

**Lesson `03/01` had a factual error, now corrected in place.** The documented status
bar carries a cost field. Across three hundred captured bars it never appeared, and the
undocumented `✓` badge is always present after a turn. The lesson now presents the
conflict via `Revised` rather than repeating either source, and SIM-2 is rebased on the
captured formats with its compression frames explicitly downgraded to reconstructed —
no compression occurred in the capture.

**`06/02-progressive-disclosure` gains an observation.** Two consecutive feed lines show
a skill's reference file loading on demand (`┊ 📚 skill hermes-agent` then
`→ references/cli-reference.md`). The lesson previously taught this from documentation
only.

**Still uncaptured**, and therefore still reconstructed: the approval gate
(`[o]nce [s]ession [a]lways [d]eny`), the `🗜️` compression badge in situ, and any
SKILL.md diff. A second capture that triggers a dangerous command and fills a context
window would close all three.
