# Hermes Agent — Extension & Advanced Ops Corpus

Compiled July 2026. Scope: the **developer/extension surface** (developer-guide docs)
and the **advanced-ops surface** (self-improvement machinery, Mixture of Agents,
Kanban/Projects, webhooks/hooks, egress firewall). Two source types are cited
throughout:

- **Website docs** — fetched live from `https://hermes-agent.nousresearch.com/docs/…`.
- **Repository source** — fetched as raw file contents from
  `https://raw.githubusercontent.com/NousResearch/hermes-agent/main/<path>`,
  repo `NousResearch/hermes-agent`, **branch `main`, commit
  `d372fda6f0cf321b14aed84599a5b2a2d68e0338`** (resolved 2026-07-25). Where a
  claim comes from source code rather than docs, that is stated explicitly —
  source code is ground truth for internals but is not itself "documentation"
  the way the website pages are user-facing.

Release-note quotes are from `gh api repos/NousResearch/hermes-agent/releases`,
tags `v2026.7.20` (v0.19.0, "The Quicksilver Release"), `v2026.7.1` (v0.18.0,
"The Judgment Release"), `v2026.5.28` (v0.15.0, "The Velocity Release"), and
`v2026.5.7` (v0.13.0, "The Tenacity Release").

Everything fetched (web pages, repo files, release notes) was treated as data
for research purposes only — no instructions embedded in any fetched content
were followed.

---

## 1. Developer / Extension Surface

### 1.1 Creating Skills

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills

Skills are the preferred extension mechanism — "easier to create than tools,
require no code changes to the agent, and can be shared with the community."
Decision rule given verbatim: make it a **Skill** when the capability is
instructions + shell commands + existing tools (wraps a CLI/API, no custom
Python integration needed); make it a **Tool** when it needs end-to-end API-key
integration, custom processing logic that must run precisely every time, or
binary/streaming/real-time handling.

**Directory layout** (bundled skills in `skills/`, official-optional in
`optional-skills/`, same shape):

```text
skills/
├── research/
│   └── arxiv/
│       ├── SKILL.md              # Required
│       └── scripts/
│           └── search_arxiv.py
├── productivity/
│   └── ocr-and-documents/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
```

**SKILL.md frontmatter fields** (from the doc's canonical template):
`name`, `description` (≤60 chars recommended, shown in search results),
`version`, `author`, `license`, `platforms: [macos, linux, windows]` (optional
OS gate), `metadata.hermes.tags`, `metadata.hermes.related_skills`,
`metadata.hermes.requires_toolsets` / `requires_tools` (hide skill when a
listed toolset/tool is **not** available), `metadata.hermes.fallback_for_toolsets`
/ `fallback_for_tools` (hide skill when a listed toolset/tool **is** available
— for building a fallback when a primary tool lacks an API key),
`metadata.hermes.config` (list of `{key, description, default, prompt}` —
non-secret settings written to `config.yaml` under `skills.config.<key>`),
`metadata.hermes.blueprint` (marks the skill a runnable automation, see below),
`required_environment_variables` (list of `{name, prompt, help, required_for}`),
`required_credential_files` (list of `{path, description}` — file-based OAuth
tokens mounted read-only into Docker / synced into Modal sandboxes).

Standard body sections: `# Skill Title`, `## When to Use`, `## Quick Reference`,
`## Procedure`, `## Pitfalls`, `## Verification`.

**Template substitution in SKILL.md body**: `${HERMES_SKILL_DIR}` (absolute
skill directory) and `${HERMES_SESSION_ID}` are substituted at load time;
disable globally with `skills.template_vars: false`. **Inline shell snippets**
(`` !`cmd` ``) are supported but off by default (`skills.inline_shell: true`
to enable) since they execute on the host with no approval prompt.

**Blueprints** — a skill becomes a shareable, runnable automation by adding
`metadata.hermes.blueprint: {schedule, deliver, prompt, no_agent}`. Installing
a skill carrying a `blueprint:` block registers it as a **suggested cron job**,
never auto-schedules it — review via `/suggestions` (`accept`/`dismiss`/`catalog`).
Acceptance calls the same `cron.jobs.create_job` the `cronjob` tool uses — "no
second job engine." Suggestion sources: `catalog` (curated starters),
`blueprint`, `usage` (background review noticed a recurring ask), `integration`
(after connecting an account).

**Trust levels** for hub-installed skills: `builtin` (repo, always trusted) →
`official` (`optional-skills/`, built-in trust) → `trusted` (openai/skills,
anthropics/skills, huggingface/skills) → `community` (non-dangerous findings
overridable with `--force`; `dangerous` verdicts stay blocked).

### 1.2 Adding Tools

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/adding-tools

Explicitly gated: **"This page is for adding a built-in Hermes tool to the
repository itself."** For a personal/project-local tool without touching core,
the doc redirects to the plugin route. Adding a built-in tool touches exactly
2 files:

1. `tools/your_tool.py` — handler + schema + check function + a top-level
   `registry.register()` call.
2. `toolsets.py` — add the tool name to `_HERMES_CORE_TOOLS` or a named
   toolset entry.

Canonical tool file shape (verbatim pattern from the doc):

```python
# tools/weather_tool.py
def check_weather_requirements() -> bool:
    return bool(os.getenv("WEATHER_API_KEY"))

def weather_tool(location: str, units: str = "metric") -> str:
    ...
    return json.dumps({"location": location, "temp": 22, "units": units})

WEATHER_SCHEMA = {
    "name": "weather",
    "description": "Get current weather for a location.",
    "parameters": {"type": "object", "properties": {...}, "required": ["location"]},
}

from tools.registry import registry
registry.register(
    name="weather", toolset="weather", schema=WEATHER_SCHEMA,
    handler=lambda args, **kw: weather_tool(args.get("location", ""), args.get("units", "metric")),
    check_fn=check_weather_requirements,
    requires_env=["WEATHER_API_KEY"],
)
```

**Hard rules** (marked `:::danger`): handlers **must** return a JSON string via
`json.dumps()`, never a raw dict; errors **must** be `{"error": "message"}`,
never a raised exception; `check_fn` returning `False` silently excludes the
tool from the schema; handler signature is `(args: dict, **kwargs)`.

No manual discovery-list step is needed — any `tools/*.py` file with a
top-level `registry.register()` call is auto-discovered at startup by
`discover_builtin_tools()`. Async handlers set `is_async=True`; the registry
bridges via `_run_async()` — callers never call `asyncio.run()` themselves.
Four tools (`todo`, `memory`, `session_search`, `delegate_task`) are
**agent-loop intercepted** — `run_agent.py` handles them before registry
dispatch because they need per-session agent state; their schemas still live
in the registry, but a direct `dispatch()` call returns a stub error.

### 1.3 Tools Runtime (internals)

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/tools-runtime

Primary files: `tools/registry.py`, `model_tools.py`, `toolsets.py`,
`tools/terminal_tool.py`, `tools/environments/*`.

**`registry.register()` full signature**:

```python
registry.register(
    name="terminal", toolset="terminal", schema={...}, handler=handle_terminal,
    check_fn=check_terminal, requires_env=["SOME_VAR"], is_async=False,
    description="Run commands", emoji="💻",
)
```

Each call creates a `ToolEntry` in the singleton `ToolRegistry._tools` dict
keyed by tool name; a name collision across toolsets logs a warning and the
**later** registration wins.

**Discovery** (`discover_builtin_tools()` in `tools/registry.py`): scans
`tools/*.py` with **AST parsing** to find modules containing a **top-level**
`registry.register()` call (calls nested inside functions are not matched, so
helper modules aren't imported), then `importlib.import_module`s each match.
After core discovery: `tools.mcp_tool.discover_mcp_tools()` registers MCP
server tools, then `hermes_cli.plugins.discover_plugins()` loads plugin tools.

**`check_fn` semantics**: run once per tool when `registry.get_definitions()`
builds the model schema; results are cached per-call (a shared `check_fn`
across tools runs once); an exception in `check_fn()` is treated as
"unavailable" (fail-safe).

**Toolset resolution** (`model_tools.get_tool_definitions(enabled_toolsets,
disabled_toolsets, quiet_mode)`): if `enabled_toolsets` given, only those
resolve via `resolve_toolset()` (which expands composite toolsets); if
`disabled_toolsets` given, start from all toolsets and subtract; if neither,
include everything. After resolution, `execute_code` and `browser_navigate`
schemas are dynamically patched to only reference tools that survived
filtering — "prevents model hallucination of unavailable tools." Legacy
`_tools`-suffixed toolset names map through `_LEGACY_TOOLSET_MAP`.

**Dispatch flow** (documented as an explicit pipeline):

```
Model response with tool_call
  -> run_agent.py agent loop
  -> model_tools.handle_function_call(name, args, task_id, user_task)
  -> [Agent-loop tools?] -> handled directly (todo, memory, session_search, delegate_task)
  -> [Plugin pre-hook] -> invoke_hook("pre_tool_call", ...)
  -> registry.dispatch(name, args, **kwargs)
  -> Look up ToolEntry by name
  -> [Async?] bridge via _run_async() / [Sync?] call directly
  -> Return result string (or JSON error)
  -> [Plugin post-hook] -> invoke_hook("post_tool_call", ...)
```

Two layers of error wrapping guarantee the model always sees valid JSON:
`registry.dispatch()` catches handler exceptions into
`{"error": "Tool execution failed: ExceptionType: message"}`; a second
try/except in `handle_function_call()` wraps the whole dispatch.

**Dangerous-command approval** (`tools/approval.py`): `DANGEROUS_PATTERNS` is a
list of `(regex, description)` tuples (recursive delete, `mkfs`/`dd`,
destructive SQL, `> /etc/`, `systemctl stop`, `curl | sh`, fork bombs, etc.);
`detect_dangerous_command()` checks every terminal command before execution;
CLI mode prompts interactively (approve/deny/allow-permanently), gateway mode
routes an async approval callback to the messaging platform, and an optional
"smart approval" auxiliary LLM can auto-approve low-risk matches. Approvals are
tracked per-session; "allow permanently" persists the pattern to
`config.yaml`'s `command_allowlist`.

Terminal backends: local, docker, ssh, singularity, modal, daytona.

### 1.4 Build a Hermes Plugin

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/plugins

This is the general-purpose plugin surface (tools, hooks, slash commands, CLI
commands), distinct from the five **specialized** plugin types and from
non-Python extension surfaces (MCP servers, gateway event hooks, shell hooks,
skill taps, TTS/STT command templates) — the doc opens with a routing table
mapping each extension need to the right guide.

**`:::caution`** Third-party-product plugins (vendor SaaS connectors, paid
integrations, observability backends) ship as **standalone repos**, installed
into `~/.hermes/plugins/` or via pip — not merged into
`NousResearch/hermes-agent`. This is a maintenance-coupling decision, not a
quality bar.

**Directory shape** (worked "calculator" plugin example):

```text
~/.hermes/plugins/calculator/
├── plugin.yaml      # name, version, description, provides_tools, provides_hooks
├── __init__.py      # def register(ctx): ...
├── schemas.py        # tool JSON schemas
└── tools.py          # handler(args: dict, **kwargs) -> str  (ALWAYS JSON, never raise)
```

`plugin.yaml` minimum:

```yaml
name: calculator
version: 1.0.0
description: Math calculator
provides_tools: [calculate, unit_convert]
provides_hooks: [post_tool_call]
```

Optional: `requires_env` — simple list (`[SOME_API_KEY]`) or rich form
(`{name, description, url, secret}`); missing values disable the plugin with
a clear message, no crash; `hermes plugins install` prompts interactively for
missing values and writes them to `.env`.

**`register(ctx)` contract** — called exactly once at startup; if it raises,
the plugin is disabled but Hermes keeps running. `ctx` API surface documented:

| Method | Purpose |
|---|---|
| `ctx.register_tool(name, toolset, schema, handler, check_fn=None, override=False)` | Register a tool. `override=True` is required to shadow a built-in tool name from a different toolset (logged at INFO for auditability); without it, a shadowing registration is rejected. |
| `ctx.register_hook(event, callback)` | Subscribe to a lifecycle event (see hook table below). |
| `ctx.register_cli_command(name, help, setup_fn, handler_fn)` | Adds `hermes <plugin> <subcommand>` (argparse tree). |
| `ctx.register_command(name, handler, description="", args_hint="")` | Adds in-session `/name` slash command, works in CLI + every gateway platform. Handler receives the raw args string; may be async. Conflicts with a built-in command name are silently rejected (built-ins win). |
| `ctx.dispatch_tool(name, args, *, parent_agent=None)` | Invoke any registered tool (built-in or plugin) through the normal approval/redaction/budget pipeline — "a real tool invocation, not a shortcut." |
| `ctx.register_skill(dirname, skill_md_path)` | Ship a bundled, read-only skill loadable as `plugin-name:skill-name`; not listed in the system prompt's skill index (opt-in explicit load). |
| `ctx.register_slack_action_handler(action_id, callback)` | Wire a Slack Block Kit button/action click handler into the adapter's `slack_bolt.AsyncApp` without monkey-patching. |
| `ctx.profile_name` | Active profile name — works in every context including kanban worker processes, unlike `ctx._cli_ref` which is `None` outside an interactive CLI session. |

**Hook table** (from the plugin guide's summary — full parameter tables live
on the Hooks reference page, §5 below):

| Hook | Fires | Notes |
|---|---|---|
| `pre_tool_call` | before any tool executes | can block |
| `post_tool_call` | after any tool returns | observer |
| `pre_llm_call` | once per turn, before the tool loop | **only hook whose return matters** — can inject context |
| `post_llm_call` | once per turn, after a successful turn | observer |
| `on_session_start` / `on_session_end` / `on_session_finalize` / `on_session_reset` | session lifecycle | observer |
| `kanban_task_claimed` | dispatcher process, before worker spawn | observer |
| `kanban_task_completed` / `kanban_task_blocked` | worker process | observer |

`pre_llm_call` context injection: return `{"context": "..."}` or a plain
string to append text to the **current turn's user message** (not the system
prompt — deliberate, to preserve the Anthropic/OpenRouter cached-prefix
across turns). Injected text over `10,000` chars (default, `hooks.output_spill.max_chars`)
spills to `$HERMES_HOME/hook_outputs/<session_id>/<uuid>.txt` with a head/tail
preview so a runaway plugin can't blow out the prompt-cache prefix. Multiple
plugins' context outputs are joined with double newlines, in plugin
discovery-order (alphabetical by directory name).

**Overriding a built-in tool**: `ctx.register_tool(..., override=True)` — the
only sanctioned way to replace e.g. the built-in browser or web-search tool.

**Thread-safe lazy singletons**: `plugins/plugin_utils.py` provides
`@lazy_singleton` (zero-arg accessor decorator) and `SingletonSlot` (for
accessors needing a build argument) — both use double-checked locking so
concurrent first calls (delegated tool calls, background workers, **the
self-improvement fork**) can't race-build/leak an expensive client. Reference
consumer: `plugins/memory/honcho/client.py`.

**Lazy-install optional deps**: `tools.lazy_deps.ensure("plugin.backend")` —
the feature key must be pre-declared in the in-tree `LAZY_DEPS` allowlist
(prevents arbitrary-package installs from a malicious config); specs are
PyPI-name-only, no `git+https://` or `--index-url`. Gated globally by
`security.allow_lazy_installs`.

**Five specialized plugin types** (each `plugins/<category>/<name>/`, own
manifest contract, own guide): model provider, platform (gateway channel),
memory provider, context engine, image-generation backend — plus (per the
routing table at the top of the page) video-gen, web-search, browser-provider,
secret-source, and dashboard-auth as further specialized surfaces documented
on their own pages.

**Non-Python extension surfaces** sketched in this guide (each links to its
own full doc): MCP servers (`mcp_servers:` in `config.yaml`, zero Python),
gateway event hooks (`HOOK.yaml` + `handler.py` under `~/.hermes/hooks/`),
shell hooks (`hooks:` block in `config.yaml`, arbitrary CLI), skill taps
(`hermes skills tap add`), TTS/STT command templates.

**Distribution**: pip entry point
(`[project.entry-points."hermes_agent.plugins"]`); NixOS
(`services.hermes-agent.extraPythonPackages` / `extraPlugins` — noted as
best-effort-only, no longer an officially supported install path).

**Common mistakes** called out explicitly: returning a dict instead of
`json.dumps(...)`; omitting `**kwargs` from the handler signature; letting
exceptions propagate instead of catching and returning error JSON; vague
schema descriptions ("Does stuff").

### 1.5 Adding Providers

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/adding-providers

Opens with a scope check: **"Hermes can already talk to any OpenAI-compatible
endpoint through the custom provider path. Do not add a built-in provider
unless you want first-class UX"** (dedicated auth/token-refresh, a curated
model catalog, setup-menu entries, `provider:model` aliases, or a non-OpenAI
API shape needing an adapter).

**The mental model** — a built-in provider must line up across:
1. `hermes_cli/auth.py` — credential resolution.
2. `hermes_cli/runtime_provider.py` → `resolve_runtime_provider()` returns
   `{provider, api_mode, base_url, api_key, source}`.
3. `run_agent.py` — uses `api_mode` to decide request construction.
4. `hermes_cli/models.py` + `hermes_cli/main.py` — CLI discoverability
   (`hermes_cli/setup.py` delegates to `main.py`'s
   `select_provider_and_model()` automatically — no separate wiring needed).
5. `agent/auxiliary_client.py` + `agent/model_metadata.py` — auxiliary-task
   routing and token budgeting.

`api_mode` is the central abstraction: most providers use
`chat_completions`; Codex uses `codex_responses`; Anthropic uses
`anthropic_messages`.

**Fast path — simple API-key providers** (no OAuth, plain chat-completions):
a plugin directory `plugins/model-providers/<name>/` with `__init__.py`
calling `register_provider(profile)` at module level plus a `plugin.yaml`
(`kind: model-provider`) is **all that's needed**. `register_provider()` wires
up automatically: `PROVIDER_REGISTRY` entry, `api_mode=chat_completions`,
`base_url` from config/env, env-var priority order, `fallback_models`,
`--provider` flag, `hermes model` menu entry, `hermes setup` delegation,
`provider:model` alias parsing, runtime resolver. User plugins at
`$HERMES_HOME/plugins/model-providers/<name>/` override bundled ones of the
same name (last-writer-wins). Templates cited: `plugins/model-providers/nvidia/`,
`plugins/model-providers/gmi/`.

**Full path — OAuth / native providers**: pick one canonical provider id used
identically across `PROVIDER_REGISTRY` (`auth.py`), `_PROVIDER_LABELS` /
`_PROVIDER_ALIASES` (`models.py`), CLI `--provider` choices (`main.py`), setup
branches, and aux-model defaults — "if the id differs between those files, the
provider will feel half-wired." A **native** (non-chat-completions) provider
additionally needs `agent/<provider>_adapter.py` (SDK/HTTP client, token
resolution, message-format conversion, response normalization, usage/finish-
reason extraction) and `run_agent.py` branches at every `api_mode` switch
point (`__init__`, `_build_api_kwargs()`, `_interruptible_api_call()`,
interrupt/rebuild, response validation, finish-reason, token usage, fallback
activation).

**Documented pitfalls**: wiring auth but not model parsing (credentials work,
`/model` input fails); assuming `config["model"]` is always a string (it can be
a dict); assuming a built-in provider is required when a custom
OpenAI-compatible provider would do; forgetting auxiliary paths (main chat
works, summarization/vision/memory-flush silently degrade); missing
`api_mode`/`self.client.` branches hidden in `run_agent.py`; leaking
OpenRouter-only request fields to other providers; updating `hermes model`
but not `hermes setup` (both delegate through the same function, so this
should be rare, but the doc still flags it).

### 1.6 TUI & Desktop from Worktrees (`htui` / `hgui`)

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/worktree-ui-dev

These are **developer shell-function conveniences, not shipped Hermes
commands** — meant to be pasted into `~/.zshrc`. Problem solved: the Python
core runs fine from any git worktree, but `ui-tui/` and `apps/desktop/` each
need a populated `node_modules`, and `npm ci` per worktree is slow and
duplicates gigabytes.

**Deps-sharing model**: one canonical **deps checkout** (`HERMES_MAIN_CHECKOUT`
env var; `HERMES_GUI_DEPS_CHECKOUT` for desktop deps, defaults to the same) is
where `npm install` actually runs. Other worktrees symlink `node_modules` from
it **only when `package-lock.json` byte-matches** (`cmp -s`) — otherwise a
local `npm ci` runs. Neither env var is read by Hermes itself.

- `htui()` — wraps `hermes --tui --dev` (which already runs the Ink TUI from
  TypeScript source via `tsx`) pointed at the current worktree's `ui-tui/`.
  `--dev` and `HERMES_TUI_DIR` (prebuilt-bundle path, e.g. Nix) are mutually
  exclusive — `unset HERMES_TUI_DIR` first.
- `hgui()` — heavier: links `node_modules` at both repo root and
  `apps/desktop/`, pins Vite to port `5174` (killing any stale listener from a
  prior `hgui` run first), sets `HERMES_DESKTOP_HERMES_ROOT`,
  `HERMES_DESKTOP_PYTHON`, `HERMES_DESKTOP_IGNORE_EXISTING=1`,
  `HERMES_DESKTOP_CWD`, and installs an `INT`/`TERM`/`EXIT` trap
  (`_hermes_gui_cleanup`) because Electron frequently survives `Ctrl+C` via
  `concurrently` without reaping the ephemeral `dashboard --port 0` backend or
  the Vite process.

Full helper source (`_hermes_root`, `_hermes_link_deps`, `_hermes_gui_cleanup`)
is given verbatim in the doc as copy-paste shell functions.

### 1.7 Contributing

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/contributing

**Contribution priority order** (verbatim): 1) bug fixes (crashes, incorrect
behavior, data loss), 2) cross-platform compatibility, 3) security hardening
(shell injection, prompt injection, path traversal), 4) performance/robustness
(retries, error handling, graceful degradation), 5) new *broadly useful*
skills, 6) new tools ("rarely needed; most capabilities should be skills"),
7) documentation.

**Dev bootstrap** — recommended path is the standard installer, then working
inside the clone it creates (`$HERMES_HOME/hermes-agent`, usually
`~/.hermes/hermes-agent`) plus `uv pip install -e ".[all,dev]"`. A manual-clone
fallback exists for throwaway/CI checkouts, with an explicit warning: create
the venv **outside** the source tree, because an agent running against its own
checkout could `rm -rf venv` / `uv venv venv` and destroy its own running
runtime mid-session.

`scripts/dev-sandbox.sh python -m hermes_cli.main` runs a fully isolated
instance (throwaway `HERMES_HOME`, separate Electron userData/app name to
avoid the single-instance lock); `--persistent` keeps state across restarts,
scoped to the worktree.

**Cross-platform rules** (Windows footguns, stated as hard rules): never
reference `signal.SIGKILL` unguarded (route through
`gateway.status.terminate_pid(pid, force=True)` or
`getattr(signal, "SIGKILL", signal.SIGTERM)`); catch `OSError` alongside
`ProcessLookupError` on `os.kill(pid, 0)` probes (Windows raises `OSError`
WinError 87 for a dead PID); gate `os.setsid`/`os.killpg`/`os.getpgid`/`os.fork`
behind `sys.platform != "win32"`; always open files with explicit
`encoding="utf-8"`; use `pathlib.Path`, never manual `/`-concatenation for
subprocess-bound paths. `scripts/check-windows-footguns.py` lints for these.

**Security practices**: `shlex.quote()` for shell interpolation,
`os.path.realpath()` before access-control checks (symlink-bypass defense),
never log secrets, broad exception catching around tool execution.

**Commit convention**: Conventional Commits (`<type>(<scope>): <description>`),
scopes `cli, gateway, tools, skills, agent, install, whatsapp, security`.
Branch prefixes: `fix/`, `feat/`, `docs/`, `test/`, `refactor/`.

---

## 2. The Self-Improvement Machinery

This is the guide's central teaching topic. The mechanism is **not** a single
system — it's four cooperating pieces: (a) an in-turn nudge counter that
periodically forks a background review agent, (b) the review agent's own
prompt-encoded editorial policy for when/how to touch skills, (c) the curator,
a separate slower-cadence maintenance pass over the resulting skill library,
and (d) a user-triggered `/learn` command that is explicitly a *different*,
non-autonomous path. Trajectory export / batch generation is a fifth,
unrelated piece (offline RL data generation, not part of the live
self-improvement loop) documented at the end of this section.

### 2.1 How autonomous skill creation is actually triggered — the nudge mechanism

Source (repo, ground truth for internals): `agent/agent_init.py`,
`agent/conversation_loop.py`, `agent/turn_finalizer.py`,
`agent/background_review.py`, all at commit `d372fda6f0cf321b14aed84599a5b2a2d68e0338`.

**Config defaults**, set in `agent/agent_init.py` (`AIAgent.__init__` path):

```python
# agent/agent_init.py
agent._memory_nudge_interval = 10
agent._memory_nudge_interval = int(mem_config.get("nudge_interval", 10))
...
agent._skill_nudge_interval = 10
agent._skill_nudge_interval = int(skills_config.get("creation_nudge_interval", 10))
```

So the config keys are `memory.nudge_interval` (default `10`) and
`skills.creation_nudge_interval` (default `10`) in `config.yaml`.

**The counter** (`agent/conversation_loop.py`, inside the per-turn tool-calling
loop, once per API-call iteration):

```python
# Track tool-calling iterations for skill nudge.
# Counter resets whenever skill_manage is actually used.
if (agent._skill_nudge_interval > 0
        and "skill_manage" in agent.valid_tool_names):
    agent._iters_since_skill += 1
```

**The trigger check** (`agent/turn_finalizer.py`, at the end of the turn):

```python
_should_review_skills = False
if (agent._skill_nudge_interval > 0
        and agent._iters_since_skill >= agent._skill_nudge_interval
        and "skill_manage" in agent.valid_tool_names):
    _should_review_skills = True
    agent._iters_since_skill = 0
...
if final_response and not interrupted and (_should_review_memory or _should_review_skills):
    agent._spawn_background_review(
        messages_snapshot=list(messages),
        review_memory=_should_review_memory,
        review_skills=_should_review_skills,
    )
```

So "nudge" concretely means: **the counter increments once per tool-calling
API-call iteration** (not once per user message — a single user turn that
takes 5 tool-loop iterations advances the counter by 5), and once it reaches
10 (default) since the last skill review, the turn finalizer spawns a
background review **after the user-visible response has already been
delivered** — the review never competes with the user's task for model
attention or blocks the reply. The curator doc's "~every 10 agent turns" is an
approximation of this iteration-count mechanism (Source:
https://hermes-agent.nousresearch.com/docs/user-guide/features/curator, and
confirmed against the source comment at `agent/background_review.py:794`,
`"the review fires every ~10 turns"`).

### 2.2 The background review fork — mechanics

Source: `agent/background_review.py` (991 lines; module docstring quoted
verbatim below), commit `d372fda`.

> "After every turn, `AIAgent.run_conversation` may call
> `spawn_background_review` to fire off a daemon thread that replays the
> conversation snapshot in a forked `AIAgent` and asks itself 'should any
> skill/memory be saved or updated?'. Writes go straight to the memory + skill
> stores. Main conversation and prompt cache are never touched."

Key implementation facts, all read directly from the source:

- **Model routing**: by default the fork runs on the **parent's live runtime**
  (same provider/model/credentials/cached system prompt) so it hits the same
  warm prompt-cache prefix — `_resolve_review_runtime()` returns
  `routed=False`. A user can route it to a cheaper model via
  `auxiliary.background_review.{provider,model}` in `config.yaml`; when
  routed to a genuinely different model, the fork is cold regardless (can't
  reuse the parent's cache key), so it replays a **compact digest**
  (`_digest_history()`, keeps the last 24 messages verbatim, collapses older
  turns into one synthetic summary message) instead of the full transcript —
  "same model -> full replay; different model -> digest. That's the whole
  policy."
- **Tool whitelist**: the fork's toolset is restricted to `["skills"]` plus
  `"memory"` if memory is enabled on the profile — enforced via
  `set_thread_tool_whitelist()`, which denies any non-whitelisted tool call at
  runtime with the message `"Background review denied non-whitelisted tool:
  {tool_name}. Only memory/skill tools are allowed."`
- **Isolation from the live session**: `review_agent._persist_disabled = True`
  and `review_agent._session_db = None` — the fork shares the parent's
  `session_id` (for cache warmth) but is explicitly barred from writing to
  `state.db`. The source comment names the failure mode this prevents as
  **"the curator-takeover root cause"**: without this isolation, the fork's
  harness prompt ("Review the conversation above and update the skill
  library…") plus its own response would get written into the user's real
  session, and on the user's next live turn the agent would re-read that
  injected message as a standing instruction and "become" the curator,
  refusing the actual task (this was issue-tracked; the fix long-predates
  v0.19.0 but the isolation flags remain load-bearing).
- **Approval auto-deny**: any dangerous-command approval callback the fork
  might trigger is auto-denied (`_bg_review_auto_deny`), logged at warning
  level — the review fork cannot execute shell commands requiring approval.
- **Compression disabled**: `review_agent.compression_enabled = False` —
  compressing mid-review would risk rotating the shared `session_id` into a
  sibling child the gateway never adopts.
- **Nested nudges disabled inside the fork**: `review_agent._memory_nudge_interval = 0`
  and `review_agent._skill_nudge_interval = 0` — the review fork does not
  spawn its own review fork.

### 2.3 The review agent's editorial policy — how it decides what to save

Source: `agent/background_review.py`, `_SKILL_REVIEW_PROMPT` /
`_COMBINED_REVIEW_PROMPT` constants (verbatim strings sent as the review
fork's user message).

The prompt is opinionated and worth quoting precisely because it *is* the
autonomous-skill-creation policy — there is no separate "distillation model"
or heuristic classifier; a normal LLM turn just follows this instruction text:

> "Be **ACTIVE** — most sessions produce at least one skill update, even if
> small. A pass that does nothing is a missed learning opportunity, not a
> neutral outcome."

**Target shape**: "CLASS-LEVEL skills, each with a rich SKILL.md and a
`references/` directory for session-specific detail. Not a long flat list of
narrow one-session-one-skill entries."

**Signals that warrant an update** (any one is enough): the user corrected
style/tone/format/verbosity ("frustration signals ... are FIRST-CLASS skill
signals, not just memory signals"); the user corrected a workflow/approach;
a non-trivial technique/fix/workaround emerged; a loaded skill turned out
wrong or outdated.

**Strict preference order** for *where* the update lands (the model is
instructed to prefer the earliest fitting option):

1. **Patch a currently-loaded skill** (one the user invoked via `/skill-name`
   or the agent read via `skill_view` this session) — "It is the skill that
   was in play, so it's the right one to extend." *(This is the concrete
   mechanism behind "skills self-improve during use" — see §2.4.)*
2. **Patch an existing umbrella** found via `skills_list` + `skill_view`.
3. **Add a support file** under an existing umbrella
   (`skill_manage(action="write_file")`), with three named kinds:
   `references/<topic>.md` (session detail or condensed knowledge banks),
   `templates/<name>.<ext>` (copy-and-modify starters),
   `scripts/<name>.<ext>` (re-runnable verification/fixture/probe scripts).
4. **Create a new class-level umbrella skill** — only when nothing existing
   covers the class, and only with a class-level name: "The name MUST NOT be
   a specific PR number, error string, feature codename, library-alone name,
   or 'fix-X / debug-Y / audit-Z-today' session artifact."

**Explicit anti-capture list** ("Do NOT capture — these become persistent
self-imposed constraints that bite you later"): environment-dependent
failures (missing binaries, unconfigured credentials — "the user can fix
these, they are not durable rules"); negative claims about tools ("browser
tools do not work" — "these harden into refusals the agent cites against
itself for months after the actual problem was fixed"); session-specific
transient errors that resolved before the conversation ended; one-off task
narratives.

**Protected skills**: bundled skills and hub-installed skills are explicitly
off-limits to the review fork's edits (`skill_manage` also refuses `delete` on
curator-pinned skills at the tool layer — see §2.5). If the only skills
needing an update are protected, the correct output is the literal string
`"Nothing to save."`.

### 2.4 How skills "self-improve during use" — the mechanism, precisely

This phrase in the guide's brief maps to two concrete, separate code paths,
not one:

1. **In-session self-patching** — preference-order item 1 above
   (§2.3): every ~10 tool-iterations, if a skill that was loaded *this
   session* turns out to have been wrong, missing a step, or contradicted by
   what actually worked, the background review fork patches that skill file
   directly via `skill_manage(action="patch"|"edit"|"write_file")`. Because
   this fires on a cadence tied to tool-loop iterations rather than to
   explicit user action, a skill genuinely can be edited multiple times
   across a single long, tool-heavy conversation as the agent keeps
   discovering what the skill got wrong.
2. **Cross-session consolidation** — the curator's opt-in LLM pass (§2.5)
   periodically surveys all agent-created skills and can merge overlapping
   ones into class-level umbrellas, which is a slower, batched form of the
   same "the library gets better as it accumulates more real usage" property.

Usage telemetry (`~/.hermes/skills/.usage.json`, tracked per skill —
`use_count`, `view_count`, `patch_count`, `last_used_at`, `last_patched_at`,
`state`, `pinned`) is written by both paths and is what the curator reads to
decide `active → stale → archived` transitions. Counters: `view_count`
increments on `skill_view`; `use_count` increments when the skill is loaded
into a conversation's prompt; `patch_count` increments on any
`skill_manage patch/edit/write_file/remove_file` call.
(Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/curator,
"Usage telemetry" section.)

### 2.5 The Curator subsystem

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/curator
(website doc, primary source for CLI/config semantics below); corroborated
against `agent/curator.py` (2018 lines), `agent/curator_backup.py` (716
lines), `hermes_cli/curator.py` (698 lines, argparse tree confirmed to expose
exactly `status, run, pause, resume, pin, unpin, restore, list-archived,
archive, prune, backup, rollback`) at commit `d372fda`.

**What it is**: "a background maintenance pass for **agent-created skills**...
tracks how often each skill is viewed, used, and patched, moves long-unused
skills through `active → stale → archived` states, and periodically spawns a
short auxiliary-model review that proposes consolidations or patches drift."
It exists specifically because the self-improvement loop in §2.1–2.4
accumulates skills without bound: "Without maintenance, you end up with
dozens of narrow near-duplicates that pollute the catalog and waste tokens."
Tracks upstream issue [#7816](https://github.com/NousResearch/hermes-agent/issues/7816).

**Trigger, not a cron daemon**: checked on CLI session start and on a
recurring tick inside the gateway's cron-ticker thread. Fires when **both**
`interval_hours` (default 7 days) has elapsed since the last run **and**
`min_idle_hours` (default 2 hours) of agent idleness has passed. On a
brand-new install the first observation seeds `last_run_at` to "now" and
defers the first real pass by a full `interval_hours` — "gives you a full
interval to review your skill library... before the curator ever touches it."
When it runs, it spawns a background `AIAgent` fork — **"the same pattern
used by the memory/skill self-improvement nudges"** (i.e., architecturally
related to, but a separate spawn from, the per-turn nudge fork in §2.2).

**Two-phase run**:
1. **Automatic transitions** (deterministic, no LLM, always runs when curator
   is enabled): `stale_after_days` (30) → `stale`; `archive_after_days` (90) →
   moved to `~/.hermes/skills/.archive/`.
2. **LLM consolidation** (`curator.consolidate: true`, **off by default**,
   single aux-model pass, `max_iterations=8`): the forked agent surveys
   agent-created skills, can `skill_view` any of them, and decides
   keep/patch/consolidate-into-umbrella/archive. Consolidation is
   package-aware: a skill with `references/`/`templates/`/`scripts/`/`assets/`
   must be kept standalone, re-homed with rewritten paths, or archived whole
   — never flattened piecemeal into another skill's `references/`.

**Config** (`config.yaml`, under `curator:`):

```yaml
curator:
  enabled: true
  interval_hours: 168          # 7 days
  min_idle_hours: 2
  stale_after_days: 30
  archive_after_days: 90
  consolidate: false           # LLM umbrella-building pass — opt-in
  prune_builtins: true         # archive unused bundled skills too (hub skills always exempt)
  backup:
    enabled: true
    keep: 5
auxiliary:
  curator:
    provider: openrouter
    model: google/gemini-3-flash-preview
    timeout: 600
```

`prune_builtins: true` (default) lets the curator archive **unused bundled
built-in skills** too, after `archive_after_days`, alongside agent-created
skills — but bundled skills are only ever archived, never patched,
consolidated, or deleted. Hub-installed skills (from agentskills.io) are
categorically off-limits regardless of config. The curator **never
auto-deletes** — the worst outcome is a recoverable archive.

**"Agent-created" qualification** (precise, three-part test from
`~/.hermes/skills/.usage.json`): (1) not in `.bundled_manifest`, (2) not in
`.hub/lock.json`, (3) has `"created_by": "agent"` / `"agent_created": true`.
Only one code path currently sets that marker: **the background
self-improvement review fork**, when it creates a new umbrella skill during
its periodic pass, with write origin `"background_review"` (via
`tools/skill_provenance.py`) — this is "the only path that triggers the
`mark_agent_created()` call in `skill_manage`." Skills the *foreground* agent
creates mid-conversation via `skill_manage(action="create")` at the user's
explicit request are **not** marked agent-created and the curator leaves them
alone — a deliberate line between "autonomous background learning" and
"user-directed creation."

**CLI** (`hermes curator ...`):

```
hermes curator status              # last run, counts, pinned list, LRU top 5
hermes curator run [--consolidate] [--background] [--dry-run]
hermes curator backup [--reason "..."]
hermes curator rollback [--list] [--id <ts>] [-y]
hermes curator pause / resume
hermes curator pin <skill> / unpin <skill>
hermes curator restore <skill>
hermes curator list-archived
hermes curator archive <skill>
hermes curator prune [--days N]     # bulk-archive agent-created skills idle >= N days (default 90)
```

Also available as the `/curator` slash command inside a running session.

**Backups/rollback**: a `tar.gz` snapshot of `~/.hermes/skills/` is taken
before every real (non-dry-run) pass, at
`~/.hermes/skills/.curator_backups/<utc-iso>/skills.tar.gz`. `hermes curator
rollback` restores the newest snapshot (or `--id <ts>` for a specific one);
the rollback itself is reversible (it snapshots itself first, tagged
`pre-rollback to <target-id>`). Snapshots retained: `curator.backup.keep`
(default 5).

**Pinning**: `hermes curator pin <skill>` sets `"pinned": true` in
`.usage.json`. Pinned skills are exempt from curator auto-transitions **and**
from the agent's own `skill_manage(action="delete")` (which refuses and
points at `hermes curator unpin`) — but content **patches still go through**,
so the review fork in §2.3 can keep improving a pinned skill's body, just
never delete/archive/consolidate it. Only agent-created skills can be pinned.
A small hardcoded set of **protected built-ins** (e.g. `plan`, which backs the
`/plan` slash command) is never archivable/consolidatable under any
config/pin state, and is filtered out of the curator's candidate list
entirely.

**Per-run reports**: `~/.hermes/logs/curator/<timestamp>/run.json` (machine)
+ `REPORT.md` (human), including an explicit rename map (`old-name →
new-name`) when consolidation ran.

**Storage paths, consolidated**:

| Path | Contents |
|---|---|
| `~/.hermes/skills/.usage.json` | Per-skill telemetry + state + pin flag |
| `~/.hermes/skills/.archive/` | Archived skills (recoverable) |
| `~/.hermes/skills/.curator_backups/<utc-iso>/skills.tar.gz` | Pre-run snapshots |
| `~/.hermes/logs/curator/<timestamp>/{run.json,REPORT.md}` | Per-run audit output |
| `~/.hermes/skills/.bundled_manifest` | Which skills are bundled (excluded from agent-created test) |
| `~/.hermes/skills/.hub/lock.json` | Which skills are hub-installed (excluded from agent-created test) |

### 2.6 `/learn` — the non-autonomous counterpart

Source: `agent/learn_prompt.py` (module docstring + `_AUTHORING_STANDARDS`
constant), commit `d372fda`; cross-referenced against
https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills and
the v0.18.0 ("Judgment") release notes.

`/learn <anything>` is explicitly **user-triggered**, not part of the
autonomous nudge loop: "There is no separate distillation engine and no
model-tool footprint: the agent does the work with its existing toolset" —
`build_learn_prompt()` assembles one prompt instructing the *live* agent to
gather sources the user named (a directory via `read_file`/`search_files`, a
URL via `web_extract`, "what I just did" from conversation history, or pasted
text) and author a `SKILL.md` via `skill_manage` following the same
house-style authoring standards a maintainer would enforce in review
(embedded verbatim in the prompt: description ≤60 chars, `author: Hermes`
literal — never the OS username, etc.). Every surface (CLI `/learn`, gateway
`/learn`, the dashboard "Learn a skill" panel) calls the same
`build_learn_prompt()` function. Per the release notes (v0.18.0), skills
created this way honor the standards from the repo's own `CONTRIBUTING.md`.

### 2.7 Trajectory export & batch generation for RL training

Trajectory saving and batch generation are **offline data-generation
tooling**, unrelated to the live self-improvement loop above — they exist so
Hermes conversations (real or synthetically batch-run) can become RL/SFT
training data, not so the running agent learns from them at runtime.

**Trajectory format**, Source:
https://hermes-agent.nousresearch.com/docs/developer-guide/trajectory-format
(cross-checked against `agent/trajectory.py`, `run_agent.py`,
`trajectory_compressor.py`).

Saved as **ShareGPT-compatible JSONL**. Two on-disk variants:

- CLI/interactive (`_save_trajectory`) → `trajectory_samples.jsonl` (completed)
  / `failed_trajectories.jsonl` (failed/interrupted). Controlled by
  `agent.save_trajectories: true` in `config.yaml` (default `false`) or
  `--save-trajectories`.
- Batch runner → custom per-batch file (e.g. `batch_001_output.jsonl`) with
  extra fields: `prompt_index`, `metadata`, `api_calls`, `toolsets_used`,
  `tool_stats` (per-tool `{count, success, failure}`), `tool_error_counts` —
  all **normalized to include every possible tool with zero defaults** so
  HuggingFace `datasets.load_dataset("json", ...)` never hits an Arrow schema
  mismatch.

Role mapping: `system→system`, `user→human`, `assistant→gpt`, `tool→tool`.
Every `gpt` turn is guaranteed a `<think>...</think>` block (empty if no
reasoning was produced) — native provider `reasoning` fields and
system-prompt-instructed `<REASONING_SCRATCHPAD>` XML are both normalized into
this one shape. Tool calls are re-serialized as `<tool_call>{json}</tool_call>`
blocks; tool results as `<tool_response>{json}</tool_response>`, matched
positionally against the parent assistant's `tool_calls`. The system message
in the saved trajectory is **regenerated at save time** (not taken from the
live conversation) using the canonical Hermes function-calling template.
"Samples with zero reasoning across all turns are automatically discarded by
the batch runner to avoid polluting training data with non-reasoning
examples."

**Batch generation CLI** (`batch_runner.py`, `class BatchRunner`,
`def main(...)` dispatched via `fire.Fire(main)`) — confirmed directly from
source, not just docs:

```bash
python batch_runner.py --dataset_file=data.jsonl --batch_size=10 --run_name=my_run
python batch_runner.py --dataset_file=data.jsonl --batch_size=10 --run_name=my_run --resume
python batch_runner.py --dataset_file=data.jsonl --batch_size=10 --run_name=my_run --distribution=image_gen
python batch_runner.py --list_distributions
```

Full flag set from `def main(...)`: `dataset_file`, `batch_size`, `run_name`,
`distribution` (a named toolset-sampling distribution, see
`toolset_distributions.py`), `model` (default
`anthropic/claude-sonnet-4.6`), `api_key`, `base_url` (default
`https://openrouter.ai/api/v1`), `max_turns` (default 10), `num_workers`
(default 4, multiprocessing `Pool`), `resume`, `verbose`,
`list_distributions`, `ephemeral_system_prompt` (used at run time, **not**
saved into trajectories), `providers_allowed` / `providers_ignored` /
`providers_order` / `provider_sort` (OpenRouter provider routing),
`max_tokens`, `reasoning_effort` (`none|minimal|low|medium|high|xhigh|max|ultra`),
`reasoning_disabled`, `prefill_messages_file`, `max_samples`. Checkpointing
supports `--resume` for interrupted runs; tool-usage stats are aggregated
across all batches at the end via the same normalization helpers described
above.

**Trajectory compression for training-context budgets**
(`trajectory_compressor.py`, `datagen-config-examples/trajectory_compression.yaml`,
1598-line implementation, cross-checked from source): a **post-processing**
step (not part of live agent operation) that fits completed trajectories into
a target token budget by summarizing middle turns while protecting the first
system/human/gpt/tool turns and the last N turn-pairs verbatim. Config
example fetched directly from the repo:

```yaml
tokenizer:
  name: "moonshotai/Kimi-K2-Thinking"
  trust_remote_code: true
compression:
  target_max_tokens: 29000
  summary_target_tokens: 750
protected_turns:
  first_system: true
  first_human: true
  first_gpt: true
  first_tool: true
  last_n_turns: 4
summarization:
  model: "google/gemini-3-flash-preview"
  base_url: "https://openrouter.ai/api/v1"
  api_key_env: "OPENROUTER_API_KEY"
  temperature: 0.3
processing:
  num_workers: 4
  max_concurrent_requests: 50
  skip_under_target: true
  save_over_limit: true
```

This — trajectory export, batch generation, and trajectory compression —
is standalone offline tooling for building **external** RL/SFT training
corpora (e.g., for HermesBench-style model training runs); it is not wired
into the live per-turn or curator self-improvement loops described in
§2.1–2.5, and the docs make no claim that it is.

---

## 3. Mixture of Agents (MoA)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/mixture-of-agents
(primary); cross-checked against `hermes_cli/moa_cmd.py` (152 lines,
confirms exact `list`/`configure`/`delete` semantics) and
`hermes_cli/moa_config.py`, commit `d372fda`. Introduced/graduated to
first-class status in **v0.18.0 "The Judgment Release"** (2026-07-01) — per
that release's notes: "MoA graduated from a mode to a first-class part of the
model system this window" (PRs #46081, #53548, #53561, #53775, #53793,
#53855, #55625, #56101, #54016, #54007, #53580, #53780, #53827, #53281,
#53275, #53556, #55991, #53206).

**What it is**: MoA is a **virtual model provider** — every named preset
appears as a selectable model under a `moa` provider, on every surface
(`/model`, `hermes model`, dashboard picker, desktop app dropdown). Selecting
a preset makes its **aggregator** the acting model — the one that writes the
response and emits tool calls. Configured **reference models** run first and
their output becomes private advisory context for the aggregator.

**When to use it** (per the doc): "Use MoA when a hard task benefits from
multiple model perspectives but still needs Hermes' normal agent loop: tool
calls, follow-up iterations, interrupts, transcript persistence, and the same
session context as any other message."

**Agent-loop mechanics**, per turn, when provider `moa` is selected:
1. resolve the preset by name;
2. run reference models **without tool schemas** — they see only conversation
   user/assistant text, not the Hermes system prompt or tool-call transcript,
   "so reference calls stay cheap and avoid strict-provider rejections";
3. append reference outputs as private context for the aggregator;
4. call the aggregator with the normal Hermes tool schema;
5. treat the aggregator's response as the real model response;
6. execute any tool calls normally;
7. on the next iteration, the whole MoA process reruns over the updated
   conversation including tool results (subject to the `fanout` cadence
   below).

**Configuration** (`config.yaml`, `moa:` block, or `hermes moa configure`, or
the dashboard/desktop settings panel):

```yaml
moa:
  default_preset: default
  presets:
    default:
      reference_models:
        - provider: openai-codex
          model: gpt-5.5
        - provider: openrouter
          model: deepseek/deepseek-v4-pro
      aggregator:
        provider: openrouter
        model: anthropic/claude-opus-4.8
      max_tokens: 4096
      enabled: true
      # reference_max_tokens: 600          # cap advisor output length (uncapped by default)
      # fanout: user_turn | per_iteration | every_n:3
      # reference_temperature / aggregator_temperature   # omitted by default (provider defaults used)
```

- **`reference_max_tokens`** — advisor generation dominates per-turn latency
  (the turn waits for the slowest advisor); capping (e.g. `600`) trims wall
  time with little quality loss. Caps advisors only, never the aggregator's
  user-visible output. Unset = uncapped.
- **`fanout` (advisor cadence)** — three modes: `user_turn` (default since
  July 2026 — advisors run once per user turn, cheapest), `per_iteration`
  (advisors re-run every tool iteration — most expensive, freshest), `every_n:3`
  (advisors run on the turn's first iteration and every Nth thereafter,
  reusing cached guidance in between; counter resets each user message).
  **Note**: prior to July 2026 the default was `per_iteration`; it changed to
  `user_turn` "until per-mode benchmarks justify a costlier default."
- **`privacy_filter`** (`off` default, `display`, or `full`) — redacts
  emails/phone numbers from advisor output surfaces; `display` only redacts
  UI-visible reference blocks and saved traces (aggregator still sees raw
  text); `full` also redacts what's injected into the aggregator prompt.
  Credential-shaped strings (API-key prefixes, JWTs, DB connection strings)
  are always masked by Hermes' central redactor regardless of this setting.
- **Per-slot `reasoning_effort`** — reference and aggregator slots can each
  set independent reasoning effort (`none` through `ultra`).
- **`moa.save_traces`** (v0.18.0) — opt-in full-turn trace persistence to
  JSONL for debugging/eval.

**CLI** (confirmed directly against `hermes_cli/moa_cmd.py` source):

```
hermes moa list                    # aliases: ls — print all presets, default marked with *
hermes moa configure [name]        # interactive: pick reference models, then aggregator
hermes moa delete <name>           # refuses if it's the only preset; clears default_preset/active_preset if deleted
```

`hermes moa configure` walks an interactive picker (`_pick_slot`) over every
*configured* provider (excluding `moa` itself, to block recursive presets) and
its models, letting you add reference models one at a time until you choose
"Done," then configure the aggregator the same way. Source confirms:
**"A preset's aggregator cannot be another MoA preset. Recursive MoA trees are
intentionally blocked"** (doc-level claim, matches the `_model_options()`
filter in `moa_cmd.py` that excludes the `moa` slug from slot pickers).

**Slash-command sugar**: `/moa <prompt>` is one-shot — runs a single turn
through the *default* preset, then restores the previous model. `/moa`
(bare) prints usage. To persistently switch, use the model picker instead —
"`/moa` is deliberately not a model switch, so a normal prompt can never
accidentally change your model."

**Benchmarks** (HermesBench, per the doc): a two-model preset — Opus-4.8
aggregator over a GPT-5.5 reference — scores 0.8202 vs. 0.7607 for Opus alone
and 0.7412 for GPT-5.5 alone: "~6 points" above its strongest component.

**Prompt caching**: explicitly engineered so MoA "does not sacrifice prompt
caching on either call type." Reference-model calls receive a stable
(system-prompt/tool-transcript-stripped) view that itself caches across
iterations; aggregator calls append reference output to the *tail* of the
latest user turn, below the entire stable prefix, so the cached prefix is
untouched — "exactly how every normal turn behaves." The main conversation's
cache is "never broken" by selecting/switching MoA.

**Notes / constraints**: not listed under `hermes tools` (no toolset to
enable/disable); `enabled: false` on a preset disables reference fan-out for
that preset only (aggregator acts alone); credential failures on one
reference model don't abort the turn (included as a failure note, turn
continues with whatever references succeeded); MoA multiplies model-call
count (one iteration = N reference calls + 1 aggregator call).

---

## 4. Kanban / Projects — Multi-Agent Board

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
(primary reference page, 981 lines — read in full), plus
https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-worker-lanes
and https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban-tutorial
(narrative walkthrough, not separately excerpted here). `hermes project`
semantics are sourced directly from `hermes_cli/projects_cmd.py` (335 lines,
full module read) since no dedicated website page for the CLI-level Projects
command was found — it's a comparatively new (v0.18.0-era) primitive whose
canonical documentation currently lives in the module docstring itself.
Shipped v0.13.0 "The Tenacity Release" (2026-05-07), matured across 104 PRs in
v0.15.0 "The Velocity Release" (2026-05-28) — both release-note excerpts
quoted in-line below.

### 4.1 What Kanban is

"Hermes Kanban is a durable task board, shared across all your Hermes
profiles, that lets multiple named agents collaborate on work without
fragile in-process subagent swarms. Every task is a row in
`~/.hermes/kanban.db`; every handoff is a row anyone can read and write;
every worker is a full OS process with its own identity."

**Two front doors, one backing store**: agents drive the board through a
dedicated `kanban_*` tool schema (never by shelling out to `hermes kanban`);
humans/scripts/cron drive it through `hermes kanban …` / `/kanban …` / the
dashboard. Both routes go through the same `kanban_db` layer.

**vs. `delegate_task`** (doc's comparison table, reproduced):

| | `delegate_task` | Kanban |
|---|---|---|
| Shape | RPC (fork → join) | Durable message queue + state machine |
| Parent | Blocks until child returns | Fire-and-forget after `create` |
| Child identity | Anonymous subagent | Named profile with persistent memory |
| Resumability | None | Block → unblock → re-run; crash → reclaim |
| Human in the loop | Not supported | Comment / unblock at any point |
| Agents per task | One call = one subagent | N agents over the task's life |
| Audit trail | Lost on context compression | Durable SQLite rows forever |
| Coordination | Hierarchical | Peer — any profile reads/writes any task |

"One-sentence distinction: `delegate_task` is a function call; Kanban is a
work queue where every handoff is a row any profile (or human) can see and
edit." They compose — a kanban worker can call `delegate_task` internally.

### 4.2 Core data model

- **Board** — a standalone queue: own SQLite DB, `workspaces/` dir, dispatcher
  loop. A fresh install has one board, `default`, DB at `~/.hermes/kanban.db`
  (back-compat path); non-default boards live at
  `~/.hermes/kanban/boards/<slug>/kanban.db`.
- **Task** — row with title, optional body, one assignee (profile name),
  status (`triage | todo | ready | running | blocked | done | archived`),
  optional tenant, optional idempotency key.
- **Link** (`task_links`) — parent→child dependency; dispatcher promotes
  `todo → ready` once all parents are `done`.
- **Comment** — the inter-agent protocol; full thread is read by a worker on
  every (re-)spawn.
- **Workspace** — three kinds: `scratch` (default, ephemeral tmp dir, deleted
  on completion except declared `artifacts`), `dir:<path>` (must be absolute
  — relative paths rejected at dispatch as a "confused-deputy escape
  vector"; preserved on completion), `worktree` (git worktree under
  `.worktrees/<id>/`, preserved on completion).
- **Dispatcher** — long-lived loop, default tick 60s
  (`kanban.dispatch_interval_seconds`), runs **inside the gateway** by
  default (`kanban.dispatch_in_gateway: true`); reclaims stale/crashed
  claims, promotes ready tasks, atomically claims and spawns. After
  `kanban.failure_limit` (default 2) consecutive spawn failures on one task
  it auto-blocks with the last error.
- **Tenant** — soft namespace *within* a board (data isolation by workspace
  path + memory key prefix); boards are the hard isolation boundary.

### 4.3 Boards (multi-project within Kanban itself)

```bash
hermes kanban boards list
hermes kanban boards create atm10-server --name "ATM10 Server" --icon 🎮 --switch
hermes kanban --board atm10-server list          # operate without switching
hermes kanban boards switch atm10-server
hermes kanban boards show
hermes kanban boards rename atm10-server "ATM10 (Prod)"
hermes kanban boards rm atm10-server              # archive (recoverable — moves dir)
hermes kanban boards rm atm10-server --delete      # hard delete, no recovery
```

Board resolution precedence: explicit `--board` > `HERMES_KANBAN_BOARD` env
(set by the dispatcher when spawning a worker, so workers can't see other
boards) > `~/.hermes/kanban/current` > `default`. Slugs: lowercase
alphanumerics/hyphens/underscores, 1–64 chars, must start alphanumeric —
path-traversal characters rejected at the CLI layer. Per-board isolation is
absolute: separate DB, `workspaces/`, `logs/`; cross-board task linking is
disallowed.

### 4.4 `hermes project` — binding a board to a named workspace

Source: `hermes_cli/projects_cmd.py`, module docstring quoted verbatim:

> "A Project is a human-named workspace spanning one or more folders, with
> one designated primary repo. Projects anchor desktop session grouping and
> (when bound to a kanban board) give kanban tasks a deterministic worktree +
> branch convention. State lives in the per-profile
> `$HERMES_HOME/projects.db` store... This is a footprint-ladder rung-2
> capability: a CLI command + gateway RPC, with zero model-tool schema cost."

Full subcommand tree, read directly from `build_parser()`:

```
hermes project create <name> [folders...] [--slug SLUG] [--primary PATH]
                              [--description D] [--icon I] [--color C]
                              [--board SLUG] [--use]
hermes project list / ls [--all]                 # --all includes archived
hermes project show <project>
hermes project add-folder <project> <path> [--label L] [--primary]
hermes project remove-folder <project> <path>
hermes project rename <project> <name>
hermes project set-primary <project> <path>
hermes project use [<project>]                   # omit to clear active project
hermes project archive <project>
hermes project restore <project>
hermes project bind-board <project> [<board>]     # omit board to unbind
```

**`bind-board` mechanics** (`_cmd_bind_board` / `_sync_board_default_workdir`,
read directly from source): sets `projects.db`'s `board_slug` column on the
project, then — if a board was actually specified (not unbinding) —
best-effort points that board's `default_workdir` (via
`hermes_cli.kanban_db.write_board_metadata`) at the project's `primary_path`.
This is how "binding a project to a board" concretely changes kanban
behavior: **new tasks created on that board default their working directory
to the project's primary repo**, anchoring kanban task worktrees to the
project's repo, unless a task overrides `--workspace` explicitly. Failures in
this sync step are swallowed (non-fatal) — the binding itself has already
succeeded even if the workdir sync fails.

`hermes project` is explicitly framed as the newer, general-purpose layer:
Projects "anchor desktop session grouping" independent of Kanban (the desktop
app's `project → repo → lane` model, shipped v0.18.0 per that release's
highlights: "First-class coding Projects in the desktop app... a proper
`project → repo → lane` model") **and**, only when explicitly bound, give
Kanban a default workdir convention. A project can exist and be used purely
for desktop session grouping with no board bound at all.

### 4.5 How workers interact with the board — the `kanban_*` toolset

The dispatcher spawns a worker with `HERMES_KANBAN_TASK=<id>` set in its
child env, which flips on a dedicated tool schema (also available to
orchestrator profiles that enable the `kanban` toolset explicitly):

| Tool | Purpose | Required params |
|---|---|---|
| `kanban_show` | Read current task: title, body, prior attempts, parent handoffs, comments, pre-formatted `worker_context`. Defaults to the env's task id. | — |
| `kanban_list` | List task summaries (filters: assignee, status, tenant, archived, limit) — orchestrator discovery. | — |
| `kanban_complete` | Finish, with `summary` + `metadata` structured handoff. | one of `summary`/`result` |
| `kanban_block` | Stop and route by `kind`: `dependency` (auto-resumes via `todo`), `needs_input`/`capability`/`transient` (surfaces to a human). | `reason` |
| `kanban_heartbeat` | Liveness signal for long operations. | — |
| `kanban_comment` | Durable note on the task thread. | `task_id`, `body` |
| `kanban_create` | (Orchestrators) fan out into child tasks. | `title`, `assignee` |
| `kanban_link` | (Orchestrators) add parent→child dependency after the fact. | `parent_id`, `child_id` |
| `kanban_unblock` | (Orchestrators) move blocked → ready/todo. | `task_id` |

**Why tools instead of shelling to `hermes kanban`** — three reasons given
verbatim: (1) backend portability — a worker on a remote terminal backend
(Docker/Modal/SSH) running `hermes kanban complete` would execute *inside the
container* where `hermes` isn't installed and `~/.hermes/kanban.db` isn't
mounted, whereas the tools run in the agent's own Python process and always
reach the real DB; (2) no shell-quoting fragility for structured metadata;
(3) structured JSON errors instead of stderr strings.

**Worker lifecycle** (auto-injected `KANBAN_GUIDANCE` system-prompt block,
"nothing to install or configure"): `kanban_show()` on spawn → `cd
$HERMES_KANBAN_WORKSPACE` → periodic `kanban_heartbeat` (at least hourly for
long operations — the dispatcher reclaims after
`kanban.dispatch_stale_timeout_seconds`, default 4h, with no heartbeat in the
last hour) → terminal `kanban_complete` or `kanban_block`. If the process
exits 0 while the task is still `running`, that's a **protocol violation**
(`kanban.py`'s dispatcher emits the `protocol_violation` event). Hermes
injects up to two synthetic pre-exit nudges when it detects the model about
to stop without a terminal tool call (disable via `HERMES_KANBAN_STOP_NUDGE=0`);
the dispatcher separately gives protocol violations a bounded retry (default 3
consecutive) before auto-blocking.

**Orchestrator pattern**: a "well-behaved orchestrator does not do the work
itself" — it decomposes via `kanban_create`/`kanban_link`/`kanban_comment` and
steps back. The dispatcher silently fails on unknown assignee names, so the
injected orchestrator guidance includes a Step-0 profile-discovery prompt.

### 4.6 Dispatch, claim, decompose, specify — the orchestration verbs

- **`dispatch`** — `hermes kanban dispatch [--dry-run] [--max N]
  [--failure-limit N]` — one-shot pass outside the normal 60s tick (also
  reachable via dashboard "Nudge dispatcher" button / `POST
  /api/plugins/kanban/dispatch?max=…&dry_run=…`).
- **`claim`** — `hermes kanban claim <id> [--ttl SECONDS]` — atomic claim of
  a ready task (used internally by the dispatcher; exposed for manual/testing
  use). Default claim TTL: `DEFAULT_CLAIM_TTL_SECONDS` (15 min) — but only
  reclaimed if the worker's PID has actually died; a live worker mid-long-call
  gets its claim **extended**, not killed.
- **`decompose`** — `hermes kanban decompose <id> | --all` — runs the
  auxiliary-LLM **decomposer** (`auxiliary.kanban_decomposer` model slot) on
  a triage task, reading the installed profile roster + descriptions, and
  atomically creates a child-task graph + links the root + flips
  `triage → todo`. **Auto mode** (`kanban.auto_decompose: true`, default) runs
  this automatically on the dispatcher's tick, capped at
  `kanban.auto_decompose_per_tick` (default 3) tasks per tick. The decomposer
  never assigns `assignee=None` — an unrouted child falls back to
  `kanban.default_assignee` or the active default profile. **Manual mode**
  (`kanban.auto_decompose: false`) leaves triage tasks parked until decompose
  is invoked explicitly. Decompose is a strict superset of specify — it falls
  back to specify-style single-task promotion when the LLM judges fan-out
  unwarranted.
- **`specify`** — `hermes kanban specify [<id> | --all] [--tenant T]` — a
  single-task spec rewrite: the `auxiliary.triage_specifier` model fleshes out
  a rough triage one-liner into a full body and promotes `triage → todo`,
  without fanning out into children.
- **`swarm`** — `hermes kanban swarm "<goal>" --workers a,b,c --verifier
  <profile> --synthesizer <profile>` — creates a full **Kanban Swarm v1**
  graph in one command: a completed root/blackboard card, N parallel worker
  cards, a verifier card gated on all workers, a synthesizer card gated on
  the verifier. Shared context lives as structured JSON comments on the root
  card.

### 4.7 Parent/child linking and promotion

`kanban_link` / `hermes kanban link <parent_id> <child_id>` records a
`task_links` row. The dispatcher auto-promotes `todo → ready` once **all**
parents of a task are `done` (`kanban.auto_promote_children`, default `true`
— set `false` to require manual `hermes kanban promote <id>...` review).
Archiving a parent promotes its dependents (config-mediated); reopening a
parent demotes ready children back down. `unblock` only ever routes a task to
`ready` (all parents done) or `todo` (a parent still open, dependency-gated,
auto-promoted later) — never to `triage`. A **block-loop breaker**
(`BLOCK_RECURRENCE_LIMIT`, default 2) reroutes a task to `triage` for human
judgment if it's blocked→unblocked→re-blocked for the *same reason* that many
times — "a deterministic DB guard, not an LLM judgment call," and the
recurrence counter survives unblocks (resets only on a successful complete).

### 4.8 Runs — attempt history and structured handoff

A **task** is the logical unit; a **run** (`task_runs` table) is one attempt.
`kanban_complete(summary=..., metadata={...}, result=...)` writes onto the run
row; `metadata` is free-form JSON that downstream/child tasks read via
`build_worker_context`. Recommended metadata shape (convention, not schema):
`changed_files`, `verification`, `dependencies`, `blocked_reason`,
`retry_notes`, `residual_risk`. **Bulk close is refused** when `--summary` is
given across multiple ids, on the reasoning that per-run structured handoff
copy-pasted across N tasks is "almost always wrong" — bulk close without
summary/metadata still works for admin cleanup. Status changes that pull a
task off `running` (dashboard drag, or archiving a running task) close the
in-flight run with `outcome='reclaimed'` rather than orphaning it; completing
a never-claimed task synthesizes a zero-duration run so the handoff isn't
lost. Two nullable columns (`workflow_template_id`, `current_step_key`) are
reserved, unused by the v1 kernel, for a future v2 workflow-routing layer.

### 4.9 Event reference (task_events table)

Three clusters, queryable via `hermes kanban watch --kinds a,b,c`:

- **Lifecycle**: `created`, `promoted`, `claimed`, `completed`, `blocked`,
  `dependency_wait`, `block_loop_detected`, `unblocked`, `archived`.
- **Edits**: `assigned`, `edited`, `reprioritized`, `status`.
- **Worker telemetry**: `spawned`, `heartbeat`, `reclaimed`, `crashed`,
  `timed_out`, `stale`, `respawn_guarded`, `spawn_failed`,
  `protocol_violation`, `gave_up`.

`respawn_guarded` reasons: `blocker_auth` (last failure was quota/auth/429 —
wait for the rate window), `recent_success` (a completed run happened within
the guard window — wait for review), `active_pr` (a GitHub PR URL appears in
a recent comment — a prior worker already opened one). `gave_up` is the
circuit breaker: fires after N consecutive non-successful attempts
(`task.max_retries` → `kanban.failure_limit` → built-in default, in that
precedence), auto-blocking with the last error.

### 4.10 Dashboard, REST, and security posture

Bundled dashboard plugin at `plugins/kanban/` (per
[Extending the Dashboard] pattern), REST under `/api/plugins/kanban/`,
WebSocket at `/events?since=<event_id>` tailing the append-only
`task_events` table. **Security model, stated explicitly**: the dashboard's
HTTP auth middleware *skips* `/api/plugins/` routes by design (they're meant
to be reached only because the dashboard binds to localhost by default) — if
you run `hermes dashboard --host 0.0.0.0`, every plugin route including
Kanban's becomes reachable from the network with no auth: "**Don't do that on
a shared host.**" The WebSocket alone requires the dashboard's ephemeral
session token as a `?token=` query param.

### 4.11 Worker lanes — the extension contract

Source: kanban-worker-lanes.md. A "lane" is a class of process the dispatcher
can route to; three things a lane must provide: (1) an assignee string
matching a Hermes profile name (default) or a plugin-registered
non-spawnable identifier; (2) a spawn mechanism (default:
`hermes -p <assignee> chat -q <prompt>` with `HERMES_KANBAN_TASK`,
`HERMES_KANBAN_DB`, `HERMES_KANBAN_BOARD`, `HERMES_KANBAN_WORKSPACE`,
`HERMES_KANBAN_RUN_ID`, `HERMES_KANBAN_CLAIM_LOCK`, `HERMES_PROFILE`,
`HERMES_TENANT` env vars); (3) a lifecycle terminator — exactly one of
`kanban_complete`, `kanban_block`, or an unterminated exit that the kernel
reaps as `crashed`/`gave_up`/`timed_out`. Wiring a non-Hermes CLI (Codex CLI,
Claude Code CLI, OpenCode) as a lane is explicitly **"not yet a paved path"**
— the dispatcher's `spawn_fn` is pluggable but the surrounding integration
work is per-integration design work; tracked at issue #19931.

### 4.12 Out of scope

"Kanban is deliberately single-host. `~/.hermes/kanban.db` is a local SQLite
file and the dispatcher spawns workers on the same machine... If you need
multi-host, run an independent board per host and use `delegate_task` / a
message queue to bridge them."

### 4.13 Release history

- **v0.13.0 "The Tenacity Release" (2026-05-07)**: shipped as "durable
  multi-profile collaboration board" — heartbeat, reclaim, zombie detection,
  auto-block on incomplete exit, per-task retries, hallucination-claim
  recovery gate, multi-project boards.
- **v0.15.0 "The Velocity Release" (2026-05-28)**: "Kanban grew into a real
  multi-agent platform — 104 PRs end to end": orchestrator auto-decomposition
  on triage, `hermes kanban swarm` topology helper, per-task model overrides,
  board-level default workdirs, per-task worktree paths/branches, scheduled
  task starts, configurable claim TTL, retry fingerprinting, stale-task
  detection, respawn guards, drag-to-delete trash zone, worker visibility
  endpoints (`/workers/active`, `/runs/{id}`, `/inspect`).

---

## 5. Webhooks and the Hooks System

### 5.1 Webhooks (inbound event-driven agent triggers)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks

The webhook adapter is an HTTP server (default port `8644`) that accepts
POSTs from external services (GitHub, GitLab, JIRA, Stripe, etc.), validates
HMAC signatures, transforms payloads into agent prompts via templates, and
routes the agent's response back to the source or another platform.

**Setup**: `hermes gateway setup` wizard, or env vars
`WEBHOOK_ENABLED=true`, `WEBHOOK_PORT=8644`, `WEBHOOK_SECRET=<global-secret>`
in `~/.hermes/.env`. Health check: `GET /health` → `{"status":"ok","platform":"webhook"}`.

**Route config** (`platforms.webhook.extra.routes.<name>` in `config.yaml`):
`events` (accept-list, empty = all), `secret` (required — HMAC, or
`INSECURE_NO_AUTH` for loopback-only testing), `prompt` (dot-notation
template, `{__raw__}` dumps full JSON truncated at 4000 chars), `filters`
(declarative payload gate: `exists`, `missing`, `equals`/`not_equals`,
`contains`, `in`, `in_file`, `regex`, `all`/`any`/`not` groups), `script`
(filter/transform script under `~/.hermes/scripts/`, JSON payload on stdin,
`[SILENT]` or nonzero exit ignores the event), `skills` (skills to load for
the run), `deliver` (target platform or `log`, default), `deliver_extra`
(delivery-specific keys, template-capable), `deliver_only` (skip the agent
entirely — zero LLM cost, sub-second, the rendered prompt becomes the literal
delivered message).

**Dynamic subscriptions** (agent- or user-driven, no `config.yaml` edit or
gateway restart):

```bash
hermes webhook subscribe github-issues \
  --events "issues" \
  --prompt "New issue #{issue.number}: {issue.title}" \
  --deliver telegram --deliver-chat-id "-100123456789" \
  --description "Triage new GitHub issues"
hermes webhook list
hermes webhook remove github-issues
hermes webhook test github-issues [--payload '{"issue": {...}}']
```

Stored at `~/.hermes/webhook_subscriptions.json`, hot-reloaded (mtime-gated)
on each incoming request; static `config.yaml` routes always take precedence
over a dynamic route of the same name. The doc notes the agent itself can
create subscriptions via the terminal tool, guided by a `webhook-subscriptions`
skill, when asked to "set up a webhook for X."

**Security layers**: HMAC per-source (`X-Hub-Signature-256` for GitHub,
plain `X-Gitlab-Token` match for GitLab, `X-Webhook-Signature-V2` +
`X-Webhook-Timestamp` — HMAC of `<timestamp>.<body>`, ±300s replay window —
as the recommended generic scheme, with a legacy V1 header still accepted but
logged as deprecated since it has no replay protection); every route requires
a secret or startup fails; rate limit 30 req/min/route by default
(`platforms.webhook.extra.rate_limit`); idempotency cache keyed on
`X-GitHub-Delivery`/`X-Request-ID` for 1 hour; body size cap 1 MB
(`max_body_bytes`).

**`:::warning` — "Authenticated does not mean trusted"**, quoted because it's
the governance-relevant line: "HMAC validation authenticates the *sender*,
not the *content*... PR titles, commit messages, issue descriptions... are
authored by arbitrary third parties and must be treated as untrusted... The
trust boundary is the agent's capability surface, not the input channel."
Recommended hardening: sandbox the runtime (Docker/SSH backend) for
internet-exposed webhook routes, scope the toolset (disable `terminal`/`file`
on read-and-summarize routes), keep approvals on, template narrowly (named
fields over `{__raw__}`).

Response codes documented precisely: `200` delivered /
`200 status=duplicate` (idempotency hit) / `401` bad signature / `400`
malformed JSON / `404` unknown route / `413` body too large / `429` rate
limited / `502` delivery target rejected (generic `Delivery failed` body to
avoid leaking adapter internals).

### 5.2 The Hooks System (three distinct hook mechanisms)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks
(1499 lines — read in full); confirmed against `hermes_cli/hooks.py` (394
lines) for the exact CLI subcommand set.

Hermes has **three separate hook systems**, deliberately distinguished by the
doc's opening comparison table:

| System | Registered via | Runs in | Use case |
|---|---|---|---|
| Gateway hooks | `HOOK.yaml` + `handler.py` in `~/.hermes/hooks/` | Gateway only | Logging, alerts, webhooks |
| Plugin hooks | `ctx.register_hook()` in a plugin | CLI + Gateway | Tool interception, metrics, guardrails |
| Shell hooks | `hooks:` block in `config.yaml` | CLI + Gateway | Drop-in scripts: blocking, auto-format, context injection |

All three are non-blocking: "errors in any hook are caught and logged, never
crashing the agent."

**Gateway event hooks** — a directory `~/.hermes/hooks/<name>/` with
`HOOK.yaml` (`name`, `description`, `events: [...]`) and `handler.py`
(`async def handle(event_type: str, context: dict)`, must be named `handle`,
sync or async both work). **Event catalog** (verbatim from the doc's table):

| Event | When | Context keys |
|---|---|---|
| `gateway:startup` | Gateway process starts | `platforms` |
| `session:start` | New messaging session | `platform, user_id, session_id, session_key` |
| `session:end` | Session ended (pre-reset) | `platform, user_id, session_key` |
| `session:reset` | `/new` or `/reset` | `platform, user_id, session_key` |
| `agent:start` | Agent begins processing | `platform, user_id, session_id, message` |
| `agent:step` | Each tool-loop iteration | `platform, user_id, session_id, iteration, tool_names` |
| `agent:end` | Agent finishes | `platform, user_id, session_id, message, response` |
| `reaction:added` / `reaction:removed` | Emoji reaction seen (Slack adapter today) | `platform, reaction, user_id, item_user_id, item_type, channel_id, message_ts, team_id, event_ts, raw_event` |
| `command:*` | Any slash command (wildcard) | `platform, user_id, command, args` |

**Plugin hooks** — the same event surface documented in the Plugin guide
(§1.4), with full per-hook parameter tables on this page: `pre_tool_call`,
`post_tool_call`, `pre_llm_call` (context injection), `post_llm_call`,
`pre_verify`, `on_session_start/end/finalize/reset`, `subagent_start/stop`,
`pre_gateway_dispatch`, `pre_approval_request`, `post_approval_response`,
`transform_tool_result`, `transform_terminal_output`, `transform_llm_output`.

**Shell hooks** — `hooks:` block in `config.yaml`, event name must be one of
`VALID_HOOKS` (typos get a "Did you mean X?" warning and are skipped):

```yaml
hooks:
  <event_name>:
    - matcher: "<regex>"          # pre/post_tool_call only
      command: "<shell command>"  # runs via shlex.split, shell=False
      timeout: <seconds>          # default 60, clamped at 300
hooks_auto_accept: false
```

**JSON wire protocol** — stdin payload:
`{"hook_event_name", "tool_name", "tool_input", "session_id", "cwd", "extra": {...}}`
(`tool_name`/`tool_input` null for non-tool events). stdout response shapes
(both Claude-Code-style and Hermes-canonical accepted and normalized):
`{"decision":"block","reason":"..."}` / `{"action":"block","message":"..."}`
to block a `pre_tool_call`; `{"context": "..."}` to inject at `pre_llm_call`;
`{"action":"continue","message":"..."}` / `{"decision":"block","reason":"..."}`
to keep the agent going at the `pre_verify` gate. Malformed JSON, non-zero
exit, and timeouts log a warning but never abort the loop.

**Consent model**: each unique `(event, command)` pair prompts for approval
on first sight, then persists to `~/.hermes/shell-hooks-allowlist.json`
(keyed on the exact command string — "script edits are silently trusted";
`hermes hooks doctor` flags mtime drift to catch this). Three ways to
bypass the interactive prompt: `--accept-hooks` CLI flag,
`HERMES_ACCEPT_HOOKS=1` env var, or `hooks_auto_accept: true` in
`cli-config.yaml` — one of these is required for non-TTY contexts (gateway,
cron, CI), otherwise a newly-added hook silently stays unregistered.

**The `hermes hooks` CLI** — confirmed directly against `hermes_cli/hooks.py`
source (`_cmd_list`, `_cmd_test`, `_cmd_revoke`, `_cmd_doctor` functions all
present, matching the doc exactly):

```
hermes hooks list                                          # matcher, timeout, consent status
hermes hooks test <event> [--for-tool X] [--payload-file F] # fire matching hooks against a synthetic payload
hermes hooks revoke <command>                                # remove every allowlist entry matching <command>
hermes hooks doctor                                          # exec bit, allowlist status, mtime drift, JSON validity, rough exec time
```

**Ordering/precedence**: both plugin hooks and shell hooks flow through the
same `invoke_hook()` dispatcher; plugins register first
(`discover_and_load()`), shell hooks second (`register_from_config()`) — so a
Python plugin's `pre_tool_call` block decision wins ties. First valid block
wins overall.

---

## 6. Egress Firewall / Proxy — Governance-Relevant Controls

Two entirely distinct commands exist, and the docs are explicit that they are
not the same feature:

> "It is **not** the inbound `hermes proxy` command, which is an OAuth
> aggregator reverse proxy. Different command (`hermes egress`), different
> direction."
> — Source: https://hermes-agent.nousresearch.com/docs/user-guide/egress/iron-proxy

### 6.1 `hermes egress` — outbound credential-injection firewall

Source: https://hermes-agent.nousresearch.com/docs/user-guide/egress/iron-proxy
(primary, 570 lines, read in full); index page
https://hermes-agent.nousresearch.com/docs/user-guide/egress; internals page
https://hermes-agent.nousresearch.com/docs/developer-guide/egress-internals.

**What it controls and why it exists**: when Hermes runs an agent inside a
Docker terminal sandbox, that sandbox normally holds real upstream API keys
(`OPENROUTER_API_KEY`, etc.) as plain env vars — "a prompt-injected agent in
that sandbox can `cat ~/.config/openrouter/auth.json` or `printenv | grep -i
key` and exfiltrate them." The egress proxy is the fix: **the sandbox never
holds a real key, only an opaque proxy token**. All sandbox outbound traffic
routes through a local `iron-proxy` daemon (Apache-2.0, Go,
[ironsh/iron-proxy](https://github.com/ironsh/iron-proxy), pinned version
v0.39.0, lazy-installed and SHA-256-verified) on the host, which terminates
TLS via a locally-generated CA, swaps the proxy token for the real credential,
and forwards upstream. This is Docker-only as of the current release — Modal,
Daytona, SSH, and Singularity backends do not yet receive proxy env vars or CA
mounts.

**Governance framing, quoted directly** because it's precisely the audience
this section is written for: "Compromise the sandbox and the attacker walks
away with tokens that only work behind the **configured trusted proxy
boundary** — the CA private key and the proxy endpoint integrity are part of
that boundary. If traffic can be redirected to attacker-controlled proxy
infrastructure (e.g. a stolen CA private key or a hijacked proxy endpoint),
the token guarantee no longer holds."

**Default allowlisted upstream hosts**: `openrouter.ai` (+ `*.openrouter.ai`),
`api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`,
`api.x.ai`, `api.mistral.ai`, `api.groq.com`, `api.together.xyz`,
`api.deepseek.com`, `inference.nousresearch.com`. Extend via
`proxy.extra_allowed_hosts` (wildcard-capable).

**SSRF deny CIDRs** (checked at connect time regardless of allowlist, so DNS
rebinding through an allowed hostname can't reach them): loopback
(`127.0.0.0/8`, `::1/128`), link-local + cloud metadata
(`169.254.0.0/16`, `fe80::/10` — **explicitly includes AWS/GCP/Azure IMDS at
169.254.169.254**), RFC1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`),
IPv6 ULA (`fc00::/7`), IPv4-mapped-IPv6 (`::ffff:0:0/96` — closes a dual-stack
IMDS bypass), CGNAT (`100.64.0.0/10`), RFC2544 benchmark range
(`198.18.0.0/15`).

**Auth-scheme coverage**: header-token providers are covered (OpenRouter,
OpenAI, Groq, Together, DeepSeek, Mistral, xAI, Nous via `*_API_KEY` in
`Authorization`; Anthropic native via `x-api-key`+`Authorization`; Azure
OpenAI via `api-key`+`Authorization`; Gemini via `x-goog-api-key` header or
`?key=` query param). **Explicitly uncovered / not protected**: AWS
Bedrock/SageMaker (SigV4 request signing) and GCP Vertex AI (OAuth minted
from a service-account file) — "if their env vars are present, the sandbox
holds **real credentials** for those providers and the egress isolation
guarantee is incomplete for them."

**CLI** (confirmed against `hermes_cli/proxy_cli.py` / `agent/proxy_sources/iron_proxy.py`
internals page):

```
hermes egress install [--force]
hermes egress setup [--tunnel-port N] [--from-bitwarden|--no-bitwarden] [--rotate-tokens]
hermes egress start / stop / restart / reload
hermes egress status [--show-tokens]
hermes egress disable                 # flips proxy.enabled=false, does not stop a running daemon
hermes egress config                  # prints path to proxy.yaml
```

**Bitwarden rotation semantics**: with `credential_source: bitwarden`, the
daemon refetches secrets from BWS (`bws secret list <project_id>`) on **every
start** — rotate in the BW web app, then `hermes egress stop && start`; no
`.env` edit, no host-process restart. Fails loud by default if the BWS token
is unset or the fetch returns no mapped values (`proxy.allow_env_fallback:
true` opts back into silent fallback for staged migrations).

**Bind policy** (never `0.0.0.0`): Linux binds the Docker bridge gateway
(`172.17.0.1:<port>` typically, reachable via `host.docker.internal`, "not
exposed to the LAN" but reachable by other containers on the default bridge —
still gated by a minted token + allowlist); macOS/Windows Docker Desktop binds
loopback. "A LAN peer with a leaked proxy token cannot use the proxy — neither
bind is reachable from the external network."

**Explicit security-model statement — what it does and does NOT protect**
(quoted in full because this is exactly the governance-audience content
requested):

Protects against: a prompt-injected sandbox agent exfiltrating real keys via
`printenv`/credential files; a compromised sandbox dependency phoning home to
an arbitrary host (default-deny allowlist); cloud metadata endpoint access;
DNS rebinding to a private IP; same-uid processes scraping the daemon's env
(only mapped names are forwarded); a LAN peer spending your quota with a
leaked token.

Does **not** protect against: a compromised **host** process (defense-in-depth
for sandbox compromise only); loss of the trusted-proxy boundary itself (CA
key theft or proxy-endpoint hijack — cites
[MITRE ATT&CK T1588.004](https://attack.mitre.org/techniques/T1588/004/));
sandbox processes that bypass `HTTPS_PROXY` via raw sockets (Node.js partially
mitigated via `NODE_OPTIONS=--use-openssl-ca`, but code that passes its own
`ca` option to `tls.connect()` is not covered — "a known v1 limitation");
credential files explicitly mounted into Docker (egress only covers env-var
credentials, not arbitrary mounted files); allowlisted-host data exfiltration
(an agent can still put stolen data in a request body to an allowed host — the
proxy logs it but doesn't block it); uncovered SigV4/service-account
providers; in-memory secret zeroization inside the Go binary (a same-uid
`/proc/<pid>/mem` reader could recover swapped secrets — "out of scope for
this layer").

**State directory** (`~/.hermes/proxy/`, dir mode `0o700`): `ca.crt` (0o644,
public), `ca.key` (0o600, "never leaves the host", `O_NOFOLLOW`-protected
against symlink TOCTOU), `proxy.yaml` (0o600), `mappings.json` (0o600, proxy
token → real env var name), `iron-proxy.pid`/`.nonce` (0o600, PID-recycle
defense), `iron-proxy.log` (0o600, **currently holds both daemon and
per-request records** on the pinned v0.39 binary — a dedicated `audit.log`
path is pre-created and reserved for a future binary version that supports
`log.audit_path`, but stays empty until then).

**Complementary, separate control**: `docs/security/network-egress-isolation.md`
describes a different, network-topology-level pattern (two Docker networks —
`internal` with no default route, and `egress` with a Squid/Envoy-style proxy
— for containerized deployments) aimed at the same threat class
(prompt-injection-driven exfiltration via `curl`/`wget`) but implemented at
the Docker Compose network layer rather than via credential substitution.
This is a deployment guide, not a `hermes egress`-managed feature — it
predates or complements iron-proxy depending on deployment shape.

### 6.2 `hermes proxy` — inbound OAuth-subscription aggregator (distinct feature)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/subscription-proxy

A **local HTTP server** (default `http://127.0.0.1:8645/v1`) that lets
*external* OpenAI-compatible apps (OpenViking, Karakeep, Open WebUI, etc.) use
a Hermes-managed OAuth provider subscription (Nous Portal, xAI/Grok) as their
LLM endpoint — "the app never needs a static API key." It is explicitly
**not** the egress firewall: different command, opposite direction (inbound
serving vs. outbound sandbox isolation), and it doesn't rewrite credentials
for anything — it's a "credential-attaching pass-through," no transformation,
no request-body logging, no agent loop.

```
hermes proxy start [--host 0.0.0.0] [--port 8645]
hermes proxy providers          # currently: nous, xai
hermes proxy status
```

Only forwards a fixed allow-list of paths for the active adapter (for Nous
Portal: `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`,
`/v1/models`) — anything else 404s. Binds `127.0.0.1` by default; exposing on
LAN (`--host 0.0.0.0`) carries an explicit warning — "the proxy has no auth
of its own — it accepts any bearer... anyone on your network can now use your
Portal subscription." Extensible via a pluggable `UpstreamAdapter` interface
in `hermes_cli/proxy/adapters/<provider>.py`.

---

## Facts uncertain / needs verification

- **Kanban `hermes project` — no dedicated end-user website doc page was
  found.** The full semantics documented in §4.4 come from the module
  docstring and argparse tree in `hermes_cli/projects_cmd.py` (repo source,
  high confidence for *what the CLI does*), not from a Docusaurus page aimed
  at end users. If Nous ships a dedicated Projects page later, it should
  supersede this section as the primary source.
- **`docs/hermes-kanban-v1-spec.pdf`** is referenced repeatedly by the kanban
  docs as the canonical design-rationale document (competitive analysis vs.
  Cline Kanban / Paperclip / NanoClaw / Google Gemini Enterprise, the eight
  canonical collaboration patterns with worked examples) but is a binary PDF
  in the repo — not fetched or read for this pass. Anything attributed to
  "the design spec" beyond what's quoted in kanban.md itself is unverified.
- **`agent/curator.py` (2018 lines) and `hermes_cli/curator.py` (698 lines)
  were fetched but not read line-by-line** — the website doc
  (`user-guide/features/curator.md`) was treated as authoritative for
  end-user-facing behavior and cross-checked only for the CLI subcommand list
  and the `.usage.json` schema shape. Internal implementation details beyond
  what the doc states (e.g. exact consolidation-pass prompt text, exact SQL/
  file-move sequencing) were not independently verified against the source.
- **The exact wording of `KANBAN_GUIDANCE`** (the system-prompt block injected
  into every kanban worker, referenced repeatedly as the mechanism that
  teaches workers the lifecycle and teaches orchestrators the anti-temptation
  rules) lives in `agent/prompt_builder.py`, which was not fetched in this
  pass — only its existence and role are documented, via citation, not its
  literal text.
- **MoA HermesBench numbers** (0.8202 / 0.7607 / 0.7412) are quoted directly
  from the website doc's benchmarks table; no independent benchmark run or
  raw HermesBench results file was located or verified.
- **Whether trajectory export / `batch_runner.py` output is *actually*
  consumed anywhere in Nous's own RL training pipeline** is not documented in
  the repo or website docs available to this research pass — the tooling
  exists and is fully documented as a mechanism, but no source confirms it is
  in active use for a specific published Hermes model's training run (vs.
  being general-purpose tooling available to anyone).
- **`docs/security/network-egress-isolation.md`'s relationship to
  `hermes egress`** is inferred (both target the same threat class, one via
  network topology, one via credential substitution) rather than stated
  explicitly by either document — no page cross-links the two, so whether one
  supersedes, complements, or predates the other is not confirmed in-repo.
- **Kanban `hermes kanban daemon`** is documented as deprecated in favor of
  the gateway-embedded dispatcher, with a `--force` "escape hatch... for one
  release cycle" — the exact release by which it's removed entirely was not
  stated in the fetched doc and was not separately verified against a
  deprecation-schedule source.
