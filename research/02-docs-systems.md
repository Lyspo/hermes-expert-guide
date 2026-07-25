# Hermes Agent — Advanced Systems Documentation Corpus

Compiled July 2026 from https://hermes-agent.nousresearch.com/docs/. All content below was fetched live from the cited URLs; nothing is inferred beyond what each page states. Verbatim quotes are marked with quotation marks and are all under 15 words.

Docs index / sidebar discovered at `/docs/` — full nav tree:
- User Stories & Use Cases → `/docs/user-stories`
- Getting Started → `/docs/getting-started/quickstart`, `/docs/getting-started/installation`, `/docs/getting-started/learning-path`
- Using Hermes (CLI) → `/docs/user-guide/cli`
- Features → `/docs/user-guide/features/overview`
- Messaging Platforms → `/docs/user-guide/messaging/`
- Integrations → `/docs/integrations/`
- Guides & Tutorials → `/docs/guides/run-nemotron-3-ultra-free`, `/docs/guides/use-mcp-with-hermes`, `/docs/guides/use-voice-mode-with-hermes`, `/docs/guides/tips`
- Developer Guide → `/docs/developer-guide/contributing`
- Reference → `/docs/reference/cli-commands`, `/docs/reference/faq`, `/docs/reference/skills-catalog`, `/docs/reference/optional-skills-catalog`

Product tagline (verbatim): "an autonomous agent that gets more capable the longer it runs." Self-improving loop: agent "creates skills from experience, improves them during use." Built by Nous Research; 20+ (elsewhere stated 27+) messaging platforms; multiple execution backends from local to serverless.

---

## 1. Memory System

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory

- Core persistent memory is a **two-file system**, not the "three layers" framing hypothesized pre-research:
  - `MEMORY.md` — agent's environment notes, conventions, lessons learned. Limit: 2,200 chars (~800 tokens).
  - `USER.md` — user profile: preferences, communication style, expectations. Limit: 1,375 chars (~500 tokens).
- Storage location: `~/.hermes/memories/`.
- Memory is injected into the system prompt as a "frozen snapshot at session start," preserving the LLM prefix cache; changes persist to disk immediately but only appear in the prompt at the *next* session.
- Agent operates memory via a `memory` tool with actions: `add`, `replace` (substring match via `old_text`), `remove` (substring match). **No read action** — memory auto-appears in system context.
- Two memory targets: `memory` (environment/project facts) and `user` (name, role, timezone, preferences, skill level).
- Save-proactively examples given: user preferences, environment facts, corrections, conventions, completed work w/ dates, explicit requests. Skip: trivial info, easily re-discovered facts, raw dumps, session-specific paths, content already in SOUL.md/AGENTS.md.
- Capacity management: when limit exceeded, `memory` tool errors with usage %, current entries, and instruction to consolidate. Best practice: consolidate at 80% capacity. Exact duplicates auto-rejected. Entries scanned for injection patterns, credentials, invisible Unicode before acceptance.
- **Session Search** (separate from MEMORY.md/USER.md): `session_search` tool queries a SQLite DB at `~/.hermes/state.db` using **FTS5 full-text search**. Returns actual raw messages, "no summarization." ~20ms FTS5 query, ~1ms scroll. CLI: `hermes sessions list`.
  - Comparison table given: Persistent Memory (~1,300 tokens, instant, always-available facts, manually curated) vs Session Search (unlimited capacity, ~20ms query, past-conversation recall, automatic storage).
- Config (YAML, in `~/.hermes/config.yaml`):
```yaml
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200
  user_char_limit: 1375
  write_approval: false

display:
  memory_notifications: on  # off | on | verbose

auxiliary:
  background_review:
    provider: openrouter
    model: google/gemini-3-flash-preview

skills:
  write_approval: false
```
- `write_approval: true` gates writes: CLI prompts inline; other platforms stage writes reviewable via `/memory pending`, `/memory approve <id>`, `/memory reject <id>`, `/memory approval on/off`.
- `display.memory_notifications`: off = silent (review still runs), on (default) = generic "💾 Memory updated" line, verbose = shows diff preview e.g. "💾 Memory ➕ User prefers terse replies." Per-platform override: `display.platforms.<platform>.memory_notifications`.
- Background review can run on a cheaper "auxiliary" model to avoid burning the main model's budget; when the auxiliary model differs from main, review uses a "compact digest (recent turns verbatim + older summary)."
- Skills share the same write-approval gate mechanism (`skills.write_approval`) with parallel `/skills pending|diff|approve|reject|approval` commands.
- **External Memory Providers** (8, run *alongside* — not replacing — built-in memory): Honcho, OpenViking, Mem0, Hindsight, Holographic, RetainDB, ByteRover, Supermemory. These "add semantic search, knowledge graphs, automatic fact extraction, and cross-session user modeling." Setup: `hermes memory setup`; status: `hermes memory status`; disable: `hermes memory off`.
  - Note: Honcho (mentioned in the task prompt as a hypothesized layer) is documented here only as one of eight optional *external* memory-provider plugins, not a built-in core layer.

---

## 2. Skills System

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/skills

- Standard: adheres to the **agentskills.io open specification**.
- Storage: `~/.hermes/skills/` is "the primary source of truth." Each skill = its own directory with a required `SKILL.md` file (YAML frontmatter + markdown body).
- Frontmatter fields observed: `name`, `description` (≤60 chars recommended), `version`, `platforms: [macos, linux, windows]` (optional), `author`, `required_environment_variables` (list of `{name, prompt, help}`), `metadata.hermes.{tags, category, fallback_for_toolsets, requires_toolsets, fallback_for_tools, requires_tools, config}`.
- Directory layout per skill: `SKILL.md` (required), `references/`, `templates/`, `scripts/`, `examples/`, `assets/` (all optional). A `.bundled_manifest` file at the skills-root tracks sync state of bundled (built-in) skills.
- Invocation: every installed skill auto-becomes a slash command (`/skill-name [instruction]`). Verbatim: "Every installed skill is automatically available as a slash command."
- **Skill stacking**: chain up to 5 leading `/skill-name` tokens in one message (`/skill-a /skill-b /skill-c your instruction`); parsing stops at first non-skill token.
- **`/learn` command**: converts existing knowledge into a skill file from local dirs (`/learn ~/projects/sdk focus on auth`), URLs (`/learn https://docs.example.com/api`), conversation history (`/learn how I deployed staging`), or pasted text. Saves via the `skill_manage` tool; no separate ingestion engine.
- **Progressive disclosure** (3 levels, token-efficient): Level 0 `skills_list()` → metadata only (~3k tokens: name/description/category); Level 1 `skill_view(name)` → full content; Level 2 `skill_view(name, path)` → specific reference file.
- **Conditional activation**: `fallback_for_toolsets`/`requires_toolsets` (and `_tools` variants) hide/show a skill based on whether a toolset/tool is already available. Example given: bundled `duckduckgo-search` skill uses `fallback_for_toolsets: [web]`.
- **Skill Bundles**: YAML files at `~/.hermes/skill-bundles/<slug>.yaml` grouping multiple skills under one slash command:
```yaml
name: backend-dev
description: Backend feature workflow
skills:
  - github-code-review
  - test-driven-development
  - github-pr-workflow
instruction: |
  Always start with failing tests, then implement.
```
  CLI: `hermes bundles create backend-dev --skill tool1 --skill tool2 -d "Description"`, `list`, `show <name>`, `delete <name>`, `reload`. Bundles win on slug collision; missing skills in a bundle are silently skipped.
- **`skill_manage` tool** (agent-facing, procedural CRUD): actions `create` (name+content, optional category), `patch` (targeted old_string/new_string, preferred), `edit` (full rewrite), `delete`, `write_file` (support files), `remove_file`.
- Write-approval gate: `skills.write_approval: true` stages writes to `~/.hermes/pending/skills/`; review via `/skills pending`, `/skills diff <id>`, `/skills approve <id>`, `/skills reject <id>`.
- **External skill directories**: `skills.external_dirs` in config.yaml supports `~`, absolute paths, and `${ENV_VAR}` expansion. New skills always write to `~/.hermes/skills/`; local skills shadow external duplicates of the same name; nonexistent paths silently ignored.
- **Environment-variable secure setup**: skills declare `required_environment_variables` without disappearing from discovery; Hermes prompts securely only on local CLI load; declared vars auto-pass to `execute_code`/`terminal` sandboxes.
- **Output/media delivery directives**: bare absolute file paths in agent output auto-detected and delivered natively (Telegram photo, Discord attachment). `[[audio_as_voice]]` promotes an audio file to a native voice-message bubble. `[[as_document]]` forces downloadable-attachment delivery instead of inline preview; directive stripped before send; all-or-nothing per response.
- **Skills Hub / registries** — sources: `official` (built into repo, trusted, e.g. `official/security/1password`), `skills-sh` (Vercel's public directory), `well-known` (URL-based via `/.well-known/skills/index.json`), `url` (direct HTTP(S) to SKILL.md), `github` (repo/path installs), plus `clawhub`, `lobehub`, `browse-sh`.
- **Trust levels**: `builtin` (ships with Hermes, always trusted) → `official` (repo's `optional-skills/`, built-in trust, no warning) → `trusted` (openai/skills, anthropics/skills, huggingface/skills, NVIDIA/skills — permissive policy) → `community` (everything else; non-dangerous findings overridable with `--force`).
- Commands: `hermes skills browse [--source]`, `search <term> [--source]`, `install <skill> [--force]`, `inspect <skill>`, `list`, `check`, `update [skill]`, `audit`, `uninstall <skill>`, `reset <skill> [--restore] [--yes]`, `opt-out [--remove]`, `opt-in [--sync]`, `publish`, `snapshot`, `tap add|list|remove`, `config`.
- **Custom skill taps** (publishing): a tap = a GitHub repo of curated skills under a `skills/` path (configurable). Slug = directory name. Skill names starting with `.` or `_` are ignored. Non-default paths configured in `~/.hermes/.hub/taps.json`, e.g. `{"taps": [{"repo": "my-org/platform-docs", "path": "internal/skills/"}]}`.
- **Bundled skills sync**: manifest at `~/.hermes/skills/.bundled_manifest` tracks content hashes; unchanged bundled skills get silently updated on `hermes update`, user-modified ones are permanently skipped (protecting edits). `--no-skills` install flag / `hermes profile create research --no-skills` opts a profile out entirely, writing a `.no-bundled-skills` marker.
- `skills.guard_agent_created: true` enables a content scanner specifically for agent-authored skills.
- References cited on the page: Bundled Skills Catalog `/docs/reference/skills-catalog`; Optional Skills Catalog `/docs/reference/optional-skills-catalog`.

---

## 3. MCP Integration

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp

- MCP lets Hermes connect to external tool servers (GitHub, DBs, APIs, browsers) "without native implementation." Supports local stdio subprocess servers and remote HTTP endpoints, with automatic tool discovery/registration at startup.
- Config location: `~/.hermes/config.yaml` under `mcp_servers:` key.
- **Stdio transport**:
```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
```
- **HTTP transport**:
```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```
- **OAuth-authenticated HTTP**:
```yaml
mcp_servers:
  linear:
    url: "https://mcp.linear.app/mcp"
    auth: oauth
```
- Config keys table: `command`, `args`, `env`, `url`, `headers`, `client_cert` (mTLS, string/list), `client_key` (separate PEM), `timeout` (per-call), `connect_timeout` (handshake), `idle_timeout_seconds` (recycle idle stdio server), `max_lifetime_seconds` (total server age before recycle), `enabled` (bool), `supports_parallel_tool_calls` (bool), `tools` (per-server filter mapping).
- Auth methods: API keys prompted at install, stored in `~/.hermes/.env`; OAuth (remote MCP) via `auth: oauth`, tokens cached at `~/.hermes/mcp-tokens/<server>.json`; OAuth for third-party providers via `hermes auth <provider>`; mTLS (combined PEM, separate cert/key, encrypted key + passphrase); `${VAR}` env substitution resolved at connect time from `~/.hermes/.env`.
- **MCP catalog**: curated, one-click installs for "Nous-approved" MCPs. Verbatim: "Manifests are gated by PR review into the hermes-agent repo, so Nous has reviewed each entry before it shipped." Manifests live at `optional-mcps/<name>/manifest.yaml` on GitHub.
- Tool-selection flow: after credentials configured, Hermes probes the server and shows a checklist; pre-checked rows come from prior selections, manifest `tools.default_enabled`, or all tools as last resort; failed probes fall back to manifest defaults.
- Discovery: happens at startup; tools auto-register into the central tool registry. Servers can push `notifications/tools/list_changed` to trigger re-fetch without manual reload (lock-protected against overlapping refresh).
- Tool naming convention: `mcp_<server_name>_<tool_name>` (e.g. `mcp_filesystem_read_file`); special chars → underscores.
- Utility tools exposed when the server supports the capability: `list_resources`/`read_resource` (resources), `list_prompts`/`get_prompt` (prompts).
- Per-server filtering: `enabled: false` disables entirely; `tools.include: [...]` whitelist; `tools.exclude: [...]` blacklist; `tools.prompts: false` / `tools.resources: false` disable utility categories. If both include and exclude set, **include wins**.
- CLI: `hermes mcp` (interactive picker, default), `hermes mcp catalog` (plain-text list), `hermes mcp install <name>`, `hermes mcp configure <name>`, `hermes mcp add <name> --preset <preset>` (e.g. `codex` preset), `hermes mcp remove <name>`, `hermes mcp list`, `hermes mcp test <name>`, `hermes mcp login <name>`, `/reload-mcp` slash command, `hermes mcp serve` (run Hermes itself as an MCP server).
- Advanced: browser-based servers (e.g. Playwright) can recycle via `idle_timeout_seconds`/`max_lifetime_seconds`; `supports_parallel_tool_calls: true` enables concurrent read-only calls; **MCP sampling** lets a server request LLM inference from Hermes:
```yaml
sampling:
  enabled: true
  model: "openai/gpt-4o"
  max_tokens_cap: 4096
  max_rpm: 10
  max_tool_rounds: 5
```
- `hermes mcp serve` exposes Hermes's messaging capabilities to other MCP clients (Claude Code, Cursor) via 10 tools including `conversations_list`, `messages_send`, `channels_list`, and event polling.
- Security: stdio subprocess env is filtered — "only explicitly configured environment variables plus safe baseline are passed"; config-level include/exclude controls model-visible surface area.
- Troubleshooting notes on page: connection failures → check deps/Node/npm/config; missing tools → check connection, discovery success, filters, capability support, `enabled: false`.

---

## 4. Voice Mode

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode

- Pipeline: **Speech-to-Text → LLM Processing → Text-to-Speech**, with voice-activity detection (VAD) for silence handling and sentence-by-sentence streaming TTS.
- Activation — CLI: start with `hermes` or `hermes --tui`; enable with `/voice on` or `/voice tts`; press **Ctrl+B** to record (configurable via `voice.record_key`); auto-stops after 3.0s silence.
- Activation — messaging: `/voice on` (voice replies only to voice messages), `/voice tts` (voice replies to all messages), `/voice off`.
- Activation — Discord voice channels: `/voice join` (bot joins caller's VC), `/voice leave`; bot listens to authorized users and replies via TTS.
- STT providers table: Local faster-whisper (base/small/large-v3, free, no key), Groq whisper-large-v3-turbo (~0.5s, free tier, key required), OpenAI whisper-1/gpt-4o-transcribe (~1-2s, paid), Mistral voxtral-mini-latest (paid), xAI grok-stt (paid). Priority fallback order: **local → groq → openai**.
```yaml
stt:
  enabled: true
  provider: "local"  # or groq, openai, mistral, xai
  local:
    model: "base"    # tiny, base, small, medium, large-v3
```
- TTS providers table: Edge TTS (free, ~1s, default/fallback), ElevenLabs (paid, ~2s, excellent quality), OpenAI TTS (paid, ~1.5s), NeuTTS (free, CPU/GPU-dependent).
```yaml
tts:
  provider: "edge"
  edge:
    voice: "en-US-AriaNeural"  # 322 voices available
  elevenlabs:
    voice_id: "pNInz6obpgDQGcFmaJgB"
    model_id: "eleven_multilingual_v2"
```
- Install requirements: Python extras via `uv` — `voice` (sounddevice, numpy), `messaging` (discord.py[voice], aiohttp), `tts-premium` (ElevenLabs), optional `neutts[all]` for local TTS. System deps: PortAudio, ffmpeg, Opus (Discord), espeak-ng (NeuTTS phonemizer).
- Streaming TTS: replies spoken sentence-by-sentence; text buffered into complete sentences (min 20 chars), markdown/emoji stripped before synthesis; chunked-PCM providers (ElevenLabs, OpenAI) stream raw audio for lowest latency.
- **Barge-in**: user can interrupt mid-reply; CLI VAD detects incoming speech and cuts playback automatically; alternative: press record key or type to stop instantly; agent is notified it was interrupted.
- **Hallucination filter**: 26 known phantom phrases across languages plus regex catching repetitive variants (example given: "Thank you for watching").
- **Silence detection (two-stage)**: (1) speech confirmation — RMS >200 for ≥0.3s; (2) end detection — triggers after 3.0s continuous silence; auto-stop if no speech detected for 15s.
```yaml
voice:
  silence_threshold: 200
  silence_duration: 3.0
  max_recording_seconds: 120
  beep_enabled: true
```
- Discord VC setup: permissions Connect, Speak, Use Voice Activity; updated permissions integer `309240908864`; privileged Gateway Intents needed: Presence, Server Members (conditional, only if `DISCORD_ALLOWED_USERS` uses usernames), Message Content (required). Env vars: `DISCORD_BOT_TOKEN`, `DISCORD_ALLOWED_USERS`, `DISCORD_REQUIRE_MENTION`, `DISCORD_FREE_RESPONSE_CHANNELS`.
- Voice-channel processing flow: bot listens per-user audio stream independently → detects silence (1.5s after ≥0.5s speech) → transcribes (local/Groq/OpenAI) → runs through full agent pipeline (session, tools, memory) → speaks reply via TTS with echo-prevention pause → transcript posted to text channel as `[Voice] @user: what you said`.
- Platform audio delivery: Telegram = Opus/OGG voice bubble (ffmpeg converts MP3 if needed); Discord = native Opus/OGG voice bubble with file-attachment fallback.
- API keys in `~/.hermes/.env`: `GROQ_API_KEY`, `VOICE_TOOLS_OPENAI_KEY`, `ELEVENLABS_API_KEY`, `STT_GROQ_MODEL`, `STT_OPENAI_MODEL`, `GROQ_BASE_URL`. Zero-cost path: local faster-whisper + Edge TTS needs no API keys at all.
- Related CLI: `hermes`, `hermes --tui`, `hermes gateway`, `hermes gateway setup`, `hermes model`.

---

## 5. Personality & SOUL.md

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/personality

- `SOUL.md` location: `~/.hermes/SOUL.md` (standard) or `$HERMES_HOME/SOUL.md` (custom home). Hermes auto-creates a starter file if none exists; verbatim: "existing user SOUL.md files are never overwritten."
- Loading: occupies **slot #1** in the system prompt (the agent-identity position); loaded **only** from `HERMES_HOME`, "never from current working directory." If empty/whitespace-only/unreadable, falls back to a built-in default identity ("You are Hermes Agent, an intelligent AI assistant created by Nous Research…"). Content is "injected verbatim after security scanning and truncation."
- Recommended contents: tone/communication style, level of directness, how to handle uncertainty/disagreement, stylistic dos/don'ts. Explicitly excluded: one-off project instructions, file paths/repo conventions, temporary workflow details — "use AGENTS.md instead" for those.
- Example structure shown on page uses `# Personality` with `## Style`, `## What to avoid`, `## Technical posture` sections, describing a pragmatic senior-engineer identity that prefers "simple systems over clever systems."
- **`/personality` command**: session-level overlay, e.g. `/personality concise`, `/personality technical`. 12 built-in options: helpful, concise, technical, creative, teacher, kawaii, pirate, shakespeare, noir, philosopher, hype (11 named + "helpful" = 12 total per page). Custom personalities definable in `~/.hermes/config.yaml` under `agent.personalities`.
- SOUL.md vs AGENTS.md distinction (verbatim rule of thumb): SOUL.md = "if it should follow you everywhere"; AGENTS.md = "if it belongs to a project."
- Security: "SOUL.md is scanned like other context-bearing files for prompt injection patterns before inclusion."

---

## 6. Context Files

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files

- Project-local file types, checked at startup in priority order: `.hermes.md` / `HERMES.md` (highest priority, "Project instructions"), `AGENTS.md` (project conventions/architecture), `CLAUDE.md` (Claude Code context files), `.cursorrules` (Cursor IDE conventions), `.cursor/rules/*.mdc` (Cursor rule modules).
- **Only one project context type loads per session — first match wins**: `.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`.
- Directory-walking behavior: `.hermes.md`/`HERMES.md` walks up to the git root; `AGENTS.md`/`CLAUDE.md` checked in "CWD at startup + subdirectories progressively"; `.cursorrules` is "CWD only." Progressive discovery during the session checks "the directory and up to 5 parent directories" as the agent navigates via file/terminal tools; each subdirectory checked at most once per session.
- **SOUL.md is always loaded independently** of this system, as agent identity in slot #1 — not subject to the "first match wins" project-file logic.
- Startup process (function named `build_context_files_prompt()`): scan CWD for first match → read UTF-8 → security-scan for prompt injection → truncate if over `context_file_max_chars` (default 20,000 chars) → assemble under a `# Project Context` header → inject into system prompt.
- Size limits: max 20,000 chars/file (~7,000 tokens, configurable); truncation ratio 70% head / 20% tail / 10% marker; subdirectory-discovered files capped at 8,000 chars. Truncation message format: `[...truncated AGENTS.md: kept 14000+4000 of 25000 chars. Use file tools to read the full file.]`
- Prompt-injection scanning detects: instruction overrides ("ignore previous instructions"), deception ("do not tell the user"), system-prompt overrides, hidden HTML comments, invisible/zero-width Unicode, credential-exfiltration attempts. Blocked-file message format: `[BLOCKED: AGENTS.md contained potential prompt injection (prompt_injection). Content not loaded.]`
- Format guidance (no mandated markup): use `##` sections for architecture/conventions/notes; include concrete examples, preferred code patterns, API shapes, naming conventions, key paths/ports, explicit constraints (e.g. "Never modify migration files directly").
- Cursor IDE compatibility: `.cursorrules` and `.cursor/rules/*.mdc` load only if no higher-priority context file exists.

---

## 7. Security

Source: https://hermes-agent.nousresearch.com/docs/user-guide/security

### Gateway authorization
- Check order: per-platform allow-all flag → DM-pairing approved list → platform-specific allowlist → global allowlist → global allow-all → **default deny**. Verbatim warning: "If no allowlists are configured and GATEWAY_ALLOW_ALL_USERS is not set, all users are denied."
- Platform allowlists: comma-separated user IDs in `~/.hermes/.env` (e.g. `TELEGRAM_ALLOWED_USERS=123456789`). Global: `GATEWAY_ALLOWED_USERS`, `GATEWAY_ALLOW_ALL_USERS`.
- **DM pairing**: unknown users get an 8-char pairing code, owner approves via CLI. Config: `unauthorized_dm_behavior: pair|ignore`. Security limits: 1-hour TTL, 1 request/user/10min, max 3 pending codes, 5 failed attempts → 1-hour lockout. Commands: `hermes pairing approve <platform> <code>`, `list`, `revoke`, `clear-pending`. Storage: `~/.hermes/pairing/` (per-platform JSON).

### Dangerous-command approval
- `approvals.mode`: **smart** (default, LLM risk-assesses; low-risk auto-approved, clearly dangerous auto-denied, uncertain escalates to user), **manual** (always prompts), **off** (disables checks).
```yaml
approvals:
  mode: smart
  timeout: 300
  cron_mode: deny
  mcp_reload_confirm: true
  destructive_slash_confirm: true
```
- **YOLO mode**: `hermes --yolo`, `/yolo` (toggles each invocation), or `HERMES_YOLO_MODE=1`. Shows red banner + `⚠ YOLO` status indicator. Verbatim limit: "Hardline blocklist still applies regardless of YOLO status."
- **Hardline blocklist** (always-on, no override — not bypassable by `--yolo`, `approvals.mode: off`, or cron headless mode): `rm -rf /`, fork bombs, `mkfs` on mounted devices, `dd` to block devices, piping untrusted URLs to shell.
- User-defined deny rules (`approvals.deny`): fnmatch glob, case-insensitive, applied *before* YOLO/mode checks, e.g. `- "git push --force*"`, `- "*curl*|*sh*"`. Only enforced on host-reaching backends (local, SSH, host-mounted Docker); isolated containers skip the guard stack.
- Dangerous-pattern categories triggering approval (from `tools/approval.py`): recursive delete, permission changes (`chmod 777/666`), filesystem ops (`mkfs`, `dd if=`), DB operations (`DROP TABLE/DATABASE`, unWHERE'd `DELETE`, `TRUNCATE`), system-config overwrites (`> /etc/`), service management (`systemctl stop/restart`), process termination (`kill -9 -1`), shell execution (`bash -c`, `curl | sh`), self-termination prevention (`pkill hermes/gateway`), gateway backgrounding tricks (`&`, `disown`, `nohup`, `setsid`).
- CLI approval flow: four options `[o]nce [s]ession [a]lways [d]eny`; "always" persists to `~/.hermes/config.yaml` under `command_allowlist`.
- Gateway/messaging approval flow: bot posts command details, user replies yes/no/approve/deny/cancel; `HERMES_EXEC_ASK=1` auto-set when running gateway.
- Approval timeout default 300s (`approvals.timeout`); no response = **denied by default** (fail-closed).

### File-write safety
- Always-blocked paths: `~/.ssh/`, `~/.aws/`, `~/.kube/`, `/etc/sudoers`, `~/.netrc`; Hermes credential stores (`auth.json`, `.env`, `.anthropic_oauth.json`, `mcp-tokens/`, `pairing/` under `HERMES_HOME`); project secret files `.env`, `.env.local`, `.env.production`, `.envrc` anywhere. Error text: "Write denied: '…' is a protected system/credential file."
- `HERMES_WRITE_SAFE_ROOT` (optional): restricts `write_file`/`patch` to listed directory prefixes (`:` on Unix, `;` on Windows); auto-set to `/opt/data` in official Docker image. Warning: "Do not add to ~/.hermes/.env casually." Violation error: "Write denied: '…' is outside HERMES_WRITE_SAFE_ROOT."
- Direct `patch` to `~/.hermes/cron/jobs.json` is blocked — must use the `cronjob` tool or `/cron` slash command.

### Container/terminal isolation backends
Table of 6 backends with isolation and dangerous-command-check behavior:

| Backend | Isolation | Dangerous Cmd Check | Best For |
|---|---|---|---|
| local | None | Yes | Development, trusted users |
| ssh | Remote machine | Yes | Separate server |
| docker | Container | Skipped | Production gateway |
| singularity | Container | Skipped | HPC environments |
| modal | Cloud sandbox | Skipped | Scalable cloud isolation |
| daytona | Cloud sandbox | Skipped | Persistent cloud workspaces |

- Docker security flags applied to every container: `--cap-drop ALL`, `--cap-add DAC_OVERRIDE,CHOWN,FOWNER`, `--security-opt no-new-privileges`, `--pids-limit 256`, `--tmpfs /tmp:rw,nosuid,size=512m`, `--tmpfs /var/tmp:rw,noexec,nosuid,size=256m`.
```yaml
terminal:
  backend: docker
  docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
  container_cpu: 1
  container_memory: 5120     # MB, default 5GB
  container_disk: 51200      # MB, default 50GB, requires overlay2 on XFS
  container_persistent: true
```
- Persistent mode bind-mounts `/workspace` and `/root` from `~/.hermes/sandboxes/docker/<task_id>/`; ephemeral mode uses tmpfs, lost on cleanup.
- `docker_forward_env: []` empty by default (keeps secrets out); declared skill env vars auto-forwarded; manual passthrough via `terminal.env_passthrough`.

### Environment/credential isolation
- `execute_code`: blocks vars containing `KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `CREDENTIAL`, `PASSWD`, `AUTH` by name; passthrough overrides bypass.
- `terminal` (local): blocks explicit Hermes infra vars (provider keys, gateway tokens, tool API keys); passthrough bypasses.
- `terminal` (Docker): no host env by default; passthrough + `docker_forward_env` forwarded via `-e`.
- `terminal` (Modal): no host env/files by default; credential files mounted; env passthrough via sync.
- MCP subprocess: safe system vars only (`PATH, HOME, USER, LANG, LC_ALL, TERM, SHELL, TMPDIR, XDG_*`); everything else stripped; explicit `env:` in MCP server config passes only named vars.
- Skill-declared env vars (`required_environment_variables` in SKILL.md frontmatter): auto-registered as passthrough when the skill loads; missing vars not registered. Pass through to `execute_code`, local terminal, Docker, and Modal.
- Skill-declared credential files (`required_credential_files`): Docker mounts read-only (`-v host:container:ro`); Modal mounts at sandbox creation + syncs before each command; manual config via `terminal.credential_files` (relative to `~/.hermes/`), container mount point `/root/.hermes/`.
- MCP credential redaction: error messages sanitized before the LLM sees them; patterns replaced with `[REDACTED]` — GitHub PATs (`ghp_...`), OpenAI keys (`sk-...`), bearer tokens, `token=`, `key=`, `API_KEY=`, `password=`, `secret=` params.

### Network / URL restrictions
```yaml
security:
  website_blocklist:
    enabled: true
    domains:
      - "*.internal.company.com"
      - "admin.example.com"
    shared_files:
      - "/etc/hermes/blocked-sites.txt"
```
Enforced across `web_search`, `web_extract`, `browser_navigate`, and other URL-capable tools.
- **SSRF protection** (always active): blocks RFC 1918 private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`), CGNAT (`100.64.0.0/10`), cloud metadata endpoints (`metadata.google.internal`, `169.254.169.254`). DNS failures treated as blocked (fail-closed); redirect chains re-validated at each hop.
```yaml
security:
  allow_private_urls: true   # default: false
```
Warning quoted: "Only enable it on machines where the agent running arbitrary prompt-injected URLs against the local network is an acceptable risk."

### Security scanning
- **Tirith** pre-exec scanner: detects homograph URL spoofing, pipe-to-interpreter patterns (`curl | bash`), terminal injection attacks. Auto-installs from GitHub with SHA-256 checksum verification.
```yaml
security:
  tirith_enabled: true
  tirith_path: "tirith"
  tirith_timeout: 5
  tirith_fail_open: true
```
Integrates with the approval flow (safe → pass, suspicious/blocked → approval, default choice on block = deny). Platform support: Linux (x86_64/aarch64), macOS (x86_64/arm64); silently skipped on Windows (recommend WSL).
- Context-file injection scanning (AGENTS.md, .cursorrules, SOUL.md) — same mechanism described in the Context Files section above.

### Supply chain
- Built-in advisory scanner flags Python packages against a "curated catalog of known-compromised versions"; runs at CLI startup banner, `hermes doctor`, and gateway startup (logged to `gateway.log`). `hermes doctor --ack <advisory-id>` dismisses permanently (persisted to `config.security.acked_advisories`). Implementation is stdlib-only.
- Lazy install of optional deps (`tools/lazy_deps.py`): features (Mistral TTS, ElevenLabs, Honcho, Bedrock, Slack, Matrix, etc.) installed on first use. `security.allow_lazy_installs` (default `true`); when `false`, runtime installs blocked, user must install manually. Guarantees: venv-scoped only, PyPI-by-name only (no `--index-url`, `git+https://`, file paths), allowlist enforced, no silent retries.

### Deployment checklist (verbatim list, 10 items)
Explicit allowlists (never `GATEWAY_ALLOW_ALL_USERS=true`); container backend for terminal; restrict CPU/memory/disk; secure `.env` storage; enable DM pairing over hardcoded IDs; periodic allowlist review; set `terminal.cwd`; run gateway as non-root; monitor `~/.hermes/logs/`; keep updated via `hermes update`.
- API key hygiene: `chmod 600 ~/.hermes/.env`; separate keys per service; never commit `.env`.
- Network isolation: run gateway on separate machine/VM; `terminal.backend: ssh`; SSH details in `.env` not `config.yaml` (e.g. `TERMINAL_SSH_HOST`, `TERMINAL_SSH_USER`, `TERMINAL_SSH_KEY`).
- Cross-session isolation: sessions cannot access each other's data/state; cron job storage hardened against path traversal.
- Terminal working-directory params validated against an allowlist to prevent shell injection.

---

## 8. Messaging Platforms (Gateway)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/

- Mechanical description (verbatim): "Each platform adapter receives messages, routes them through a per-chat session store, and dispatches them to the AIAgent for processing. The gateway also runs the cron scheduler, ticking every 60 seconds to execute any due jobs."
- Single-process design manages multiple concurrent platform connections with isolated per-chat session contexts.
- 20 platform pages linked from the index (docs elsewhere say "27+ platform support" and the top nav lists "20+"):

| Platform | URL |
|---|---|
| Telegram | `/docs/user-guide/messaging/telegram` |
| Discord | `/docs/user-guide/messaging/discord` |
| Slack | `/docs/user-guide/messaging/slack` |
| Google Chat | `/docs/user-guide/messaging/google_chat` |
| WhatsApp | `/docs/user-guide/messaging/whatsapp` |
| WhatsApp Cloud API | `/docs/user-guide/messaging/whatsapp-cloud` |
| Signal | `/docs/user-guide/messaging/signal` |
| SMS (Twilio) | `/docs/user-guide/messaging/sms` |
| Email | `/docs/user-guide/messaging/email` |
| Home Assistant | `/docs/user-guide/messaging/homeassistant` |
| Mattermost | `/docs/user-guide/messaging/mattermost` |
| Matrix | `/docs/user-guide/messaging/matrix` |
| DingTalk | `/docs/user-guide/messaging/dingtalk` |
| Feishu/Lark | `/docs/user-guide/messaging/feishu` |
| WeCom | `/docs/user-guide/messaging/wecom` |
| Weixin (WeChat) | `/docs/user-guide/messaging/weixin` |
| BlueBubbles (iMessage) | `/docs/user-guide/messaging/bluebubbles` |
| QQBot | `/docs/user-guide/messaging/qqbot` |
| Yuanbao | `/docs/user-guide/messaging/yuanbao` |
| Microsoft Teams | `/docs/user-guide/messaging/teams` |
| IRC | `/docs/user-guide/messaging/irc` |

- Gateway CLI (from Reference/CLI-Commands page): `hermes gateway run|start|stop|restart|status|list|install|uninstall|setup|migrate-legacy|enroll`, with options `--all`, `--no-supervise`, `--external-supervisor`.
- Related from Architecture page: gateway is a long-running process with (per that page) "20 platform adapters," unified session routing, user authorization, slash-command dispatch, and a lifecycle hook system.
- FAQ notes: gateway supports multi-user access via allowlists or DM pairing; `hermes gateway status` checks health; logs at `~/.hermes/logs/gateway.log`; WSL2 users should prefer `hermes gateway run` (foreground) over systemd for stability.

---

## 9. Integrations — Nous Portal

Source: https://hermes-agent.nousresearch.com/docs/integrations/nous-portal

- Definition (paraphrased from page): Nous Portal is a unified subscription gateway providing a single OAuth login across 300+ frontier models and multiple tool backends, avoiding separate per-provider API keys/billing.
- Quoted: "Single OAuth login covers 300+ models plus the four Tool Gateway tools" (from earlier integrations-index summary); detail page frames it as "300+ frontier models, one bill."
- Setup: one command, `hermes setup --portal` — performs OAuth login, lets user pick a model, configures Nous as inference provider in `config.yaml`, enables the Tool Gateway.
- Model access includes: Anthropic Claude (Opus 4.7, Sonnet 4.6, Haiku 4.5), OpenAI (GPT-5.5, GPT-5.4, GPT-5.3 variants), Google Gemini (multiple preview versions), DeepSeek, Qwen, xAI, NVIDIA Nemotron, and Nous's own Hermes-4-70B/405B. Routing occurs "through OpenRouter under the hood"; switch mid-session with `/model`.
- **Tool Gateway** — 5 integrated backends unlocked by subscription:

| Tool | Partner | Function |
|---|---|---|
| Web search & extract | Firecrawl | agent-grade search/extraction |
| Image generation | FAL | 9 models (FLUX 2, Z-Image Turbo, GPT Image, others) |
| Text-to-speech | OpenAI TTS | high-quality TTS for voice mode |
| Browser automation | Browser Use | headless Chromium nav/click |
| Cloud terminal | Modal | serverless sandboxes for code execution |

- Key commands: `hermes portal info` (per this page — check login/subscription status) — **note: the CLI Commands reference page instead documents `hermes portal status|open|tools`, a naming discrepancy, see uncertain-facts list**. Also `hermes portal tools` (view gateway tool routing), `hermes model` (switch models), `hermes portal open` (subscription management page), `hermes tools` (configure per-tool backends).
- Credential storage quoted: "The refresh token at `~/.hermes/auth.json` is the only credential on disk," with Hermes minting short-lived JWTs per request instead of storing long-lived API keys.
- Post-setup config.yaml example:
```yaml
model:
  provider: nous
  default: anthropic/claude-sonnet-4.6
  base_url: https://inference-api.nousresearch.com/v1
```
Tool settings route through the gateway using `provider/backend: nous` for web, image_gen, tts, browser.
- Important caveat, quoted: Nous's own Hermes 4 models are "not recommended for use inside Hermes Agent" because they're chat/reasoning-tuned rather than rapid-tool-calling-tuned; Portal recommends frontier agentic models instead.

---

## 10. Integrations — AI Providers (OpenRouter / OpenAI / etc.)

Source: https://hermes-agent.nousresearch.com/docs/integrations/providers

- Two configuration paths: `hermes model` (interactive wizard, OAuth flows/API keys/custom endpoints, outside chat) vs `/model` (in-session rapid switching between already-configured providers).
- **Nous Portal**: recommended default, `hermes setup --portal` or select from `hermes model` menu.
- **Anthropic (native)**: 3 auth methods — direct API key (`export ANTHROPIC_API_KEY=***; hermes chat --provider anthropic --model claude-sonnet-4-6`); OAuth (quoted: requires "Claude Max plan and purchased extra usage credits"); setup-token via `export ANTHROPIC_TOKEN=***`.
- **GitHub Copilot**: direct Copilot API (recommended, supports GPT-5.x/Claude/Gemini via subscription) or `copilot-acp` (spawns local CLI subprocess). Supported token types: OAuth (`gho_`), fine-grained PATs (`github_pat_`), GitHub App tokens (`ghu_`). Classic PATs (`ghp_*`) **unsupported**.
- **OpenAI/Azure**: direct API via `OPENAI_API_KEY` + `--provider openai-api`, optional `OPENAI_BASE_URL` override; Azure via `hermes model` → "Azure AI Foundry" using endpoint + key.
- First-class API-key providers table: Fireworks (`FIREWORKS_API_KEY`), NovitaAI (`NOVITA_API_KEY`), z.ai/GLM (`GLM_API_KEY`), Kimi/Moonshot (`KIMI_API_KEY`), MiniMax (`MINIMAX_API_KEY`), DeepSeek (`DEEPSEEK_API_KEY`), Google Gemini (`GOOGLE_API_KEY`/`GEMINI_API_KEY`), NVIDIA NIM (`NVIDIA_API_KEY`), Hugging Face (`HF_TOKEN`) — all keys go in `~/.hermes/.env`.
- Self-hosted/custom endpoint config pattern:
```yaml
model:
  default: model-name
  provider: custom
  base_url: http://localhost:PORT/v1
  context_length: 64000
```
- **Ollama**: zero-config local; quoted: "Ollama does not use your model's full context window by default" — minimum 64,000 tokens required for agent use; set via `OLLAMA_CONTEXT_LENGTH=64000 ollama serve` or Modelfile.
- **vLLM**: needs `--enable-auto-tool-choice --tool-call-parser hermes` and `--max-model-len 65536`.
- **llama.cpp**: needs `--jinja` for tool calling; context via `-c 64000`.
- **LM Studio**: native tool calling since v0.3.6; configure via GUI or `lms load model-name --context-length 64000`.
- Context-length detection is a **9-source resolution chain**: config override (highest) → custom provider per-model → persistent cache → endpoint `/models` API → Anthropic `/v1/models` → OpenRouter → Nous Portal → models.dev registry → fallback default (128K). Manual override: `model.context_length: 131072`.
- Named custom providers (multiple independent endpoints):
```yaml
custom_providers:
  - name: local
    base_url: http://localhost:8080/v1
  - name: work
    base_url: https://gpu-server.internal/v1
    key_env: CORP_API_KEY
```
Switch: `/model custom:local:qwen-2.5` or `/model custom:work:llama3`.
- **Provider Routing (OpenRouter)**: `provider_routing: {sort: "price"}` (price/throughput/latency); append `:nitro` (throughput) or `:floor` (price) to model slug.
- **Fallback Providers**: `fallback_providers:` list, auto-activates on primary failure without losing conversation context.
- **Pareto Code Router**: `openrouter/pareto-code` experimental model auto-routes to cheapest adequate coder via `min_coding_score: 0.65` (range 0.0–1.0).
- Optional enhancement API keys: Firecrawl (`FIRECRAWL_API_KEY`, web scraping), Browserbase (`BROWSERBASE_API_KEY`, browser automation), FAL (`FAL_KEY`, image gen), ElevenLabs (`ELEVENLABS_API_KEY`, premium TTS).
- WSL2 networking: mirrored mode (Windows 11 22H2+) via `networkingMode=mirrored` in `.wslconfig`; NAT-mode fallback using Windows host IP from `ip route show | grep default | awk '{print $3}'`, servers must bind `0.0.0.0`.
- Critical constraints (verbatim-adjacent): minimum context for agent use = **64,000 tokens**; tool calling disabled without explicit server flags on vLLM/llama.cpp/SGLang; `config.yaml` is authoritative (legacy `LLM_MODEL` env var removed); `context_length` controls total conversation budget while `max_tokens` limits only a single response.

---

## 11. Cron / Scheduled Automations

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/cron

- Capabilities quoted: cron can "schedule one-shot or recurring tasks" and "pause, resume, edit, trigger, and remove jobs"; supports zero-or-more attached skills, delivery to multiple platform targets, and running in standard-agent or no-agent script-only mode.
- Creation — chat: `/cron add 30m "Reminder text"`, `/cron add "every 2h" "Task" --skill skillname`. CLI: `hermes cron create "every 2h" "Check server status"`, `hermes cron create "every 1h" "Task" --skill blogwatcher`. Natural language also works — invokes the unified `cronjob` tool internally.
- Schedule formats: relative (`30m`, `2h`, `1d` — one-time), interval (`every 30m`, `every 2h` — recurring forever), standard cron expr (`0 9 * * *`, `0 */6 * * *`), ISO timestamp (`2026-03-15T09:00:00` — single scheduled time).
- Lifecycle CLI: `hermes cron list|pause <id>|resume <id>|run <id>|remove <id>|status|tick`, `edit <job_id> --schedule "every 4h"|--skill name|--add-skill name|--remove-skill name|--clear-skills`, `hermes cron runs [job-id] --limit 20`.
- **Execution model**: quoted "The gateway ticks the scheduler every 60 seconds, running any due jobs in isolated agent sessions." Each tick: load `~/.hermes/cron/jobs.json` → check `next_run_at` → start fresh `AIAgent` session per due job → optionally inject attached skills → run to completion → deliver → update run metadata/next-run time. A lock file at `~/.hermes/cron/.tick.lock` prevents overlapping ticks.
- Storage: jobs `~/.hermes/cron/jobs.json`; output `~/.hermes/cron/output/{job_id}/{timestamp}.md`; execution history `~/.hermes/cron/executions.db` (states: claimed, running, completed, failed, unknown).
- Delivery targets: `origin`, `local`, `telegram`, `discord`, `slack`, `whatsapp`, `signal`, `matrix`, `email`, `sms`, `homeassistant`, `all`, comma-separated combos.
```yaml
cron:
  wrap_response: false
  mirror_delivery: true
  script_timeout_seconds: 3600
```
Env override: `HERMES_CRON_SCRIPT_TIMEOUT`.
- Skill attachment: single via `skill="blogwatcher"`; multiple via `skills=["blogwatcher","maps"]` in the `cronjob(action="create", ...)` tool call.
- `--workdir /path/to/project`: injects `.cursorrules`/`AGENTS.md`/`CLAUDE.md`; scopes terminal/file/code tools to the path; workdir jobs run **sequentially** (not in the parallel pool) to avoid terminal-state corruption.
- **No-agent mode** (script-only): `hermes cron create "every 5m" --no-agent --script watchdog.sh --deliver telegram --name "memory-watchdog"`. Scripts live in `~/.hermes/scripts/`, run via `/bin/bash` (.sh/.bash) or the Python interpreter (other extensions). Empty stdout → silent tick; non-zero exit → error alert. Final stdout line can emit `{"wakeAgent": false}` to suppress waking the LLM (default `true`) — enables cheap 1–5min polling loops.
- **Job chaining** via `context_from`: job B's create call sets `context_from="<job1_id>"` (or a list); "Hermes reads Job 1's most recent output" and prepends it to Job 2's prompt automatically.
- **Continuable jobs** (reply-to-cron): `cron.mirror_delivery: true` globally, or per-job `attach_to_session` param on the `cronjob` tool. Thread-preferred where supported (Telegram topics, Discord/Slack threads), falling back to DM mirroring on flat platforms. Slack flat-channel variant:
```yaml
slack:
  cron_continuable_surface: in_channel
  reply_in_thread: false
  require_mention: false
```
- Silent suppression: agent response containing `[SILENT]` suppresses delivery but still saves output locally; "Failed jobs always deliver regardless" of the marker.
- Provider recovery: cron jobs inherit configured fallback providers and credential-pool rotation on rate limit/errors.
- Toolset config: `hermes tools` → select "cron" platform to toggle toolsets; per-job override via `enabled_toolsets` param. Resolution order: job-specific → `hermes tools` cron config → built-in defaults.
- Constraints: cron-run sessions **cannot recursively create more cron jobs**; prompts must be self-contained; unpinned jobs snapshot the global default provider/model at creation and "fail closed" if the default later changes; cron-management tools are disabled inside cron executions.
- Agent-facing `cronjob` tool actions: `create`, `list`, `update`, `pause`, `resume`, `run`, `remove`. To clear all attached skills on update, pass `skills=[]`.
- Security: "Cron jobs run in a completely fresh agent session"; prompts scanned for prompt-injection/credential-exfiltration patterns at creation and update time.

---

## 12. Subagents / Multi-Agent Orchestration (Delegation)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation

- Core mechanism: the `delegate_task` tool spawns child `AIAgent` instances with "isolated context, inherited tool access, and their own terminal sessions." Each child starts a completely fresh conversation with zero knowledge of parent history — quoted section heading: **"Subagents Know Nothing."**
- Single task: `delegate_task(goal="...", context="...")`. Parallel batch: up to **3 concurrent subagents by default** (configurable) via a `tasks` array, each element with `goal`/`context`.
- Info transfer: parent must pass everything needed via `goal`+`context`; the child receives "a focused system prompt built from your goal and context, instructing it to complete the task and provide a structured summary."
- Orchestration model: top-level `delegate_task` calls run **asynchronously in the background** — Hermes returns a handle immediately, posts results later. **Orchestrator subagents** (`role="orchestrator"`) instead wait **synchronously** for their own workers before returning — this is the distinction between background parallelism and synchronous hierarchical coordination.
- Nested delegation: **flat by default** — children cannot delegate further. To nest: set `role="orchestrator"` on the child AND raise `delegation.max_spawn_depth` above its default of **1**. Leaf (default) subagents cannot call `delegation`, `clarify`, `memory`, or `send_message`.
- Tool inheritance: subagents inherit "the parent's enabled toolsets so the model cannot grant a child capabilities that the parent does not have." Always-blocked for leaf nodes: `delegation`, `clarify`, `memory`, `code_execution`.
- Concurrency: max 3 by default via `ThreadPoolExecutor`; results sorted by task index regardless of completion order; no wall-clock timeout by default (children fail only from real errors or iteration limits); optional `child_timeout_seconds` hard cap (floor 30s).
- Monitoring: `/agents` TUI overlay = "live tree view of running and recently-finished subagents, grouped by parent," with cost/token rollups and kill/pause controls. Live transcripts: per-task append-only logs at `~/.hermes/cache/delegation/live/<delegation_id>/task-<n>.log`.
- Durability: background-completion events stored in `state.db` before publishing. Process restarts **do not resume running children** (marked `unknown`), but completed-but-undelivered results are restored. For guaranteed durability, use `cronjob` or `terminal(background=True)` instead.
```yaml
delegation:
  max_iterations: 50
  max_concurrent_children: 3
  max_spawn_depth: 1
  orchestrator_enabled: true
  model: "provider/model-name"
  provider: "openrouter"
  base_url: "http://custom-endpoint/v1"
  api_key: "key"
  api_mode: "anthropic_messages"
```
- Distinction: `delegate_task` = full LLM reasoning loop with all tools (for judgment tasks); `execute_code` = mechanical Python execution with no reasoning (for data pipelines).
- Lifecycle: `/stop` cancels background delegations; closing/resetting the owning session discards active children; follow-up messages do **not** cancel background work; synchronous orchestrator children follow the parent's interrupt state.

---

## 13. Developer Guide — Architecture

Source: https://hermes-agent.nousresearch.com/docs/developer-guide/architecture

- Three entry points converge on one core engine: CLI (`cli.py`, interactive terminal UI), Gateway (`gateway/run.py`, messaging platform API server), ACP adapter (`acp_adapter/`, IDE integration for VS Code/Zed/JetBrains). All feed the central `AIAgent` class in `run_agent.py`.
- `AIAgent` orchestrates five subsystems: (1) **Prompt Builder** — assembles ordered system-prompt tiers `stable → context → volatile`; (2) **Provider Resolution** — maps (provider, model) → (api_mode, api_key, base_url); (3) **Tool Dispatch** — executes function calls via central registry; (4) **Compression & Caching** — manages context windows + Anthropic prefix caching; (5) **Session Storage** — persists conversations to SQLite with FTS5.
- Tool System: central registry `tools/registry.py`, quoted "70+ registered tools across ~28 toolsets"; each tool self-registers at import time; terminal tools support the same 6 backends as Security section (local, Docker, SSH, Daytona, Modal, Singularity).
- Session persistence: SQLite + FTS5; lineage tracking across compressions (parent/child sessions); per-platform isolation with atomic writes.
- Messaging gateway (per this page): long-running process, "20 platform adapters," unified session routing, user authorization, slash-command dispatch, lifecycle hook system.
- Plugin system: three discovery sources — `~/.hermes/plugins/`, `.hermes/plugins/`, pip entry points. Specialized single-select plugin types: memory providers and context engines (one active at a time each).
- Provider support: "18+ providers" via a unified runtime resolver shared across CLI, gateway, cron, and ACP; manages OAuth flows and credential pools.
- Data flow patterns:
  - CLI session: User input → HermesCLI → AIAgent → prompt assembly → provider resolution → API call → tool execution loop → response → SessionDB.
  - Gateway message: Platform event → adapter → MessageEvent → GatewayRunner → authorization → session resolution → AIAgent → response delivery.
  - Cron job: Scheduler tick → load due jobs → fresh AIAgent → skill context injection → job execution → platform delivery.
- Design principles table: Prompt stability (system prompt unchanged mid-conversation except explicit actions); Observable execution (all tool calls visible via callbacks, UI progress updates); Interruptible (API + tool execution cancellable); Platform-agnostic core (single AIAgent serves CLI/gateway/ACP/batch/API); Loose coupling (optional subsystems via registry patterns, no hard deps); Profile isolation (each profile has separate HERMES_HOME/config/sessions).
- Directory structure highlights:
```
hermes-agent/
├── run_agent.py              # AIAgent — core loop
├── model_tools.py            # Tool discovery & dispatch
├── agent/                    # Internals (prompt_builder, context_engine, etc.)
├── tools/                    # 70+ tool implementations
├── gateway/                  # 20 platform adapters
├── hermes_cli/               # CLI commands & setup
├── plugins/                  # Memory providers, context engines
└── tests/                    # ~25,000 tests
```
- Abstract patterns named: Tool Registry (self-registering, `registry.register()` at import), Context Engine ABC (pluggable compression/summarization interface), Memory Provider ABC (interchangeable memory backends), Runtime Resolver (credential/provider mapping without hardcoded logic).

Related Developer Guide sidebar pages discovered: Contributing (`/docs/developer-guide/contributing`), TUI & Desktop from Worktrees (`/docs/developer-guide/worktree-ui-dev`), Architecture (`/docs/developer-guide/architecture`), Extending (`/docs/developer-guide/adding-tools`), Internals (`/docs/developer-guide/tools-runtime`), Build a Hermes Plugin (`/docs/developer-guide/plugins`), Creating Skills (`/docs/developer-guide/creating-skills`), Adding Providers (`/docs/developer-guide/adding-providers`). No page specifically named "subagents"/"multi-agent orchestration" exists in the Developer Guide — that content lives entirely on the user-guide Delegation feature page (Section 12 above).

---

## 14. Reference — CLI Commands

Source: https://hermes-agent.nousresearch.com/docs/reference/cli-commands

Full command surface extracted (grouped as documented):

**Entrypoint & global options**: `hermes [global-options] <command> [subcommand/options]` — `--version/-V`, `--profile/-p <name>`, `--resume/-r <session>`, `--continue/-c [name]`, `--worktree/-w`, `--yolo`, `--pass-session-id`, `--ignore-user-config`, `--ignore-rules`, `--tui`, `--cli`, `--dev`.

**Chat**: `hermes chat [-q/--query] [-m/--model] [-t/--toolsets] [--provider] [-s/--skills] [-v/--verbose] [-Q/--quiet] [--image] [--checkpoints] [--safe-mode]`; `hermes -z <prompt>` (scripted one-shot, pure output).

**Model**: `hermes model` (interactive selector); `/model [--global]` (slash command mid-session).

**Gateway**: `hermes gateway run|start|stop|restart|status|list|install|uninstall|setup|migrate-legacy|enroll`, options `--all`, `--no-supervise`, `--external-supervisor`.

**Setup/Config**: `hermes setup [section] [--non-interactive] [--reset] [--quick]` (sections: model, tts, terminal, gateway, tools, agent; `--portal` for Nous OAuth); `hermes config show|edit|set <key> <value>|path|env-path|check|migrate`.

**Credentials**: `hermes auth list [provider]|add <provider> [--api-key|--type oauth]|remove <provider> <index>|reset <provider>|status <provider>|logout <provider>|spotify`; `hermes secrets bitwarden|bw setup [--project-id][--access-token][--server-url]|status|token [--access-token][--no-verify]|sync [--apply]|install [--force]|disable`.

**Messaging**: `hermes send --to <target> [-f/--file][-s/--subject][-l/--list [platform]][-q/--quiet][--json]`; `hermes whatsapp`; `hermes whatsapp-cloud`; `hermes slack manifest [--write][--name][--description][--long-description <text>][--long-description-file <path>][--slashes-only]`.

**Proxy/Firewall**: `hermes proxy start [--provider][--host][--port]|status|providers`; `hermes egress install [--force]|setup [--tunnel-port][--from-bitwarden][--no-bitwarden]|start|stop|restart|reload|status [--show-tokens]|disable|config`.

**LSP**: `hermes lsp status|list [--installed-only]|install <id>|install-all|restart|which <id>`.

**Monitoring**: `hermes status [--all][--deep]`; `hermes doctor [--fix]`; `hermes dump [--show-keys]`; `hermes debug share [--lines][--expire][--nous][--local][--no-redact]`; `hermes logs [log_name] [-n/--lines][-f/--follow][--level][--session][--since][--component]` (log names: agent, errors, gateway, gui, desktop, list).

**Backup**: `hermes backup [-o/--output][--quick][-l/--label]`; `hermes import <zipfile> [--force]`; `hermes checkpoints status|list|prune [--retention-days][--max-size-mb]|clear [-f]|clear-legacy [-f]`.

**Sessions**: `hermes sessions list|browse|export <output> [--session-id]|delete <session-id>|prune [filters]|archive [filters]|stats|rename <session-id> <title>`; `hermes insights [--days N][--source platform]`.

**Skills/Bundles**: `hermes skills browse [--source]|search <term> [--source]|install <skill> [--force]|inspect <skill>|list|check|update|audit|uninstall <skill>|reset <skill> [--restore]|opt-out [--remove]|opt-in [--sync]|publish|snapshot|tap|config`; `hermes bundles list|show <name>|create <name> [--skill][--description]|delete <name>`.

**Curator/Memory**: `hermes curator status|run [--background][--dry-run]|backup|rollback [--list][--id <ts>][-y]|pause|resume|pin <skill>|unpin <skill>|restore <skill>|archive <skill>|prune|list-archived`; `hermes memory setup|status|off`.

**Model variants**: `hermes moa list|configure [name]|delete <name>` (Mixture of Agents presets); `hermes fallback list|add|remove|clear`.

**Scheduled/Event-driven**: `hermes cron list|create [--skill]|edit <job>|pause <job>|resume <job>|run <job>|remove <job>|status|tick`; `hermes webhook subscribe <name> [--prompt][--events][--skills][--deliver]|list|remove <name>|test <name>`.

**Project/Workspace**: `hermes project create|list|show|add-folder|remove-folder|rename|set-primary|use|archive|restore|bind-board`; `hermes kanban [--board <slug>] init|boards list|create|switch|show|rename|rm|create "<title>" [--body][--assignee][--skill]|list [--mine][--status]|show <id>|assign <id> <profile>|link <parent> <child>|unlink <parent> <child>|claim <id>|comment <id> "<text>"|complete <id> [--result]|block <id> "<reason>"|schedule <id> "<reason>"|unblock <id>|archive <id>|tail <id>|dispatch [--dry-run][--max N]|context <id>|specify [<id>|--all]|decompose [<id>|--all]|gc`.

**AI/Editor**: `hermes acp` (ACP stdio server); `hermes mcp picker|catalog|install <name>|serve [-v]|add <name> [--url][--command][--auth][--args]|remove <name>|list|test <name>|configure <name>|login <name>`.

**Plugins/Tools**: `hermes plugins install <id> [--force]|update <name>|remove <name>|enable <name>|disable <name>|list`; `hermes tools [--summary]`; `hermes computer-use install [--upgrade]|status`.

**Cosmetics**: `hermes pets list|install|select|show|off|scale|remove|doctor` (Petdex pets).

**Portal/Infra**: `hermes portal status|open|tools` (per this page — cf. discrepancy noted in Section 9); `hermes migrate <type> [--apply][--no-backup]` (`xai` sub-type documented); `hermes security audit [--json][--fail-on][--skip-venv][--skip-plugins][--skip-mcp]` (OSV.dev supply-chain audit).

**Data/Utilities**: `hermes prompt-size [--platform][--json]`; `hermes pairing list|approve <platform> <code>|revoke <platform> <user-id>|clear-pending`; `hermes hooks list|test <event>|revoke <name>|doctor`.

**Desktop/Web**: `hermes dashboard [--port][--host][--no-open][--skip-build][--isolated]`, `hermes dashboard register [--name][--redirect-uri]`; `hermes serve [options]` (same options as dashboard, headless); `hermes desktop` (alias `gui`).

**Profiles**: `hermes profile list|use <name>|create <name> [--clone][--clone-all][--clone-from]|delete <name> [-y]|show <name>|alias <name> [--remove][--name]|rename <old> <new>|export <name> [-o]|import <archive> [--name]|install <source> [--name][--alias][--force][-y]|update <name> [--force-config][-y]|info <name>`.

**Maintenance**: `hermes completion bash|zsh|fish`; `hermes version`; `hermes update [--gateway][--check][--no-backup][--backup][--yes]`; `hermes uninstall [--full][--gui][--yes]`; `hermes claw migrate [--dry-run][--preset][--overwrite][--migrate-secrets][--no-backup][--source][--workspace-target][--skill-conflict][--yes]` (OpenClaw migration).

**Deprecated**: `hermes login` / `hermes logout` — replaced by `hermes auth`.

---

## 15. Reference — FAQ & Troubleshooting

Source: https://hermes-agent.nousresearch.com/docs/reference/faq

### FAQ (condensed Q&A)
- **Providers**: "Hermes Agent works with any OpenAI-compatible API"; explicitly supported: OpenRouter, Nous Portal, OpenAI, Anthropic Claude, Google Gemini, local via Ollama/vLLM/llama.cpp/SGLang.
- **Platform support** (Windows/Android/Termux): page defers to a separate Platform Support doc for the availability matrix (URL not given on this page).
- **WSL2 → Windows Chrome control**: prefer MCP bridge with `chrome-devtools-mcp` over direct `/browser connect`.
- **Data/telemetry**: "API calls go only to the LLM provider you configure"; no telemetry collected; conversations/memories stay local under `~/.hermes/`.
- **Local/offline models**: yes — `hermes model` → Custom endpoint → local server URL (Ollama, vLLM, llama.cpp, etc.), configure context length in `config.yaml`.
- **Cost**: "Hermes Agent itself is free and open-source (MIT license)"; pay only for chosen LLM provider's usage; local models are free.
- **Multi-user**: yes, via messaging gateway (Telegram, Discord, Slack, WhatsApp, Home Assistant) with allowlist/DM-pairing access control.
- **Memory vs skills** distinction (quoted definition): memory stores facts about you/preferences (auto-retrieved by relevance); skills store procedures/step-by-step instructions (recalled for similar tasks).
- **Programmatic use**: yes — import the `AIAgent` class directly in a Python project.

### Troubleshooting (by category)
- **Installation**: `hermes: command not found` → reload shell profile / new terminal, verify `~/.local/bin/hermes`; Python <3.11 → upgrade (3.11+ required); `node: command not found` in terminal tools → add files to `terminal.shell_init_files` in config.yaml (bash-login-shell snapshot issue with nvm/asdf); `uv: command not found` → `curl -LsSf https://astral.sh/uv/install.sh | sh`; permission denied on install → don't use sudo, installs to `~/.local/bin`.
- **Provider/model**: `/model` shows only one provider → use terminal `hermes model` to add new providers first (in-session `/model` only switches pre-configured ones); API key issues → `hermes model` to reconfigure or check `.env` conflicts; rate limiting (429) → wait/retry or upgrade plan/switch model; context length exceeded → `/compress` or switch to larger-context model.
- **Terminal**: command blocked as dangerous → safety feature, approve with `y`; `sudo` fails via gateway → gateway lacks interactive terminal for password prompts, avoid sudo or configure passwordless sudo; Docker backend not connecting → check `docker info` and user's docker group membership.
- **Messaging**: bot not responding → check `hermes gateway status`, allowlist membership, bot token validity; messages not delivering → verify token, check `~/.hermes/logs/gateway.log`, ensure public accessibility for webhook platforms; gateway won't start → check deps/ports/tokens/config; WSL gateway disconnects → use foreground `hermes gateway run` instead of systemd, or tmux/nohup; macOS Node/ffmpeg not found by gateway → re-run `hermes gateway install` to recapture PATH.
- **Performance**: slow responses → smaller/faster model, fewer active toolsets, check network latency; high token usage → `/compress` regularly, check `/usage`; session too long → `/compress`, new session, or `hermes chat --continue`.
- **MCP**: server not connecting → check deps/binary path; tools not showing → verify `tools/list` response, check config filters, `/reload-mcp`; timeout errors → increase timeout, verify server running/network.
- **Profiles**: profiles vs `HERMES_HOME` → profiles manage directory structure, shell aliases, active-profile tracking, auto-sync skill updates across profiles; bot tokens are exclusive per profile (no sharing); profiles are fully isolated (no shared memory/sessions) — clone via `hermes profile create --clone-all`; `hermes update` updates code once and syncs skills to all profiles automatically; no documented hard limit on profile count ("dozens... are feasible").
- **Workflows**: per-task model routing → configure `delegation` in config.yaml to route subagents to a different model while keeping the main conversation on the primary model; one WhatsApp number can't run multiple agents (Baileys = one session per number; workarounds: personality switching, separate numbers, or use Telegram/Discord); Telegram tool-progress display controlled by `display.tool_progress: off|new|all|verbose` (restart gateway after change); Telegram skill/slash-command limits → `hermes skills config` to disable skills per-platform; shared-thread sessions default per-user, Slack threads and Discord channels support shared context natively, Telegram/Discord threads need workarounds; export whole install → `hermes backup` (zip) + `hermes import`; move one profile → `hermes profile export work ./backup.tar.gz` + `hermes profile import`; `hermes backup` = full install incl. all profiles + API keys (zip); `hermes profile export` = one profile, no credentials (tar.gz); Error 400 on first run → usually model-name mismatch or API key lacking model access, re-run `hermes model`.
- **Still stuck**: page directs users to GitHub Issues, the Nous Research Discord, or filing a bug report with OS/Python version/Hermes version/full error message.

---

## Facts uncertain / needs verification

1. **Nous Portal CLI command name conflict**: the Nous Portal integration page (`/docs/integrations/nous-portal`) references `hermes portal info` for checking login/subscription status, while the CLI Commands reference page (`/docs/reference/cli-commands`) documents the portal subcommand set as `hermes portal status|open|tools` (no `info`). Could not verify which is current/correct without running the CLI — flag as inconsistency between two doc pages rather than a fabrication.
2. **"Honcho-style user modeling" / three-layer memory hypothesis**: the task brief assumed a three-layer memory architecture (skill memory / conversational FTS5+summarization / Honcho-style modeling). What the docs actually describe is a two-file persistent memory system (MEMORY.md + USER.md) plus a separate FTS5 session-search tool, plus Honcho as one of eight *optional external* memory-provider plugins (not a built-in layer). Whether Honcho-style modeling is active by default is not stated — it requires explicit `hermes memory setup`.
3. **Messaging platform count discrepancy**: the docs index page's product summary and top-nav area state "20+ messaging platforms" (also "20 platform adapters" per the Architecture page), while the Integrations index page separately states "27+ platform support." The enumerated platform list fetched from the messaging index only contains 20 named platforms. Actual current count is ambiguous between these two figures.
4. **Personality preset count**: the Personality page states "12 total" built-in personalities but only 11 named options were returned by the fetch (helpful, concise, technical, creative, teacher, kawaii, pirate, shakespeare, noir, philosopher, hype). Possible the fetch/summarization dropped one option, or "helpful" is both the default and counted separately from a 12th unnamed one — unverified.
5. **Platform Support matrix location**: the FAQ page references "the Platform Support documentation" for Windows/Android/Termux compatibility but does not give its URL; this page was not discovered in the sidebar crawl performed and was not separately fetched.
6. **"~25,000 tests" and "70+ tools / ~28 toolsets" figures** (Architecture page) and **"18+ providers"**: these are point-in-time figures as stated on the docs site in July 2026; likely to drift as the project evolves, not independently verified against the actual repository.
7. Pages not fetched in this pass (out of task scope but referenced in nav and may contain adjacent advanced-systems detail): `/docs/user-guide/features/tool-gateway`, `/docs/user-guide/features/web-dashboard`, `/docs/user-guide/features/memory-providers`, `/docs/user-guide/features/plugins`, `/docs/user-guide/features/browser`, `/docs/user-guide/features/acp`, `/docs/user-guide/features/api-server`, `/docs/developer-guide/creating-skills`, `/docs/developer-guide/adding-providers`, `/docs/developer-guide/plugins`, `/docs/developer-guide/tools-runtime`, `/docs/developer-guide/adding-tools`, `/docs/reference/skills-catalog`, `/docs/reference/optional-skills-catalog`, individual per-platform messaging pages (Telegram, Discord, Slack, etc.).
